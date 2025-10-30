"use client";

import { useState } from "react";

export function CicdArchitecture() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = {
    bitbucket: {
      title: "Bitbucket Pipelines",
      description: "CI/CD orchestration with parallel testing (unit, integration, SAST, SCA)",
    },
    tests: {
      title: "Parallel Tests",
      description: "Unit tests, Integration tests, Veracode SAST, SourceClear SCA (~5min total)",
    },
    docker: {
      title: "Docker Build",
      description: "Multi-stage builds with custom base image (Maven + kubectl + ArgoCD CLI)",
    },
    ecr: {
      title: "AWS ECR",
      description: "Container registry with image scanning and lifecycle policies",
    },
    gitops: {
      title: "GitOps Repo",
      description: "Kustomize overlays updated via script (dev/qa/preprod/prod)",
    },
    argocd: {
      title: "ArgoCD",
      description: "GitOps continuous delivery with App-of-Apps pattern and PostSync hooks",
    },
    k8s: {
      title: "Kubernetes",
      description: "EKS cluster with 4 environments (Dev, QA, PreProd, Prod)",
    },
    postsync: {
      title: "PostSync Tests",
      description: "Automated test jobs (Newman API + Cucumber BDD) triggered after deployment",
    },
    teams: {
      title: "Teams Notifications",
      description: "Rich Adaptive Cards with deployment status, test results, and ArgoCD links",
    },
    reporter: {
      title: "Pipeline Reporter",
      description: "Bash script in custom Docker image - sends Teams notifications at each stage",
    },
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold">CI/CD & GitOps Architecture</h3>
      <div className="relative">
        <svg
          viewBox="0 0 900 600"
          className="w-full"
          role="img"
          aria-label="Enterprise CI/CD GitOps architecture diagram showing Bitbucket Pipelines, Docker build pipeline, AWS ECR container registry, ArgoCD GitOps deployment, Kubernetes cluster orchestration, and automated testing with Teams notifications"
        >
          {/* Flow paths */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" className="fill-primary" />
            </marker>
          </defs>

          {/* Developer commit */}
          <g>
            <circle cx="50" cy="100" r="25" className="fill-secondary stroke-border" strokeWidth="2" />
            <text x="50" y="105" textAnchor="middle" className="fill-foreground text-xs font-medium">
              Dev
            </text>
            <text x="50" y="145" textAnchor="middle" className="fill-muted-foreground text-[10px]">
              Commit
            </text>
          </g>

          {/* Bitbucket Pipelines */}
          <g
            onMouseEnter={() => setActiveNode("bitbucket")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="120"
              y="60"
              width="140"
              height="80"
              rx="8"
              className={`stroke-border ${
                activeNode === "bitbucket" ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="2"
            />
            <text x="190" y="90" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              Bitbucket
            </text>
            <text x="190" y="110" textAnchor="middle" className="fill-muted-foreground text-xs">
              Pipelines
            </text>
            <text x="190" y="125" textAnchor="middle" className="fill-muted-foreground text-[10px]">
              Tests • Build • Deploy
            </text>
          </g>

          {/* Tests (parallel) */}
          <g
            onMouseEnter={() => setActiveNode("tests")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="120"
              y="170"
              width="140"
              height="60"
              rx="8"
              className={`stroke-border ${
                activeNode === "tests" ? "fill-primary/20" : "fill-secondary"
              }`}
              strokeWidth="2"
            />
            <text x="190" y="195" textAnchor="middle" className="fill-foreground text-xs font-semibold">
              Parallel Tests
            </text>
            <text x="190" y="210" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Unit • Integration
            </text>
            <text x="190" y="222" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              SAST • SCA
            </text>
          </g>

          {/* Docker Build */}
          <g
            onMouseEnter={() => setActiveNode("docker")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="310"
              y="75"
              width="120"
              height="50"
              rx="8"
              className={`stroke-border ${
                activeNode === "docker" ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="2"
            />
            <text x="370" y="95" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              Docker Build
            </text>
            <text x="370" y="112" textAnchor="middle" className="fill-muted-foreground text-[10px]">
              Custom Base Image
            </text>
          </g>

          {/* ECR */}
          <g
            onMouseEnter={() => setActiveNode("ecr")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="480"
              y="75"
              width="100"
              height="50"
              rx="8"
              className={`stroke-border ${
                activeNode === "ecr" ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="2"
            />
            <text x="530" y="95" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              AWS ECR
            </text>
            <text x="530" y="112" textAnchor="middle" className="fill-muted-foreground text-[10px]">
              Container Registry
            </text>
          </g>

          {/* GitOps Repo */}
          <g
            onMouseEnter={() => setActiveNode("gitops")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="630"
              y="60"
              width="120"
              height="80"
              rx="8"
              className={`stroke-border ${
                activeNode === "gitops" ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="2"
            />
            <text x="690" y="85" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              GitOps Repo
            </text>
            <text x="690" y="102" textAnchor="middle" className="fill-muted-foreground text-[10px]">
              Kustomize Overlays
            </text>
            <text x="690" y="117" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              dev • qa • preprod • prod
            </text>
            <text x="690" y="130" textAnchor="middle" className="fill-primary text-[9px] font-medium">
              Auto: dev, qa
            </text>
          </g>

          {/* ArgoCD */}
          <g
            onMouseEnter={() => setActiveNode("argocd")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="630"
              y="180"
              width="120"
              height="60"
              rx="8"
              className={`stroke-border ${
                activeNode === "argocd" ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="2"
            />
            <text x="690" y="200" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              ArgoCD
            </text>
            <text x="690" y="217" textAnchor="middle" className="fill-muted-foreground text-[10px]">
              GitOps Sync
            </text>
            <text x="690" y="230" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              App-of-Apps Pattern
            </text>
          </g>

          {/* Kubernetes */}
          <g
            onMouseEnter={() => setActiveNode("k8s")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="630"
              y="280"
              width="120"
              height="60"
              rx="8"
              className={`stroke-border ${
                activeNode === "k8s" ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="2"
            />
            <text x="690" y="300" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              Kubernetes
            </text>
            <text x="690" y="317" textAnchor="middle" className="fill-muted-foreground text-[10px]">
              EKS Cluster
            </text>
            <text x="690" y="330" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              4 Environments
            </text>
          </g>

          {/* PostSync Tests */}
          <g
            onMouseEnter={() => setActiveNode("postsync")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="630"
              y="380"
              width="120"
              height="60"
              rx="8"
              className={`stroke-border ${
                activeNode === "postsync" ? "fill-primary/20" : "fill-secondary"
              }`}
              strokeWidth="2"
            />
            <text x="690" y="400" textAnchor="middle" className="fill-foreground text-xs font-semibold">
              PostSync Tests
            </text>
            <text x="690" y="415" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Newman API Tests
            </text>
            <text x="690" y="427" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Cucumber BDD
            </text>
          </g>

          {/* Teams Notifications */}
          <g
            onMouseEnter={() => setActiveNode("teams")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="310"
              y="280"
              width="120"
              height="60"
              rx="8"
              className={`stroke-border ${
                activeNode === "teams" ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="2"
            />
            <text x="370" y="300" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              Teams
            </text>
            <text x="370" y="317" textAnchor="middle" className="fill-muted-foreground text-[10px]">
              Adaptive Cards
            </text>
            <text x="370" y="330" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Rich Notifications
            </text>
          </g>

          {/* Pipeline Reporter */}
          <g
            onMouseEnter={() => setActiveNode("reporter")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="120"
              y="280"
              width="140"
              height="60"
              rx="8"
              className={`stroke-border ${
                activeNode === "reporter" ? "fill-primary/20" : "fill-secondary/50"
              }`}
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text x="190" y="300" textAnchor="middle" className="fill-foreground text-xs font-semibold">
              Pipeline Reporter
            </text>
            <text x="190" y="315" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Bash Script (1000+ lines)
            </text>
            <text x="190" y="327" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Baked into Base Image
            </text>
          </g>

          {/* Flow arrows */}
          <line x1="75" y1="100" x2="120" y2="100" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="190" y1="140" x2="190" y2="170" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="260" y1="100" x2="310" y2="100" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="430" y1="100" x2="480" y2="100" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="580" y1="100" x2="630" y2="100" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="690" y1="140" x2="690" y2="180" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="690" y1="240" x2="690" y2="280" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="690" y1="340" x2="690" y2="380" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* GitOps update to Reporter */}
          <line x1="690" y1="140" x2="260" y2="280" className="stroke-blue-500" strokeWidth="2" markerEnd="url(#arrowhead)" strokeDasharray="3,3" />

          {/* Reporter to Teams */}
          <line x1="260" y1="310" x2="310" y2="310" className="stroke-blue-500" strokeWidth="2" markerEnd="url(#arrowhead)" strokeDasharray="3,3" />

          {/* PostSync to Teams */}
          <line x1="630" y1="410" x2="430" y2="340" className="stroke-blue-500" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Labels */}
          <text x="85" y="92" className="fill-muted-foreground text-[9px]">git push</text>
          <text x="275" y="92" className="fill-muted-foreground text-[9px]">build</text>
          <text x="445" y="92" className="fill-muted-foreground text-[9px]">push</text>
          <text x="595" y="92" className="fill-muted-foreground text-[9px]">update</text>
          <text x="420" y="200" className="fill-blue-500 text-[8px]">config updated</text>
          <text x="695" y="165" className="fill-muted-foreground text-[9px]">sync</text>
          <text x="695" y="265" className="fill-muted-foreground text-[9px]">deploy</text>
          <text x="695" y="365" className="fill-muted-foreground text-[9px]">test</text>
        </svg>

        {/* Hover info panel */}
        {activeNode && (
          <div className="mt-4 rounded-lg border border-primary/50 bg-primary/10 p-4">
            <h4 className="mb-1 font-semibold text-foreground">
              {nodes[activeNode as keyof typeof nodes].title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {nodes[activeNode as keyof typeof nodes].description}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        <p>
          <strong>Flow:</strong> Developer commits → Bitbucket runs parallel tests → Docker builds
          with custom base image → Pushes to ECR → Updates GitOps repo → ArgoCD syncs → Deploys to
          K8s → PostSync tests run → Teams notifications at each stage
        </p>
      </div>
    </div>
  );
}
