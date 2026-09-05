"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  The document the model is handed before it sees a question. Rendered in    */
/*  the compiler's real output format; table names and summaries are           */
/*  anonymised. Annotations explain why each part earns its tokens.            */
/* -------------------------------------------------------------------------- */

type Ann = {
  id: string;
  label: string;
  body: string;
};

const ANNOTATIONS: Record<string, Ann> = {
  complete: {
    id: "complete",
    label: "the completeness claim",
    body: "Saying this is the complete set is what stops the model inventing a table it feels ought to exist. Anything it names outside this list gets caught downstream as fabricated_name.",
  },
  fresh: {
    id: "fresh",
    label: "freshness marks",
    body: "The compile probes each table's newest timestamp and stamps the result. A dead table announces itself, so the model routes around it instead of confidently reporting no data. This is the mark that exists because of a real bug.",
  },
  summary: {
    id: "summary",
    label: "written by the model, once",
    body: "Each summary is LLM-generated during the nightly compile, not at question time. Tables diff by content hash, so unchanged ones carry last night's summary forward and cost nothing.",
  },
  glossary: {
    id: "glossary",
    label: "the words users actually use",
    body: "Users don't ask about work_order.status_code; they ask which jobs are overdue. The glossary maps their language onto the schema so the model doesn't have to guess.",
  },
  recipe: {
    id: "recipe",
    label: "known-good SQL",
    body: "Queries that are known to work, for questions people keep asking. Cheaper and far more reliable than having the model rediscover a five-table join every morning.",
  },
};

type Line = { text: string; ann?: string; tone?: "head" | "dim" | "code" | "fresh" };

const DOC: Line[] = [
  { text: "## Schema Directory", tone: "head" },
  {
    text: "Every table you can query is listed below with a one-line description.",
    tone: "dim",
  },
  { text: "This is the complete set.", tone: "dim", ann: "complete" },
  { text: "" },
  { text: "### operational", tone: "head" },
  { text: "- `work_order` — jobs raised against a site, with status and due date", ann: "summary" },
  { text: "- `site` — every physical location, with region and commissioning date" },
  { text: "- `asset` — equipment installed at a site, keyed to its site" },
  {
    text: "- `site_daily_rollup` (no new data since 2025-03) — legacy daily aggregates",
    tone: "fresh",
    ann: "fresh",
  },
  { text: "- `alarm_event_archive` (no rows) — superseded, retained for audit", tone: "fresh", ann: "fresh" },
  { text: "" },
  { text: "### telemetry", tone: "head" },
  { text: "- `reading` — time-series sensor readings, one row per probe per interval" },
  { text: "- `probe` — sensor metadata: type, unit, the asset it monitors" },
  { text: "" },
  { text: "## Glossary", tone: "head" },
  { text: "- **overdue**: a work order past its due date and not yet closed", ann: "glossary" },
  { text: "- **estate**: every site belonging to one tenant" },
  { text: "" },
  { text: "## Verified Query Recipes", tone: "head" },
  { text: "- **open work by site** — how much outstanding work does each site have?", ann: "recipe" },
  { text: "```sql", tone: "code" },
  { text: "SELECT s.name, count(*) AS open_jobs", tone: "code" },
  { text: "FROM work_order w JOIN site s ON s.id = w.site_id", tone: "code" },
  { text: "WHERE w.closed_at IS NULL GROUP BY s.name ORDER BY 2 DESC", tone: "code" },
  { text: "```", tone: "code" },
];

export function SchemaDirectory() {
  const [active, setActive] = useState<string | null>("fresh");

  return (
    <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border bg-card/60 px-4 py-2.5">
        <span className="font-mono text-xs text-primary">
          compiled nightly, injected as cached context
        </span>
        <span className="ml-auto font-mono text-[11px] text-muted-foreground">
          click a highlighted line
        </span>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.35fr_1fr]">
        {/* the document */}
        <div tabIndex={0} className="p-4 sm:p-5 overflow-x-auto border-b lg:border-b-0 lg:border-r border-border">
          <pre className="font-mono text-[11.5px] leading-[1.75] whitespace-pre">
            {DOC.map((l, i) => {
              const clickable = Boolean(l.ann);
              const isActive = clickable && l.ann === active;
              const base =
                l.tone === "head"
                  ? "text-foreground font-semibold"
                  : l.tone === "dim"
                    ? "text-muted-foreground/70"
                    : l.tone === "code"
                      ? "text-muted-foreground/80"
                      : l.tone === "fresh"
                        ? "text-amber-500/90"
                        : "text-muted-foreground";
              if (!clickable)
                return (
                  <div key={i} className={base}>
                    {l.text || " "}
                  </div>
                );
              return (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  onClick={() => setActive(l.ann!)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActive(l.ann!);
                    }
                  }}
                  className={`cursor-pointer rounded-sm -mx-1 px-1 transition-colors ${base} ${
                    isActive
                      ? "bg-primary/15 text-foreground"
                      : "bg-primary/[0.06] hover:bg-primary/12 active:bg-primary/20"
                  }`}
                >
                  {l.text}
                </div>
              );
            })}
          </pre>
        </div>

        {/* the annotation */}
        <div role="status" aria-live="polite" className="p-4 sm:p-5">
          <AnimatePresence mode="wait" initial={false}>
            {active && (
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
              >
                <div className="font-mono text-xs text-primary mb-2">
                  {ANNOTATIONS[active].label}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {ANNOTATIONS[active].body}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground/80 leading-relaxed">
              Everything above is sanitised before it reaches the prompt.
              Table comments and sample values are attacker-influenceable, so
              headings, code fences and template tokens are defused at the
              rendering boundary. Injected knowledge is data, never
              instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
