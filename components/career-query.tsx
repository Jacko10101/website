"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { QUESTIONS, SCHEMA_SUMMARY, TABLES } from "@/lib/career-db";
import { validate } from "@/lib/sql-guard";

/**
 * Ask this site a question about my work and watch it answer with the query.
 *
 * This is Clarity's central rule pointed at the site itself: never assert a
 * number without showing what produced it. The questions are curated, and the
 * page says so — but the database is real, the SQL runs for real in the
 * visitor's browser, and the box is guarded by the same validator port that
 * refuses model-generated SQL on the Clarity case study.
 *
 * The engine is imported dynamically on first run, so it costs nothing on
 * first paint. Nothing leaves the browser; there is no API behind this.
 */

type Row = Record<string, unknown>;

type State =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "rows"; rows: Row[]; ms: number }
  | { kind: "refused"; message: string }
  | { kind: "error"; message: string };

/**
 * Real SQLite, compiled to WebAssembly, running in the visitor's tab. The wasm
 * binary is only fetched on the first query, so it costs nothing on first
 * paint — and it needs no `unsafe-eval`, only the far narrower
 * `wasm-unsafe-eval` this site's CSP grants.
 */
interface SqlDb {
  exec: (sql: string) => { columns: string[]; values: unknown[][] }[];
}

let dbPromise: Promise<SqlDb> | null = null;
/** True once the engine is warm. After that `db.exec` is synchronous and
 *  there is no interval in which "running…" can usefully be shown — flipping
 *  through it tore the table down and dropped the panel to its floor for one
 *  frame on every question. */
let dbReady = false;

function getDb(): Promise<SqlDb> {
  if (dbPromise) return dbPromise;
  dbPromise = import("sql.js").then(async (mod) => {
    const initSqlJs = (mod.default ?? mod) as unknown as (
      cfg: { locateFile: (f: string) => string }
    ) => Promise<{ Database: new () => SqlDb }>;
    const SQL = await initSqlJs({ locateFile: () => "/sql-wasm.wasm" });
    const db = new SQL.Database();
    for (const table of TABLES) {
      db.exec(table.ddl);
      for (const row of table.rows) {
        const values = row
          .map((v) => (typeof v === "number" ? String(v) : `'${String(v).replace(/'/g, "''")}'`))
          .join(", ");
        db.exec(`INSERT INTO ${table.name} VALUES (${values})`);
      }
    }
    dbReady = true;
    return db;
  });
  return dbPromise;
}

// Opens on the every-number question rather than "what's running in
// production?" — that one returned the same six project tiles the reader is
// about to scroll into, so the site's best artefact led on a worse version of
// the next section.
const OPENING = 3;

