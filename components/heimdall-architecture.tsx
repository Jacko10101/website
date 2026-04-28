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
    description: "What's actually running. Pod health, sync status, p95, error rate.",
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

export function HeimdallArchitecture() {
  const [active, setActive] = useState<NodeKey | null>(null);
  const isActive = (key: NodeKey) => active === key;

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-1 text-lg font-semibold">Heimdall — system overview</h3>
      <p className="mb-4 text-xs text-muted-foreground">
        Hover any node for a one-line explanation.
      </p>

      <div className="relative">
        <svg
          viewBox="0 0 900 540"
          className="w-full"
          role="img"
          aria-label="Heimdall architecture: four upstream sources feed a background collector, which writes to a database and an in-memory cache. A web app reads from both."
        >
          <defs>
            <marker
              id="arrow"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" className="fill-primary" />
            </marker>
          </defs>

          <text x="20" y="30" className="fill-muted-foreground text-[10px] font-mono">
            sources
          </text>

          {(
            [
              { key: "bitbucket", x: 60, label: "Bitbucket", sub: "commits · PRs" },
              { key: "gitops", x: 270, label: "GitOps repo", sub: "desired state" },
              { key: "cluster", x: 480, label: "Kubernetes", sub: "what's running" },
              { key: "jira", x: 690, label: "JIRA", sub: "tickets" },
            ] as const
          ).map((n) => (
            <g
              key={n.key}
              onMouseEnter={() => setActive(n.key)}
              onMouseLeave={() => setActive(null)}
              className="cursor-pointer"
            >
              <rect
                x={n.x}
                y="50"
                width="150"
                height="60"
                rx="8"
                className={`stroke-border ${
                  isActive(n.key) ? "fill-primary/20" : "fill-secondary"
                }`}
                strokeWidth="2"
              />
              <text
                x={n.x + 75}
                y="75"
                textAnchor="middle"
                className="fill-foreground text-sm font-semibold"
              >
                {n.label}
              </text>
              <text
                x={n.x + 75}
                y="93"
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {n.sub}
              </text>
            </g>
          ))}

          {[135, 345, 555, 765].map((x) => (
            <line
              key={x}
              x1={x}
              y1="110"
              x2="450"
              y2="190"
              className="stroke-primary"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
              opacity="0.5"
            />
          ))}

          <text x="20" y="225" className="fill-muted-foreground text-[10px] font-mono">
            background work
          </text>

          <g
            onMouseEnter={() => setActive("collector")}
            onMouseLeave={() => setActive(null)}
            className="cursor-pointer"
          >
            <rect
              x="270"
              y="200"
              width="360"
              height="70"
              rx="10"
              className={`stroke-border ${
                isActive("collector") ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="3"
            />
            <text
              x="450"
              y="228"
              textAnchor="middle"
              className="fill-foreground text-base font-bold"
            >
              Background collector
            </text>
            <text
              x="450"
              y="250"
              textAnchor="middle"
              className="fill-muted-foreground text-[11px]"
            >
              runs every 10 minutes · does all the heavy lifting
            </text>
          </g>

          <line
            x1="370"
            y1="270"
            x2="240"
            y2="335"
            className="stroke-primary"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <line
            x1="530"
            y1="270"
            x2="660"
            y2="335"
            className="stroke-primary"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          <text x="20" y="370" className="fill-muted-foreground text-[10px] font-mono">
            stores
          </text>

          <g
            onMouseEnter={() => setActive("database")}
            onMouseLeave={() => setActive(null)}
            className="cursor-pointer"
          >
            <rect
              x="120"
              y="345"
              width="240"
              height="70"
              rx="8"
              className={`stroke-border ${
                isActive("database") ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="2"
            />
            <text
              x="240"
              y="373"
              textAnchor="middle"
              className="fill-foreground text-sm font-semibold"
            >
              Database
            </text>
            <text
              x="240"
              y="392"
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              durable history of everything
            </text>
          </g>

          <g
            onMouseEnter={() => setActive("cache")}
            onMouseLeave={() => setActive(null)}
            className="cursor-pointer"
          >
            <rect
              x="540"
              y="345"
              width="240"
              height="70"
              rx="8"
              className={`stroke-border ${
                isActive("cache") ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="2"
            />
            <text
              x="660"
              y="373"
              textAnchor="middle"
              className="fill-foreground text-sm font-semibold"
            >
              In-memory cache
            </text>
            <text
              x="660"
              y="392"
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              what the UI reads
            </text>
          </g>

          <line
            x1="240"
            y1="415"
            x2="380"
            y2="465"
            className="stroke-primary"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <line
            x1="660"
            y1="415"
            x2="520"
            y2="465"
            className="stroke-primary"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          <text x="20" y="490" className="fill-muted-foreground text-[10px] font-mono">
            web
          </text>

          <g
            onMouseEnter={() => setActive("web")}
            onMouseLeave={() => setActive(null)}
            className="cursor-pointer"
          >
            <rect
              x="270"
              y="465"
              width="360"
              height="55"
              rx="10"
              className={`stroke-border ${
                isActive("web") ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="3"
            />
            <text
              x="450"
              y="488"
              textAnchor="middle"
              className="fill-foreground text-sm font-bold"
            >
              Web app
            </text>
            <text
              x="450"
              y="506"
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              UI · API · metrics — only ever reads
            </text>
          </g>
        </svg>

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
