"use client";

import { useState } from "react";

type NodeKey =
  | "service"
  | "shared"
  | "scripts"
  | "bitbucket"
  | "ecr"
  | "buildjson"
  | "updater"
  | "gitops"
  | "argocd"
  | "k8s"
  | "postsync"
  | "sentry";

const nodeInfo: Record<NodeKey, { title: string; description: string }> = {
  service: {
    title: "Service repo",
    description:
      "Per-service config is a single .ci/builds.yaml: name, runtime, dockerfile, image repo, build commands. That's all a service author has to write.",
  },
  shared: {
    title: "Shared pipelines (java + node)",
    description:
      "Two library repos that export Bitbucket selectors. Service repos import them by tag (e.g. java-shared-pipeline:1.4.0:main-java). Semver-tagged so services adopt new versions on their own schedule.",
  },
  scripts: {
    title: "shared-scripts",
    description:
      "Reusable commands the shared pipelines call into: tagging, ECR push, scan helpers. Where the useful bits of the old bash reporter ended up.",
  },
  bitbucket: {
    title: "Bitbucket Pipelines",
    description:
      "Runs the imported steps. Optional gates (Veracode SAST, SourceClear SCA, Jira Fix Version) are env-gated in the same library, toggled per service via env, not template-forked.",
  },
  ecr: {
    title: "AWS ECR",
    description:
      "Tagged image. Build tag (commit + build number), semver tag from VERSION, digest-date tag.",
  },
  buildjson: {
    title: "build.json",
    description:
      "Output contract: commit, image, digest, tags, build_url written to .ci/out/build.json. Consumed downstream by Heimdall and Sentry.",
  },
  updater: {
    title: "ArgoCD Image Updater",
    description:
      "Watches ECR. When a new tag matches a service's policy, opens a commit on the GitOps repo. The pipeline doesn't push to GitOps any more.",
  },
  gitops: {
    title: "GitOps repo",
    description:
      "Kustomize overlays per environment. Source of truth for what's meant to be deployed where.",
  },
  argocd: {
    title: "ArgoCD",
    description:
      "Syncs the GitOps repo to the cluster. Notifications controller posts deploy reporting, replacing the old bash reporter.",
  },
  k8s: {
    title: "Kubernetes",
    description: "Four environments: dev, qa, preprod and prod.",
  },
  postsync: {
    title: "PostSync → test-infra",
    description:
      "An ArgoCD PostSync hook triggers a test job after the deploy is healthy. Tests live in their own repo, not in the pipeline.",
  },
  sentry: {
    title: "Sentry (the dashboard I built, not the SaaS)",
    description:
      "Fleet test-health dashboard. Aggregates POSTSYNC and CONTINUOUS test runs, surfaces pass rates per service, links to per-run Allure reports.",
  },
};

const ACTIVE_FILL = "oklch(0.72 0.19 150 / 0.1)";

/* Row 1 — the three things a build reads. */
const INPUT_NODES = [
  { key: "service", x: 64, label: "Service repo", sub: ".ci/builds.yaml" },
  { key: "shared", x: 264, label: "Shared pipelines", sub: "java + node, by tag" },
  { key: "scripts", x: 464, label: "shared-scripts", sub: "reusable commands" },
] as const;

/* Row 4 — build artefact to running pod. */
const DELIVERY_NODES = [
  { key: "updater", x: 64, label: "Image Updater", sub: "watches ECR" },
  { key: "gitops", x: 216, label: "GitOps repo", sub: "kustomize bump" },
  { key: "argocd", x: 368, label: "ArgoCD", sub: "sync" },
  { key: "k8s", x: 520, label: "Kubernetes", sub: "4 environments" },
] as const;

