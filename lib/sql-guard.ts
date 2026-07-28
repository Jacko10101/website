/**
 * A faithful browser port of the SQL validator that guards model-generated
 * queries in Clarity. Rule sets, reason codes and messages match the Java
 * original; the tokeniser is a simplified version of the same idea.
 *
 * The point of the real thing, and of this port, is that every check runs on
 * canonical tokens rather than raw text. Comments are stripped, string
 * literals are masked and identifiers are unquoted and lower-cased *before*
 * anything is compared, so quoting and comment tricks cannot disguise a name.
 */

export type Reason =
  | "not_select"
  | "multi_statement"
  | "unicode_escape"
  | "catalog_schema"
  | "system_table"
  | "dangerous_function"
  | "restricted_keyword"
  | "blocked_pattern"
  | "data_modification";

export type Verdict = {
  allowed: boolean;
  reason?: Reason;
  message?: string;
  /** the offending token, when there is one */
  token?: string;
};

export type Parsed = {
  /** comments stripped, literals masked, whitespace collapsed */
  canonical: string;
  identifiers: string[];
  functionCalls: string[];
  schemaRefs: string[];
  hasSeparator: boolean;
  hasUnicodeEscape: boolean;
};

const BLOCKED_SCHEMAS = ["information_schema", "pg_catalog", "pg_toast", "clarity"];
const BLOCKED_IDENTIFIERS = ["information_schema", "pg_catalog", "pg_toast"];

const BLOCKED_FUNCTIONS = [
  "lo_import", "lo_export", "lo_get", "lo_put",
  "dblink", "dblink_exec", "dblink_connect",
  "version", "current_setting", "set_config",
  "inet_server_addr", "inet_server_port", "inet_client_addr", "inet_client_port",
  "query_to_xml", "query_to_xmlschema", "query_to_xml_and_xmlschema",
  "cursor_to_xml", "cursor_to_xmlschema",
  "table_to_xml", "table_to_xmlschema", "table_to_xml_and_xmlschema",
  "schema_to_xml", "schema_to_xmlschema", "schema_to_xml_and_xmlschema",
  "database_to_xml", "database_to_xmlschema", "database_to_xml_and_xmlschema",
  "xmltable",
];

const BLOCKED_KEYWORDS = [
  "current_user", "session_user", "current_database",
  "current_schema", "current_role", "current_catalog",
];

const BLOCKED_DML = ["insert", "update", "delete", "merge"];

const BLOCKED_PATTERNS: { re: RegExp; label: string }[] = [
  { re: /\bSELECT\b[^;]*\bINTO\b\s+\w+\s+FROM\b/i, label: "SELECT … INTO … FROM" },
  { re: /\bSELECT\b[^;]*\bINTO\b\s+\w+\s*$/i, label: "SELECT … INTO …" },
  { re: /\bFOR\s+(NO\s+KEY\s+)?UPDATE\b/i, label: "FOR [NO KEY] UPDATE" },
  { re: /\bFOR\s+(KEY\s+)?SHARE\b/i, label: "FOR [KEY] SHARE" },
];

/** Strip comments, mask literals, and pull out canonical tokens. */
export function parse(raw: string): Parsed {
  // 1. strip comments so they cannot hide or split a name
  let s = raw.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/--[^\n]*/g, " ");

  // 2. mask string literals so their contents never trip a rule, and a
  //    semicolon inside a string is not read as a statement separator
  s = s.replace(/'(?:[^']|'')*'/g, "'…'");

  const hasUnicodeEscape = /\bU&["']/i.test(s);

  // 3. a trailing semicolon is stripped; any other one is a separator
  const trimmed = s.trim().replace(/;\s*$/, "");
  const hasSeparator = trimmed.includes(";");

  const canonical = trimmed.replace(/\s+/g, " ").trim();

  // 4. identifiers: unquote then lower-case, so "pg_catalog" === pg_catalog
  const identifiers: string[] = [];
  const idRe = /"([^"]+)"|([A-Za-z_][A-Za-z0-9_$]*)/g;
  let m: RegExpExecArray | null;
  while ((m = idRe.exec(canonical)) !== null) {
    identifiers.push((m[1] ?? m[2]).toLowerCase());
  }

  // 5. a token immediately followed by "(" is a call; a token followed by "."
  //    is a schema reference
  const functionCalls: string[] = [];
  const fnRe = /(?:"([^"]+)"|([A-Za-z_][A-Za-z0-9_$]*))\s*\(/g;
  while ((m = fnRe.exec(canonical)) !== null) {
    functionCalls.push((m[1] ?? m[2]).toLowerCase());
  }

  const schemaRefs: string[] = [];
  const schRe = /(?:"([^"]+)"|([A-Za-z_][A-Za-z0-9_$]*))\s*\./g;
  while ((m = schRe.exec(canonical)) !== null) {
    schemaRefs.push((m[1] ?? m[2]).toLowerCase());
  }

  return {
    canonical,
    identifiers: [...new Set(identifiers)],
    functionCalls: [...new Set(functionCalls)],
    schemaRefs: [...new Set(schemaRefs)],
    hasSeparator,
    hasUnicodeEscape,
  };
}

