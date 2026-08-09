"use client";

import { useState } from "react";

const ACTIVE_FILL = "oklch(0.72 0.19 150 / 0.1)";

export function ObservabilityArchitecture() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const activeNode = hovered ?? selected;

  const nodes = {
    services: {
      title: "Microservices",
      description:
        "The 20 services each expose a /metrics endpoint, including counters we added for business events rather than plumbing.",
    },
    exporters: {
      title: "Infrastructure exporters",
      description:
        "Off-the-shelf exporters cover the things that can't instrument themselves — nodes, Kubernetes objects, Kafka, Postgres and Redis.",
    },
    prometheus: {
      title: "Prometheus",
      description:
        "Scrapes every target on a 30-second interval and evaluates the alert rules against what it finds.",
    },
    thanos: {
      title: "Thanos",
      description:
        "Compacts and downsamples older metrics so we can keep years of history without keeping it hot.",
    },
    s3: {
      title: "AWS S3",
      description:
        "Where the cold metrics end up, at object-storage prices rather than cluster-disk prices.",
    },
    promtail: {
      title: "Promtail",
      description:
        "Runs on every node and tags each log line with its pod and namespace before shipping it on.",
    },
    loki: {
      title: "Loki",
      description:
        "Indexes logs by label instead of by content, which is the reason it stays cheap to run.",
    },
    tempo: {
      title: "Tempo",
      description:
        "Holds the traces, using the OpenTelemetry and trace-to-log conventions I set for services to build against.",
    },
    grafana: {
      title: "Grafana",
      description:
        "The one place people actually look — 22 dashboards reading metrics, logs and traces side by side.",
    },
    alertmanager: {
      title: "Alertmanager",
      description:
        "Groups related alerts, suppresses the downstream noise with inhibition rules, and routes what's left by environment.",
    },
    teams: {
      title: "Teams",
      description:
        "Where alerts land, via Power Automate — dev in business hours, QA and prod around the clock.",
    },
  };

  const toggle = (key: string) =>
    setSelected((prev) => (prev === key ? null : key));

  const nodeProps = (key: keyof typeof nodes) => ({
    tabIndex: 0,
    role: "button" as const,
    "aria-label": `${nodes[key].title} · show details`,
    "aria-pressed": selected === key,
    onClick: () => toggle(key),
    onKeyDown: (e: React.KeyboardEvent<SVGGElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(key);
      }
    },
    // Pointer events rather than mouse events: a tap on a touch screen fires a
    // synthetic mouseenter that never gets a matching mouseleave, which used to
    // leave the panel stuck on whichever node you last touched.
    onPointerEnter: (e: React.PointerEvent<SVGGElement>) => {
      if (e.pointerType === "mouse") setHovered(key);
    },
    onPointerLeave: (e: React.PointerEvent<SVGGElement>) => {
      if (e.pointerType === "mouse") setHovered(null);
    },
    onFocus: () => setHovered(key),
    onBlur: () => setHovered(null),
    className: "cursor-pointer outline-none",
  });

  const isActive = (key: string) => activeNode === key;
  const rectClass = (key: string, base: string) =>
    `${base} ${isActive(key) ? "stroke-primary" : "stroke-border"}`;
  const rectStyle = (key: string) =>
    isActive(key) ? { fill: ACTIVE_FILL } : undefined;

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-3 text-lg font-semibold">Observability stack · system overview</h3>

      {/* The explanation sits above the diagram, not below it: the SVG is wider
          than the column, so anything underneath scrolls out of view the moment
          you pan right. Fixed height so selecting a node doesn't shift the page. */}
      <div
        aria-live="polite"
        className="mb-4 min-h-[5.5rem] rounded-md border border-border/60 bg-secondary/20 p-4"
      >
        {activeNode ? (
          <>
            <h4 className="mb-1 font-semibold text-foreground">
              {nodes[activeNode as keyof typeof nodes].title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {nodes[activeNode as keyof typeof nodes].description}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Select any box in the diagram for a line on what it does. The
            diagram is wider than this column, so it scrolls sideways.
          </p>
        )}
      </div>

      <div className="relative">
        <div className="overflow-x-auto" data-lenis-prevent tabIndex={0}>
        <svg
          viewBox="0 0 880 600"
          className="min-w-[880px] w-full"
          role="group"
          aria-label="Diagram of the observability stack: metrics, logs and traces flow from the services to Grafana, and alerts route on to Teams."
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
              id="arrowhead-muted"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" className="fill-muted-foreground" />
            </marker>
            <marker
              id="arrowhead-error"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" className="fill-error" />
            </marker>
          </defs>

          {/* Data Sources - Left Side */}
          <g {...nodeProps("exporters")}>
            <rect
              x="50"
              y="80"
              width="160"
              height="100"
              rx="8"
              className={rectClass("exporters", "fill-secondary")}
              style={rectStyle("exporters")}
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

          <g {...nodeProps("services")}>
            <rect
              x="50"
              y="200"
              width="160"
              height="80"
              rx="8"
              className={rectClass("services", "fill-secondary")}
              style={rectStyle("services")}
              strokeWidth="2"
            />
            <text x="130" y="225" textAnchor="middle" className="fill-foreground text-sm font-semibold">
              Microservices
            </text>
            <text x="130" y="242" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              20 services
            </text>
            <text x="130" y="255" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              /metrics endpoints
            </text>
            <text x="130" y="268" textAnchor="middle" className="fill-muted-foreground text-[8px]">
              Custom business metrics
            </text>
          </g>

          {/* Metrics Path - Center */}
          <g {...nodeProps("prometheus")}>
            <rect
              x="280"
              y="130"
              width="160"
              height="90"
              rx="8"
              className={rectClass("prometheus", "fill-card")}
              style={rectStyle("prometheus")}
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

          <g {...nodeProps("thanos")}>
            <rect
              x="500"
              y="130"
              width="140"
              height="70"
              rx="8"
              className={rectClass("thanos", "fill-card")}
              style={rectStyle("thanos")}
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

          <g {...nodeProps("s3")}>
            <rect
              x="700"
              y="130"
              width="140"
              height="70"
              rx="8"
              className={rectClass("s3", "fill-secondary")}
              style={rectStyle("s3")}
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
          <g {...nodeProps("promtail")}>
            <rect
              x="50"
              y="380"
              width="160"
              height="80"
              rx="8"
              className={rectClass("promtail", "fill-secondary")}
              style={rectStyle("promtail")}
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

          <g {...nodeProps("loki")}>
            <rect
              x="50"
              y="490"
              width="160"
              height="80"
              rx="8"
              className={rectClass("loki", "fill-card")}
              style={rectStyle("loki")}
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
          <g {...nodeProps("tempo")}>
            <rect
              x="280"
              y="490"
              width="160"
              height="80"
              rx="8"
              className={rectClass("tempo", "fill-card")}
              style={rectStyle("tempo")}
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
          <g {...nodeProps("grafana")}>
            <rect
              x="500"
              y="280"
              width="140"
              height="100"
              rx="8"
              className={rectClass("grafana", "fill-card")}
              style={rectStyle("grafana")}
              strokeWidth="3"
            />
            <text x="570" y="310" textAnchor="middle" className="fill-foreground text-base font-bold">
              Grafana
            </text>
            <text x="570" y="328" textAnchor="middle" className="fill-muted-foreground text-[9px]">
              22 custom dashboards
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
          <g {...nodeProps("alertmanager")}>
            <rect
              x="700"
              y="280"
              width="140"
              height="90"
              rx="8"
              className={rectClass("alertmanager", "fill-card")}
              style={rectStyle("alertmanager")}
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

          <g {...nodeProps("teams")}>
            <rect
              x="700"
              y="410"
              width="140"
              height="80"
              rx="8"
              className={rectClass("teams", "fill-card")}
              style={rectStyle("teams")}
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
          <line x1="130" y1="280" x2="130" y2="380" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="130" y1="460" x2="130" y2="490" className="stroke-primary" strokeWidth="2" markerEnd="url(#arrowhead)" />

          {/* Flow arrows - Traces path: Microservices → Tempo */}
          <line x1="180" y1="250" x2="320" y2="490" className="stroke-muted-foreground" strokeWidth="2" markerEnd="url(#arrowhead-muted)" />

          {/* Grafana queries */}
          <line x1="440" y1="190" x2="530" y2="280" className="stroke-muted-foreground" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
          <line x1="180" y1="530" x2="500" y2="360" className="stroke-muted-foreground" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
          <line x1="410" y1="530" x2="520" y2="380" className="stroke-muted-foreground" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />

          {/* Alerting flow */}
          <line x1="360" y1="220" x2="760" y2="280" className="stroke-error" strokeWidth="2" markerEnd="url(#arrowhead-error)" strokeDasharray="3,3" />
          <line x1="770" y1="370" x2="770" y2="410" className="stroke-error" strokeWidth="2" markerEnd="url(#arrowhead-error)" />

          {/* Labels */}
          <text x="230" y="140" className="fill-primary text-[8px]">scrape</text>
          <text x="230" y="230" className="fill-primary text-[8px]">scrape</text>
          <text x="460" y="158" className="fill-primary text-[8px]">store</text>
          <text x="660" y="158" className="fill-primary text-[8px]">archive</text>
          <text x="75" y="330" className="fill-primary text-[8px]">logs</text>
          <text x="140" y="480" className="fill-primary text-[8px]">aggregate</text>
          <text x="230" y="360" className="fill-muted-foreground text-[8px]">traces</text>
          <text x="460" y="245" className="fill-muted-foreground text-[8px]">query</text>
          <text x="280" y="430" className="fill-muted-foreground text-[8px]">query</text>
          <text x="450" y="450" className="fill-muted-foreground text-[8px]">query</text>
          <text x="520" y="250" className="fill-error text-[8px]">alerts</text>
          <text x="780" y="395" className="fill-error text-[8px]">notify</text>
        </svg>
        </div>
      </div>
    </div>
  );
}
