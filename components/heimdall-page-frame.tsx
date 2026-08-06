"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Heimdall-only page frame. The case study reads as a day on the platform
 * team, so the frame is a shift log: the header is the day starting, the
 * sidebar is the desk, and the closer is clocking off. Deliberately not the
 * shared CaseStudyHero / TechSidebar / CaseStudyCTA the other studies use.
 */

// The day starting: log preamble, clock, then the title under the rule —
// entry zero of the same anatomy DaySection gives every section below it.
// Kept tight so the interactive environments view lands in the first viewport.
export function DayLogHeader() {
  return (
    <header className="relative pt-24 pb-10 md:pt-28 md:pb-12 overflow-hidden">
      <div className="absolute inset-0 grid-background pointer-events-none" aria-hidden />

      <div className="container px-4 relative z-10">
        <div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
        </div>

        <div className="max-w-4xl">
          <p className="font-mono text-xs text-muted-foreground tracking-wider mb-4">
            day log · platform team · 2025 → ongoing
          </p>

          <div className="flex items-baseline gap-4 font-mono">
            <span className="text-3xl sm:text-4xl font-semibold text-primary glow-soft tabular-nums shrink-0">
              08:52
            </span>
            <span className="text-sm text-muted-foreground tracking-wider">
              first tab of the day
            </span>
          </div>

          <div className="border-t border-border/60 mt-3 pt-5">
            <h1 className="font-mono font-semibold tracking-tight text-4xl sm:text-5xl md:text-6xl text-foreground mb-3">
              Heimdall
            </h1>
            <p className="font-mono text-sm text-muted-foreground mb-4">
              Deployment intelligence platform
            </p>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Before standup, before email, the platform team opens the same page.
              It answers one question across 20 services and four environments:
              where is my ticket right now? Twenty-plus engineers ask it every
              morning. Today goes like this.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function DeskPanel({
  label,
  note,
  children,
}: {
  label: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border bg-card/50">
        <h3 className="font-mono text-xs tracking-wider text-primary">{label}</h3>
        {note && (
          <span className="font-mono text-[10px] text-muted-foreground">{note}</span>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// The desk: what's running, what the day needs, the dashboard's own vitals,
// and the other tabs open. Same facts TechSidebar carries elsewhere, worn
// as day-log furniture instead of `$ label` blocks.
export function DayLogSidebar({
  vitals,
  technologies,
  skills,
  related,
}: {
  vitals: Array<{ label: string; value: string }>;
  technologies: string[];
  skills: string[];
  related: Array<{ title: string; href: string }>;
}) {
  return (
    <aside className="space-y-5 lg:sticky lg:top-24 self-start">
      <DeskPanel
        label="vitals"
        note={
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden />
            live
          </span>
        }
      >
        <dl className="divide-y divide-border/60">
          {vitals.map((v) => (
            <div
              key={v.label}
              className="flex items-baseline justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
            >
              <dt className="font-mono text-xs text-muted-foreground shrink-0">
                {v.label}
              </dt>
              <dd className="text-sm text-foreground text-right">{v.value}</dd>
            </div>
          ))}
        </dl>
      </DeskPanel>

      <DeskPanel label="on the desk" note="stack">
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs font-mono rounded bg-secondary text-secondary-foreground border border-border hover:border-primary/30 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </DeskPanel>

      <DeskPanel label="what the day asks for" note="skills">
        <ul className="space-y-2 text-sm text-muted-foreground">
          {skills.map((skill) => (
            <li key={skill} className="flex gap-2.5">
              <span className="font-mono text-primary shrink-0" aria-hidden>
                –
              </span>
              {skill}
            </li>
          ))}
        </ul>
      </DeskPanel>

      <DeskPanel label="also open" note="related">
        <div className="space-y-3">
          {related.map((project) => (
            <Link
              key={project.href}
              href={project.href}
              className="flex items-center justify-between gap-3 text-sm font-medium hover:text-primary transition-colors group"
            >
              <span>{project.title}</span>
              <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </DeskPanel>
    </aside>
  );
}

// The day ending: one last entry after 17:40, closing the loop the header
// opened, then a quiet way out.
export function DayLogClose() {
  return (
    <div className="pt-4">
      <div className="flex items-baseline gap-4 mb-1 font-mono">
        <span className="text-2xl font-semibold text-primary glow-soft tabular-nums shrink-0">
          18:05
        </span>
        <span className="text-sm text-muted-foreground tracking-wider">clocking off</span>
      </div>
      <div className="border-t border-border/60 pt-5 mt-3">
        <p className="text-muted-foreground leading-relaxed">
          Last entry. The dashboard stays up overnight, and whoever is in first
          tomorrow will open the same tab and ask the same question.
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          If you want to dig into the parts I didn&apos;t write up,{" "}
          <Link
            href="/contact"
            className="text-primary hover:underline underline-offset-4"
          >
            say hello
          </Link>
          . Or head back to{" "}
          <Link
            href="/projects"
            className="text-primary hover:underline underline-offset-4"
          >
            all projects
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
