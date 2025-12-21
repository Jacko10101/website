"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const projects = [
  {
    id: "dora-devex",
    title: "DORA Metrics Platform",
    subtitle: "Developer Experience & Business Intelligence",
    description:
      "Built comprehensive DevEx platform with DORA metrics collector, intelligent pipeline notifications, and automated deployment gates. Transformed engineering visibility from zero to complete deployment intelligence.",
    stats: [
      { value: "400+", label: "deploys tracked/month" },
      { value: "2-3 days", label: "lead time measured" },
      { value: "80%", label: "fewer status questions" },
    ],
    tags: ["Python", "Prometheus", "Grafana", "Jira API", "Teams"],
    href: "/projects/dora-devex",
    color: "#f59e0b",
    terminal: [
      { cmd: "$ dora-metrics status", color: "text-gray-500" },
      { cmd: "Deployment Frequency: 400+/month", color: "text-green-400" },
      { cmd: "Lead Time: 2.3 days avg", color: "text-cyan-400" },
      { cmd: "Change Failure Rate: 2.1%", color: "text-amber-400" },
    ],
  },
  {
    id: "cicd-gitops",
    title: "CI/CD & GitOps Platform",
    subtitle: "Enterprise Pipeline Architecture",
    description:
      "Built production-grade CI/CD from greenfield to 400 deploys/month across 20 services. Implemented ArgoCD GitOps, enterprise security scanning, and a 1100-line test orchestrator.",
    stats: [
      { value: "~5min", label: "build times" },
      { value: "400+", label: "deploys/month" },
      { value: "<1 day", label: "service onboarding" },
    ],
    tags: ["ArgoCD", "Kubernetes", "Bitbucket Pipelines", "Kustomize", "Veracode"],
    href: "/projects/cicd-gitops",
    color: "#22c55e",
    terminal: [
      { cmd: "$ argocd app list", color: "text-gray-500" },
      { cmd: "20 apps synced", color: "text-green-400" },
      { cmd: "0 pending", color: "text-green-400" },
      { cmd: "142 pods running", color: "text-cyan-400" },
    ],
  },
  {
    id: "observability",
    title: "Enterprise Observability",
    subtitle: "Self-Hosted Monitoring Stack",
    description:
      "Built production-grade observability with Prometheus, Grafana, and Loki. Achieved full-stack visibility for 20 services at 95%+ cost savings vs cloud solutions.",
    stats: [
      { value: "<$5K/yr", label: "vs $150K cloud" },
      { value: "25+", label: "dashboards" },
      { value: "70%", label: "MTTD reduction" },
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
            Real projects, real impact. Here&apos;s where I got to build something cool
            and make a measurable difference.
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
