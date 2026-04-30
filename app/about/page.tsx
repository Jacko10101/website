"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
  GradientOrb,
  GridPattern,
  GlassCard,
} from "@/components/scroll-reveal";

// Journey timeline data
const journey = [
  {
    year: "2023",
    title: "QA Engineer",
    description: "Graduated with a BSc in Computer Science. Jumped straight into a massive monolith → microservices migration, building the first CI/CD pipelines from scratch.",
    color: "#22c55e",
  },
  {
    year: "2024",
    title: "Platform Engineer",
    description: "Took ownership of the platform. Built observability from zero, implemented GitOps with ArgoCD, and designed deployment automation for 20+ services.",
    color: "#06b6d4",
  },
  {
    year: "2025",
    title: "Site Reliability Engineer",
    description: "Standardised the pipeline platform onto one shared library across every service. Started the deployment-metrics tooling that became Heimdall.",
    color: "#8b5cf6",
  },
  {
    year: "2026",
    title: "Platform & MLOps · MSc AI",
    description: "Pivoting toward AI infrastructure. Finishing an MSc in Artificial Intelligence (August 2026). Operating as an independent B2B contractor, focused on the gap between data science and production.",
    color: "#f59e0b",
  },
];

// Things I've come to believe after a few years on platform teams
const philosophy = [
  {
    title: "Build for the morning standup",
    description:
      "If a tool doesn't have a place to look, it doesn't get used. Most of my best work has been adding a UI to something that was already running headless.",
  },
  {
    title: "Boring is a compliment",
    description:
      "The ideal platform fades into the background. Engineers shouldn't have to think about it any more than they think about the office wifi.",
  },
  {
    title: "Operability is a feature",
    description:
      "If a teammate can't tell whether your service is healthy in under a minute, you haven't finished it yet. I default to one-curl health checks and a runbook.",
  },
  {
    title: "Ship the diff, not the rewrite",
    description:
      "Every project I'm proud of started as a small thing that quietly became load-bearing. Big-bang plans almost never survive contact with reality.",
  },
];

// Tech stack with categories
const techStack = [
  { category: "Orchestration", items: ["Kubernetes", "EKS", "ArgoCD", "Helm", "Kustomize"] },
  { category: "MLOps & AI", items: ["PyTorch", "MLflow", "KubeFlow", "NVIDIA GPU Operator", "Triton"] },
  { category: "Observability", items: ["Prometheus", "Grafana", "Loki", "Tempo", "Thanos"] },
  { category: "Cloud & IaC", items: ["AWS", "Terraform", "AWS CDK", "CloudFormation"] },
  { category: "Languages", items: ["Python", "Bash", "TypeScript", "Go"] },
  { category: "Security", items: ["Falco", "Veracode", "Istio", "OPA"] },
  { category: "Data", items: ["Kafka", "PostgreSQL", "TimescaleDB", "Redis"] },
];

