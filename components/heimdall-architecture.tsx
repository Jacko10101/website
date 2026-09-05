"use client";

import { useState } from "react";

type NodeKey =
  | "bitbucket"
  | "gitops"
  | "cluster"
  | "jira"
  | "collector"
  | "database"
  | "cache"
  | "web";

const nodeInfo: Record<NodeKey, { title: string; description: string }> = {
  bitbucket: {
    title: "Bitbucket",
    description: "Commits and pull requests. Tickets are extracted from commit messages.",
  },
  gitops: {
    title: "GitOps repo",
    description: "Source of truth for what's meant to be deployed where.",
  },
  cluster: {
    title: "Kubernetes (via ArgoCD & Thanos)",
    description: "What's running. Pod health, sync status, p95, error rate.",
  },
  jira: {
    title: "JIRA",
    description: "Ticket metadata: status, fix versions, assignee, sprint.",
  },
  collector: {
    title: "Background collector",
    description:
      "Pulls everything every ten minutes, joins it together, writes the result to the database and the cache. All the heavy lifting happens here.",
  },
  database: {
    title: "Database (TimescaleDB)",
    description:
      "The durable record. Deployments, syncs, tests, tickets, PRs, all joined by a deployment lifecycle view.",
  },
  cache: {
    title: "In-memory cache",
    description:
      "Pre-computed snapshot of everything the UI needs. Refreshes once per cycle, atomically.",
  },
  web: {
    title: "Web app",
    description:
      "Reads from the database and cache. Doesn't talk to upstream sources directly, which is why pages stay fast.",
  },
};

/* Short labels, shared by the SVG and the stacked small-screen layout. */
const SHORT: Record<NodeKey, { label: string; sub: string }> = {
  bitbucket: { label: "Bitbucket", sub: "commits · PRs" },
  gitops: { label: "GitOps repo", sub: "desired state" },
  cluster: { label: "Kubernetes", sub: "what's running" },
  jira: { label: "JIRA", sub: "tickets" },
  collector: { label: "Background collector", sub: "every 10 minutes · all the heavy lifting" },
  database: { label: "Database", sub: "durable history of everything" },
  cache: { label: "In-memory cache", sub: "what the UI reads" },
  web: { label: "Web app", sub: "UI · API · metrics · only ever reads" },
};

const SOURCE_KEYS: NodeKey[] = ["bitbucket", "gitops", "cluster", "jira"];

const ACTIVE_FILL = "oklch(0.72 0.19 150 / 0.1)";

/* Small-screen stacked layout. Defined at module scope so hovering or
   focusing a node doesn't remount the boxes and drop keyboard focus. */
function StackNode({
  nodeKey,
  active,
  handlers,
}: {
  nodeKey: NodeKey;
  active: boolean;
  handlers: React.ButtonHTMLAttributes<HTMLButtonElement>;
}) {
  return (
    <button type="button" {...handlers} className="w-full text-left">
      <span
        className={`block h-full rounded-lg border px-3 py-2.5 transition-colors ${
          active ? "border-primary bg-primary/10" : "border-border bg-secondary/40"
        }`}
      >
        <span className="block text-sm font-semibold text-foreground">
          {SHORT[nodeKey].label}
        </span>
        <span className="block text-[11px] leading-snug text-muted-foreground">
          {SHORT[nodeKey].sub}
        </span>
      </span>
    </button>
  );
}

function StackArrow() {
  return (
    <div className="py-1.5 text-center text-primary" aria-hidden>
      ↓
    </div>
  );
}

function StackLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

