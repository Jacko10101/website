"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, Calendar, Layers, TrendingUp, Home, Brain } from "lucide-react";
import {
  FadeUp,
  GradientOrb,
  GridPattern,
  GlassCard,
} from "@/components/scroll-reveal";

type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  stats: { value: string; label: string }[];
  tags: string[];
  href?: string;
  color: string;
  year: string;
  icon: React.ReactNode;
  status?: "live" | "planned";
};

const projects: Project[] = [
  {
    id: "heimdall",
    title: "Heimdall",
    subtitle: "Deployment intelligence platform",
    description:
      "The dashboard the platform team checks every morning. Answers one question — where is my ticket right now? — across 17 services and four environments.",
    longDescription:
      "An internal tool I designed and built end-to-end, now used daily by 20+ engineers. Replaces about five tabs and most of the kubectl-output-pasted-into-Slack ritual.",
    stats: [
      { value: "17", label: "services tracked" },
      { value: "20+", label: "engineers daily" },
      { value: "10 min", label: "data freshness" },
    ],
    tags: ["Python", "Flask", "TimescaleDB", "Prometheus", "ArgoCD", "Thanos"],
    href: "/projects/heimdall",
    color: "#f59e0b",
    year: "2025 → ongoing",
    icon: <TrendingUp className="w-6 h-6" />,
    status: "live",
  },
  {
    id: "pipeline-platform",
    title: "Pipeline Platform",
    subtitle: "Shared CI/CD library",
    description:
      "One Bitbucket pipeline library, imported by every Java and Node service. Tests live in their own repo. Promotion and reporting belong to ArgoCD.",
    longDescription:
      "Twenty drifted pipelines became one semver-tagged library. The bash reporter retired, tests moved out of the pipeline, and ArgoCD Image Updater took over promotion. ~400 deploys/month across 20 services.",
    stats: [
      { value: "20", label: "services, one library" },
      { value: "~400", label: "deploys/month" },
      { value: "1 file", label: "to onboard" },
    ],
    tags: ["Bitbucket Shared Pipelines", "ArgoCD", "Image Updater", "Kubernetes", "Kustomize"],
    href: "/projects/pipeline-platform",
    color: "#22c55e",
    year: "2023 → ongoing",
    icon: <Layers className="w-6 h-6" />,
    status: "live",
  },
  {
    id: "observability",
    title: "Observability Stack",
    subtitle: "Self-hosted monitoring",
    description:
      "Prometheus, Grafana and Loki for 20 services across four environments. Built it ourselves because the commercial quotes were ~£100k and we already had the cluster capacity.",
    longDescription:
      "Self-hosted metrics, logs and alerts on the platform. ~25 dashboards, 50+ alerts each with a runbook, ~£5k/yr all-in.",
    stats: [
      { value: "~£5k/yr", label: "vs ~£100k commercial" },
      { value: "~25", label: "dashboards" },
      { value: "50+", label: "alerts, runbook each" },
    ],
    tags: ["Prometheus", "Grafana", "Loki", "Thanos", "Alertmanager"],
    href: "/projects/observability",
    color: "#e6522c",
    year: "2024 → 2025",
    icon: <Calendar className="w-6 h-6" />,
    status: "live",
  },
  {
    id: "smart-home",
    title: "Smart Home on K3s",
    subtitle: "Self-hosted home automation",
    description:
      "Single-node K3s cluster on a Raspberry Pi 5 running Home Assistant, ArgoCD, Prometheus and Grafana. Twenty-plus lights, plugs and sensors monitored end-to-end. Zero ports exposed to the internet.",
    longDescription:
      "Every config change goes through git, every metric flows into Prometheus, every remote connection rides Tailscale. Same discipline as the platform at work, sized to a flat.",
    stats: [
      { value: "Single-node", label: "K3s control plane" },
      { value: "20+", label: "lights, plugs and sensors" },
      { value: "0", label: "ports exposed to the internet" },
    ],
    tags: ["K3s", "ArgoCD", "Home Assistant", "Zigbee2MQTT", "Prometheus", "Tailscale"],
    href: "/projects/smart-home",
    color: "#06b6d4",
    year: "2024 → ongoing",
    icon: <Home className="w-6 h-6" />,
    status: "live",
  },
  {
    id: "ml-scheduler",
    title: "Predictive Job Scheduling",
    subtitle: "MSc dissertation · in progress",
    description:
      "Deep learning models in PyTorch applied to compute resource allocation. The same scheduling problems I keep hitting on the platform side, framed as a research question.",
    longDescription:
      "Placeholder while the work is in flight. Submission August 2026. The plan: train models on historical job traces to predict resource needs and inform scheduler placement decisions, with the goal of reducing wasted GPU and CPU time on shared clusters.",
    stats: [
      { value: "Aug 2026", label: "submission" },
      { value: "PyTorch", label: "framework" },
      { value: "GPU", label: "scheduling focus" },
    ],
    tags: ["PyTorch", "Python", "Deep Learning", "Kubernetes Scheduler", "MLOps"],
    color: "#ec4899",
    year: "2026 → in progress",
    icon: <Brain className="w-6 h-6" />,
    status: "planned",
  },
];

