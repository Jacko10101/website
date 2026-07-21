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
      "Per-service config is a single .ci/builds.yaml — name, runtime, dockerfile, image repo, build commands. That's all a service author has to write.",
  },
  shared: {
    title: "Shared pipelines (java + node)",
    description:
      "Two library repos that export Bitbucket selectors. Service repos import them by tag (e.g. java-shared-pipeline:1.4.0:main-java). Semver-tagged so services adopt new versions on their own schedule.",
  },
  scripts: {
    title: "shared-scripts",
    description:
      "Reusable commands the shared pipelines call into — tagging, ECR push, scan helpers. Where the useful bits of the old 1000-line bash reporter ended up.",
  },
  bitbucket: {
    title: "Bitbucket Pipelines",
    description:
      "Runs the imported steps. Optional gates (Veracode SAST, SourceClear SCA, Jira Fix Version) are env-gated in the same library — toggled per service via env, not template-forked.",
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
    description: "Four environments: dev, qa, preprod, prod.",
  },
  postsync: {
    title: "PostSync → test-infra",
    description:
      "An ArgoCD PostSync hook triggers a test job after the deploy is healthy. Tests live in their own repo, not in the pipeline.",
  },
  sentry: {
    title: "Sentry",
    description:
      "Fleet test-health dashboard. Aggregates POSTSYNC and CONTINUOUS test runs, surfaces pass rates per service, links to per-run Allure reports.",
  },
};

