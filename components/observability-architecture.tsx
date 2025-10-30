"use client";

import { useState } from "react";

export function ObservabilityArchitecture() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = {
    services: {
      title: "Microservices",
      description: "20+ services exposing /metrics endpoints - custom business metrics via Prometheus client libraries",
    },
    exporters: {
      title: "Infrastructure Exporters",
      description: "Node Exporter, Kube State Metrics, Kafka Exporter, Postgres Exporter, Redis Exporter",
    },
    prometheus: {
      title: "Prometheus",
      description: "Metrics collection with 30s scrape interval - 50+ alert rules with inhibition",
    },
    thanos: {
      title: "Thanos",
      description: "Long-term storage with data compression and downsampling - unlimited retention",
    },
    s3: {
      title: "AWS S3",
      description: "Object storage for historical metrics - cost-effective long-term retention",
    },
    promtail: {
      title: "Promtail",
      description: "Log collector running as DaemonSet - labels enrichment with pod/namespace context",
    },
    loki: {
      title: "Loki",
      description: "Log aggregation in microservices mode - label-based indexing for fast queries",
    },
    tempo: {
      title: "Tempo",
      description: "Distributed tracing - trace collection and storage with OpenTelemetry",
    },
    grafana: {
      title: "Grafana",
      description: "25+ dashboards for metrics, logs, and traces - unified observability interface",
    },
    alertmanager: {
      title: "Alertmanager",
      description: "Alert routing with smart grouping - environment-specific channels and inhibition rules",
    },
    teams: {
      title: "Teams",
      description: "Notifications via Power Automate - Dev (business hours), QA/Prod (24/7)",
    },
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold">Enterprise Observability Stack Architecture</h3>
      <div className="relative">
        <svg
          viewBox="0 0 950 720"
          className="w-full"
          role="img"
          aria-label="Enterprise observability platform architecture diagram showing Prometheus metrics scraping from Kubernetes microservices and infrastructure exporters, Thanos long-term storage on AWS S3, Loki log aggregation with Promtail collectors, Tempo distributed tracing with OpenTelemetry, Grafana unified visualization dashboards for metrics logs and traces, Alertmanager alert routing with smart inhibition, and Microsoft Teams notification integration for DevOps incident management"
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
            <marker
              id="arrowhead-green"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" className="fill-green-500" />
            </marker>
            <marker
              id="arrowhead-purple"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" className="fill-purple-500" />
            </marker>
          </defs>

          {/* Data Sources - Left Side */}
          <g
            onMouseEnter={() => setActiveNode("exporters")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="50"
              y="80"
              width="160"
              height="100"
              rx="8"
              className={`stroke-border ${
                activeNode === "exporters" ? "fill-primary/20" : "fill-secondary"
              }`}
              strokeWidth="2"
            />
            <text x="130" y="105" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              Infrastructure
            </text>
            <text x="130" y="120" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              Exporters
            </text>
            <text x="130" y="137" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              Node Exporter
            </text>
            <text x="130" y="149" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              Kube State Metrics
            </text>
            <text x="130" y="161" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              Kafka • Postgres • Redis
            </text>
          </g>

          <g
            onMouseEnter={() => setActiveNode("services")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="50"
              y="200"
              width="160"
              height="80"
              rx="8"
              className={`stroke-border ${
                activeNode === "services" ? "fill-primary/20" : "fill-secondary"
              }`}
              strokeWidth="2"
            />
            <text x="130" y="225" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              Microservices
            </text>
            <text x="130" y="242" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              20+ services
            </text>
            <text x="130" y="255" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              /metrics endpoints
            </text>
            <text x="130" y="268" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              Custom business metrics
            </text>
          </g>

          {/* Metrics Path - Center */}
          <g
            onMouseEnter={() => setActiveNode("prometheus")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="280"
              y="130"
              width="160"
              height="90"
              rx="8"
              className={`stroke-border ${
                activeNode === "prometheus" ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="3"
            />
            <text x="360" y="160" textAnchor="middle" className="fill-foreground text-base font-bold">
              Prometheus
            </text>
            <text x="360" y="178" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Metrics collection
            </text>
            <text x="360" y="191" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              30s scrape interval
            </text>
            <text x="360" y="204" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              50+ alert rules
            </text>
          </g>

          <g
            onMouseEnter={() => setActiveNode("thanos")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="500"
              y="130"
              width="140"
              height="70"
              rx="8"
              className={`stroke-border ${
                activeNode === "thanos" ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="2"
            />
            <text x="570" y="155" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              Thanos
            </text>
            <text x="570" y="172" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Long-term storage
            </text>
            <text x="570" y="185" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              Compression • Downsampling
            </text>
          </g>

          <g
            onMouseEnter={() => setActiveNode("s3")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="700"
              y="130"
              width="140"
              height="70"
              rx="8"
              className={`stroke-border ${
                activeNode === "s3" ? "fill-primary/20" : "fill-secondary"
              }`}
              strokeWidth="2"
            />
            <text x="770" y="155" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              AWS S3
            </text>
            <text x="770" y="172" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Object storage
            </text>
            <text x="770" y="185" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              Unlimited retention
            </text>
          </g>

          {/* Logs Path - Bottom Left */}
          <g
            onMouseEnter={() => setActiveNode("promtail")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="50"
              y="380"
              width="160"
              height="80"
              rx="8"
              className={`stroke-border ${
                activeNode === "promtail" ? "fill-primary/20" : "fill-secondary"
              }`}
              strokeWidth="2"
            />
            <text x="130" y="405" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              Promtail
            </text>
            <text x="130" y="422" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              DaemonSet collector
            </text>
            <text x="130" y="435" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Label enrichment
            </text>
            <text x="130" y="448" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              Pod/namespace context
            </text>
          </g>

          <g
            onMouseEnter={() => setActiveNode("loki")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="50"
              y="490"
              width="160"
              height="80"
              rx="8"
              className={`stroke-border ${
                activeNode === "loki" ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="3"
            />
            <text x="130" y="515" textAnchor="middle" className="fill-foreground text-base font-bold">
              Loki
            </text>
            <text x="130" y="533" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Log aggregation
            </text>
            <text x="130" y="546" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Microservices mode
            </text>
            <text x="130" y="559" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              Label-based indexing
            </text>
          </g>

          {/* Traces Path - Bottom Right */}
          <g
            onMouseEnter={() => setActiveNode("tempo")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="280"
              y="490"
              width="160"
              height="80"
              rx="8"
              className={`stroke-border ${
                activeNode === "tempo" ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="3"
            />
            <text x="360" y="515" textAnchor="middle" className="fill-foreground text-base font-bold">
              Tempo
            </text>
            <text x="360" y="533" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Distributed tracing
            </text>
            <text x="360" y="546" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              OpenTelemetry
            </text>
            <text x="360" y="559" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              Trace storage
            </text>
          </g>

          {/* Visualization - Right Center */}
          <g
            onMouseEnter={() => setActiveNode("grafana")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="500"
              y="280"
              width="140"
              height="100"
              rx="8"
              className={`stroke-border ${
                activeNode === "grafana" ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="3"
            />
            <text x="570" y="310" textAnchor="middle" className="fill-foreground text-base font-bold">
              Grafana
            </text>
            <text x="570" y="328" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              25+ dashboards
            </text>
            <text x="570" y="341" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Metrics + Logs
            </text>
            <text x="570" y="354" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              Unified observability
            </text>
            <text x="570" y="367" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              IoT • Platform • Business
            </text>
          </g>

          {/* Alerting - Right Bottom */}
          <g
            onMouseEnter={() => setActiveNode("alertmanager")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="700"
              y="280"
              width="140"
              height="90"
              rx="8"
              className={`stroke-border ${
                activeNode === "alertmanager" ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="2"
            />
            <text x="770" y="310" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              Alertmanager
            </text>
            <text x="770" y="327" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Alert routing
            </text>
            <text x="770" y="340" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Smart grouping
            </text>
            <text x="770" y="353" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              Inhibition rules
            </text>
          </g>

          <g
            onMouseEnter={() => setActiveNode("teams")}
            onMouseLeave={() => setActiveNode(null)}
            className="cursor-pointer"
          >
            <rect
              x="700"
              y="410"
              width="140"
              height="80"
              rx="8"
              className={`stroke-border ${
                activeNode === "teams" ? "fill-primary/20" : "fill-card"
              }`}
              strokeWidth="2"
            />
            <text x="770" y="435" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              Teams
            </text>
            <text x="770" y="452" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              Power Automate
            </text>
            <text x="770" y="465" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              Dev: business hours
            </text>
            <text x="770" y="478" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              QA/Prod: 24/7
            </text>
          </g>

          {/* Flow arrows - Metrics path */}
          <line x1="210" y1="130" x2="280" y2="155" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="210" y1="240" x2="280" y2="195" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="440" y1="175" x2="500" y2="165" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="640" y1="165" x2="700" y2="165" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Flow arrows - Logs path: Microservices → Promtail → Loki */}
          <line x1="130" y1="280" x2="130" y2="380" className="stroke-green-500" strokeWidth="2" markerEnd="url(#arrowhead-green)" />
          <line x1="130" y1="460" x2="130" y2="490" className="stroke-green-500" strokeWidth="2" markerEnd="url(#arrowhead-green)" />

          {/* Flow arrows - Traces path: Microservices → Tempo */}
          <line x1="180" y1="250" x2="320" y2="490" className="stroke-purple-500" strokeWidth="2" markerEnd="url(#arrowhead-purple)" />

          {/* Grafana queries */}
          <line x1="440" y1="190" x2="530" y2="280" className="stroke-blue-500" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="180" y1="530" x2="500" y2="360" className="stroke-blue-500" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="410" y1="530" x2="520" y2="380" className="stroke-blue-500" strokeWidth="2" strokeDasharray="5,5" />

          {/* Alerting flow */}
          <line x1="360" y1="220" x2="760" y2="280" className="stroke-red-500" strokeWidth="2" markerEnd="url(#arrowhead)" strokeDasharray="3,3" />
          <line x1="770" y1="370" x2="770" y2="410" className="stroke-red-500" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Labels */}
          <text x="230" y="140" className="fill-primary text-[8px]">scrape</text>
          <text x="230" y="230" className="fill-primary text-[8px]">scrape</text>
          <text x="460" y="158" className="fill-primary text-[8px]">store</text>
          <text x="660" y="158" className="fill-primary text-[8px]">archive</text>
          <text x="75" y="330" className="fill-green-500 text-[8px]">logs</text>
          <text x="140" y="480" className="fill-green-500 text-[8px]">aggregate</text>
          <text x="230" y="360" className="fill-purple-500 text-[8px]">traces</text>
          <text x="460" y="245" className="fill-blue-500 text-[8px]">query</text>
          <text x="280" y="430" className="fill-blue-500 text-[8px]">query</text>
          <text x="450" y="450" className="fill-blue-500 text-[8px]">query</text>
          <text x="520" y="250" className="fill-red-500 text-[8px]">alerts</text>
          <text x="780" y="395" className="fill-red-500 text-[8px]">notify</text>

          {/* Cost savings legend */}
          <g>
            <rect x="50" y="620" width="840" height="90" rx="6" className="fill-secondary/30 stroke-border" strokeWidth="1" />
            <text x="470" y="640" textAnchor="middle" className="fill-foreground text-[11px] font-bold">
              Business Impact & Scale
            </text>
            <text x="470" y="657" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              <tspan className="fill-primary font-semibold">&lt;$5K/year</tspan> self-hosted cost vs <tspan className="fill-muted-foreground line-through">$50K-150K</tspan> cloud solutions (95%+ savings)
            </text>
            <text x="470" y="673" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              25+ Grafana dashboards • 50+ alert rules • 100% service coverage • ~70% MTTD reduction • Full-stack tracing
            </text>
            <text x="470" y="689" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              Platform: Cluster health, infrastructure, service mesh • Service: IoT gateway, multi-tenant analytics • Business: Cost tracking, SLA monitoring
            </text>
          </g>
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

      <div className="mt-4 text-xs text-muted-foreground space-y-2">
        <p>
          <strong className="text-primary">Metrics Flow:</strong> Services (expose /metrics) + Exporters → Prometheus (scrape) → Thanos → S3
        </p>
        <p>
          <strong className="text-green-600 dark:text-green-400">Logs Flow:</strong> Services (stdout/stderr) → Promtail (DaemonSet collector) → Loki (aggregate)
        </p>
        <p>
          <strong className="text-purple-600 dark:text-purple-400">Traces Flow:</strong> Services (OpenTelemetry instrumentation) → Tempo (distributed trace storage)
        </p>
        <p>
          <strong className="text-blue-600 dark:text-blue-400">Visualization:</strong> Grafana queries Prometheus, Loki, and Tempo for unified observability (metrics + logs + traces)
        </p>
        <p>
          <strong className="text-red-600 dark:text-red-400">Alerting:</strong> Prometheus → Alertmanager (routing + inhibition) → Teams (environment-specific channels)
        </p>
      </div>
    </div>
  );
}
