"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ATTACKS, validate } from "@/lib/sql-guard";

/* -------------------------------------------------------------------------- */
/*  Type SQL, watch the real rules refuse it. The tokenised pane is the point: */
/*  every check runs on canonical tokens, which is why the comment and quoting */
/*  tricks collapse into the same blocked name.                                */
/* -------------------------------------------------------------------------- */

export function SqlPlayground() {
  const [sql, setSql] = useState(ATTACKS[1].sql);
  const [hint, setHint] = useState<string | null>(ATTACKS[1].hint);

  const { verdict, parsed } = useMemo(() => validate(sql), [sql]);

  const pick = (i: number) => {
    setSql(ATTACKS[i].sql);
    setHint(ATTACKS[i].hint);
  };

  return (
    <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
      <div className="border-b border-border bg-card/60 px-4 py-3">
        <div className="font-mono text-xs text-muted-foreground mb-2">
          try one, or write your own
        </div>
        <div className="flex flex-wrap gap-2">
          {ATTACKS.map((a, i) => (
            <button
              key={a.label}
              type="button"
              onClick={() => pick(i)}
              aria-pressed={sql === a.sql}
              className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
                sql === a.sql
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-2">
        {/* input */}
        <div className="border-b lg:border-b-0 lg:border-r border-border">
          <div className="px-4 pt-3 font-mono text-xs text-muted-foreground">
            model-generated SQL
          </div>
          <textarea
            value={sql}
            onChange={(e) => {
              setSql(e.target.value);
              setHint(null);
            }}
            spellCheck={false}
            rows={7}
            aria-label="SQL to validate"
            className="w-full bg-transparent px-4 py-3 font-mono text-[12px] leading-relaxed text-foreground outline-none resize-y placeholder:text-muted-foreground/40"
            placeholder="SELECT …"
          />

          <div className="px-4 pb-4">
            <div className="font-mono text-xs text-muted-foreground mb-1.5">
              what the validator actually sees
            </div>
            <div className="rounded-md border border-border bg-background/60 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground break-words">
              {parsed.canonical || <span className="opacity-40">empty</span>}
            </div>
            <p className="mt-2 font-mono text-[11px] text-muted-foreground/80">
              comments stripped · literals masked · identifiers unquoted and
              lower-cased
            </p>
          </div>
        </div>

        {/* verdict */}
        <div className="p-4 sm:p-5">
          <div role="status" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${verdict.allowed}-${verdict.reason}-${verdict.token}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <div
                className={`rounded-md border p-3 ${
                  verdict.allowed
                    ? "border-primary/40 bg-primary/5"
                    : "border-amber-500/40 bg-amber-500/5"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span
                    className={`font-mono text-xs font-semibold ${
                      verdict.allowed ? "text-primary" : "text-amber-500"
                    }`}
                  >
                    {verdict.allowed ? "allowed" : "blocked"}
                  </span>
                  {verdict.reason && (
                    <code className="font-mono text-[11px] text-muted-foreground">
                      clarity.sql.blocked{"{"}reason=
                      <span className="text-amber-500">{verdict.reason}</span>
                      {"}"}
                    </code>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {verdict.allowed
                    ? "Passes every rule. It would run as the read-only role, capped at 500 rows, with a 30 second statement timeout."
                    : verdict.message}
                </p>
                {verdict.token && (
                  <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                    offending token:{" "}
                    <span className="text-amber-500">{verdict.token}</span>
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          </div>

          {hint && (
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {hint}
            </p>
          )}

          <div className="mt-5 pt-4 border-t border-border">
            <div className="font-mono text-[11px] text-muted-foreground/80 space-y-1">
              <div>
                identifiers:{" "}
                <span className="text-muted-foreground">
                  {parsed.identifiers.slice(0, 12).join(", ") || "none"}
                </span>
              </div>
              <div>
                calls:{" "}
                <span className="text-muted-foreground">
                  {parsed.functionCalls.join(", ") || "none"}
                </span>
              </div>
              <div>
                schema refs:{" "}
                <span className="text-muted-foreground">
                  {parsed.schemaRefs.join(", ") || "none"}
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground/80 leading-relaxed">
              These are the real rule sets and reason codes, ported to run in
              your browser. Nothing is sent anywhere. In production this is the
              outermost layer: underneath it the query still runs as a
              SELECT-only role that fails closed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
