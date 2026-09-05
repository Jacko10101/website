import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CaseStudyLayout } from "@/components/case-study-layout";

/* --------------------------------------------------------------------------
 * The dissertation, set as what it is: a paper. Title block, abstract, index
 * terms, numbered sections, figures with numbered captions, a results table
 * with the registered/descriptive marking the paper uses, threats to
 * validity, and an artefact list where a paper would carry references.
 * Every figure below is drawn in-page from the run records; every number is
 * the paper's own, re-derived from `runs/` through the receipts index.
 * ----------------------------------------------------------------------- */

const PAPER_PHOSPHOR = { hue: 195, chroma: 0.13, label: "P22 · cyan" };

/* ---- data, all from runs/ via docs/RECEIPTS.md ----------------------- */

// Eighteen confirmatory node kills, honest services (blocks 8–25). Weighted
// completion at the horizon, %, per arm. Source: runs/confirmatory-stop/records.
const ROUNDS = {
  stock: [84.1, 78.4, 75.7, 75.4, 72.3, 79.0, 76.7, 80.0, 78.9, 83.9, 79.8, 80.9, 79.9, 77.5, 83.1, 75.9, 83.7, 78.9],
  priorityclass: [88.3, 89.2, 97.3, 86.1, 85.5, 90.9, 85.6, 90.0, 87.6, 92.6, 86.2, 82.3, 84.5, 91.3, 97.3, 86.5, 90.5, 82.4],
  knapsack: [87.6, 86.3, 89.2, 81.3, 82.4, 86.9, 82.2, 85.0, 87.1, 89.9, 84.0, 84.4, 82.8, 85.6, 91.2, 76.5, 84.4, 81.9],
};

// Always-down liars, five paired node kills. Source: runs/evidence-dead/descriptive.json.
const PAIRED = {
  knapsack: [80.5, 89.9, 78.3, 83.0, 73.9],
  ai: [95.9, 97.3, 87.0, 95.8, 94.2],
};

// Every eviction the AI arm made in the two lying-services cells: the measured
// serving probability it priced the victim at, the victim's declared grade, and
// what the victim was actually doing. Source: runs/evidence-{dead,graded}/b0*-evidence-evict.json.
type Kind = "dead" | "flaky" | "healthy";
const EVICTIONS: { cell: "dead" | "graded"; block: number; p: number; grade: number; kind: Kind }[] = [
  { cell: "dead", block: 0, p: 0.095, grade: 9, kind: "dead" }, { cell: "dead", block: 0, p: 0.095, grade: 9, kind: "dead" },
  { cell: "dead", block: 0, p: 0.974, grade: 1, kind: "healthy" }, { cell: "dead", block: 0, p: 0.974, grade: 1, kind: "healthy" },
  { cell: "dead", block: 1, p: 0.099, grade: 9, kind: "dead" }, { cell: "dead", block: 1, p: 0.974, grade: 1, kind: "healthy" },
  { cell: "dead", block: 1, p: 0.078, grade: 9, kind: "dead" }, { cell: "dead", block: 1, p: 0.078, grade: 9, kind: "dead" },
  { cell: "dead", block: 2, p: 0.086, grade: 9, kind: "dead" }, { cell: "dead", block: 2, p: 0.086, grade: 9, kind: "dead" },
  { cell: "dead", block: 2, p: 0.013, grade: 9, kind: "dead" }, { cell: "dead", block: 2, p: 0.974, grade: 1, kind: "healthy" },
  { cell: "dead", block: 3, p: 0.089, grade: 9, kind: "dead" }, { cell: "dead", block: 3, p: 0.974, grade: 3, kind: "healthy" },
  { cell: "dead", block: 3, p: 0.149, grade: 9, kind: "dead" },
  { cell: "dead", block: 4, p: 0.093, grade: 9, kind: "dead" }, { cell: "dead", block: 4, p: 0.093, grade: 9, kind: "dead" },
  { cell: "dead", block: 4, p: 0.974, grade: 2, kind: "healthy" }, { cell: "dead", block: 4, p: 0.974, grade: 2, kind: "healthy" },
  { cell: "graded", block: 0, p: 0.091, grade: 9, kind: "dead" }, { cell: "graded", block: 0, p: 0.974, grade: 1, kind: "healthy" },
  { cell: "graded", block: 0, p: 0.231, grade: 7, kind: "flaky" }, { cell: "graded", block: 0, p: 0.974, grade: 2, kind: "healthy" },
  { cell: "graded", block: 1, p: 0.974, grade: 2, kind: "healthy" }, { cell: "graded", block: 1, p: 0.974, grade: 2, kind: "healthy" },
  { cell: "graded", block: 1, p: 0.104, grade: 9, kind: "dead" }, { cell: "graded", block: 1, p: 0.974, grade: 1, kind: "healthy" },
  { cell: "graded", block: 2, p: 0.085, grade: 9, kind: "dead" }, { cell: "graded", block: 2, p: 0.085, grade: 9, kind: "dead" },
  { cell: "graded", block: 2, p: 0.101, grade: 9, kind: "dead" }, { cell: "graded", block: 2, p: 0.974, grade: 1, kind: "healthy" },
  { cell: "graded", block: 3, p: 0.086, grade: 9, kind: "dead" }, { cell: "graded", block: 3, p: 0.086, grade: 9, kind: "dead" },
  { cell: "graded", block: 3, p: 0.102, grade: 9, kind: "dead" }, { cell: "graded", block: 3, p: 0.974, grade: 2, kind: "healthy" },
  { cell: "graded", block: 4, p: 0.095, grade: 9, kind: "dead" }, { cell: "graded", block: 4, p: 0.095, grade: 9, kind: "dead" },
  { cell: "graded", block: 4, p: 0.974, grade: 1, kind: "healthy" }, { cell: "graded", block: 4, p: 0.974, grade: 1, kind: "healthy" },
];

