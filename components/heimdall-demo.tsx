"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  Mock data — deliberately static (no Date.now / Math.random at render) so   */
/*  server and client first paint match. The "live" feel comes from a client   */
/*  interval that only runs after mount.                                        */
/* -------------------------------------------------------------------------- */

const ENVS = ["dev", "qa", "preprod", "prod"] as const;
type Env = (typeof ENVS)[number];

type CellStatus = "synced" | "progressing" | "drift" | "degraded" | "nodata";

type Cell = {
  sha: string;
  status: CellStatus;
  ticket: string | null;
  ageMin: number;
  by: string;
  pods: string;
};

type Service = { name: string; cells: Record<Env, Cell> };

/** how Heimdall attributed a change to an environment */
type Provenance = "via commit message" | "via pull request" | "via cross-env match";

type Reach = { env: Env; via: Provenance };

type Ticket = {
  id: string;
  title: string;
  service: string;
  /** environments this change has landed in, in pipeline order, with how it was attributed */
  reached: Reach[];
  /** why it hasn't progressed further, if anywhere */
  blocked?: { env: Env; reason: string };
};

const SERVICES: Service[] = [
  {
    name: "payments-api",
    cells: {
      dev: { sha: "a1f4c2e", status: "synced", ticket: "PLAT-2041", ageMin: 12, by: "jack", pods: "3/3 ready" },
      qa: { sha: "a1f4c2e", status: "synced", ticket: "PLAT-2041", ageMin: 58, by: "argocd", pods: "3/3 ready" },
      preprod: { sha: "a1f4c2e", status: "synced", ticket: "PLAT-2041", ageMin: 41, by: "argocd", pods: "3/3 ready" },
      prod: { sha: "9b30d77", status: "drift", ticket: "PLAT-1990", ageMin: 1440, by: "argocd", pods: "4/4 ready" },
    },
  },
  {
    name: "checkout-web",
    cells: {
      dev: { sha: "c7e91a0", status: "synced", ticket: "PLAT-1998", ageMin: 95, by: "amara", pods: "2/2 ready" },
      qa: { sha: "c7e91a0", status: "synced", ticket: "PLAT-1998", ageMin: 80, by: "argocd", pods: "2/2 ready" },
      preprod: { sha: "c7e91a0", status: "synced", ticket: "PLAT-1998", ageMin: 64, by: "argocd", pods: "2/2 ready" },
      prod: { sha: "c7e91a0", status: "synced", ticket: "PLAT-1998", ageMin: 30, by: "argocd", pods: "3/3 ready" },
    },
  },
  {
    name: "identity-svc",
    cells: {
      dev: { sha: "5d2b8f1", status: "synced", ticket: "OPS-402", ageMin: 220, by: "argocd", pods: "2/2 ready" },
      qa: { sha: "5d2b8f1", status: "synced", ticket: "OPS-402", ageMin: 210, by: "argocd", pods: "2/2 ready" },
      preprod: { sha: "5d2b8f1", status: "synced", ticket: "OPS-402", ageMin: 200, by: "argocd", pods: "2/2 ready" },
      prod: { sha: "—", status: "nodata", ticket: null, ageMin: 0, by: "—", pods: "—" },
    },
  },
  {
    name: "ledger-worker",
    cells: {
      dev: { sha: "f08a6c4", status: "synced", ticket: "PLAT-2033", ageMin: 18, by: "jack", pods: "2/2 ready" },
      qa: { sha: "f08a6c4", status: "degraded", ticket: "PLAT-2033", ageMin: 9, by: "argocd", pods: "1/2 crashloop" },
      preprod: { sha: "7c1e045", status: "drift", ticket: "PLAT-1975", ageMin: 2880, by: "argocd", pods: "2/2 ready" },
      prod: { sha: "7c1e045", status: "synced", ticket: "PLAT-1975", ageMin: 2820, by: "argocd", pods: "2/2 ready" },
    },
  },
  {
    name: "search-api",
    cells: {
      dev: { sha: "b44de90", status: "progressing", ticket: "PLAT-2055", ageMin: 2, by: "jack", pods: "1/2 starting" },
      qa: { sha: "e1190ab", status: "drift", ticket: "PLAT-2010", ageMin: 600, by: "argocd", pods: "2/2 ready" },
      preprod: { sha: "e1190ab", status: "synced", ticket: "PLAT-2010", ageMin: 540, by: "argocd", pods: "2/2 ready" },
      prod: { sha: "e1190ab", status: "synced", ticket: "PLAT-2010", ageMin: 500, by: "argocd", pods: "2/2 ready" },
    },
  },
  {
    name: "notifications",
    cells: {
      dev: { sha: "3aa7b21", status: "synced", ticket: "PLAT-2048", ageMin: 75, by: "amara", pods: "2/2 ready" },
      qa: { sha: "3aa7b21", status: "synced", ticket: "PLAT-2048", ageMin: 60, by: "argocd", pods: "2/2 ready" },
      preprod: { sha: "9f5c113", status: "drift", ticket: "PLAT-2019", ageMin: 720, by: "argocd", pods: "2/2 ready" },
      prod: { sha: "9f5c113", status: "synced", ticket: "PLAT-2019", ageMin: 700, by: "argocd", pods: "2/2 ready" },
    },
  },
  {
    name: "inventory-svc",
    cells: {
      dev: { sha: "6e0f4dd", status: "synced", ticket: "PLAT-2044", ageMin: 130, by: "argocd", pods: "3/3 ready" },
      qa: { sha: "6e0f4dd", status: "synced", ticket: "PLAT-2044", ageMin: 120, by: "argocd", pods: "3/3 ready" },
      preprod: { sha: "—", status: "nodata", ticket: null, ageMin: 0, by: "—", pods: "—" },
      prod: { sha: "6e0f4dd", status: "synced", ticket: "PLAT-2044", ageMin: 95, by: "argocd", pods: "3/3 ready" },
    },
  },
  {
    name: "gateway",
    cells: {
      dev: { sha: "d9c2f87", status: "synced", ticket: "OPS-417", ageMin: 300, by: "argocd", pods: "4/4 ready" },
      qa: { sha: "d9c2f87", status: "synced", ticket: "OPS-417", ageMin: 290, by: "argocd", pods: "4/4 ready" },
      preprod: { sha: "d9c2f87", status: "synced", ticket: "OPS-417", ageMin: 280, by: "argocd", pods: "4/4 ready" },
      prod: { sha: "d9c2f87", status: "synced", ticket: "OPS-417", ageMin: 260, by: "argocd", pods: "4/4 ready" },
    },
  },
];

