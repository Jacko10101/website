import type { Metadata } from "next";
import Link from "next/link";
import { projects, type Project } from "@/lib/projects";
import { TypedLines } from "@/components/terminal-window";
import { SectionHeading } from "@/components/section-heading";
import { ContactCTA } from "@/components/contact-cta";

// Each case study is a different document genre — postmortem, ADR, day log —
// and this badge is how the index says so before the click. It takes the
// accent colour; the k8s status pill below defers to it.
function DocTypeBadge({ project }: { project: Project }) {
  if (!project.docType) return null;
  const tone =
    project.status === "in-progress"
      ? "text-warn border-warn/50 bg-warn/10"
      : "text-primary border-primary/50 bg-primary/10";
  return (
    <span
      className={`font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-sm border whitespace-nowrap ${tone}`}
    >
      {project.docType}
    </span>
  );
}

// Deliberately muted: the genre badge owns the accent colour, this stays a
// quiet kubectl joke in the corner.
function StatusPill({ project }: { project: Project }) {
  return (
    <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-border/60 text-muted-foreground whitespace-nowrap">
      {project.statusLabel}
    </span>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const clickable = project.href !== null;

  const inner = (
    <>
      {/* Document stamp row: genre badge leads, status pill defers */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 md:px-8 pt-6">
        <span className="flex flex-wrap items-center gap-2">
          <DocTypeBadge project={project} />
          {project.startHere && (
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-sm border border-warn/50 bg-warn/10 text-warn whitespace-nowrap">
              start here
            </span>
          )}
        </span>
        <StatusPill project={project} />
      </div>

      {/* Title row */}
      <div className="flex items-baseline gap-3 px-6 md:px-8 mt-3">
        <h2
          className={`display text-2xl text-foreground ${
            clickable ? "group-hover:text-primary transition-colors" : ""
          }`}
        >
          {project.title}
        </h2>
        <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
      </div>

      <p className="px-6 md:px-8 mt-1 font-mono text-xs text-muted-foreground">
        {project.subtitle}
      </p>

      {project.context && (
        <p className="px-6 md:px-8 mt-1.5 font-mono text-[11px] text-primary/80">
          {project.context}
        </p>
      )}

      {/* Body, copy and stats on the left, terminal pane on the right */}
      <div className="grid lg:grid-cols-[1fr_minmax(0,360px)] gap-6 lg:gap-10 px-6 md:px-8 mt-5">
        <div className="flex flex-col">
          {/* Outcome first, then what it is. */}
          {project.outcome && (
            <p className="text-sm text-foreground/85 leading-relaxed mb-3">
              {project.outcome}
            </p>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {project.indexDescription ?? project.description}
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
          <TypedLines lines={project.terminal} animate={false} />
        </div>
      </div>

      {/* Footer affordance */}
      <div className="px-6 md:px-8 pb-6 mt-5">
        {clickable ? (
          <span className="inline-block font-mono text-xs text-primary group-hover:translate-x-1 transition-transform">
            {project.docCta ?? "case study"} →
          </span>
        ) : (
          <span className="font-mono text-xs text-muted-foreground">
            case study to follow
          </span>
        )}
      </div>
    </>
  );

  return (
    <div>
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
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <div className="bg-background">
      <section className="relative pt-28 md:pt-36 pb-16">
        <div className="container">
          <SectionHeading
            as="h1"
            title="Case studies"
            lede="Six projects and a dissertation. Everything except the smart home and the dissertation was built at Loweconex, a UK IoT platform business in Northern Ireland, where I've been since August 2023."
          />

          <div className="max-w-5xl space-y-8">
            {projects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Platform & MLOps case studies: Heimdall deployment intelligence, a shared CI/CD pipeline platform, self-hosted observability, and a smart home on K3s.",
  openGraph: {
    title: "Projects · Jack Devlin",
    description:
      "Platform & MLOps case studies: Heimdall, a shared CI/CD pipeline platform, self-hosted observability, and a smart home on K3s.",
    url: "https://devlinops.com/projects",
  },
};
