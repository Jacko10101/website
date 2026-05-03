"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const projects = [
  {
    id: "heimdall",
    title: "Heimdall",
    subtitle: "Deployment intelligence platform",
    description:
      "The dashboard the platform team checks every morning. Answers one question: where is my ticket right now? Used daily by 20+ engineers across 17 services.",
    stats: [
      { value: "17", label: "services tracked" },
      { value: "20+", label: "engineers daily" },
      { value: "10 min", label: "data freshness" },
    ],
    tags: ["Python", "Flask", "TimescaleDB", "Prometheus", "ArgoCD", "Kubernetes"],
    href: "/projects/heimdall",
    color: "#f59e0b",
    terminal: [
      { cmd: "$ curl heimdall/api/v1/debug | jq .", color: "text-gray-500" },
      { cmd: "collection.age_seconds: 142", color: "text-green-400" },
      { cmd: "db_pool.checked_out: 2 / 10", color: "text-cyan-400" },
      { cmd: "circuit_breakers: all closed", color: "text-amber-400" },
    ],
  },
  {
    id: "pipeline-platform",
    title: "Pipeline Platform",
    subtitle: "Shared CI/CD library",
    description:
      "One Bitbucket pipeline library, imported by every Java and Node service. Tests live in their own repo, promotion belongs to ArgoCD. ~400 deploys/month across 20 services on a single .ci/builds.yaml.",
    stats: [
      { value: "20", label: "services, one library" },
      { value: "~400", label: "deploys/month" },
      { value: "1 file", label: "to onboard" },
    ],
    tags: ["Bitbucket Shared Pipelines", "ArgoCD", "Image Updater", "Kubernetes", "Kustomize"],
    href: "/projects/pipeline-platform",
    color: "#22c55e",
    terminal: [
      { cmd: "$ cat .ci/builds.yaml", color: "text-gray-500" },
      { cmd: "service: payments-api", color: "text-green-400" },
      { cmd: "import: java-shared-pipeline:1.4.0", color: "text-cyan-400" },
      { cmd: "→ Image Updater handles the rest", color: "text-amber-400" },
    ],
  },
  {
    id: "observability",
    title: "Observability Stack",
    subtitle: "Self-hosted monitoring",
    description:
      "Prometheus, Grafana and Loki for 20 services across four environments. Built it ourselves because the commercial quotes were ~£100k and we already had the cluster capacity.",
    stats: [
      { value: "~£5k/yr", label: "vs ~£100k commercial" },
      { value: "~25", label: "dashboards" },
      { value: "50+", label: "alerts, runbook each" },
    ],
    tags: ["Prometheus", "Grafana", "Loki", "Thanos", "Alertmanager"],
    href: "/projects/observability",
    color: "#e6522c",
    terminal: [
      { cmd: "$ prometheus targets", color: "text-gray-500" },
      { cmd: "20/20 targets healthy", color: "text-green-400" },
      { cmd: "25 dashboards active", color: "text-amber-400" },
      { cmd: "50+ alert rules configured", color: "text-cyan-400" },
    ],
  },
  {
    id: "smart-home",
    title: "Smart Home on K3s",
    subtitle: "Self-hosted home automation",
    description:
      "Single-node Kubernetes cluster on a Raspberry Pi 5, GitOps-reconciled by ArgoCD, observable end-to-end through Prometheus and Grafana. Twenty-plus lights, plugs and sensors. Zero ports exposed to the internet. Same discipline I apply at work, sized to a flat.",
    stats: [
      { value: "Single-node", label: "K3s + ArgoCD + Prometheus" },
      { value: "20+", label: "lights, plugs and sensors" },
      { value: "0", label: "ports exposed to the internet" },
    ],
    tags: ["K3s", "ArgoCD", "Home Assistant", "Zigbee2MQTT", "Prometheus", "Grafana", "Tailscale"],
    href: "/projects/smart-home",
    color: "#06b6d4",
    terminal: [
      { cmd: "$ kubectl get apps -n argocd", color: "text-gray-500" },
      { cmd: "home-assistant      Synced  Healthy", color: "text-green-400" },
      { cmd: "zigbee2mqtt         Synced  Healthy", color: "text-green-400" },
      { cmd: "prometheus + grafana  Synced  Healthy", color: "text-cyan-400" },
    ],
  },
];

function ProjectCard({
  project,
  index,
  isReversed,
}: {
  project: typeof projects[0];
  index: number;
  isReversed: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-16 items-center`}
    >
      {/* Project info */}
      <div className="flex-1 w-full">
        <span
          className="text-7xl font-bold opacity-20 block mb-4"
          style={{ color: project.color }}
        >
          0{index + 1}
        </span>

        <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          {project.title}
        </h3>

        <p className="mb-4" style={{ color: project.color }}>
          {project.subtitle}
        </p>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          {project.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {project.stats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <div
                className="text-2xl sm:text-3xl font-bold font-mono"
                style={{ color: project.color }}
              >
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-mono rounded-full bg-gray-800/50 text-gray-400 border border-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={project.href}
          className="inline-flex items-center gap-2 text-white hover:text-green-400 transition-colors duration-150"
        >
          <span className="font-medium">Read Case Study</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Visual card */}
      <div className="flex-1 w-full">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-card">
          <div
            className="absolute inset-0 opacity-20"
            style={{ background: `linear-gradient(135deg, ${project.color}40, transparent)` }}
          />

          <div className="absolute inset-4 rounded-lg bg-black/50 border border-gray-700/50 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700/50">
              <div className="w-2 h-2 rounded-full bg-red-500/60" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
              <div className="w-2 h-2 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs text-gray-500 font-mono">{project.id}</span>
            </div>

            <div className="p-4 font-mono text-xs space-y-1">
              {project.terminal.map((line, i) => (
                <div key={i} className={line.color}>{line.cmd}</div>
              ))}
            </div>
          </div>

          <div
            className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-[80px]"
            style={{ backgroundColor: project.color, opacity: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturedProjects() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section className="relative py-24 md:py-32 bg-background overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container px-4 relative z-10">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-green-400 font-mono text-sm mb-4 tracking-wider">
            {"<projects />"}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">Featured </span>
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Work
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Four things I&apos;ve owned end-to-end. What they are, what
            changed, and a few decisions worth flagging.
          </p>
        </motion.div>

        {/* Projects list */}
        <div className="max-w-6xl mx-auto space-y-32">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isReversed={index % 2 === 1}
            />
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-20">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 border border-gray-700 text-white rounded-xl hover:border-green-500/50 transition-colors duration-200"
          >
            <span>View All Projects</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
