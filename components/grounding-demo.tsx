"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  Five ways an answer can lie, and what catches each one.                    */
/*  Static data, no Date.now / Math.random at render, so SSR and first client  */
/*  paint agree. Scenarios are simplified from real caught cases.              */
/* -------------------------------------------------------------------------- */

type Violation =
  | "fabricated_result"
  | "fabricated_name"
  | "action_claim"
  | "numeric"
  | "ungrounded_link";

type Severity = "regenerate" | "strip" | "advisory";

type Scenario = {
  id: Violation;
  label: string;
  severity: Severity;
  question: string;
  /** what the tools actually did this turn */
  trace: { text: string; ok: boolean }[];
  /** the answer before grounding runs: plausible and wrong */
  draft: string;
  /** why the detector fires */
  detection: string;
  /** what the user gets once grounding has done its work */
  corrected: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "fabricated_result",
    label: "fabricated_result",
    severity: "regenerate",
    question: "What are the freezer temperatures across my northern sites?",
    trace: [
      { text: "runQuery  → join across operational + telemetry stores", ok: false },
      { text: "error     → cross-store join, relation not found", ok: false },
    ],
    draft:
      "Your northern sites are running between -18.2°C and -19.4°C, all within the target range. Site 4 is the warmest at -18.2°C.",
    detection:
      "Every query this turn failed, yet the answer presents data. Nothing produced those numbers.",
    corrected:
      "I couldn't answer that one. The operational and telemetry data live in separate stores and I can't join across them, so I need to query them one at a time. Want me to pull the telemetry side on its own?",
  },
  {
    id: "fabricated_name",
    label: "fabricated_name",
    severity: "regenerate",
    question: "Which sites had the most alarms last month?",
    trace: [
      { text: "runQuery  → SELECT … FROM site_alarm_summary_monthly", ok: false },
      { text: "error     → relation does not exist", ok: false },
    ],
    draft:
      "Pulling from site_alarm_summary_monthly, the top three sites by alarm count last month were 118, 204 and 91.",
    detection:
      "site_alarm_summary_monthly isn't in this tenant's schema registry. The model invented a plausible table name. Aliases and CTEs the answer defined itself are whitelisted, so only genuinely unknown names trip this.",
    corrected:
      "Top three by alarm count last month: site 118 (412 alarms), site 204 (377), site 91 (301). Query used: SELECT site_id, count(*) FROM alarm_event WHERE raised_at >= date_trunc('month', now() - interval '1 month') …",
  },
  {
    id: "action_claim",
    label: "action_claim",
    severity: "regenerate",
    question: "Export the last quarter's work orders to CSV.",
    trace: [
      { text: "runQuery  → SELECT … FROM work_order WHERE …", ok: true },
      { text: "exportQueryToCsv  → not called", ok: false },
    ],
    draft:
      "Done. I've exported 12,480 work orders to CSV and the download is ready in your reports.",
    detection:
      "The answer claims an export, but no successful export call backs it. The user would go looking for a file that was never written.",
    corrected:
      "12,480 work orders match. I've started the export now, and it'll appear in your Download Center in a moment. (This one regenerates and actually performs the export it promised.)",
  },
  {
    id: "numeric",
    label: "numeric",
    severity: "advisory",
    question: "So how many of those were overdue?",
    trace: [{ text: "no query this turn, answering from context", ok: true }],
    draft:
      "Around 1,840 of them were overdue, roughly 15% of the total.",
    detection:
      "A figure appears with no SQL run this turn. Flagged, not blocked: restating a number from earlier in the conversation is legitimate, and a model that can't refer back to its own results is useless.",
    corrected:
      "Around 1,840 of them were overdue, roughly 15% of the total. (Unchanged. This one is advisory only, and it exists so a rising count tells me the model is drifting toward answering from memory.)",
  },
  {
    id: "ungrounded_link",
    label: "ungrounded_link",
    severity: "strip",
    question: "Show me the worst performing site.",
    trace: [
      { text: "runQuery  → SELECT site_id, … ORDER BY downtime DESC LIMIT 1", ok: true },
      { text: "returned  → site_id 118", ok: true },
    ],
    draft:
      "Site 204 is your worst performer this month. You can open it here: /sites/204/overview",
    detection:
      "The link points at an id that never appeared in any result this conversation. The query returned 118, not 204. Stripped deterministically by a link sanitiser and an entity ledger, with no second model call.",
    corrected:
      "Site 118 is your worst performer this month, with 14.2 hours of downtime. You can open it here: /sites/118/overview",
  },
];