// Table II of the paper. Weighted completion at the horizon (%), mean over the
// cell's blocks; healthy pods evicted across the cell by the two evicting arms.
const CELLS: {
  cell: string;
  n: number;
  test: "P" | "D";
  stock: string;
  pc: string;
  knapsack: string;
  ai: string;
  evicted: string;
  delta: string;
  best: "stock" | "pc" | "knapsack" | "ai" | "tie";
}[] = [
  { cell: "Node kill, honest services", n: 18, test: "P", stock: "79.1", pc: "88.5", knapsack: "84.9", ai: "–", evicted: "86 / –", delta: "+5.8 [4.2, 7.5], knapsack over stock", best: "pc" },
  { cell: "Node kill, always-down liars", n: 5, test: "P", stock: "75.2", pc: "83.2", knapsack: "81.1", ai: "94.0", evicted: "28 / 7", delta: "+12.9 [6.4, 19.4], AI over knapsack", best: "ai" },
  { cell: "Node kill, graded liars", n: 5, test: "D", stock: "74.0", pc: "82.0", knapsack: "79.3", ai: "88.3", evicted: "23 / 9", delta: "no test", best: "ai" },
  { cell: "Pod kill, nothing scarce", n: 5, test: "P", stock: "100", pc: "100", knapsack: "100", ai: "–", evicted: "0 / –", delta: "+0.31 downtime, knapsack over stock", best: "tie" },
  { cell: "Pod kill, balanced queue", n: 5, test: "D", stock: "64.1", pc: "77.1", knapsack: "76.7", ai: "81.1", evicted: "45 / 14", delta: "no test", best: "ai" },
  { cell: "Pod kill, hostile queue", n: 5, test: "D", stock: "73.9", pc: "73.4", knapsack: "69.3", ai: "75.5", evicted: "30 / 9", delta: "no test", best: "ai" },
];

const ARMS = [
  { arm: "stock", what: "Kubernetes' default scheduler", shortage: "Blind to importance. Seats whatever fits, first come first served. Evicts nobody." },
  { arm: "priorityclass", what: "Stock plus one PriorityClass per grade, preemption on", shortage: "Saves the highest grades. Evicts healthy lower-grade pods to do it, whichever rank lowest." },
  { arm: "knapsack", what: "This project's selection rule: an exact knapsack over the labels", shortage: "Saves the most total importance that fits. Evicts nobody." },
  { arm: "ai", what: "The knapsack over label × measured probability of serving, with eviction gated on that evidence", shortage: "Discounts pods that will not serve. May evict one it has measured failing, at a fixed margin." },
];

const ENVIRONMENT = [
  ["Cloud", "Amazon EKS, eu-west-1, single availability zone"],
  ["Nodes", "3 × m6i.large workload nodes plus one tainted harness node; Kubernetes 1.33"],
  ["Provisioning", "Terraform"],
  ["Failure injection", "EC2 stop with the real ~300 s unreachable toleration; pod delete with zero grace"],
  ["Load", "k6, in-cluster, open model: 30 / 15 / 5 requests per second by tier"],
  ["Workload", "Twelve services per block from the Alibaba 2018 cluster trace, nine importance grades, packed to about 87% of capacity"],
  ["Runs", "199 recorded, 26 to 30 August 2026, after the stop-mode noise floor of 10 and 11 August"],
  ["Test suite", "828 passed, 4 skipped"],
];

const THREATS = [
  ["Scale", "Three workload nodes, one cloud, one instance type, one trace-derived workload. An offline simulator projects larger clusters and no finding rests on it, though its predicted arm orderings matched the campaign's exactly in both cells where that could be checked."],
  ["Staging", "Shortage is engineered and the lying services are registered kinds, not natural failures. The estimator was trained on a four-behaviour taxonomy and tested against injected instances of it, so the second question measures in-distribution estimation."],
  ["Instrument constants", "The eviction cap of four per run and the 0.5 margin were pre-set and bound in eighteen of the AI arm's twenty runs, so its gain and its collateral are floors, not the arm's ceiling. A later simulated probe placed the margin off the tuned frontier on the permissive side."],
  ["A noisy cell", "The graded lying-services floor was eleven times noisier than the honest one, so that cell is descriptive by the registered demotion and carries no test."],
  ["The proxy", "Ready is an API-side signal, not proof of serving. Per-tier request failure rates from the load generator bound the drift; at the median they do not flatter the treatment arms."],
  ["The value model", "Value accrues while serving, so the model addresses long-running services and not run-to-completion jobs. The findings are conditional on importance adding up: in offline replay, selection stops dominating order near a grade-to-grade weight ratio of 1.35."],
];

