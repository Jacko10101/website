"use client";

import { useState } from "react";

export function DoraArchitecture() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = {
    dora: {
      title: "DORA Metrics Collector",
      description: "Python Flask app running as K8s deployment - correlates APIs and exposes Prometheus metrics",
    },
    bitbucket: {
      title: "Bitbucket API",
      description: "Commit history, pipeline data, deployment timestamps for lead time calculation",
    },
    jira: {
      title: "Jira API",
      description: "Issue tracking, Fix Version validation, ticket lifecycle for MTTR metrics",
    },
    argocd: {
      title: "ArgoCD API",
      description: "Deployment status, sync history, application health for deployment frequency",
    },
    gitops: {
      title: "GitOps Repo",
      description: "ArgoCD Apps repo - deployment configuration cloned locally for analysis",
    },
    prometheus: {
      title: "Prometheus",
      description: "Scrapes /metrics endpoint every 30s - stores 15+ DORA metrics time-series",
    },
    grafana: {
      title: "Grafana",
      description: "Visualizes DORA metrics - deployment frequency, lead time, MTTR, change failure rate",
    },
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold">DORA Metrics Collection Architecture</h3>
      <div className="relative">
        <svg
          viewBox="0 0 900 400"
          className="w-full"
          role="img"
          aria-label="DORA metrics platform architecture diagram showing Kubernetes deployment with Python Flask metrics collector, Bitbucket API integration, Jira API correlation, ArgoCD API monitoring, GitOps repository tracking, Prometheus metrics scraping, and Grafana visualization dashboard for deployment intelligence and developer experience analytics"
        >
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

          {/* Central DORA Collector */}
          <g
            onMouseEnter={() => setActiveNode("dora")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="320"
              y="160"
              width="260"
              height="80"
              rx="8"
              className={`stroke-border ${
                activeNode === "dora" ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="3"
            />
            <text x="450" y="190" textAnchor="middle" className="fill-foreground text-lg font-bold">
              DORA Metrics Collector
            </text>
            <text x="450" y="210" textAnchor="middle" className="fill-muted-foreground text-[11px]">
              Python Flask • K8s Deployment
            </text>
            <text x="450" y="225" textAnchor="middle" className="fill-muted-foreground text-[10px]">
              Correlates APIs • Exposes /metrics
            </text>
          </g>

          {/* API Sources - Top Row */}
          <g
            onMouseEnter={() => setActiveNode("gitops")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="60"
              y="40"
              width="150"
              height="70"
              rx="8"
              className={`stroke-border ${
                activeNode === "gitops" ? "fill-primary/20" : "fill-secondary"
              }`}
              strokeWidth="2"
            />
            <text x="135" y="65" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              GitOps Repo
            </text>
            <text x="135" y="82" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              ArgoCD Apps
            </text>
            <text x="135" y="95" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              Deployment config
            </text>
          </g>

          <g
            onMouseEnter={() => setActiveNode("bitbucket")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="250"
              y="40"
              width="150"
              height="70"
              rx="8"
              className={`stroke-border ${
                activeNode === "bitbucket" ? "fill-primary/20" : "fill-secondary"
              }`}
              strokeWidth="2"
            />
            <text x="325" y="65" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              Bitbucket API
            </text>
            <text x="325" y="82" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Commits • Pipelines
            </text>
            <text x="325" y="95" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              Lead time tracking
            </text>
          </g>

          <g
            onMouseEnter={() => setActiveNode("jira")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="440"
              y="40"
              width="150"
              height="70"
              rx="8"
              className={`stroke-border ${
                activeNode === "jira" ? "fill-primary/20" : "fill-secondary"
              }`}
              strokeWidth="2"
            />
            <text x="515" y="65" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              Jira API
            </text>
            <text x="515" y="82" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Issues • Fix Versions
            </text>
            <text x="515" y="95" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              MTTR metrics
            </text>
          </g>

          <g
            onMouseEnter={() => setActiveNode("argocd")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="630"
              y="40"
              width="150"
              height="70"
              rx="8"
              className={`stroke-border ${
                activeNode === "argocd" ? "fill-primary/20" : "fill-secondary"
              }`}
              strokeWidth="2"
            />
            <text x="705" y="65" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              ArgoCD API
            </text>
            <text x="705" y="82" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Sync status • Health
            </text>
            <text x="705" y="95" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              Deploy frequency
            </text>
          </g>

          {/* Observability - Bottom Row */}
          <g
            onMouseEnter={() => setActiveNode("prometheus")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="260"
              y="290"
              width="160"
              height="70"
              rx="8"
              className={`stroke-border ${
                activeNode === "prometheus" ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="2"
            />
            <text x="340" y="315" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              Prometheus
            </text>
            <text x="340" y="332" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Scrapes /metrics
            </text>
            <text x="340" y="345" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              15+ DORA metrics
            </text>
          </g>

          <g
            onMouseEnter={() => setActiveNode("grafana")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="480"
              y="290"
              width="160"
              height="70"
              rx="8"
              className={`stroke-border ${
                activeNode === "grafana" ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="2"
            />
            <text x="560" y="315" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              Grafana
            </text>
            <text x="560" y="332" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              DORA dashboards
            </text>
            <text x="560" y="345" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              Lead time • Frequency
            </text>
          </g>

          {/* Flow arrows - APIs to DORA */}
          <line x1="135" y1="110" x2="380" y2="160" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="325" y1="110" x2="420" y2="160" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="515" y1="110" x2="480" y2="160" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="705" y1="110" x2="520" y2="160" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* DORA to Prometheus */}
          <line x1="390" y1="240" x2="330" y2="290" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Prometheus to Grafana */}
          <line x1="420" y1="325" x2="480" y2="325" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Labels */}
          <text x="220" y="130" className="fill-muted-foreground text-[8px]">git clone</text>
          <text x="360" y="135" className="fill-muted-foreground text-[8px]">REST API</text>
          <text x="500" y="135" className="fill-muted-foreground text-[8px]">REST API</text>
          <text x="590" y="130" className="fill-muted-foreground text-[8px]">REST API</text>
          <text x="350" y="275" className="fill-muted-foreground text-[8px]">scrape</text>
          <text x="435" y="318" className="fill-muted-foreground text-[8px]">query</text>
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
          <strong>Flow:</strong> DORA Collector (K8s deployment) clones GitOps repo and correlates Bitbucket, Jira, and ArgoCD APIs →
          Exposes Prometheus metrics → Grafana visualizes deployment intelligence (deployment frequency, lead time, MTTR, change failure rate)
        </p>
      </div>
    </div>
  );
}