// Hero section for projects page
function ProjectsHero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <motion.section
      style={{ opacity }}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <GridPattern opacity={0.03} />
      <GradientOrb className="-top-32 -right-32" color="green" size="xl" />
      <GradientOrb className="bottom-0 -left-32" color="cyan" size="lg" />

      <motion.div style={{ y }} className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block text-green-400 font-mono text-sm tracking-wider">
              {"<case-studies />"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6"
          >
            <span className="text-foreground">Featured </span>
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Work
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Four projects shipped end-to-end and one in flight. What they are,
            what changed, and a few decisions worth flagging.
          </motion.p>
        </div>
      </motion.div>
    </motion.section>
  );
}

// Individual project card with enhanced interactivity
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isPlanned = project.status === "planned";

  const cardInner = (
    <GlassCard className="p-0 overflow-hidden">
      <div className="flex flex-col lg:flex-row">
            {/* Visual side */}
            <div
              className="relative lg:w-2/5 aspect-[16/10] lg:aspect-auto lg:min-h-[400px] overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${project.color}15, ${project.color}05)` }}
            >
              {/* Background pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(${project.color}40 1px, transparent 1px),
                    linear-gradient(90deg, ${project.color}40 1px, transparent 1px)
                  `,
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Floating decoration */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="w-64 h-64 rounded-full opacity-20 blur-3xl"
                  style={{ backgroundColor: project.color }}
                />
              </motion.div>

              {/* Project number */}
              <div className="absolute top-6 left-6 z-10">
                <motion.span
                  className="text-8xl font-bold opacity-20 font-mono"
                  style={{ color: project.color }}
                  whileHover={{ scale: 1.1 }}
                >
                  0{index + 1}
                </motion.span>
              </div>

              {/* Icon */}
              <div className="absolute bottom-6 right-6 z-10">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${project.color}20`,
                    color: project.color,
                  }}
                >
                  {project.icon}
                </div>
              </div>

              {/* Year badge */}
              <div className="absolute top-6 right-6 z-10">
                <span
                  className="px-3 py-1 rounded-full text-xs font-mono border"
                  style={{
                    backgroundColor: `${project.color}10`,
                    borderColor: `${project.color}30`,
                    color: project.color,
                  }}
                >
                  {project.year}
                </span>
              </div>
            </div>

            {/* Content side */}
            <div className="flex-1 p-8 lg:p-10 flex flex-col">
              {/* Title */}
              <h2 className="text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h2>
              <p className="text-muted-foreground mb-4" style={{ color: project.color }}>
                {project.subtitle}
              </p>

              {/* Description */}
              <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                {project.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 py-6 border-y border-border">
                {project.stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div
                      className="text-2xl font-bold font-mono mb-1"
                      style={{ color: project.color }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground/70">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-mono rounded-lg bg-secondary/50 text-secondary-foreground border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              {isPlanned ? (
                <div
                  className="flex items-center gap-2 font-medium text-sm font-mono"
                  style={{ color: project.color }}
                >
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: project.color }} />
                  <span>Planned · write-up to follow</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-primary font-medium">
                  <span>Read Case Study</span>
                  <motion.div className="group-hover:translate-x-2 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              )}
            </div>
          </div>
    </GlassCard>
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      {isPlanned || !project.href ? (
        <div className="block">{cardInner}</div>
      ) : (
        <Link href={project.href} className="block group">
          {cardInner}
        </Link>
      )}
    </motion.div>
  );
}

// CTA section
function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <GridPattern opacity={0.03} />

      <div className="container px-4 relative z-10">
        <FadeUp className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-foreground">Want to </span>
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              chat?
            </span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            About a B2B engagement, an AI infrastructure problem, or anything
            that overlaps. I usually reply within a day.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all duration-300"
              >
                Say hello
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-green-500/50 text-green-400 font-semibold hover:bg-green-500/10 hover:border-green-400 transition-all duration-300"
              >
                More about me
              </Link>
            </motion.div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

export default function ProjectsPage() {
  return (
    <div className="bg-background dark:bg-black">
      <ProjectsHero />

      {/* Projects list */}
      <section className="pb-12 relative">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