const ARTEFACTS = [
  ["Paper", "IEEE format, eight core pages. ECS8056, Queen's University Belfast."],
  ["Analysis plan", "Registered before the confirmatory data, with every amendment dated. It froze when the primary noise floor was measured."],
  ["Receipts index", "Claim → script → artifact, for every quantitative claim. Every number on this page has a row."],
  ["Run records", "199 recorded runs on EKS. Each carries its seed, workload hash, victim, pinned start fingerprint and health-model hash."],
  ["Code", "Python 3.14. Scheduler, experiment driver, workload generator, stats, and the test suite. Private until the viva."],
];

/* ---- typography ------------------------------------------------------- */

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[1.0625rem] text-foreground/80 leading-[1.7] mb-5 last:mb-0">
      {children}
    </p>
  );
}

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <h2 className="display text-2xl sm:text-[1.75rem] text-foreground mb-6 flex items-baseline gap-4">
        <span className="font-mono text-base font-medium text-primary tabular-nums shrink-0" aria-hidden>
          {n}.
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Caption({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <figcaption className="mt-3 text-sm text-muted-foreground leading-relaxed">
      <span className="font-mono text-xs uppercase tracking-[0.12em] text-primary mr-2">
        Fig. {n}
      </span>
      {children}
    </figcaption>
  );
}

function TableCaption({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <caption className="text-left mb-3 text-sm text-muted-foreground leading-relaxed">
      <span className="font-mono text-xs uppercase tracking-[0.12em] text-primary mr-2">
        Table {n}
      </span>
      {children}
    </caption>
  );
}

/* ---- figures, drawn from the data above ------------------------------ */

// Fig. 1: eighteen rounds, three arms, and the knapsack-minus-stock gap.
function EighteenRounds() {
  const W = 720;
  const top = { y0: 26, y1: 150, min: 70, max: 100 };
  const bot = { y0: 184, y1: 246, min: 0, max: 15 };
  const x0 = 44;
  const x1 = W - 14;
  const n = ROUNDS.stock.length;
  const xs = (i: number) => x0 + (i * (x1 - x0)) / (n - 1);
  const yTop = (v: number) => top.y1 - ((v - top.min) / (top.max - top.min)) * (top.y1 - top.y0);
  const yBot = (v: number) => bot.y1 - ((v - bot.min) / (bot.max - bot.min)) * (bot.y1 - bot.y0);
  const path = (arr: number[]) => arr.map((v, i) => `${i ? "L" : "M"}${xs(i).toFixed(1)},${yTop(v).toFixed(1)}`).join(" ");
  const gaps = ROUNDS.knapsack.map((v, i) => +(v - ROUNDS.stock[i]).toFixed(2));
  const mean = gaps.reduce((a, b) => a + b, 0) / n;
  const barW = ((x1 - x0) / (n - 1)) * 0.5;

  return (
    <svg viewBox={`0 0 ${W} 262`} className="w-full h-auto" role="img" aria-label="Weighted completion over eighteen node kills for stock Kubernetes, PriorityClass and the knapsack, with the knapsack's gap over stock below">
      {/* top panel: gridlines */}
      {[70, 80, 90, 100].map((v) => (
        <g key={v}>
          <line x1={x0} x2={x1} y1={yTop(v)} y2={yTop(v)} className="stroke-border" strokeWidth="1" />
          <text x={x0 - 8} y={yTop(v) + 4} textAnchor="end" className="fill-muted-foreground font-mono" fontSize="10">
            {v}
          </text>
        </g>
      ))}
      <path d={path(ROUNDS.priorityclass)} fill="none" className="stroke-warn" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={path(ROUNDS.stock)} fill="none" className="stroke-muted-foreground" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={path(ROUNDS.knapsack)} fill="none" className="stroke-primary" strokeWidth="2" strokeLinejoin="round" />
      {ROUNDS.knapsack.map((v, i) => (
        <circle key={i} cx={xs(i)} cy={yTop(v)} r="2.6" className="fill-primary" />
      ))}
      {/* legend, top right, clear of the lines */}
      <text x={x1} y={top.y0 - 6} textAnchor="end" className="font-mono" fontSize="10">
        <tspan className="fill-warn">PriorityClass</tspan>
        <tspan className="fill-muted-foreground" dx="14">stock</tspan>
        <tspan className="fill-primary" dx="14">knapsack</tspan>
      </text>
      <text x={x0 - 8} y={top.y0 - 6} textAnchor="end" className="fill-muted-foreground font-mono" fontSize="9">
        % kept
      </text>

      {/* bottom panel: knapsack minus stock */}
      {[0, 5, 10, 15].map((v) => (
        <g key={v}>
          <line x1={x0} x2={x1} y1={yBot(v)} y2={yBot(v)} className="stroke-border" strokeWidth="1" />
          <text x={x0 - 8} y={yBot(v) + 4} textAnchor="end" className="fill-muted-foreground font-mono" fontSize="10">
            {v}
          </text>
        </g>
      ))}
      {gaps.map((g, i) => (
        <rect key={i} x={xs(i) - barW / 2} y={yBot(Math.max(g, 0))} width={barW} height={Math.max(yBot(0) - yBot(g), 0.5)} className="fill-primary/60" />
      ))}
      <line x1={x0} x2={x1} y1={yBot(mean)} y2={yBot(mean)} className="stroke-foreground" strokeWidth="1" strokeDasharray="3 3" />
      <text x={x1} y={yBot(mean) - 5} textAnchor="end" className="fill-foreground font-mono" fontSize="10">
        mean +{mean.toFixed(1)}
      </text>
      <text x={x0 - 8} y={bot.y0 - 6} textAnchor="end" className="fill-muted-foreground font-mono" fontSize="9">
        gap, pp
      </text>
      {ROUNDS.stock.map((_, i) => (
        <text key={i} x={xs(i)} y={258} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize="9">
          {i + 1}
        </text>
      ))}
    </svg>
  );
}