// Hero section
function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity }}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background elements */}
      <GridPattern opacity={0.03} />
      <GradientOrb className="-top-32 -left-32" color="green" size="xl" />
      <GradientOrb className="-bottom-32 -right-32" color="cyan" size="lg" />

      <motion.div style={{ y }} className="container px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative flex-shrink-0"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500 via-cyan-500 to-purple-500 opacity-50 blur-xl animate-pulse" />
                <div className="absolute inset-[3px] rounded-2xl bg-background" />

                {/* Photo */}
                <div className="absolute inset-[6px] rounded-xl overflow-hidden">
                  <Image
                    src="/jack-photo.jpg"
                    alt="Jack Devlin"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Status badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-mono">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    B2B contracts · September 2026
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Intro text */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-4"
              >
                <span className="text-green-400 font-mono text-sm tracking-wider">
                  {"// about me"}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
              >
                Hey, I&apos;m{" "}
                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  Jack
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-muted-foreground mb-8 leading-relaxed"
              >
                Independent B2B contractor based in the UK. I sit between data
                science and production, and I build the platforms that get models
                and services off a laptop and onto a Kubernetes cluster that
                doesn&apos;t fall over. Day job: Heimdall, a deployment dashboard
                20+ engineers open every morning, a shared CI/CD library across
                20 services, and the observability stack underneath. Night job:
                MSc in Artificial Intelligence, finishing August 2026.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-3 justify-center lg:justify-start"
              >
                {["Platform Engineering", "MLOps", "Kubernetes", "AI Infrastructure", "Observability"].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="px-4 py-2 text-sm font-medium rounded-full bg-secondary text-secondary-foreground border border-border"
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs font-mono">scroll</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

// Timeline section
function JourneyTimeline() {
  return (
    <section className="relative py-24 overflow-hidden">
      <GradientOrb className="top-1/4 -right-64" color="purple" size="lg" />

      <div className="container px-4 relative z-10">
        <FadeUp className="text-center mb-16">
          <span className="inline-block text-green-400 font-mono text-sm mb-4 tracking-wider">
            {"<journey />"}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-foreground">The </span>
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Story
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From graduate QA to platform engineering. Here&apos;s how I got here.
          </p>
        </FadeUp>

        <div className="max-w-4xl mx-auto">
          <StaggerContainer className="relative">
            {/* Timeline line */}
            <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-green-500 via-cyan-500 to-purple-500 opacity-30" />

            {journey.map((item, index) => (
              <StaggerItem
                key={item.year}
                className={`relative flex items-start gap-8 mb-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Year badge */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center font-mono text-sm font-bold"
                    style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                      border: `2px solid ${item.color}`,
                    }}
                  >
                    {item.year}
                  </motion.div>
                </div>

                {/* Content */}
                <div className={`flex-1 ml-20 md:ml-0 ${index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                  <GlassCard className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </GlassCard>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

// Philosophy section
function PhilosophySection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <GridPattern opacity={0.02} />
      <GradientOrb className="-left-32 top-1/2" color="green" size="lg" />

      <div className="container px-4 relative z-10">
        <FadeUp className="text-center mb-16">
          <span className="inline-block text-green-400 font-mono text-sm mb-4 tracking-wider">
            {"<principles />"}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-foreground">How I </span>
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Work
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A few things I&apos;ve come to believe after a few years on platform teams.
          </p>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {philosophy.map((item, index) => (
            <StaggerItem key={item.title}>
              <GlassCard className="p-8 h-full group">
                {/* Number */}
                <div className="text-5xl font-bold text-green-500/20 mb-4 group-hover:text-green-500/40 transition-colors">
                  0{index + 1}
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// Tech stack section
function TechStackSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 overflow-hidden">
      <GradientOrb className="-right-32 top-0" color="cyan" size="lg" />
      <GradientOrb className="-left-32 bottom-0" color="purple" size="md" />

      <div className="container px-4 relative z-10">
        <FadeUp className="text-center mb-16">
          <span className="inline-block text-green-400 font-mono text-sm mb-4 tracking-wider">
            {"<stack />"}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-foreground">Tech </span>
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Stack
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            What I work with day to day.
          </p>
        </FadeUp>

        <div ref={ref} className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              >
                <GlassCard className="p-6 h-full">
                  <h3 className="text-sm font-mono text-green-400 mb-4">{category.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((tech, techIndex) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ delay: categoryIndex * 0.1 + techIndex * 0.05 + 0.2 }}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1.5 text-sm rounded-lg bg-secondary text-secondary-foreground border border-border hover:border-primary/30 transition-colors cursor-default"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Currently section
function CurrentlySection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <GlassCard className="p-8 md:p-12 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-3xl" />

              <div className="relative">
                <span className="inline-block text-amber-400 font-mono text-sm mb-4 tracking-wider">
                  {"<now />"}
                </span>

                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <span className="text-3xl">⚙️</span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Right now
                    </h3>
                    <p className="text-xl text-amber-400 font-medium mb-4">
                      Shipping Heimdall · Finishing the MSc · Lining up September 2026
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Wrapping up my current contract on the platform team I helped
                      build. Heimdall is still the centre of gravity — a deployment
                      intelligence dashboard used daily by 20+ engineers across 17
                      services.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Finishing an MSc in Artificial Intelligence in August 2026.
                      The dissertation looks at deep learning applied to compute
                      resource allocation — the same problem I keep running into on
                      the platform side, so the two halves are converging.
                    </p>
                    <p className="text-sm text-muted-foreground/60">
                      Available for fully remote B2B contracts (Outside IR35 or
                      international equivalent) starting September 2026. Platform
                      engineering, SRE, and MLOps / AI infrastructure work.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// CTA section
function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 overflow-hidden">
      <GridPattern opacity={0.03} />
      <GradientOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="green" size="xl" />

      <div ref={ref} className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-foreground">Still </span>
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              reading?
            </span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Drop me a note. About a B2B engagement, an AI infrastructure problem,
            or anything that overlaps with the work above.
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
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-green-500/50 text-green-400 font-semibold hover:bg-green-500/10 hover:border-green-400 transition-all duration-300"
              >
                See the projects
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Main page component
export default function AboutPage() {
  return (
    <div className="bg-background dark:bg-black">
      <AboutHero />
      <JourneyTimeline />
      <PhilosophySection />
      <TechStackSection />
      <CurrentlySection />
      <CTASection />
    </div>
  );
}
