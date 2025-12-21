"use client";

import { useRef, ReactNode } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowLeft, Calendar, Tag, Clock, ArrowRight } from "lucide-react";
import { ScrollProgress } from "@/components/scroll-progress";
import { GradientOrb, GridPattern, GlassCard, FadeUp, StaggerContainer, StaggerItem } from "@/components/scroll-reveal";

// Case study hero section
export function CaseStudyHero({
  title,
  subtitle,
  description,
  date,
  metrics,
  color = "#22c55e",
}: {
  title: string;
  subtitle: string;
  description: string;
  date: string;
  metrics: string;
  color?: string;
}) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 120]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <motion.header
      style={{ opacity }}
      className="relative pt-8 pb-24 md:pt-12 md:pb-32 overflow-hidden"
    >
      <GridPattern opacity={0.02} />
      <GradientOrb className="-top-32 -right-32" color="green" size="xl" />
      <GradientOrb className="bottom-0 -left-64" color="cyan" size="lg" />

      <motion.div style={{ y }} className="container px-4 relative z-10">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
        </motion.div>

        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono border"
              style={{
                backgroundColor: `${color}10`,
                borderColor: `${color}30`,
                color: color,
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: color }}
              />
              {subtitle}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            <span className="text-foreground">{title.split(" ").slice(0, -1).join(" ")} </span>
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              {title.split(" ").slice(-1)}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-8 leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Meta info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" style={{ color }} />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" style={{ color }} />
              <span>{metrics}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.header>
  );
}

// Section wrapper with animation
export function CaseStudySection({
  children,
  title,
  eyebrow,
  className = "",
}: {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6 }}
      className={`mb-16 ${className}`}
    >
      {(eyebrow || title) && (
        <div className="mb-6">
          {eyebrow && (
            <span className="text-green-400 font-mono text-sm tracking-wider">{eyebrow}</span>
          )}
          {title && <h2 className="text-3xl font-bold text-foreground mt-2">{title}</h2>}
        </div>
      )}
      {children}
    </motion.section>
  );
}

// Challenge/Problem box
export function ChallengeBox({
  children,
  callout,
}: {
  children: ReactNode;
  callout?: { type: "warning" | "info"; text: string };
}) {
  return (
    <GlassCard className="p-8">
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        {children}
      </div>
      {callout && (
        <div
          className={`mt-6 rounded-lg p-4 border ${
            callout.type === "warning"
              ? "bg-destructive/10 border-destructive/30"
              : "bg-primary/10 border-primary/30"
          }`}
        >
          <p
            className={`text-sm ${
              callout.type === "warning" ? "text-destructive" : "text-primary"
            }`}
          >
            <strong>{callout.type === "warning" ? "Business Impact:" : "Key Insight:"}</strong>{" "}
            {callout.text}
          </p>
        </div>
      )}
    </GlassCard>
  );
}

