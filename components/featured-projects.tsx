"use client";

import Link from "next/link";
import { featuredProjects, type Project } from "@/lib/projects";
import { SectionHeading } from "@/components/section-heading";

function StatusPill({ project }: { project: Project }) {
  const tone =
    project.status === "in-progress"
      ? "text-warn border-warn/50"
      : "text-primary border-primary/50";
  return (
    <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${tone}`}>
      {project.statusLabel}
    </span>
  );
}

function ProjectTile({ project }: { project: Project }) {
  return (
      <Link
        href={project.href!}
        className="group flex flex-col h-full rounded-lg border border-border bg-card/60 hover:border-primary/60 hover:-translate-y-1 hover:shadow-[0_12px_48px_oklch(0.72_0.19_150_/_0.12)] transition-all duration-300 overflow-hidden"
      >
        {/* Document stamp — each case study is a different genre */}
        {(project.docType || project.startHere) && (
          <div className="mx-6 mt-5 flex flex-wrap items-center gap-2">
            {project.docType && (
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded border border-primary/50 bg-primary/10 text-primary">
                {project.docType}
              </span>
            )}
            {project.startHere && (
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded border border-warn/50 bg-warn/10 text-warn">
                start here
              </span>
            )}
          </div>
        )}

        {/* Tile header, reads like a dashboard row */}
        <div className="flex items-center justify-between px-6 pt-3">
          <div className="flex items-baseline gap-3">
            <h3 className="font-mono font-semibold text-xl text-foreground group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
          </div>
          <StatusPill project={project} />
        </div>

        <p className="px-6 mt-1 font-mono text-xs text-muted-foreground">
          {project.subtitle}
        </p>

        {project.context && (
          <p className="px-6 mt-1.5 font-mono text-[11px] text-primary/80">
            {project.context}
          </p>
        )}

        {/* The skim line: what changed because this exists. The fuller
            description stays on /projects; a homepage tile gets one job. */}
        <p className="px-6 mt-4 text-sm text-foreground/85 leading-relaxed flex-1">
          {project.outcome ?? project.description}
        </p>

        {/* Stats row */}
        <div className="px-6 mt-5 grid grid-cols-3 gap-3 border-t border-border/60 pt-4">
          {project.stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-mono text-lg font-semibold text-primary">{stat.value}</div>
              <div className="text-[11px] text-muted-foreground leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* The terminal pane and the tag list live on /projects. Six panes
            typing at once read as six empty boxes, and duplicating the index
            here left "All projects" with nothing to offer. */}
        <div className="px-6 pt-4 pb-5 flex items-center justify-end">
          <span className="font-mono text-xs text-primary whitespace-nowrap group-hover:translate-x-1 transition-transform">
            {project.docCta ?? "case study"} →
          </span>
        </div>
      </Link>
  );
}

export function FeaturedProjects() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container">
        <SectionHeading
          title="Shipped and running"
          index="01"
          lede="Six things I built and still look after. All but the last were at Loweconex, a UK IoT platform business in Northern Ireland."
        />

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl">
          {featuredProjects.map((project) => (
            <ProjectTile key={project.id} project={project} />
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-primary hover:text-foreground transition-colors"
          >
            All seven in full, with the stack and the dissertation →
          </Link>
        </div>
      </div>
    </section>
  );
}
