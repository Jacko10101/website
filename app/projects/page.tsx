"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, Calendar, Layers, TrendingUp } from "lucide-react";
import {
  FadeUp,
  GradientOrb,
  GridPattern,
  GlassCard,
} from "@/components/scroll-reveal";

const projects = [
  {
    id: "dora-devex",
    title: "DORA Metrics Platform",
    subtitle: "Developer Experience & Business Intelligence",
    description:
      "Built comprehensive DevEx platform with DORA metrics collector, intelligent pipeline notifications, and automated deployment gates. Transformed engineering visibility from zero to complete deployment intelligence.",
    longDescription:
      "A multi-layered intelligence platform consisting of a Python metrics collector, a 1000+ line Bash pipeline reporter, and automated Jira-integrated deployment gates.",
    stats: [
      { value: "400+", label: "deploys tracked/month" },
      { value: "2-3 days", label: "lead time measured" },
      { value: "80%", label: "fewer status questions" },
    ],
    tags: ["Python", "Prometheus", "Grafana", "Jira API", "Teams", "Bash"],
    href: "/projects/dora-devex",
    color: "#f59e0b",
    year: "2025",
    icon: <TrendingUp className="w-6 h-6" />,
  },
  {
    id: "cicd-gitops",
    title: "CI/CD & GitOps Platform",
    subtitle: "Enterprise Pipeline Architecture",
    description:
      "Built production-grade CI/CD from greenfield to 400 deploys/month across 20 services. Implemented ArgoCD GitOps, enterprise security scanning, and PostSync hook test orchestration.",
    longDescription:
      "A 2-year evolution from basic build scripts to a sophisticated, production-ready CI/CD platform supporting 20 microservices with standardised deployment automation.",
    stats: [
      { value: "~5min", label: "build times" },
      { value: "400+", label: "deploys/month" },
      { value: "<1 day", label: "service onboarding" },
    ],
    tags: ["ArgoCD", "Kubernetes", "Bitbucket Pipelines", "Kustomize", "Veracode"],
    href: "/projects/cicd-gitops",
    color: "#22c55e",
    year: "2023-2025",
    icon: <Layers className="w-6 h-6" />,
  },
  {
    id: "observability",
    title: "Enterprise Observability",
    subtitle: "Self-Hosted Monitoring Stack",
    description:
      "Built production-grade observability with Prometheus, Grafana, and Loki. Achieved full-stack visibility for 20 services at 95%+ cost savings vs cloud solutions.",
    longDescription:
      "Complete self-hosted observability platform including metrics, logs, and alerting with 25+ dashboards and 50+ alert rules.",
    stats: [
      { value: "<$5K/yr", label: "vs $150K cloud" },
      { value: "25+", label: "dashboards" },
      { value: "70%", label: "MTTD reduction" },
    ],
    tags: ["Prometheus", "Grafana", "Loki", "Thanos", "Alertmanager"],
    href: "/projects/observability",
    color: "#e6522c",
    year: "2023-2025",
    icon: <Calendar className="w-6 h-6" />,
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
            Real projects with measurable impact. Each case study dives deep into
            the technical challenges, solutions, and business outcomes.
          </motion.p>
        </div>
      </motion.div>
    </motion.section>
  );
}

// Individual project card with enhanced interactivity
function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <Link href={project.href} className="block group">
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
              <div className="flex items-center gap-2 text-primary font-medium">
                <span>Read Case Study</span>
                <motion.div
                  className="group-hover:translate-x-2 transition-transform"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </div>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}

// Summary stats section
function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { value: "20", suffix: "+", label: "Microservices Managed" },
    { value: "400", suffix: "+", label: "Deploys per Month" },
    { value: "95", suffix: "%", label: "Cost Savings" },
    { value: "2", suffix: "", label: "Years of Evolution" },
  ];

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <GradientOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="green" size="xl" />

      <div className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold font-mono text-primary mb-2">
                    {stat.value}
                    <span className="text-primary/70">{stat.suffix}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
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
            <span className="text-foreground">Like What </span>
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              You See?
            </span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            I&apos;d love to bring this same level of platform engineering expertise
            to your team. Let&apos;s chat about what you&apos;re building.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all duration-300"
              >
                Get in Touch
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-green-500/50 text-green-400 font-semibold hover:bg-green-500/10 hover:border-green-400 transition-all duration-300"
              >
                Learn More About Me
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

      <StatsSection />
      <CTASection />
    </div>
  );
}