const TICKETS: Ticket[] = [
  {
    id: "PLAT-2041",
    title: "Idempotency keys on the payments endpoint",
    service: "payments-api",
    reached: [
      { env: "dev", via: "via commit message" },
      { env: "qa", via: "via pull request" },
      { env: "preprod", via: "via cross-env match" },
    ],
    blocked: { env: "prod", reason: "Awaiting Thursday release window — green everywhere else." },
  },
  {
    id: "PLAT-1998",
    title: "Fix checkout double-submit race",
    service: "checkout-web",
    reached: [
      { env: "dev", via: "via commit message" },
      { env: "qa", via: "via pull request" },
      { env: "preprod", via: "via cross-env match" },
      { env: "prod", via: "via cross-env match" },
    ],
  },
  {
    id: "PLAT-2055",
    title: "New search ranking model",
    service: "search-api",
    reached: [{ env: "dev", via: "via commit message" }],
    blocked: { env: "qa", reason: "Just merged — pods still starting in dev, not yet promoted." },
  },
  {
    id: "PLAT-2033",
    title: "Ledger end-of-day reconciliation",
    service: "ledger-worker",
    reached: [
      { env: "dev", via: "via commit message" },
      { env: "qa", via: "via pull request" },
    ],
    blocked: { env: "preprod", reason: "Crashlooping in qa (1/2 pods) — promotion gate is holding it back." },
  },
  {
    id: "OPS-417",
    title: "Rotate gateway TLS certificates",
    service: "gateway",
    reached: [
      { env: "dev", via: "via commit message" },
      { env: "qa", via: "via pull request" },
      { env: "preprod", via: "via cross-env match" },
      { env: "prod", via: "via cross-env match" },
    ],
  },
];

/* -------------------------------------------------------------------------- */

const STATUS_META: Record<
  CellStatus,
  { dot: string; text: string; ring: string; label: string }
> = {
  synced: { dot: "bg-primary", text: "text-primary", ring: "ring-primary/40", label: "Synced · on latest" },
  progressing: { dot: "bg-warn", text: "text-warn", ring: "ring-warn/40", label: "Progressing · syncing" },
  drift: { dot: "bg-warn", text: "text-warn", ring: "ring-warn/40", label: "Drifted · behind latest" },
  degraded: { dot: "bg-error", text: "text-error", ring: "ring-error/40", label: "Degraded · pods unhealthy" },
  nodata: { dot: "bg-muted-foreground/60", text: "text-muted-foreground", ring: "ring-muted-foreground/30", label: "No data · cluster metrics unreachable" },
};

function fmtAge(min: number): string {
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-lg border border-border bg-black/40 px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-xl font-bold text-foreground">{value}</div>
      <div className="text-[11px] text-muted-foreground/80">{sub}</div>
    </div>
  );
}

