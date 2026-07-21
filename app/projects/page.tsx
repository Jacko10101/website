"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { projects, type Project } from "@/lib/projects";
import { TypedLines } from "@/components/terminal-window";
import { SectionHeading } from "@/components/section-heading";
import { ContactCTA } from "@/components/contact-cta";

function StatusPill({ project }: { project: Project }) {
  const tone =
    project.status === "in-progress"
      ? "text-warn border-warn/50"
      : "text-primary border-primary/50";
  return (
    <span className={`font-mono text-[10px] px-2 py-0.5 rounded border whitespace-nowrap ${tone}`}>
      {project.statusLabel}
    </span>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const clickable = project.href !== null;

  const inner = (
    <>
      {/* Header row — reads like a dashboard entry */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 md:px-8 pt-6">
        <div className="flex items-baseline gap-3">
          <h2
            className={`font-mono font-semibold tracking-tight text-2xl text-foreground ${
              clickable ? "group-hover:text-primary transition-colors" : ""
            }`}
          >
            {project.title}
          </h2>
          <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
        </div>
        <StatusPill project={project} />
      </div>

      <p className="px-6 md:px-8 mt-1 font-mono text-xs text-muted-foreground">
        {project.subtitle}
      </p>

      {project.context && (
        <p className="px-6 md:px-8 mt-1.5 font-mono text-[11px] text-primary/80">
          {project.context}
        </p>
      )}

      {/* Body — copy and stats on the left, terminal pane on the right */}
      <div className="grid lg:grid-cols-[1fr_minmax(0,360px)] gap-6 lg:gap-10 px-6 md:px-8 mt-5">
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {project.description}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border/60 pt-5">
            {project.stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-mono text-lg font-semibold text-primary">
                  {stat.value}
                </div>
                <div className="text-[11px] text-muted-foreground leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] font-mono rounded bg-secondary text-muted-foreground border border-border/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-border/60 bg-black/50 p-4 self-start lg:self-stretch">
          <TypedLines lines={project.terminal} />
        </div>
      </div>

      {/* Footer affordance */}
      <div className="px-6 md:px-8 pb-6 mt-5">
        {clickable ? (
          <span className="inline-block font-mono text-xs text-primary group-hover:translate-x-1 transition-transform">
            case study →
          </span>
        ) : (
          <span className="font-mono text-xs text-muted-foreground">
            write-up to follow with the dissertation
          </span>
        )}
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index === 0 ? 0.1 : 0 }}
    >
      {clickable ? (
        <Link
          href={project.href!}
          className="group flex flex-col rounded-lg border border-border bg-card/60 hover:border-primary/60 transition-colors overflow-hidden"
        >
          {inner}
        </Link>
      ) : (
        <div className="flex flex-col rounded-lg border border-border bg-card/60 overflow-hidden">
          {inner}
        </div>
      )}
    </motion.div>
  );
}

export default function ProjectsPage() {
  return (
    <div className="bg-background">
      <section className="relative pt-28 md:pt-36 pb-16">
        <div className="container">
          <SectionHeading
            as="h1"
            command="kubectl get projects --all-namespaces"
            title="Case studies"
            lede="Four projects shipped end-to-end and one in flight. What they are, what changed, and a few decisions worth flagging."
          />

          <div className="max-w-5xl space-y-8">
            {projects.map((project, index) => (
              <ProjectRow key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      <ContactCTA command="say-hello" />
    </div>
  );
}