const ACTIVE_FILL = "oklch(0.72 0.19 150 / 0.1)";

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
    "aria-label": `${nodeInfo[key].title} — show details`,
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
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-1 text-lg font-semibold">Pipeline platform — system overview</h3>
      <p className="mb-4 text-xs text-muted-foreground">
        Click, tap or hover any node for a one-line explanation.
      </p>

      <div className="relative">
        <svg
          viewBox="0 0 900 600"
          className="w-full"
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

          <text x="20" y="30" className="fill-muted-foreground text-[10px] font-mono">
            inputs
          </text>

          {/* Row 1 — three input boxes */}
          {(
            [
              {
                key: "service",
                x: 60,
                w: 200,
                label: "Service repo",
                sub: ".ci/builds.yaml",
              },
              {
                key: "shared",
                x: 350,
                w: 200,
                label: "Shared pipelines",
                sub: "java + node, semver-tagged",
              },
              {
                key: "scripts",
                x: 640,
                w: 200,
                label: "shared-scripts",
                sub: "reusable commands",
              },
            ] as const
          ).map((n) => (
            <g key={n.key} {...nodeProps(n.key)}>
              <rect
                x={n.x}
                y="50"
                width={n.w}
                height="60"
                rx="8"
                className={`fill-secondary ${
                  isActive(n.key) ? "stroke-primary" : "stroke-border"
                }`}
                style={isActive(n.key) ? { fill: ACTIVE_FILL } : undefined}
                strokeWidth="2"
              />
              <text
                x={n.x + n.w / 2}
                y="75"
                textAnchor="middle"
                className="fill-foreground text-sm font-semibold"
              >
                {n.label}
              </text>
              <text
                x={n.x + n.w / 2}
                y="93"
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {n.sub}
              </text>
            </g>
          ))}

          {/* Inputs → Bitbucket */}
          {[160, 450, 740].map((x) => (
            <line
              key={x}
              x1={x}
              y1="110"
              x2="450"
              y2="170"
              className="stroke-primary"
              strokeWidth="1.5"
              markerEnd="url(#arrow-cicd)"
              opacity="0.5"
            />
          ))}

          <text x="20" y="200" className="fill-muted-foreground text-[10px] font-mono">
            ci
          </text>

          {/* Row 2 — Bitbucket Pipelines */}
          <g {...nodeProps("bitbucket")}>
            <rect
              x="240"
              y="180"
              width="420"
              height="60"
              rx="10"
              className={`fill-card ${
                isActive("bitbucket") ? "stroke-primary" : "stroke-border"
              }`}
              style={isActive("bitbucket") ? { fill: ACTIVE_FILL } : undefined}
              strokeWidth="3"
            />
            <text
              x="450"
              y="206"
              textAnchor="middle"
              className="fill-foreground text-base font-bold"
            >
              Bitbucket Pipelines
            </text>
            <text
              x="450"
              y="225"
              textAnchor="middle"
              className="fill-muted-foreground text-[11px]"
            >
              imports shared selectors · builds · pushes
            </text>
          </g>

          {/* Pipelines → outputs */}
          <line
            x1="350"
            y1="240"
            x2="280"
            y2="280"
            className="stroke-primary"
            strokeWidth="2"
            markerEnd="url(#arrow-cicd)"
          />
          <line
            x1="550"
            y1="240"
            x2="630"
            y2="280"
            className="stroke-primary"
            strokeWidth="2"
            markerEnd="url(#arrow-cicd)"
          />

          {/* Outputs */}
          <g {...nodeProps("ecr")}>
            <rect
              x="160"
              y="280"
              width="180"
              height="50"
              rx="8"
              className={`fill-card ${
                isActive("ecr") ? "stroke-primary" : "stroke-border"
              }`}
              style={isActive("ecr") ? { fill: ACTIVE_FILL } : undefined}
              strokeWidth="2"
            />
            <text
              x="250"
              y="302"
              textAnchor="middle"
              className="fill-foreground text-sm font-semibold"
            >
              AWS ECR
            </text>
            <text
              x="250"
              y="318"
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              image · multi-tagged
            </text>
          </g>

          <g {...nodeProps("buildjson")}>
            <rect
              x="560"
              y="280"
              width="180"
              height="50"
              rx="8"
              className={`fill-card ${
                isActive("buildjson") ? "stroke-primary" : "stroke-border"
              }`}
              style={isActive("buildjson") ? { fill: ACTIVE_FILL } : undefined}
              strokeWidth="2"
            />
            <text
              x="650"
              y="302"
              textAnchor="middle"
              className="fill-foreground text-sm font-semibold"
            >
              build.json
            </text>
            <text
              x="650"
              y="318"
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              metadata · output contract
            </text>
          </g>

          <text x="20" y="365" className="fill-muted-foreground text-[10px] font-mono">
            delivery
          </text>

          {/* Row 3 — delivery chain */}
          {(
            [
              {
                key: "updater",
                x: 40,
                w: 180,
                label: "Image Updater",
                sub: "watches ECR",
              },
              {
                key: "gitops",
                x: 250,
                w: 160,
                label: "GitOps repo",
                sub: "kustomize bump",
              },
              {
                key: "argocd",
                x: 440,
                w: 140,
                label: "ArgoCD",
                sub: "sync",
              },
              {
                key: "k8s",
                x: 610,
                w: 180,
                label: "Kubernetes",
                sub: "dev · qa · preprod · prod",
              },
            ] as const
          ).map((n) => (
            <g key={n.key} {...nodeProps(n.key)}>
              <rect
                x={n.x}
                y="380"
                width={n.w}
                height="60"
                rx="8"
                className={`fill-card ${
                  isActive(n.key) ? "stroke-primary" : "stroke-border"
                }`}
                style={isActive(n.key) ? { fill: ACTIVE_FILL } : undefined}
                strokeWidth="2"
              />
              <text
                x={n.x + n.w / 2}
                y="405"
                textAnchor="middle"
                className="fill-foreground text-sm font-semibold"
              >
                {n.label}
              </text>
              <text
                x={n.x + n.w / 2}
                y="423"
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {n.sub}
              </text>
            </g>
          ))}

          {/* ECR → Image Updater */}
          <line
            x1="190"
            y1="330"
            x2="130"
            y2="380"
            className="stroke-primary"
            strokeWidth="2"
            markerEnd="url(#arrow-cicd)"
          />

          {/* delivery chain arrows */}
          {[
            { x1: 220, x2: 250 },
            { x1: 410, x2: 440 },
            { x1: 580, x2: 610 },
          ].map((arr) => (
            <line
              key={arr.x1}
              x1={arr.x1}
              y1="410"
              x2={arr.x2}
              y2="410"
              className="stroke-primary"
              strokeWidth="2"
              markerEnd="url(#arrow-cicd)"
            />
          ))}

          <text x="20" y="485" className="fill-muted-foreground text-[10px] font-mono">
            verify
          </text>

          {/* Row 4 — verify */}
          <g {...nodeProps("postsync")}>
            <rect
              x="120"
              y="500"
              width="280"
              height="60"
              rx="8"
              className={`fill-secondary ${
                isActive("postsync") ? "stroke-primary" : "stroke-border"
              }`}
              style={isActive("postsync") ? { fill: ACTIVE_FILL } : undefined}
              strokeWidth="2"
            />
            <text
              x="260"
              y="525"
              textAnchor="middle"
              className="fill-foreground text-sm font-semibold"
            >
              PostSync → test-infra
            </text>
            <text
              x="260"
              y="543"
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              tests run after the deploy is healthy
            </text>
          </g>

          <g {...nodeProps("sentry")}>
            <rect
              x="500"
              y="500"
              width="280"
              height="60"
              rx="8"
              className={`fill-secondary ${
                isActive("sentry") ? "stroke-primary" : "stroke-border"
              }`}
              style={isActive("sentry") ? { fill: ACTIVE_FILL } : undefined}
              strokeWidth="2"
            />
            <text
              x="640"
              y="525"
              textAnchor="middle"
              className="fill-foreground text-sm font-semibold"
            >
              Sentry
            </text>
            <text
              x="640"
              y="543"
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              fleet test health · per-run Allure reports
            </text>
          </g>

          {/* k8s → postsync */}
          <line
            x1="650"
            y1="440"
            x2="320"
            y2="500"
            className="stroke-primary"
            strokeWidth="2"
            markerEnd="url(#arrow-cicd)"
            opacity="0.6"
          />

          {/* postsync → sentry */}
          <line
            x1="400"
            y1="530"
            x2="500"
            y2="530"
            className="stroke-primary"
            strokeWidth="2"
            markerEnd="url(#arrow-cicd)"
          />

          {/* build.json → sentry (dashed, metadata) */}
          <line
            x1="650"
            y1="330"
            x2="650"
            y2="500"
            className="stroke-primary"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            markerEnd="url(#arrow-cicd)"
            opacity="0.4"
          />
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