const SEVERITY_COPY: Record<Severity, string> = {
  regenerate: "triggers a correction round",
  strip: "removed deterministically, no model call",
  advisory: "counted, not corrected",
};

export function GroundingDemo() {
  const [active, setActive] = useState<Violation>("fabricated_result");
  const [grounding, setGrounding] = useState(true);

  const scenario = SCENARIOS.find((s) => s.id === active) ?? SCENARIOS[0];

  return (
    <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
      {/* control bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-card/60 px-4 py-3">
        <span className="font-mono text-xs text-muted-foreground">
          grounding layer
        </span>
        <button
          type="button"
          onClick={() => setGrounding((g) => !g)}
          aria-pressed={grounding}
          className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-[''] ${
            grounding ? "bg-primary" : "bg-muted-foreground/30"
          }`}
        >
          <span className="sr-only">Toggle grounding layer</span>
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className={`inline-block h-4 w-4 rounded-full bg-background ${
              grounding ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
        <span
          className={`font-mono text-xs font-semibold ${
            grounding ? "text-primary" : "text-amber-500"
          }`}
        >
          {grounding ? "ON" : "OFF"}
        </span>
        <span className="ml-auto font-mono text-xs text-muted-foreground">
          {grounding
            ? "what users get"
            : "what they'd have got without it"}
        </span>
      </div>

      {/* scenario picker */}
      <div className="flex flex-wrap gap-2 border-b border-border px-4 py-3">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(s.id)}
            aria-pressed={s.id === active}
            className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
              s.id === active
                ? "border-primary/60 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* the question */}
        <div>
          <div className="font-mono text-xs text-muted-foreground mb-1.5">
            question
          </div>
          <p className="text-sm text-foreground">{scenario.question}</p>
        </div>

        {/* what the tools did */}
        <div>
          <div className="font-mono text-xs text-muted-foreground mb-1.5">
            what actually ran
          </div>
          <div className="rounded-md border border-border bg-background/60 p-3 space-y-1">
            {scenario.trace.map((line) => (
              <div
                key={line.text}
                className={`font-mono text-xs ${
                  line.ok ? "text-muted-foreground" : "text-amber-500"
                }`}
              >
                {line.ok ? "  " : "! "}
                {line.text}
              </div>
            ))}
          </div>
        </div>

        {/* the answer */}
        <div>
          <div className="font-mono text-xs text-muted-foreground mb-1.5">
            answer shown to the user
          </div>
          <div aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${scenario.id}-${grounding}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className={`rounded-md border p-3 text-sm leading-relaxed ${
                grounding
                  ? "border-primary/40 bg-primary/5 text-foreground"
                  : "border-amber-500/40 bg-amber-500/5 text-foreground"
              }`}
            >
              {grounding ? scenario.corrected : scenario.draft}
            </motion.div>
          </AnimatePresence>
          </div>
        </div>

        {/* what fired */}
        <div aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {grounding ? (
            <motion.div
              key={`det-${scenario.id}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="rounded-md border border-border bg-background/60 p-3">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs text-primary">
                    {scenario.label}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {SEVERITY_COPY[scenario.severity]}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {scenario.detection}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.p
              key="off-note"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="text-sm text-muted-foreground leading-relaxed"
            >
              Nothing looks wrong, which is the whole problem. Every answer above
              is fluent, confident and specific, and a user has no way to tell it
              apart from a real one. Turn the toggle back on.
            </motion.p>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