// Fig. 2: five paired node kills, the knapsack against the same knapsack
// pricing labels by measured evidence.
function PairedSlopes() {
  const W = 480;
  const H = 240;
  const y = (v: number) => 210 - ((v - 70) / 30) * 190;
  const xl = 140;
  const xr = 340;
  // Push labels apart where the points cluster, keeping their order.
  const spread = (vals: number[], gap: number) => {
    const order = vals.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v);
    const out: number[] = new Array(vals.length);
    let last = -Infinity;
    for (const { v, i } of order) {
      const yy = Math.max(y(v), last + gap);
      out[i] = yy;
      last = yy;
    }
    return out;
  };
  const yL = spread(PAIRED.knapsack, 13);
  const yR = spread(PAIRED.ai, 13);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-w-[30rem] mx-auto" role="img" aria-label="Five paired node kills: the knapsack trusting labels against the AI arm, every pair rising">
      {[70, 80, 90, 100].map((v) => (
        <g key={v}>
          <line x1={xl - 60} x2={xr + 60} y1={y(v)} y2={y(v)} className="stroke-border" strokeWidth="1" />
          <text x={xl - 68} y={y(v) + 4} textAnchor="end" className="fill-muted-foreground font-mono" fontSize="10">
            {v}
          </text>
        </g>
      ))}
      {PAIRED.knapsack.map((k, i) => {
        const a = PAIRED.ai[i];
        return (
          <g key={i}>
            <line x1={xl} x2={xr} y1={y(k)} y2={y(a)} className="stroke-foreground/50" strokeWidth="1.25" />
            <circle cx={xl} cy={y(k)} r="4" className="fill-muted-foreground" />
            <circle cx={xr} cy={y(a)} r="4" className="fill-primary" />
            <text x={xl - 10} y={yL[i] + 4} textAnchor="end" className="fill-muted-foreground font-mono" fontSize="10">
              round {i + 1}
            </text>
            <text x={xr + 10} y={yR[i] + 4} textAnchor="start" className="fill-primary font-mono" fontSize="10">
              +{(a - k).toFixed(1)} · round {i + 1}
            </text>
          </g>
        );
      })}
      <text x={xl} y={H - 6} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize="10">
        knapsack, trusts labels
      </text>
      <text x={xr} y={H - 6} textAnchor="middle" className="fill-primary font-mono" fontSize="10">
        AI, watches
      </text>
      <text x={xl - 68} y={14} textAnchor="end" className="fill-muted-foreground font-mono" fontSize="9">
        % kept
      </text>
    </svg>
  );
}

