"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

// Skill data with icons and descriptions
const skills = [
  {
    id: "kubernetes",
    title: "Kubernetes",
    subtitle: "& EKS",
    description: "Production-grade clusters, zero-downtime upgrades, cost optimisation",
    icon: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <path
          fill="currentColor"
          d="M16 2L4 8v16l12 6 12-6V8L16 2zm0 2.5l9.5 4.75v9.5L16 23.5l-9.5-4.75v-9.5L16 4.5zm0 3.5a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12z"
        />
      </svg>
    ),
    color: "#326ce5",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    id: "observability",
    title: "Observability",
    subtitle: "Stack",
    description: "Prometheus, Grafana, Loki, distributed tracing, alerting",
    icon: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <path
          fill="currentColor"
          d="M4 24h24v2H4v-2zm2-4h3v3H6v-3zm5-4h3v7h-3v-7zm5-6h3v13h-3V10zm5-4h3v17h-3V6z"
        />
      </svg>
    ),
    color: "#e6522c",
    gradient: "from-orange-500 to-amber-400",
  },
  {
    id: "gitops",
    title: "GitOps",
    subtitle: "& CI/CD",
    description: "ArgoCD, pipeline automation, deployment strategies, security scanning",
    icon: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <path
          fill="currentColor"
          d="M16 2a14 14 0 00-4.43 27.28c.7.13.96-.3.96-.68v-2.4c-3.89.85-4.71-1.88-4.71-1.88a3.7 3.7 0 00-1.55-2.05c-1.27-.86.1-.85.1-.85a2.94 2.94 0 012.14 1.44 2.98 2.98 0 004.08 1.16 3 3 0 01.88-1.87c-3.1-.35-6.36-1.55-6.36-6.9a5.4 5.4 0 011.44-3.75 5 5 0 01.14-3.7s1.17-.38 3.85 1.43a13.3 13.3 0 017 0c2.67-1.8 3.84-1.43 3.84-1.43a5 5 0 01.14 3.7 5.4 5.4 0 011.44 3.75c0 5.37-3.27 6.55-6.38 6.9a3.33 3.33 0 01.95 2.59v3.84c0 .46.25.81.97.68A14 14 0 0016 2z"
        />
      </svg>
    ),
    color: "#22c55e",
    gradient: "from-green-500 to-emerald-400",
  },
  {
    id: "security",
    title: "Security",
    subtitle: "Automation",
    description: "SAST/SCA integration, runtime security, policy-as-code",
    icon: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <path
          fill="currentColor"
          d="M16 2L4 7v9c0 7.73 5.11 14.26 12 16 6.89-1.74 12-8.27 12-16V7L16 2zm0 2.18l10 4.09v7.73c0 6.51-4.23 12-10 13.77-5.77-1.77-10-7.26-10-13.77V8.27l10-4.09zM16 10v8h6a8 8 0 01-6 6v-6h-6a8 8 0 016-8z"
        />
      </svg>
    ),
    color: "#8b5cf6",
    gradient: "from-purple-500 to-violet-400",
  },
  {
    id: "service-mesh",
    title: "Service",
    subtitle: "Mesh",
    description: "Istio, traffic management, mTLS, observability integration",
    icon: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <circle cx="6" cy="16" r="3" fill="currentColor" />
        <circle cx="16" cy="6" r="3" fill="currentColor" />
        <circle cx="26" cy="16" r="3" fill="currentColor" />
        <circle cx="16" cy="26" r="3" fill="currentColor" />
        <circle cx="16" cy="16" r="4" fill="currentColor" />
        <path
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          d="M9 16h4M19 16h4M16 9v4M16 19v4M9 9l4 4M19 9l-4 4M9 23l4-4M19 23l-4-4"
        />
      </svg>
    ),
    color: "#06b6d4",
    gradient: "from-cyan-500 to-teal-400",
  },
  {
    id: "data",
    title: "Data",
    subtitle: "Platforms",
    description: "Kafka, stream processing, data migrations, monitoring",
    icon: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <ellipse cx="16" cy="8" rx="10" ry="4" fill="currentColor" />
        <path
          fill="currentColor"
          d="M6 10v4c0 2.21 4.48 4 10 4s10-1.79 10-4v-4c-2.5 1.5-6 2.5-10 2.5S8.5 11.5 6 10z"
        />
        <path
          fill="currentColor"
          d="M6 16v4c0 2.21 4.48 4 10 4s10-1.79 10-4v-4c-2.5 1.5-6 2.5-10 2.5S8.5 17.5 6 16z"
        />
        <path
          fill="currentColor"
          d="M6 22v4c0 2.21 4.48 4 10 4s10-1.79 10-4v-4c-2.5 1.5-6 2.5-10 2.5S8.5 23.5 6 22z"
        />
      </svg>
    ),
    color: "#f59e0b",
    gradient: "from-amber-500 to-yellow-400",
  },
];

// Individual skill item with hover effects
function SkillItem({
  skill,
  index
}: {
  skill: typeof skills[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500 overflow-hidden">
        {/* Background glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at center, ${skill.color}15, transparent 70%)`,
          }}
        />

        {/* Icon with animated background */}
        <div className="relative mb-6">
          <motion.div
            className="w-16 h-16 relative"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Icon glow */}
            <div
              className="absolute inset-0 rounded-xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity"
              style={{ backgroundColor: skill.color }}
            />
            {/* Icon container */}
            <div
              className="relative w-full h-full rounded-xl p-3 transition-all duration-300"
              style={{
                backgroundColor: `${skill.color}20`,
                color: skill.color,
              }}
            >
              {skill.icon}
            </div>
          </motion.div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-foreground mb-1 transition-colors duration-300 group-hover:text-primary">
          {skill.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 font-medium">{skill.subtitle}</p>

        {/* Description */}
        <p className="text-muted-foreground/70 text-sm leading-relaxed group-hover:text-muted-foreground transition-colors">
          {skill.description}
        </p>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 rounded-full"
          style={{ backgroundColor: skill.color }}
          initial={{ width: "0%" }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}

// Animated section title
function SectionTitle() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      {/* Eyebrow */}
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-block text-green-400 font-mono text-sm mb-4 tracking-wider"
      >
        {"<expertise />"}
      </motion.span>

      {/* Main title */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
        <span className="text-foreground">What I </span>
        <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
          Build
        </span>
      </h2>

      {/* Subtitle */}
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
        The platform engineering challenges that keep your team from shipping fast.
        I tackle them so you don&apos;t have to.
      </p>
    </motion.div>
  );
}

// Main component
export function WhatIDo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={containerRef}
      className="relative py-24 md:py-32 bg-background dark:bg-black overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-green-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
      </motion.div>

      <div className="container px-4 relative z-10">
        <SectionTitle />

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {skills.map((skill, index) => (
            <SkillItem key={skill.id} skill={skill} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 mb-6">
            Want to see these skills in action?
          </p>
          <a
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/30 text-green-400 rounded-xl hover:border-green-400 hover:bg-green-500/20 transition-all duration-300 group"
          >
            <span>View Case Studies</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
