"use client";

import { useRef, ReactNode } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, Calendar, Tag, ArrowRight } from "lucide-react";
import { ScrollProgress } from "@/components/scroll-progress";
import { GlassCard, FadeUp } from "@/components/scroll-reveal";
import { TerminalWindow } from "@/components/terminal-window";

// Case study hero section
export function CaseStudyHero({
  title,
  subtitle,
  description,
  date,
  metrics,
  command,
}: {
  title: string;
  subtitle: string;
  description: string;
  date: string;
  metrics: string;
  command: string;
}) {
  return (
    <header className="relative pt-28 pb-24 md:pt-32 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 grid-background pointer-events-none" aria-hidden />

      <div className="container px-4 relative z-10">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
        </motion.div>

        <div className="max-w-4xl">
          {/* Command line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-sm text-primary mb-4"
            aria-hidden
          >
            <span className="text-muted-foreground">$</span> {command}
          </motion.p>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-mono font-semibold tracking-tight text-4xl sm:text-5xl md:text-6xl text-foreground mb-4"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden />
            {subtitle}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-8 leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Meta info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-6 text-sm font-mono text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" aria-hidden />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" aria-hidden />
              <span>{metrics}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
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
            <span className="text-primary font-mono text-sm tracking-wider">{eyebrow}</span>
          )}
          {title && (
            <h2 className="font-mono font-semibold tracking-tight text-2xl sm:text-3xl text-foreground mt-2">
              {title}
            </h2>
          )}
        </div>
      )}
      {children}
    </motion.section>
  );
}

// Stats grid
export function StatsGrid({
  stats,
}: {
  stats: Array<{ value: string; label: string }>;
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
            <div className="text-4xl font-mono font-semibold tracking-tight text-primary mb-2">
              {stat.value}
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

// Code block with terminal chrome
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
    <TerminalWindow title={title ?? language}>
      <div className="p-4 font-mono text-xs overflow-x-auto">
        <pre className="text-muted-foreground whitespace-pre-wrap">{code}</pre>
      </div>
    </TerminalWindow>
  );
}

// Sidebar label — mono `$ `-prefixed
function SidebarLabel({ label }: { label: string }) {
  return (
    <h3 className="mb-4 font-mono font-semibold tracking-tight text-sm text-primary">
      <span className="text-muted-foreground">$</span> {label}
    </h3>
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
    <aside className="space-y-6 lg:sticky lg:top-24 self-start">
      {/* Technologies */}
      <FadeUp delay={0.1}>
        <GlassCard className="p-6">
          <SidebarLabel label="stack" />
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-sm font-mono rounded-md bg-secondary text-secondary-foreground border border-border hover:border-primary/30 transition-colors"
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
          <SidebarLabel label="skills" />
          <ul className="space-y-2 text-sm text-muted-foreground">
            {skills.map((skill) => (
              <li key={skill} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden />
                {skill}
              </li>
            ))}
          </ul>
        </GlassCard>
      </FadeUp>

      {/* Metrics */}
      <FadeUp delay={0.3}>
        <GlassCard className="p-6">
          <SidebarLabel label="metrics" />
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
          <SidebarLabel label="related" />
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

// CTA at end of case study
export function CaseStudyCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 grid-background pointer-events-none" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
        className="container px-4 relative z-10"
      >
        <GlassCard className="p-8 md:p-12 text-center max-w-3xl mx-auto">
          <h2 className="font-mono font-semibold tracking-tight text-3xl text-foreground mb-4">
            Thanks for reading.
          </h2>
          <p className="text-muted-foreground mb-8">
            If any of this resonates — or you want to dig into the parts I didn&apos;t
            write up — drop me a note. Always happy to talk shop.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md bg-primary text-primary-foreground font-mono font-semibold hover:bg-primary/90 transition-colors"
            >
              Say hello
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md border border-border text-foreground font-mono hover:border-primary/60 hover:text-primary transition-colors"
            >
              Other case studies
            </Link>
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
      <article className="bg-background min-h-screen">
        <ScrollProgress />
        {children}
      </article>
    </>
  );
}