// Fig. 3: every eviction the AI arm made, placed by its measured serving
// probability and sized by declared importance.
function EvictionStrip() {
  const W = 720;
  const rowH = 22;
  const rows = [
    ...[0, 1, 2, 3, 4].map((b) => ({ cell: "dead" as const, block: b, label: `always-down, round ${b + 1}` })),
    ...[0, 1, 2, 3, 4].map((b) => ({ cell: "graded" as const, block: b, label: `graded, round ${b + 1}` })),
  ];
  const x0 = 170;
  const x1 = W - 20;
  const xp = (p: number) => x0 + p * (x1 - x0);
  const yr = (i: number) => 24 + i * rowH + (i >= 5 ? 14 : 0);
  const H = yr(9) + 50;
  const seen = new Map<string, number>();
  const kindClass: Record<Kind, string> = {
    dead: "fill-error",
    flaky: "fill-warn",
    healthy: "fill-primary",
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Thirty-nine evictions placed by measured serving probability: the fakes sit near 0.1, the healthy victims near 1 and all small">
      {[0, 0.25, 0.5, 0.75, 1].map((p) => (
        <g key={p}>
          <line x1={xp(p)} x2={xp(p)} y1={12} y2={yr(9) + 12} className="stroke-border" strokeWidth="1" />
          <text x={xp(p)} y={H - 24} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize="10">
            {p.toFixed(2)}
          </text>
        </g>
      ))}
      {rows.map((r, i) => (
        <text key={r.label} x={x0 - 12} y={yr(i) + 4} textAnchor="end" className="fill-muted-foreground font-mono" fontSize="10">
          {r.label}
        </text>
      ))}
      {EVICTIONS.map((e, i) => {
        const row = rows.findIndex((r) => r.cell === e.cell && r.block === e.block);
        const key = `${e.cell}-${e.block}-${e.p}`;
        const k = seen.get(key) ?? 0;
        seen.set(key, k + 1);
        const jitter = (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 5;
        return (
          <circle
            key={i}
            cx={xp(e.p)}
            cy={yr(row) + jitter}
            r={2.2 + e.grade * 0.55}
            className={`${kindClass[e.kind]} opacity-90`}
          />
        );
      })}
      <text x={(x0 + x1) / 2} y={H - 6} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize="9">
        measured probability the service serves
      </text>
    </svg>
  );
}

/* ---- page -------------------------------------------------------------- */

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  headline:
    "Evict the Guilty, Not the Innocent: Importance- and Evidence-Aware Pod Recovery Under Real Node Failure in Kubernetes",
  description:
    "MSc dissertation. Four schedulers compared on real Amazon EKS clusters under two failure conditions, under an analysis plan registered before the data.",
  author: { "@type": "Person", name: "Jack Devlin", url: "https://www.devlinops.com" },
  datePublished: "2026-09-04",
  keywords: ["Kubernetes", "scheduling", "failure recovery", "preemption", "eviction"],
};

