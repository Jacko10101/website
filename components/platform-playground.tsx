"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GitBranch, Blocks, Braces, Database, Package, ShieldCheck, Sparkles, GitPullRequest, Check, HelpCircle, ArrowUpRight } from "lucide-react";

type Mode = "release" | "nightshift" | "clarity";
const flows = {
  release: {
    label: "Ship a change", project: "Delivery platform", href: "/projects/pipeline-platform", code: "git push origin main",
    title: "From your laptop to somewhere useful.", core: "Ship it.", icon: GitBranch,
    steps: ["Build", "Deploy to dev", "Verify", "Promote to QA"], icons: [Package, Blocks, ShieldCheck, ArrowUpRight],
    notes: ["Build the image. Give this change a revision.", "ArgoCD picks up the revision and deploys it to dev.", "Run the checks against the service that is actually running.", "Checks passed. Promote that same revision to QA."],
    complete: "Same revision. Checked, deployed, ready for QA.", stopped: "A check failed. The change stays in dev.",
    fault: "Break a check", result: "Ready for QA", refused: "Hold the release",
  },
  nightshift: {
    label: "Give AI a task", project: "Nightshift", href: "/projects/nightshift", code: "ticket → tested change → review",
    title: "Let the agent work. Keep the judgement.", core: "On it.", icon: Sparkles,
    steps: ["Read the ticket", "Write the change", "Check the work", "Draft the PR"], icons: [HelpCircle, Braces, ShieldCheck, GitPullRequest],
    notes: ["Check the scope and choose the allowed repository.", "Work on the implementation in an isolated workspace.", "Rebuild the change from a clean baseline and run the checks.", "Open a draft, with the evidence attached. Your review comes next."],
    complete: "One reviewable change. An engineer makes the final call.", stopped: "Not enough detail. Ask a question before changing code.",
    fault: "Leave the ticket vague", result: "Over to you", refused: "Needs a question",
  },
  clarity: {
    label: "Ask the data", project: "Clarity", href: "/projects/clarity", code: '"Which sites are above their limit?"',
    title: "A question in. An answer with its working.", core: "Ask away.", icon: Database,
    steps: ["Understand", "Check the SQL", "Read the data", "Answer + report"], icons: [Sparkles, ShieldCheck, Database, ArrowUpRight],
    notes: ["Which example sites are above their temperature limit?", "Check that the SQL is read-only and stays in this customer’s data.", "Compare each sample site’s reading with its configured limit.", "North Quay: 9.2°C. Limit: 8°C. The query and report stay attached."],
    complete: "North Quay is above its limit. Here is the data behind it.", stopped: "Wrong customer’s data. Stop before the query runs.",
    fault: "Cross a tenant boundary", result: "Answer grounded", refused: "Access refused",
  },
};

const paths = ["M 150 76 C 215 25, 385 25, 450 76", "M 450 76 C 545 112, 545 256, 450 292", "M 450 292 C 385 343, 215 343, 150 292", "M 150 292 C 55 256, 55 112, 150 76"];

export function PlatformPlayground({ initialMode = "release", compact = false }: { initialMode?: Mode; compact?: boolean }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [failure, setFailure] = useState(false);
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const flow = flows[mode];
  const CoreIcon = flow.icon;
  const stopAt = failure ? (mode === "nightshift" ? 0 : mode === "clarity" ? 1 : 2) : 3;

  useEffect(() => {
    if (!running) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      if (reduced || step >= stopAt) {
        setStep(stopAt); setRunning(false); setDone(true);
      } else setStep(step + 1);
    }, reduced ? 0 : 850);
    return () => window.clearTimeout(timer);
  }, [running, step, stopAt]);

  function reset(nextMode = mode, nextFailure = failure) {
    setMode(nextMode); setFailure(nextFailure); setRunning(false); setDone(false); setStep(-1);
  }
  const stageState = (i: number) => step < i ? "waiting" : done && failure && i === stopAt ? "stopped" : step === i && running ? "active" : "complete";

  return <div className={`platform-playground ink-surface ${compact ? "playground-compact" : ""}`} data-mode={mode} data-outcome={done ? failure ? "stopped" : "complete" : running ? "running" : "ready"}>
    <div className="playground-top"><span><i aria-hidden /> THE SMALL SYSTEMS LAB</span><span>Yours to try ↙</span></div>
    <div className="playground-tabs" role="group" aria-label="Choose a platform example">
      {(Object.keys(flows) as Mode[]).map((id, index) => <button type="button" key={id} aria-pressed={mode === id} onClick={() => reset(id, false)}><span className="tab-number">0{index + 1}</span>{flows[id].label}</button>)}
    </div>
    <div className="playground-body">
      <div className="playground-context"><span className="folio-label">{flow.project}</span><span className="playground-state">{running ? "Working on it" : done ? failure ? "Boundary held" : "Handover ready" : "Waiting for you"}</span></div>
      <p className="playground-title">{flow.title}</p>
      <div className="system-stage">
        <svg className="system-wiring" viewBox="0 0 600 368" preserveAspectRatio="none" aria-hidden="true">
          <ellipse cx="300" cy="184" rx="213" ry="126" className="system-ghost-orbit" />
          {paths.map((d, i) => <g key={i} data-state={stageState(i)}><path d={d} className="system-wire" /><path d={d} className="system-packet" /></g>)}
          <path d="M150 76 L300 184 L450 76 M150 292 L300 184 L450 292" className="system-spokes" />
        </svg>
        <div className="system-core" aria-hidden="true"><div className="core-orbit core-orbit-one" /><div className="core-orbit core-orbit-two" /><div className="core-inner"><CoreIcon size={28} strokeWidth={1.2} /><span>{done ? failure ? "Hold on." : "All yours." : flow.core}</span><small>{running ? "IN MOTION" : done ? failure ? "STOPPED" : "COMPLETE" : "READY WHEN YOU ARE"}</small></div></div>
        <ol className="playground-flow" aria-label="Workflow stages">
          {flow.steps.map((label, i) => { const Icon = flow.icons[i]; return <li key={label} data-state={stageState(i)}><span className="flow-node" aria-hidden>{done && failure && i === stopAt ? <HelpCircle size={20} /> : step > i || done && step >= i ? <Check size={20} /> : <Icon size={20} strokeWidth={1.5} />}</span><span><small>0{i + 1}</small>{label}</span></li>; })}
        </ol>
        <span className="system-command" aria-hidden="true">{flow.code}</span>
      </div>
      <div className="playground-log" role="status" aria-live="polite" aria-atomic="true"><span aria-hidden>{done ? failure ? "!" : "✓" : "↳"}</span><p>{done ? <><strong>{failure ? flow.refused : flow.result}.</strong> {failure ? flow.stopped : flow.complete}</> : step >= 0 ? flow.notes[step] : "Pick a path. Follow it through. Then see what happens when something goes wrong."}</p></div>
      <div className="playground-controls"><button type="button" className="playground-run" disabled={running} onClick={() => { setDone(false); setStep(0); setRunning(true); }}>{running ? "Working…" : done ? "Give it another go" : "Set it in motion"}<ArrowUpRight size={16} aria-hidden /></button><label className="playground-failure"><input type="checkbox" checked={failure} onChange={(e) => reset(mode, e.target.checked)} /><span>{flow.fault}</span></label></div>
    </div>
    <div className="playground-bottom"><span>Illustrative workflows · sample data</span><Link href={flow.href}>The real project <ArrowUpRight size={12} aria-hidden /></Link></div>
  </div>;
}
