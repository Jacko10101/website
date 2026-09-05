import { describe, expect, it } from "vitest";
import { ATTACKS, parse, validate, type Reason } from "./sql-guard";

/**
 * The guard is the site's most-cited piece of engineering: it is what
 * refuses model-generated SQL in Clarity, and the same code gates the
 * career query on /oncall. These cases pin the behaviour the case
 * study describes, reason code by reason code.
 */

const refused: [string, string, Reason, string?][] = [
  ["a DDL statement", "DROP TABLE work_order", "not_select"],
  ["an update", "UPDATE work_order SET closed_at = now()", "not_select"],
  ["a second statement after a semicolon", "SELECT 1; DROP TABLE work_order", "multi_statement", ";"],
  ["a unicode-escaped literal", "SELECT U&'\\0041'", "unicode_escape", "U&"],
  ["the catalog by schema", "SELECT tablename FROM pg_catalog.pg_tables", "catalog_schema", "pg_catalog"],
  ["the catalog behind quoting and case", 'SELECT * FROM "PG_catalog"."pg_tables"', "catalog_schema", "pg_catalog"],
  ["information_schema", "select * from information_schema.tables", "catalog_schema", "information_schema"],
  ["a pg_ table hidden behind a comment", "SELECT tablename FROM/**/pg_tables", "system_table", "pg_tables"],
  ["a pg_ function", "SELECT pg_sleep(10)", "dangerous_function", "pg_sleep"],
  ["a server-identity function", "SELECT version()", "dangerous_function", "version"],
  ["a query-executing XML function", "SELECT query_to_xml('SELECT 1', true, true, '')", "dangerous_function", "query_to_xml"],
  ["a session keyword", "SELECT current_user", "restricted_keyword", "current_user"],
  ["a row lock", "SELECT * FROM work_order FOR UPDATE", "blocked_pattern", "FOR [NO KEY] UPDATE"],
  ["a shared lock", "SELECT * FROM work_order FOR SHARE", "blocked_pattern", "FOR [KEY] SHARE"],
  ["SELECT INTO", "SELECT * INTO backup FROM work_order", "blocked_pattern"],
  ["a delete smuggled through a CTE", "WITH doomed AS (SELECT id FROM work_order) DELETE FROM work_order", "data_modification", "delete"],
  ["an insert smuggled through a CTE", "WITH x AS (SELECT 1) INSERT INTO work_order VALUES (1)", "data_modification", "insert"],
];

const allowed: [string, string][] = [
  ["ordinary analytical SQL", "SELECT s.name, count(*) AS open_jobs\nFROM work_order w JOIN site s ON s.id = w.site_id\nWHERE w.closed_at IS NULL\nGROUP BY s.name ORDER BY 2 DESC"],
  ["a literal that looks like an attack", "SELECT * FROM work_order WHERE status = 'DELETED'"],
  ["a literal containing a semicolon", "SELECT * FROM work_order WHERE note = 'a; b'"],
  ["a literal with an escaped quote", "SELECT 'it''s fine'"],
  ["a trailing semicolon", "SELECT 1;"],
  ["a trailing comment", "SELECT 1 -- ; DROP TABLE work_order"],
  ["a CTE that only reads", "WITH open AS (SELECT * FROM work_order WHERE closed_at IS NULL) SELECT count(*) FROM open"],
  ["leading whitespace and lower case", "   select 1"],
];

describe("validate refuses", () => {
  it.each(refused)("%s", (_label, sql, reason, token) => {
    const { verdict } = validate(sql);
    expect(verdict.allowed).toBe(false);
    expect(verdict.reason).toBe(reason);
    if (token) expect(verdict.token).toBe(token);
    expect(verdict.message).toBeTruthy();
  });

  it("an empty query", () => {
    const { verdict } = validate("   ");
    expect(verdict).toEqual({ allowed: false, reason: "not_select", message: "Nothing to run." });
  });
});

describe("validate allows", () => {
  it.each(allowed)("%s", (_label, sql) => {
    expect(validate(sql).verdict).toEqual({ allowed: true });
  });
});

describe("the attack list on /projects/clarity", () => {
  const shouldPass = new Set(["a query that should work", "a literal that looks like an attack"]);
  it.each(ATTACKS.map((a) => [a.label, a.sql] as const))("%s", (label, sql) => {
    expect(validate(sql).verdict.allowed).toBe(shouldPass.has(label));
  });
});

describe("parse canonicalises before anything is compared", () => {
  it("strips comments and masks literals", () => {
    const p = parse("SELECT /* hidden */ name FROM site -- trailing\nWHERE name = 'pg_catalog'");
    expect(p.canonical).toBe("SELECT name FROM site WHERE name = '…'");
    expect(p.identifiers).not.toContain("pg_catalog");
  });

  it("unquotes and lower-cases identifiers", () => {
    const p = parse('SELECT "Name" FROM "Work_Order"');
    expect(p.identifiers).toEqual(expect.arrayContaining(["name", "work_order"]));
  });

  it("tells calls from schema references", () => {
    const p = parse("SELECT count(*) FROM public.site");
    expect(p.functionCalls).toContain("count");
    expect(p.schemaRefs).toContain("public");
  });

  it("only treats a non-trailing semicolon as a separator", () => {
    expect(parse("SELECT 1;").hasSeparator).toBe(false);
    expect(parse("SELECT 1; SELECT 2").hasSeparator).toBe(true);
    expect(parse("SELECT ';'").hasSeparator).toBe(false);
  });
});