export default function MlSchedulerPage() {
  return (
    <CaseStudyLayout schema={articleSchema} phosphor={PAPER_PHOSPHOR}>
      {/* Title block */}
      <header className="pt-28 md:pt-32 pb-4">
        <div className="container px-4">
          <div className="max-w-[46rem] mx-auto">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-12 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Projects
            </Link>

            <p className="eyebrow mb-5">MSc dissertation · submitted September 2026</p>
            <h1 className="display text-4xl sm:text-5xl text-foreground mb-4" style={{ viewTransitionName: "title-ml-scheduler" }}>
              Evict the guilty, not the innocent
            </h1>
            <p className="text-xl sm:text-2xl text-foreground/80 leading-snug mb-8">
              Importance- and evidence-aware pod recovery under real node failure in Kubernetes
            </p>

            <div className="font-mono text-xs text-muted-foreground leading-relaxed mb-10 space-y-1">
              <p>Jack Devlin · School of Electronics, Electrical Engineering and Computer Science, Queen&apos;s University Belfast</p>
              <p>MSc Artificial Intelligence · supervised by Prof. Javid Taheri · ECS8056</p>
            </div>

            <div className="rounded-md border border-border bg-card/40 px-6 py-5 sm:px-8 sm:py-6">
              <p className="text-[1.0625rem] text-foreground/85 leading-[1.7]">
                <span className="font-mono text-xs uppercase tracking-[0.12em] text-primary mr-3">
                  Abstract
                </span>
                When a Kubernetes cluster loses a node and cannot hold every pod,
                something decides which services come back and what gets thrown
                out. Production schedulers evict by declared priority, contract
                breach or restart count. None of them prices the victim&apos;s
                measured serving behaviour against the capacity it holds. I
                built one that does, and measured it. Four schedulers are
                compared on real AWS clusters under two failure conditions: the
                stock default, PriorityClass preemption, a selection rule that
                seats the most importance that fits, and an AI scheduler that
                multiplies each importance label by a small learned probability,
                from the kubelet&apos;s own status signals, that the service will
                actually serve. Over eighteen real node kills the selection rule
                recovered 5.8 points more weighted service than the blind
                default, in every block. PriorityClass kept more still, at 86
                healthy pods destroyed to none. Where services lied about their
                health, pricing labels by measured behaviour added a further 12.9
                points over that same rule, five of five, evicting measured
                failures by preference and otherwise only the cheapest healthy
                pods. Every comparison follows an analysis plan timestamped
                before the data.
              </p>
              <p className="mt-4 font-mono text-xs text-muted-foreground">
                <span className="uppercase tracking-[0.12em] text-primary mr-3">Index terms</span>
                Kubernetes · scheduling · failure recovery · preemption · eviction
              </p>
            </div>

            <p className="mt-6 font-mono text-xs text-muted-foreground leading-relaxed">
              This page is the dissertation compressed to one read. Every
              figure is drawn from the run records and every number is the
              paper&apos;s own; the artefacts are listed at the end.
            </p>
          </div>
        </div>
      </header>

      <div className="container px-4 pt-12">
        <div className="max-w-[46rem] mx-auto">
          <Section n="I" title="The problem">
            <P>
              A node dies. Its pods are evicted and reapply for space that no
              longer exists. With spare capacity any policy succeeds; the
              interesting case is shortage, and Kubernetes offers two answers to
              it.
            </P>
            <P>
              The default scheduler is blind to importance. It seats whatever
              fits, first come first served, and never evicts anybody, so a
              low-value pod that got there first keeps a seat a critical service
              needs.
            </P>
            <P>
              PriorityClass preemption reads rank, and only rank. It saves the
              highest-priority pods and throws healthy lower-priority pods out to
              make room. The ordering is lexicographic, so no number of
              importance-8 pods outweighs one importance-9 pod, whereas for most
              operators importance adds up.
            </P>
            <P>
              Both share a deeper flaw. An importance label says what a pod is
              worth, not whether it will serve. A crash-looping pod labelled
              critical holds scarce recovery capacity for the whole horizon and
              delivers nothing, and any scheduler that trusts the label inherits
              that lie.
            </P>
          </Section>

          <Section n="II" title="What I built">
            <P>
              I treated recovery as a selection problem rather than an ordering
              one: fit the most total importance into the space that is left.
              That is a knapsack, and at recovery scale it is solved exactly, by
              branch and bound over a node-or-leave-out choice per pod. The
              solver&apos;s own exactness certificate is enforced rather than
              assumed, so a truncated search is refused instead of quietly
              reported as optimal, and an integer-programming fallback runs when
              branch and bound exhausts its budget. Capacity is a hard invariant
              re-checked outside the policy, so a buggy policy can be suboptimal
              but never unsafe.
            </P>
            <P>
              The AI leg is deliberately small. Eight signals the kubelet already
              reports for a service&apos;s existing replicas feed a logistic
              regression that estimates the probability a newly placed replica
              will be Ready over the horizon: the Ready fraction, the crash-loop
              fraction, the restart rate, the worst restart count, the fraction
              with a non-zero last exit code, median pod age, and a
              never-Ready flag with its age. That estimate multiplies into the
              value the knapsack maximises.
            </P>
            <figure className="my-8 rounded-md border border-border bg-black/40 px-6 py-5 font-mono text-sm">
              <div className="text-foreground">
                effective importance <span className="text-muted-foreground">=</span> importance label{" "}
                <span className="text-muted-foreground">×</span>{" "}
                <span className="text-primary">P(this service will serve)</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                The features carry no name, label or pathology field, so nothing can key on the injected fault. Behaviour is the only evidence.
              </div>
            </figure>
            <P>
              So the scheduler maximises expected delivered importance instead
              of labelled importance. A service with too few observations gets
              no discount at all, which means that on a healthy cluster this
              arm&apos;s decisions are identical to the label-trusting one.
            </P>
            <P>
              The same discount is what makes eviction defensible. Run over
              occupied capacity as well as free, the rule evicts a running pod
              only when it has been measured failing to serve and the swap
              clears a fixed margin, half the smallest unit on the importance
              scale. Keeping everything is always feasible, so the arm is never
              worse than not evicting in its own estimated objective.
              PriorityClass evicts whatever ranks lowest; this arm evicts only
              what it has measured failing.
            </P>
            <P>
              Eviction has a side effect I had not anticipated and that the
              literature does not name. Evicting a crash-looper hands its
              controller a fresh replacement with a clean record, so a scheduler
              that only re-reads current status re-trusts the replacement and
              evicts a healthy pod to seat it again. The fix is belief
              persistence: the scheduler keeps its measured estimate for an
              evicted service and prices the respawn with it until fresh
              evidence supersedes it. The belief yields to measurement, never to
              a clock.
            </P>

            <figure className="my-8">
              <table className="w-full text-sm border-t border-border">
                <TableCaption n="I">The four schedulers under shortage.</TableCaption>
                <thead>
                  <tr className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    <th className="text-left font-medium py-2 pr-4 w-[7rem]">arm</th>
                    <th className="text-left font-medium py-2 pr-4">what it is</th>
                    <th className="text-left font-medium py-2">under shortage</th>
                  </tr>
                </thead>
                <tbody>
                  {ARMS.map((a) => (
                    <tr key={a.arm} className="border-t border-border/60 align-top">
                      <td className="py-3 pr-4 font-mono text-primary">{a.arm}</td>
                      <td className="py-3 pr-4 text-foreground/85">{a.what}</td>
                      <td className="py-3 text-muted-foreground">{a.shortage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </figure>
          </Section>

          <Section n="III" title="Method">
            <P>
              Everything reported comes from Amazon EKS. A local kind cluster of
              the same shape rehearsed every mechanism first and is never a
              source of a reported number.
            </P>
            <P>
              Two failure conditions. Stop: an abrupt EC2 power-off of one
              workload node, with Kubernetes&apos; real unreachable toleration,
              on a cluster packed so that the survivors are short. Pod kill: a
              seeded deletion of 30% of replica slots with zero grace, which
              frees the victims&apos; own capacity and so isolates recovery
              ordering and speed rather than shortage.
            </P>
            <P>
              Workloads are drawn from the Alibaba 2018 cluster trace, twelve
              services per block, with nine importance grades. The grade is the
              weight, so a grade-9 replica counts nine times a grade-1 replica,
              and the same integers serve as the solver&apos;s objective and the
              metric&apos;s weights. Every comparison is within-block: all four
              arms see the same workload, the same victim node and the same
              pinned starting placement, verified by fingerprint before
              aggregation, in Latin-square order.
            </P>
            <P>
              The primary metric is weighted completion at the horizon: the
              importance-weighted count of Ready replicas as a fraction of the
              healthy cluster&apos;s. Healthy pods evicted are reported beside
              every score, because the score charges a denied pod the same as an
              evicted one and I wanted the collateral visible on its own axis.
            </P>
            <P>
              The analysis plan was registered before any confirmatory data and
              froze when the first noise floor was measured. For each cell: a
              stage-one floor, the untreated default arm repeated six to eight
              times; the minimum detectable effect that floor buys at the
              affordable block count; then the blocks. A result below the
              certified detectable effect is claimed in neither direction. A
              cell whose floor fails is demoted to descriptive readings, which
              happened once.
            </P>

            <figure className="my-8">
              <table className="w-full text-sm border-t border-border">
                <TableCaption n="II">Experimental environment.</TableCaption>
                <tbody>
                  {ENVIRONMENT.map(([k, v]) => (
                    <tr key={k} className="border-t border-border/60 align-top">
                      <td className="py-2.5 pr-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground w-[9rem] pt-3">
                        {k}
                      </td>
                      <td className="py-2.5 text-foreground/85">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </figure>
          </Section>

          <Section n="IV" title="Results">
            <figure className="my-2 mb-10 overflow-x-auto">
              <table className="w-full min-w-[40rem] text-sm border-t border-border tabular-nums">
                <TableCaption n="III">
                  Weighted completion at the horizon (%), mean over each cell&apos;s blocks, and healthy pods evicted across the cell by the two arms that evict. P marks a test registered before the data; D is descriptive, no test. Bold is best in row.
                </TableCaption>
                <thead>
                  <tr className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    <th className="text-left font-medium py-2 pr-3">cell</th>
                    <th className="text-right font-medium py-2 px-2">n</th>
                    <th className="text-center font-medium py-2 px-2">test</th>
                    <th className="text-right font-medium py-2 px-2">stock</th>
                    <th className="text-right font-medium py-2 px-2">PC</th>
                    <th className="text-right font-medium py-2 px-2">knapsack</th>
                    <th className="text-right font-medium py-2 px-2">AI</th>
                    <th className="text-right font-medium py-2 px-2 whitespace-nowrap">evicted PC / AI</th>
                    <th className="text-left font-medium py-2 pl-3">Δ, pp [95% CI]</th>
                  </tr>
                </thead>
                <tbody>
                  {CELLS.map((c) => {
                    const cell = (key: "stock" | "pc" | "knapsack" | "ai") => (
                      <td
                        className={`py-2.5 px-2 text-right font-mono ${
                          c.best === key ? "text-foreground font-semibold" : "text-muted-foreground"
                        }`}
                      >
                        {c[key]}
                      </td>
                    );
                    return (
                      <tr key={c.cell} className="border-t border-border/60 align-top">
                        <td className="py-2.5 pr-3 text-foreground/85">{c.cell}</td>
                        <td className="py-2.5 px-2 text-right font-mono text-muted-foreground">{c.n}</td>
                        <td className={`py-2.5 px-2 text-center font-mono ${c.test === "P" ? "text-primary" : "text-muted-foreground"}`}>
                          {c.test}
                        </td>
                        {cell("stock")}
                        {cell("pc")}
                        {cell("knapsack")}
                        {cell("ai")}
                        <td className="py-2.5 px-2 text-right font-mono text-muted-foreground whitespace-nowrap">{c.evicted}</td>
                        <td className="py-2.5 pl-3 text-muted-foreground text-xs leading-snug">{c.delta}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </figure>

            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-primary mb-3">A. The foundation: selection against order</h3>
            <P>
              Over eighteen real node kills with honest services, the selection
              rule beat the importance-blind default by 5.8 points (95% interval
              4.2 to 7.5, t = 7.43, p &lt; 10⁻⁶), eighteen wins of eighteen,
              with its median first bind six seconds later because the batching
              is charged against it. PriorityClass led on the single completion
              axis, 3.6 points over selection, and paid 86 healthy evictions to
              do it against selection&apos;s zero. That trade is the frontier the
              whole study reads: completion against healthy pods destroyed.
            </P>
            <figure className="my-8">
              <EighteenRounds />
              <Caption n="1">
                Eighteen real node kills, honest services. Weighted completion per arm above; the knapsack&apos;s gap over stock below. The knapsack never falls below stock.
              </Caption>
            </figure>

            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-primary mb-3">B. The headline: labels that lie</h3>
            <P>
              In the always-down world every grade-9 service crash-loops
              permanently, so the top-graded claimants are the fakes. One test,
              fixed before the cell&apos;s data: the AI arm against its own
              decision core, the label-trusting knapsack. The difference was
              12.9 points (95% interval 6.4 to 19.4, t = 5.52, p = 0.005), the
              AI ahead in every block, against a certified detectable effect of
              1.4 points. The offline prior, written down weeks before the run,
              was 12.7. The AI arm kept 94.0% of important work running with
              seven healthy evictions across the cell. PriorityClass kept 83.2%
              with 28.
            </P>
            <figure className="my-8">
              <PairedSlopes />
              <Caption n="2">
                Always-down liars, five paired node kills: the same solver trusting labels against the same solver checking them. Every pair rises.
              </Caption>
            </figure>

            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-primary mb-3">C. Who got evicted</h3>
            <P>
              All 39 evictions the AI arm made across the two lying-services
              cells, from the decision log. 23 struck services its evidence
              priced below 0.25, one a flaky service at 0.23, and 16 were
              healthy pods: grade 1 or 2 batch pods, plus a single grade 3. No
              healthy pod above grade 3 was evicted in either world. Every
              eviction carries an exact enumeration certificate. The arm reached
              its registered cap of four evictions per run in nine of the ten
              runs, so the cap bounded both its gain and its collateral.
            </P>
            <figure className="my-8">
              <EvictionStrip />
              <Caption n="3">
                Every eviction, placed by the measured probability the victim&apos;s service would serve and sized by its declared grade. Red is a dead service, amber flaky, the accent colour healthy. The large dots on the left are important-looking fakes; the healthy victims are all small and all on the right.
              </Caption>
            </figure>

            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-primary mb-3">D. The trap, and the control</h3>
            <P>
              In a queue whose highest-labelled claimants are all fakes, the
              label-trusting knapsack finished last, below the blind default.
              With a queue watching every vacancy, rank hands each seat to the
              best label, and when the best labels are lies that is worse than
              ignoring them. The AI arm returned to the top, narrowly: 1.6
              points over the default, three blocks of five, and no test is
              attached.
            </P>
            <P>
              With 30% of pods killed and room to spare, every scheduler
              recovered everything. The selection arm sat 0.31 points of
              downtime above the others, the measured cost of its planning batch
              when choosing buys nothing. The wins in every other cell come from
              the shortage.
            </P>

            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-primary mb-3">E. How much model the decision needs</h3>
            <P>
              On the recorded decisions of both lying cells, trusting labels
              seated 23.4 importance units per cycle in the always-down world. A
              tuned one-feature threshold rule, that rule with fitted leaf
              probabilities, and the full logistic model each seated 28.4,
              against an oracle 28.8. Measuring at all is the step that pays.
              The logistic model ships because it is the smallest rung that is
              also calibrated.
            </P>
          </Section>

          <Section n="V" title="Threats to validity">
            <dl className="border-t border-border">
              {THREATS.map(([k, v]) => (
                <div key={k} className="grid sm:grid-cols-[10rem_1fr] gap-x-6 gap-y-1 py-4 border-b border-border/60">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground pt-1">{k}</dt>
                  <dd className="text-[1rem] text-foreground/80 leading-[1.65]">{v}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section n="VI" title="What I took from it">
            <P>
              Two things travel beyond the dissertation. The first is that a
              controller acting irreversibly on measured evidence destroys the
              evidence that justified the action, and has to remember.
              Kubernetes&apos; own descheduler has this bug in the open: its
              restart-count plugin evicts a pod and thereby resets the count it
              was reading. Circuit breakers and mesh outlier detection have the
              same shape and end their hold-out on a timer. Here it ends on
              measurement.
            </P>
            <P>
              The second is the method. Every number on this page traces to a
              run record through a receipts index, the analysis plan was
              committed before the data with every amendment dated, and a result
              below the floor&apos;s detectable effect is not claimed in either
              direction. It is the same rule the rest of this site runs on: a
              number is shown with what produced it, or not at all.
            </P>
          </Section>

          {/* Artefacts, where a paper would carry its references */}
          <section className="mb-16">
            <h2 className="display text-2xl sm:text-[1.75rem] text-foreground mb-6">
              Artefacts
            </h2>
            <ol className="border-t border-border">
              {ARTEFACTS.map(([k, v], i) => (
                <li key={k} className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[2.5rem_9rem_1fr] gap-x-4 gap-y-1 py-4 border-b border-border/60">
                  <span className="font-mono text-xs text-primary pt-1">[{i + 1}]</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground pt-1 col-start-2">{k}</span>
                  <span className="text-[1rem] text-foreground/80 leading-[1.65] col-start-2 sm:col-start-3">{v}</span>
                </li>
              ))}
            </ol>
          </section>

          <footer className="pb-24">
            <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-primary hover:underline underline-offset-4 group"
              >
                Say hello
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </CaseStudyLayout>
  );
}

export const metadata: Metadata = {
  alternates: { canonical: "/projects/ml-scheduler" },
  title: "Evict the Guilty, Not the Innocent · MSc dissertation",
  description:
    "Recovery scheduling under real node failure in Kubernetes. Four schedulers, two failure modes, 199 recorded runs on Amazon EKS, under an analysis plan fixed before the data. Jack Devlin's MSc AI dissertation, Queen's University Belfast.",
  openGraph: {
    title: "Evict the Guilty, Not the Innocent · MSc dissertation",
    description:
      "Recovery scheduling under real node failure in Kubernetes: four schedulers, two failure modes, 199 recorded runs on Amazon EKS.",
    url: "https://www.devlinops.com/projects/ml-scheduler",
  },
};