export function validate(raw: string): { verdict: Verdict; parsed: Parsed } {
  const parsed = parse(raw);
  const v = (verdict: Verdict) => ({ verdict, parsed });

  if (!raw.trim()) {
    return v({ allowed: false, reason: "not_select", message: "Nothing to run." });
  }

  if (!/^\s*(select|with)\b/i.test(parsed.canonical)) {
    return v({
      allowed: false,
      reason: "not_select",
      message: "Only SELECT and WITH queries are allowed. Anything else is refused before it reaches a connection.",
    });
  }

  if (parsed.hasSeparator) {
    return v({
      allowed: false,
      reason: "multi_statement",
      token: ";",
      message: "Multi-statement queries are not allowed.",
    });
  }

  if (parsed.hasUnicodeEscape) {
    return v({
      allowed: false,
      reason: "unicode_escape",
      token: "U&",
      message: "Unicode-escaped identifiers and strings are not permitted.",
    });
  }

  for (const schema of BLOCKED_SCHEMAS) {
    if (parsed.schemaRefs.includes(schema)) {
      return v({
        allowed: false,
        reason: "catalog_schema",
        token: schema,
        message: `Access to system catalog schema '${schema}' is not permitted.`,
      });
    }
  }

  for (const ident of BLOCKED_IDENTIFIERS) {
    if (parsed.identifiers.includes(ident)) {
      return v({
        allowed: false,
        reason: "catalog_schema",
        token: ident,
        message: `Access to system catalog schema '${ident}' is not permitted.`,
      });
    }
  }

  // the pg_ prefix rule: every catalog table, view and function in one check
  for (const ident of parsed.identifiers) {
    if (ident.startsWith("pg_")) {
      const isFn = parsed.functionCalls.includes(ident);
      return v({
        allowed: false,
        reason: isFn ? "dangerous_function" : "system_table",
        token: ident,
        message: isFn
          ? `Execution of function '${ident}()' is strictly forbidden.`
          : `Access to system table '${ident}' is not permitted.`,
      });
    }
  }

  for (const fn of BLOCKED_FUNCTIONS) {
    if (parsed.functionCalls.includes(fn)) {
      return v({
        allowed: false,
        reason: "dangerous_function",
        token: fn,
        message: `Execution of function '${fn}()' is strictly forbidden.`,
      });
    }
  }

  for (const kw of BLOCKED_KEYWORDS) {
    if (parsed.identifiers.includes(kw)) {
      return v({
        allowed: false,
        reason: "restricted_keyword",
        token: kw,
        message: `Use of system keyword '${kw}' is not permitted.`,
      });
    }
  }

  for (const p of BLOCKED_PATTERNS) {
    if (p.re.test(parsed.canonical)) {
      return v({
        allowed: false,
        reason: "blocked_pattern",
        token: p.label,
        message: `Query contains forbidden syntax matching: ${p.label}`,
      });
    }
  }

  for (const dml of BLOCKED_DML) {
    if (parsed.identifiers.includes(dml)) {
      return v({
        allowed: false,
        reason: "data_modification",
        token: dml,
        message: "Data-modifying statements are not allowed; only read-only SELECT and WITH queries.",
      });
    }
  }

  return v({ allowed: true });
}

export type Attack = { label: string; sql: string; hint: string };

export const ATTACKS: Attack[] = [
  {
    label: "read the catalog",
    sql: "SELECT tablename FROM pg_catalog.pg_tables",
    hint: "The obvious one. Blocked on the schema before the prefix rule even gets a look.",
  },
  {
    label: "hide it in a comment",
    sql: "SELECT tablename FROM/**/pg_tables",
    hint: "Beats naive string matching. Comments are stripped before any comparison happens.",
  },
  {
    label: "hide it in quotes",
    sql: 'SELECT * FROM "PG_catalog"."pg_tables"',
    hint: "Quoting changes the text but not the token. Identifiers are unquoted and lower-cased first.",
  },
  {
    label: "delete via a CTE",
    sql: "WITH doomed AS (SELECT id FROM work_order) DELETE FROM work_order",
    hint: "Starts with WITH, so it sails through the SELECT/WITH gate. The verb token is what catches it.",
  },
  {
    label: "smuggle a second statement",
    sql: "SELECT 1; DROP TABLE work_order",
    hint: "Trailing semicolons are stripped. Any other one means two statements.",
  },
  {
    label: "leak the server identity",
    sql: "SELECT current_user, version()",
    hint: "Two rules fire here. Whichever runs first wins; both would refuse it.",
  },
  {
    label: "dump a table into one value",
    sql: "SELECT query_to_xml('SELECT * FROM work_order', true, true, '')",
    hint: "The nastiest of the set. It executes its string argument as SQL and bypasses row limits.",
  },
  {
    label: "lock rows for writing",
    sql: "SELECT * FROM work_order FOR UPDATE",
    hint: "Read-only in shape, not in effect. Pattern-matched on masked SQL.",
  },
  {
    label: "a query that should work",
    sql: "SELECT s.name, count(*) AS open_jobs\nFROM work_order w JOIN site s ON s.id = w.site_id\nWHERE w.closed_at IS NULL\nGROUP BY s.name ORDER BY 2 DESC",
    hint: "The whole point. Ordinary analytical SQL goes straight through.",
  },
  {
    label: "a literal that looks like an attack",
    sql: "SELECT * FROM work_order WHERE status = 'DELETED'",
    hint: "String literals are masked before checks, so this is not mistaken for a DELETE.",
  },
];