export function CareerQuery() {
  const [asked, setAsked] = useState(QUESTIONS[OPENING].ask);
  const [sql, setSql] = useState(QUESTIONS[OPENING].sql);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [showSchema, setShowSchema] = useState(false);
  // The panel answers its opening question on mount; announcing that would
  // read a whole table at every homepage visit. It goes live once asked.
  const [announce, setAnnounce] = useState(false);
  const firstRun = useRef(true);

  const run = useCallback(async (query: string) => {
    const { verdict } = validate(query);
    if (!verdict.allowed) {
      setState({
        kind: "refused",
        message: verdict.message ?? "Refused before it reached a connection.",
      });
      return;
    }

    if (!dbReady) setState({ kind: "running" });
    try {
      const db = await getDb();
      const started = performance.now();
      const result = db.exec(query);
      const ms = performance.now() - started;
      // sql.js returns one {columns, values} set per statement; shape it into
      // plain rows so the table renderer stays dumb.
      const first = result[0];
      const rows: Row[] = first
        ? first.values.map((v) =>
            Object.fromEntries(first.columns.map((c, i) => [c, v[i]]))
          )
        : [];
      setState({ kind: "rows", rows, ms });
    } catch (e) {
      setState({
        kind: "error",
        message:
          e instanceof Error
            ? e.message
            : "That query didn't parse. The engine is SQL, but not every dialect.",
      });
    }
  }, []);

  // Answer the opening question on mount so the panel is never empty.
  useEffect(() => {
    if (!firstRun.current) return;
    firstRun.current = false;
    run(QUESTIONS[OPENING].sql);
  }, [run]);

  const pick = (q: (typeof QUESTIONS)[number]) => {
    setAnnounce(true);
    setAsked(q.ask);
    setSql(q.sql);
    run(q.sql);
  };

  const columns =
    state.kind === "rows" && state.rows.length > 0 ? Object.keys(state.rows[0]) : [];

  return (
    <div className="rounded-xl border border-border bg-card/40 overflow-hidden glow-border">
      {/* Chrome */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border bg-card/60">
        <span className="font-mono text-xs text-muted-foreground">
          ask · devlinops.com
        </span>
        <button
          type="button"
          onClick={() => setShowSchema((s) => !s)}
          className="-my-1.5 rounded px-2 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors duration-150 hover:text-primary active:text-primary/70"
          aria-expanded={showSchema}
        >
          {showSchema ? "hide schema" : "schema"}
        </button>
      </div>

      {showSchema && (
        <pre className="px-4 py-3 border-b border-border bg-black/40 font-mono text-[11px] text-muted-foreground whitespace-pre-wrap">
          {SCHEMA_SUMMARY}
        </pre>
      )}

      {/* Questions */}
      <div className="px-4 py-3 border-b border-border">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          ask something
        </p>
        <div className="flex flex-wrap gap-2">
          {QUESTIONS.map((q) => (
            <button
              key={q.ask}
              type="button"
              onClick={() => pick(q)}
              aria-pressed={asked === q.ask}
              className={`rounded-md border px-2.5 py-2 text-left font-mono text-[11px] transition-colors duration-150 active:bg-primary/15 ${
                asked === q.ask
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
              }`}
            >
              {q.ask}
            </button>
          ))}
        </div>
      </div>

      {/* The query, editable */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-[10px] uppercase tracking-wider text-primary">
            the query that answers it
          </p>
          <button
            type="button"
            onClick={() => {
              setAnnounce(true);
              run(sql);
            }}
            disabled={state.kind === "running"}
            className="min-h-8 rounded-md bg-primary px-4 py-1.5 font-mono text-[11px] font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary/90 active:bg-primary/75 disabled:cursor-wait disabled:opacity-70"
          >
            run
          </button>
        </div>
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              setAnnounce(true);
              run(sql);
            }
          }}
          spellCheck={false}
          rows={Math.min(9, sql.split("\n").length + 1)}
          aria-label="SQL query, editable"
          title="Edit the query, then press Cmd/Ctrl + Enter to run it"
          className="w-full resize-y rounded-md border border-border bg-black/50 p-3 font-mono text-[12px] leading-6 text-foreground/90 outline-none focus:border-primary/50"
        />
      </div>

      {/* Result. The floor is the height a full result settles at: reserving
          8rem meant the homepage reflowed ~160px the moment the wasm resolved. */}
      <div className="px-4 py-3 min-h-[18rem]" role="status" aria-live={announce ? "polite" : "off"}>
        {state.kind === "running" && (
          <p className="font-mono text-[11px] text-muted-foreground">running…</p>
        )}

        {state.kind === "refused" && (
          <div className="rounded-md border border-error/50 bg-error/5 p-3">
            <p className="font-mono text-[11px] text-error mb-1">refused</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{state.message}</p>
            <p className="mt-2 text-[11px] text-muted-foreground/80 leading-relaxed">
              That refusal came from the same validator that guards
              model-generated SQL in Clarity, ported to run here.
            </p>
          </div>
        )}

        {state.kind === "error" && (
          <div className="rounded-md border border-warn/50 bg-warn/5 p-3">
            <p className="font-mono text-[11px] text-warn mb-1">the engine couldn&apos;t run that</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{state.message}</p>
          </div>
        )}

        {state.kind === "rows" && (
          <>
            {state.rows.length === 0 ? (
              <p className="font-mono text-[11px] text-muted-foreground">
                0 rows.
              </p>
            ) : (
              <div
                tabIndex={0}
                className="max-h-[15rem] overflow-auto rounded-md border border-border/40"
              >
                <table className="w-full font-mono text-[12px]">
                  <thead className="sticky top-0 bg-card">
                    <tr className="text-left">
                      {columns.map((c) => (
                        <th
                          key={c}
                          className="border-b border-border py-2 pl-3 pr-5 font-normal text-[10px] uppercase tracking-wider text-muted-foreground"
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {state.rows.map((row, i) => (
                      <tr key={i} className="align-top">
                        {columns.map((c) => (
                          <td
                            key={c}
                            className="border-b border-border/40 py-1.5 pl-3 pr-5 text-foreground/85"
                          >
                            {String(row[c] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="mt-3 font-mono text-[10px] text-muted-foreground/80">
              {state.rows.length} row{state.rows.length === 1 ? "" : "s"} · {state.ms.toFixed(1)}ms ·
              executed in your browser
            </p>
          </>
        )}
      </div>

      <p className="px-4 py-3 border-t border-border text-[11px] leading-relaxed text-muted-foreground/80">
        Questions are mine. Database, query and result are real, and nothing
        leaves your browser.
      </p>
    </div>
  );
}