export function HeimdallDemo() {
  const [activeTicket, setActiveTicket] = useState<string | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ service: string; env: Env } | null>(null);
  const [driftOnly, setDriftOnly] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds since last collection (client-only)

  // "Live" collection cycle — runs every 10 min in the real thing; sped-up cosmetic ticker here.
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => (e + 1) % 600), 1000);
    return () => clearInterval(t);
  }, []);

  const ticket = useMemo(() => TICKETS.find((t) => t.id === activeTicket) ?? null, [activeTicket]);

  const visibleServices = useMemo(() => {
    if (!driftOnly) return SERVICES;
    return SERVICES.filter((s) =>
      ENVS.some((e) => s.cells[e].status === "drift" || s.cells[e].status === "degraded")
    );
  }, [driftOnly]);

  const isHighlighted = (service: string, env: Env) => {
    if (!ticket) return true;
    return ticket.service === service && ticket.reached.some((r) => r.env === env);
  };
  const isDimmed = (service: string, env: Env) => ticket !== null && !isHighlighted(service, env);

  const detail = selectedCell
    ? SERVICES.find((s) => s.name === selectedCell.service)?.cells[selectedCell.env] ?? null
    : null;

  const nextSync = 600 - elapsed;
  const mm = Math.floor(nextSync / 60);
  const ss = String(nextSync % 60).padStart(2, "0");

  return (
    <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
      {/* window chrome */}
      <div className="flex items-center gap-3 border-b border-border bg-secondary/40 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="font-mono text-xs text-muted-foreground">heimdall — environments</span>
        <div className="ml-auto flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          live · next sync {mm}:{ss}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* demo banner */}
        <div className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span className="rounded bg-warn/15 px-2 py-0.5 font-mono font-semibold text-warn">
            interactive demo
          </span>
          <span>
            A faithful rebuild with mock data — the real Heimdall reads live from Bitbucket, ArgoCD, Kubernetes and JIRA.
          </span>
        </div>

        {/* DORA tiles */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Deploy frequency" value="5.2/day" sub="last 30 days" />
          <Metric label="Lead time" value="1d 6h" sub="merge → prod, median" />
          <Metric label="Change failure" value="11%" sub="rollbacks / deploys" />
          <Metric label="MTTR" value="34m" sub="median recovery" />
        </div>

        {/* "where is my ticket" search */}
        <div className="mb-3">
          <label className="mb-2 block font-mono text-xs text-muted-foreground">
            where is my ticket?
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {TICKETS.map((t) => {
              const on = activeTicket === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setActiveTicket(on ? null : t.id);
                    setSelectedCell(null);
                  }}
                  aria-pressed={on}
                  className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${
                    on
                      ? "border-warn/60 bg-warn/10 text-warn"
                      : "border-border bg-black/40 text-muted-foreground hover:border-warn/40 hover:text-foreground"
                  }`}
                >
                  {t.id}
                </button>
              );
            })}
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setDriftOnly((d) => !d);
                  setSelectedCell(null);
                }}
                aria-pressed={driftOnly}
                className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${
                  driftOnly
                    ? "border-warn/60 bg-warn/10 text-warn"
                    : "border-border bg-black/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {driftOnly ? "✓ drift only" : "drift only"}
              </button>
            </div>
          </div>
        </div>

        {/* ticket trail */}
        <AnimatePresence initial={false}>
          {ticket && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mb-4 rounded-lg border border-warn/30 bg-warn/5 p-4">
                <div className="mb-1 flex flex-wrap items-baseline gap-2">
                  <span className="font-mono text-sm font-bold text-warn">{ticket.id}</span>
                  <span className="text-sm text-foreground">{ticket.title}</span>
                  <span className="font-mono text-xs text-muted-foreground">· {ticket.service}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-start gap-1.5">
                  {ENVS.map((env, i) => {
                    const reach = ticket.reached.find((r) => r.env === env);
                    const reached = !!reach;
                    const blockedHere = ticket.blocked?.env === env;
                    return (
                      <div key={env} className="flex items-start gap-1.5">
                        <div className="flex flex-col items-start gap-1">
                          <span
                            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs ${
                              reached
                                ? "border-primary/40 bg-primary/10 text-primary"
                                : blockedHere
                                  ? "border-warn/40 bg-warn/10 text-warn"
                                  : "border-border bg-black/40 text-muted-foreground"
                            }`}
                          >
                            {reached ? "✓" : blockedHere ? "⏳" : "○"} {env}
                          </span>
                          {reach && (
                            <span className="pl-0.5 font-mono text-[10px] text-muted-foreground">
                              {reach.via}
                            </span>
                          )}
                        </div>
                        {i < ENVS.length - 1 && (
                          <span className="mt-1.5 text-muted-foreground/50">→</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {ticket.blocked
                    ? ticket.blocked.reason
                    : "Shipped end-to-end — live in production, nothing outstanding."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* matrix */}
        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            {/* header */}
            <div className="grid grid-cols-[150px_repeat(4,1fr)] gap-2 px-1 pb-2">
              <div className="font-mono text-[11px] text-muted-foreground">service</div>
              {ENVS.map((env) => (
                <div key={env} className="font-mono text-[11px] text-muted-foreground">
                  {env}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {visibleServices.map((service) => (
                <div
                  key={service.name}
                  className="grid grid-cols-[150px_repeat(4,1fr)] items-stretch gap-2"
                >
                  <div className="flex items-center font-mono text-xs text-foreground">
                    {service.name}
                  </div>
                  {ENVS.map((env) => {
                    const cell = service.cells[env];
                    const meta = STATUS_META[cell.status];
                    const dimmed = isDimmed(service.name, env);
                    const highlight = ticket !== null && isHighlighted(service.name, env);
                    const isSelected =
                      selectedCell?.service === service.name && selectedCell?.env === env;
                    return (
                      <button
                        key={env}
                        type="button"
                        onClick={() =>
                          setSelectedCell(isSelected ? null : { service: service.name, env })
                        }
                        aria-label={`${service.name} ${env}: ${meta.label}, ${cell.sha}`}
                        title={
                          cell.status === "nodata"
                            ? "cluster metrics not reachable for this environment"
                            : undefined
                        }
                        className={`group relative rounded-md border px-2.5 py-2 text-left transition-all ${
                          isSelected ? `ring-2 ${meta.ring}` : ""
                        } ${
                          cell.status === "nodata"
                            ? "border-dashed border-muted-foreground/30 bg-secondary/30"
                            : highlight
                              ? "border-warn/50 bg-warn/5"
                              : "border-border bg-black/40 hover:border-muted-foreground/40"
                        } ${dimmed ? "opacity-30" : "opacity-100"}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot} ${
                              cell.status === "progressing" ? "animate-pulse" : ""
                            }`}
                          />
                          <span className="truncate font-mono text-[11px] text-muted-foreground">
                            {cell.sha}
                          </span>
                        </div>
                        <div className={`mt-0.5 font-mono text-[10px] ${meta.text}`}>
                          {cell.status === "nodata" ? "no data" : cell.status}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* cell detail */}
        <AnimatePresence initial={false}>
          {detail && selectedCell && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="mt-4 rounded-lg border border-border bg-black/50 p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${STATUS_META[detail.status].dot}`} />
                <span className="font-mono text-sm font-semibold text-foreground">
                  {selectedCell.service}
                </span>
                <span className="font-mono text-xs text-muted-foreground">/ {selectedCell.env}</span>
                <span className={`ml-auto font-mono text-xs ${STATUS_META[detail.status].text}`}>
                  {STATUS_META[detail.status].label}
                </span>
              </div>
              {detail.status === "nodata" ? (
                <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                  Cluster metrics aren&apos;t reachable for this environment, so Heimdall shows{" "}
                  <span className="text-foreground">no data</span> rather than assuming a healthy
                  state. Honest beats green — a grey cell is a prompt to go and look, not a
                  silent false-positive.
                </p>
              ) : (
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-xs text-muted-foreground sm:grid-cols-4">
                <div>
                  <span className="text-muted-foreground/60">commit</span>
                  <div className="text-foreground">{detail.sha}</div>
                </div>
                <div>
                  <span className="text-muted-foreground/60">ticket</span>
                  <div className="text-warn">{detail.ticket ?? "—"}</div>
                </div>
                <div>
                  <span className="text-muted-foreground/60">deployed</span>
                  <div className="text-foreground">{fmtAge(detail.ageMin)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground/60">by</span>
                  <div className="text-foreground">{detail.by}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground/60">pods</span>
                  <div
                    className={
                      detail.pods.includes("crashloop") ? "text-error" : "text-primary"
                    }
                  >
                    {detail.pods}
                  </div>
                </div>
              </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* legend */}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 font-mono text-[11px] text-muted-foreground">
          {(Object.keys(STATUS_META) as CellStatus[]).map((s) => (
            <span key={s} className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${STATUS_META[s].dot}`} />
              {STATUS_META[s].label}
            </span>
          ))}
          <span className="ml-auto text-muted-foreground/60">
            {ticket ? "click a ticket again to clear" : "pick a ticket, or click any cell"}
          </span>
        </div>
      </div>
    </div>
  );
}