export function CicdArchitecture() {
  const [selected, setSelected] = useState<NodeKey | null>(null);
  const [hovered, setHovered] = useState<NodeKey | null>(null);
  const active = hovered ?? selected;
  const isActive = (key: NodeKey) => active === key;

  const toggle = (key: NodeKey) =>
    setSelected((prev) => (prev === key ? null : key));

  const nodeProps = (key: NodeKey) => ({
    tabIndex: 0,
    role: "button" as const,
    "aria-label": `${nodeInfo[key].title} · show details`,
    "aria-pressed": selected === key,
    onClick: () => toggle(key),
    onKeyDown: (e: React.KeyboardEvent<SVGGElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(key);
      }
    },
    onMouseEnter: () => setHovered(key),
    onMouseLeave: () => setHovered(null),
    onFocus: () => setHovered(key),
    onBlur: () => setHovered(null),
    className: "cursor-pointer outline-none",
  });

  return (
    <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
      <h3 className="mb-1 text-lg font-semibold">
        Pipeline platform · system overview
      </h3>
      <p className="mb-4 text-xs text-muted-foreground">
        Select any node for a one-line explanation of what it does.
      </p>

      {/* The panel sits above the drawing, so the explanation is never off
          the bottom of a scrolled diagram. Fixed height, so selecting a node
          doesn't shove the diagram down the page. */}
      <div
        aria-live="polite"
        className="mb-4 min-h-[6.25rem] sm:min-h-[5.25rem] rounded-lg border border-border bg-secondary/40 p-4"
      >
        {active ? (
          <>
            <h4 className="mb-1 font-semibold text-foreground">
              {nodeInfo[active].title}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {nodeInfo[active].description}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nothing selected. Every box below is a real repo, controller or
            service; pick one and its description appears here.
          </p>
        )}
      </div>

      <div className="overflow-x-auto" data-lenis-prevent tabIndex={0}>
        <svg
          viewBox="0 0 680 540"
          className="min-w-[560px] w-full"
          role="group"
          aria-label="CI/CD architecture: a service repo and two shared pipeline libraries feed Bitbucket Pipelines, which produces an ECR image and build metadata; ArgoCD Image Updater promotes via the GitOps repo, ArgoCD syncs to Kubernetes, and a PostSync hook triggers the test infra repo with results aggregated in Sentry."
        >
          <defs>
            <marker
              id="arrow-cicd"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" className="fill-primary" />
            </marker>
          </defs>

          {/* Stage labels live in the left gutter, level with their row. */}
          {[
            { text: "inputs", y: 56 },
            { text: "ci", y: 166 },
            { text: "output", y: 266 },
            { text: "deliver", y: 376 },
            { text: "verify", y: 476 },
          ].map((l) => (
            <text
              key={l.text}
              x="6"
              y={l.y}
              className="fill-muted-foreground text-[10px] font-mono"
            >
              {l.text}
            </text>
          ))}

          {/* Row 1 — inputs */}
          {INPUT_NODES.map((n) => (
            <g key={n.key} {...nodeProps(n.key)}>
              <rect
                x={n.x}
                y="20"
                width="184"
                height="64"
                rx="8"
                className={`fill-secondary ${
                  isActive(n.key) ? "stroke-primary" : "stroke-border"
                }`}
                style={isActive(n.key) ? { fill: ACTIVE_FILL } : undefined}
                strokeWidth="2"
              />
              <text
                x={n.x + 92}
                y="48"
                textAnchor="middle"
                className="fill-foreground text-sm font-semibold"
              >
                {n.label}
              </text>
              <text
                x={n.x + 92}
                y="66"
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {n.sub}
              </text>
            </g>
          ))}

          {/* inputs → Bitbucket */}
          {[156, 356, 556].map((x) => (
            <line
              key={x}
              x1={x}
              y1="84"
              x2="356"
              y2="130"
              className="stroke-primary"
              strokeWidth="1.5"
              markerEnd="url(#arrow-cicd)"
              opacity="0.5"
            />
          ))}

          {/* Row 2 — Bitbucket Pipelines */}
          <g {...nodeProps("bitbucket")}>
            <rect
              x="134"
              y="130"
              width="444"
              height="64"
              rx="10"
              className={`fill-card ${
                isActive("bitbucket") ? "stroke-primary" : "stroke-border"
              }`}
              style={isActive("bitbucket") ? { fill: ACTIVE_FILL } : undefined}
              strokeWidth="3"
            />
            <text
              x="356"
              y="158"
              textAnchor="middle"
              className="fill-foreground text-base font-bold"
            >
              Bitbucket Pipelines
            </text>
            <text
              x="356"
              y="177"
              textAnchor="middle"
              className="fill-muted-foreground text-[11px]"
            >
              imports shared selectors · builds · pushes
            </text>
          </g>

          {/* Bitbucket → outputs */}
          <line
            x1="270"
            y1="194"
            x2="199"
            y2="236"
            className="stroke-primary"
            strokeWidth="2"
            markerEnd="url(#arrow-cicd)"
          />
          <line
            x1="442"
            y1="194"
            x2="513"
            y2="236"
            className="stroke-primary"
            strokeWidth="2"
            markerEnd="url(#arrow-cicd)"
          />

          {/* Row 3 — what the build leaves behind */}
          {(
            [
              {
                key: "ecr",
                x: 64,
                label: "AWS ECR",
                sub: "image · multi-tagged",
              },
              {
                key: "buildjson",
                x: 378,
                label: "build.json",
                sub: "metadata · output contract",
              },
            ] as const
          ).map((n) => (
            <g key={n.key} {...nodeProps(n.key)}>
              <rect
                x={n.x}
                y="236"
                width="270"
                height="52"
                rx="8"
                className={`fill-card ${
                  isActive(n.key) ? "stroke-primary" : "stroke-border"
                }`}
                style={isActive(n.key) ? { fill: ACTIVE_FILL } : undefined}
                strokeWidth="2"
              />
              <text
                x={n.x + 135}
                y="259"
                textAnchor="middle"
                className="fill-foreground text-sm font-semibold"
              >
                {n.label}
              </text>
              <text
                x={n.x + 135}
                y="276"
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {n.sub}
              </text>
            </g>
          ))}

          {/* ECR → Image Updater */}
          <line
            x1="180"
            y1="288"
            x2="136"
            y2="340"
            className="stroke-primary"
            strokeWidth="2"
            markerEnd="url(#arrow-cicd)"
          />

          {/* Row 4 — delivery */}
          {DELIVERY_NODES.map((n) => (
            <g key={n.key} {...nodeProps(n.key)}>
              <rect
                x={n.x}
                y="340"
                width="126"
                height="64"
                rx="8"
                className={`fill-card ${
                  isActive(n.key) ? "stroke-primary" : "stroke-border"
                }`}
                style={isActive(n.key) ? { fill: ACTIVE_FILL } : undefined}
                strokeWidth="2"
              />
              <text
                x={n.x + 63}
                y="368"
                textAnchor="middle"
                className="fill-foreground text-[13px] font-semibold"
              >
                {n.label}
              </text>
              <text
                x={n.x + 63}
                y="385"
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {n.sub}
              </text>
            </g>
          ))}

          {[
            { x1: 190, x2: 216 },
            { x1: 342, x2: 368 },
            { x1: 494, x2: 520 },
          ].map((arr) => (
            <line
              key={arr.x1}
              x1={arr.x1}
              y1="372"
              x2={arr.x2}
              y2="372"
              className="stroke-primary"
              strokeWidth="2"
              markerEnd="url(#arrow-cicd)"
            />
          ))}

          {/* Row 5 — verify */}
          {(
            [
              {
                key: "postsync",
                x: 64,
                label: "PostSync → test-infra",
                sub: "tests run once the deploy is healthy",
              },
              {
                key: "sentry",
                x: 378,
                label: "Sentry",
                sub: "fleet test health · Allure per run",
              },
            ] as const
          ).map((n) => (
            <g key={n.key} {...nodeProps(n.key)}>
              <rect
                x={n.x}
                y="440"
                width="270"
                height="64"
                rx="8"
                className={`fill-secondary ${
                  isActive(n.key) ? "stroke-primary" : "stroke-border"
                }`}
                style={isActive(n.key) ? { fill: ACTIVE_FILL } : undefined}
                strokeWidth="2"
              />
              <text
                x={n.x + 135}
                y="468"
                textAnchor="middle"
                className="fill-foreground text-sm font-semibold"
              >
                {n.label}
              </text>
              <text
                x={n.x + 135}
                y="486"
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {n.sub}
              </text>
            </g>
          ))}

          {/* Kubernetes → PostSync */}
          <line
            x1="540"
            y1="404"
            x2="250"
            y2="440"
            className="stroke-primary"
            strokeWidth="2"
            markerEnd="url(#arrow-cicd)"
            opacity="0.6"
          />

          {/* PostSync → Sentry */}
          <line
            x1="334"
            y1="472"
            x2="378"
            y2="472"
            className="stroke-primary"
            strokeWidth="2"
            markerEnd="url(#arrow-cicd)"
          />

          {/* build.json → Sentry, dashed: metadata, not a trigger. Routed
              round the right edge so it doesn't cross the delivery row. */}
          <path
            d="M 620 288 H 662 V 472 H 656"
            fill="none"
            className="stroke-primary"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            markerEnd="url(#arrow-cicd)"
            opacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
}
