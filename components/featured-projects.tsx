"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { featuredProjects, type Project } from "@/lib/projects";
import { TypedLines } from "@/components/terminal-window";
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

function ProjectTile({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
    >
      <Link
        href={project.href!}
        className="group flex flex-col h-full rounded-lg border border-border bg-card/60 hover:border-primary/60 hover:-translate-y-1 hover:shadow-[0_12px_48px_oklch(0.72_0.19_150_/_0.12)] transition-all duration-300 overflow-hidden"
      >
        {/* Tile header — reads like a dashboard row */}
        <div className="flex items-center justify-between px-6 pt-5">
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

        <p className="px-6 mt-4 text-sm text-muted-foreground leading-relaxed flex-1">
          {project.description}
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

        {/* Terminal pane */}
        <div className="mx-6 my-5 rounded-md border border-border/60 bg-black/50 p-4">
          <TypedLines lines={project.terminal} />
        </div>

        {/* Tags + link */}
        <div className="px-6 pb-5 flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] font-mono rounded bg-secondary text-muted-foreground border border-border/60"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="font-mono text-xs text-primary whitespace-nowrap group-hover:translate-x-1 transition-transform">
            case study →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function FeaturedProjects() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container">
        <SectionHeading
          command="kubectl get projects"
          title="Shipped and running"
          index="03"
          lede="Four things I've owned end-to-end. What they are, what changed, and a few decisions worth flagging."
        />

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl">
          {featuredProjects.map((project, index) => (
            <ProjectTile key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-primary hover:text-foreground transition-colors"
          >
            kubectl get projects --all-namespaces →
          </Link>
        </div>
      </div>
    </section>
  );
}