// Stats grid
export function StatsGrid({
  stats,
  color = "#22c55e",
}: {
  stats: Array<{ value: string; label: string }>;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <GlassCard className="p-6 text-center">
            <div
              className="text-4xl font-bold font-mono mb-2"
              style={{ color }}
            >
              {stat.value}
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

// Phase/Timeline card
export function PhaseCard({
  phase,
  title,
  children,
  color = "#22c55e",
  highlight,
}: {
  phase: string;
  title: string;
  children: ReactNode;
  color?: string;
  highlight?: string;
}) {
  return (
    <GlassCard className="p-6 group">
      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
        <span style={{ color }}>{phase}:</span>
        <span className="text-foreground group-hover:text-primary transition-colors">{title}</span>
      </h3>
      <div className="space-y-3 text-sm text-muted-foreground">{children}</div>
      {highlight && (
        <div
          className="mt-4 rounded-lg p-3 border"
          style={{
            backgroundColor: `${color}10`,
            borderColor: `${color}30`,
          }}
        >
          <p className="text-xs" style={{ color }}>
            <strong>Key Achievement:</strong> {highlight}
          </p>
        </div>
      )}
    </GlassCard>
  );
}

// Code block with enhanced styling
export function EnhancedCodeBlock({
  title,
  code,
  language = "bash",
}: {
  title?: string;
  code: string;
  language?: string;
}) {
  return (
    <GlassCard className="overflow-hidden">
      {title && (
        <div className="px-4 py-3 border-b border-border bg-secondary/30">
          <span className="text-sm font-mono text-muted-foreground">{title}</span>
        </div>
      )}
      <div className="p-4 font-mono text-xs overflow-x-auto">
        <pre className="text-muted-foreground whitespace-pre-wrap">{code}</pre>
      </div>
    </GlassCard>
  );
}

// Technologies sidebar
export function TechSidebar({
  technologies,
  skills,
  metrics,
  relatedProjects,
}: {
  technologies: string[];
  skills: string[];
  metrics: Array<{ label: string; value: string }>;
  relatedProjects: Array<{ title: string; href: string }>;
}) {
  return (
    <aside className="space-y-6">
      {/* Technologies */}
      <FadeUp delay={0.1}>
        <GlassCard className="p-6">
          <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <span className="text-green-400 font-mono text-sm">{"<tech />"}</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm rounded-lg bg-secondary text-secondary-foreground border border-border hover:border-primary/30 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </GlassCard>
      </FadeUp>

      {/* Skills */}
      <FadeUp delay={0.2}>
        <GlassCard className="p-6">
          <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <span className="text-green-400 font-mono text-sm">{"<skills />"}</span>
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {skills.map((skill) => (
              <li key={skill} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {skill}
              </li>
            ))}
          </ul>
        </GlassCard>
      </FadeUp>

      {/* Metrics */}
      <FadeUp delay={0.3}>
        <GlassCard className="p-6">
          <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <span className="text-green-400 font-mono text-sm">{"<metrics />"}</span>
          </h3>
          <div className="space-y-3 text-sm">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <div className="font-semibold text-foreground">{metric.label}</div>
                <div className="text-muted-foreground">{metric.value}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </FadeUp>

      {/* Related */}
      <FadeUp delay={0.4}>
        <GlassCard className="p-6">
          <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <span className="text-green-400 font-mono text-sm">{"<related />"}</span>
          </h3>
          <div className="space-y-3">
            {relatedProjects.map((project) => (
              <Link
                key={project.href}
                href={project.href}
                className="flex items-center justify-between text-sm font-medium hover:text-primary transition-colors group"
              >
                <span>{project.title}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </GlassCard>
      </FadeUp>
    </aside>
  );
}

// Lesson item
export function LessonItem({
  children,
  highlight,
}: {
  children: ReactNode;
  highlight?: string;
}) {
  return (
    <li className="flex gap-3 text-muted-foreground">
      <span className="text-primary font-bold flex-shrink-0">→</span>
      <span>
        {highlight && <strong className="text-foreground">{highlight}:</strong>}{" "}
        {children}
      </span>
    </li>
  );
}

// CTA at end of case study
export function CaseStudyCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 relative overflow-hidden">
      <GradientOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="green" size="lg" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
        className="container px-4 relative z-10"
      >
        <GlassCard className="p-8 md:p-12 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-foreground">Want Similar </span>
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Results?
            </span>
          </h2>
          <p className="text-muted-foreground mb-8">
            I&apos;d love to bring this same approach to your platform engineering challenges.
            Let&apos;s discuss how I can help your team.
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
                href="/projects"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-green-500/50 text-green-400 font-semibold hover:bg-green-500/10 hover:border-green-400 transition-all duration-300"
              >
                View More Projects
              </Link>
            </motion.div>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
}

// Main layout wrapper
export function CaseStudyLayout({
  children,
  schema,
}: {
  children: ReactNode;
  schema?: object;
}) {
  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <article className="bg-background dark:bg-black min-h-screen">
        <ScrollProgress />
        {children}
      </article>
    </>
  );
}