export function HeimdallArchitecture() {
  const [selected, setSelected] = useState<NodeKey | null>(null);
  const [hovered, setHovered] = useState<NodeKey | null>(null);
  const active = hovered ?? selected;
  const isActive = (key: NodeKey) => active === key;

  const toggle = (key: NodeKey) =>
    setSelected((prev) => (prev === key ? null : key));

  /* Shared interaction for both layouts. The SVG groups need an explicit
     role/tabIndex; the stacked layout uses real buttons. */
  const shared = (key: NodeKey) => ({
    "aria-label": `${nodeInfo[key].title} · show details`,
    "aria-pressed": selected === key,
    onClick: () => toggle(key),
    onMouseEnter: () => setHovered(key),
    onMouseLeave: () => setHovered(null),
    onFocus: () => setHovered(key),
    onBlur: () => setHovered(null),
  });

  const nodeProps = (key: NodeKey) => ({
    ...shared(key),
    tabIndex: 0,
    role: "button" as const,
    onKeyDown: (e: React.KeyboardEvent<SVGGElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(key);
      }
    },
    className: "cursor-pointer outline-none",
  });

  const stack = (key: NodeKey) => ({
    nodeKey: key,
    active: isActive(key),
    handlers: shared(key),
  });

  return (
    <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
      <h3 className="mb-1 text-lg font-semibold">Heimdall · system overview</h3>
      <p className="mb-4 text-xs text-muted-foreground">
        Tap or click any box for a one-line explanation.
      </p>

      {/* Small screens: the same flow stacked, no horizontal panning. */}
      <div className="sm:hidden">
        <StackLabel>sources</StackLabel>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {SOURCE_KEYS.map((k) => (
            <StackNode key={k} {...stack(k)} />
          ))}
        </div>
        <StackArrow />
        <StackLabel>background work</StackLabel>
        <div className="mt-2">
          <StackNode {...stack("collector")} />
        </div>
        <StackArrow />
        <StackLabel>stores</StackLabel>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <StackNode {...stack("database")} />
          <StackNode {...stack("cache")} />
        </div>
        <StackArrow />
        <StackLabel>web</StackLabel>
        <div className="mt-2">
          <StackNode {...stack("web")} />
        </div>
      </div>

      {/* sm and up: a 600-wide diagram that fits without panning. */}
      <svg
        viewBox="0 0 600 530"
        className="hidden w-full sm:block"
        role="group"
        aria-label="Heimdall architecture: four upstream sources feed a background collector, which writes to a database and an in-memory cache. A web app reads from both."
      >
        <defs>
          <marker
            id="heimdall-arch-arrow"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" className="fill-primary" />
          </marker>
        </defs>

        <text
          x="300"
          y="26"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px] font-mono"
        >
          sources
        </text>

        {(
          [
            { key: "bitbucket", x: 60, y: 44 },
            { key: "gitops", x: 310, y: 44 },
            { key: "cluster", x: 60, y: 116 },
            { key: "jira", x: 310, y: 116 },
          ] as const
        ).map((n) => (
          <g key={n.key} {...nodeProps(n.key)}>
            <rect
              x={n.x}
              y={n.y}
              width="230"
              height="56"
              rx="8"
              className={`fill-secondary ${
                isActive(n.key) ? "stroke-primary" : "stroke-border"
              }`}
              style={isActive(n.key) ? { fill: ACTIVE_FILL } : undefined}
              strokeWidth="2"
            />
            <text
              x={n.x + 115}
              y={n.y + 24}
              textAnchor="middle"
              className="fill-foreground text-sm font-semibold"
            >
              {SHORT[n.key].label}
            </text>
            <text
              x={n.x + 115}
              y={n.y + 42}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {SHORT[n.key].sub}
            </text>
          </g>
        ))}

        {/* Left and right buses: the four sources gather at the margins and
            enter the collector as one line each side. */}
        <g className="stroke-primary" strokeWidth="1.5" fill="none" opacity="0.6">
          <path d="M60 144 H30" />
          <path d="M540 144 H570" />
        </g>
        <path
          d="M60 72 H30 V243 H136"
          className="stroke-primary"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
          markerEnd="url(#heimdall-arch-arrow)"
        />
        <path
          d="M540 72 H570 V243 H464"
          className="stroke-primary"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
          markerEnd="url(#heimdall-arch-arrow)"
        />

        <text
          x="300"
          y="200"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px] font-mono"
        >
          background work
        </text>

        <g {...nodeProps("collector")}>
          <rect
            x="140"
            y="210"
            width="320"
            height="66"
            rx="10"
            className={`fill-card ${
              isActive("collector") ? "stroke-primary" : "stroke-border"
            }`}
            style={isActive("collector") ? { fill: ACTIVE_FILL } : undefined}
            strokeWidth="3"
          />
          <text
            x="300"
            y="238"
            textAnchor="middle"
            className="fill-foreground text-sm font-bold"
          >
            Background collector
          </text>
          <text
            x="300"
            y="258"
            textAnchor="middle"
            className="fill-muted-foreground text-[10px]"
          >
            every 10 minutes · all the heavy lifting
          </text>
        </g>

        <line
          x1="240"
          y1="276"
          x2="165"
          y2="324"
          className="stroke-primary"
          strokeWidth="2"
          markerEnd="url(#heimdall-arch-arrow)"
        />
        <line
          x1="360"
          y1="276"
          x2="435"
          y2="324"
          className="stroke-primary"
          strokeWidth="2"
          markerEnd="url(#heimdall-arch-arrow)"
        />

        <text
          x="300"
          y="318"
          textAnchor="middle"
          className="fill-muted-foreground text-[10px] font-mono"
        >
          stores
        </text>

        {(
          [
            { key: "database", x: 40 },
            { key: "cache", x: 320 },
          ] as const
        ).map((n) => (
          <g key={n.key} {...nodeProps(n.key)}>
            <rect
              x={n.x}
              y="330"
              width="240"
              height="64"
              rx="8"
              className={`fill-card ${
                isActive(n.key) ? "stroke-primary" : "stroke-border"
              }`}
              style={isActive(n.key) ? { fill: ACTIVE_FILL } : undefined}
              strokeWidth="2"
            />
            <text
              x={n.x + 120}
              y="358"
              textAnchor="middle"
              className="fill-foreground text-sm font-semibold"
            >
              {SHORT[n.key].label}
            </text>
            <text
              x={n.x + 120}
              y="377"
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {SHORT[n.key].sub}
            </text>
          </g>
        ))}

        <line
          x1="160"
          y1="394"
          x2="250"
          y2="444"
          className="stroke-primary"
          strokeWidth="2"
          markerEnd="url(#heimdall-arch-arrow)"
        />
        <line
          x1="440"
          y1="394"
          x2="350"
          y2="444"
          className="stroke-primary"
          strokeWidth="2"
          markerEnd="url(#heimdall-arch-arrow)"
        />

        <text
          x="20"
          y="440"
          className="fill-muted-foreground text-[10px] font-mono"
        >
          web
        </text>

        <g {...nodeProps("web")}>
          <rect
            x="140"
            y="450"
            width="320"
            height="58"
            rx="10"
            className={`fill-card ${
              isActive("web") ? "stroke-primary" : "stroke-border"
            }`}
            style={isActive("web") ? { fill: ACTIVE_FILL } : undefined}
            strokeWidth="3"
          />
          <text
            x="300"
            y="474"
            textAnchor="middle"
            className="fill-foreground text-sm font-bold"
          >
            Web app
          </text>
          <text
            x="300"
            y="493"
            textAnchor="middle"
            className="fill-muted-foreground text-[10px]"
          >
            UI · API · metrics · only ever reads
          </text>
        </g>
      </svg>

      {/* The explanation sits directly under both layouts, so it's never
          scrolled off with the diagram. */}
      <div aria-live="polite">
        {active && (
          <div className="mt-4 rounded-lg border border-primary/40 bg-primary/5 p-4">
            <h4 className="mb-1 font-semibold text-foreground">{nodeInfo[active].title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {nodeInfo[active].description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
