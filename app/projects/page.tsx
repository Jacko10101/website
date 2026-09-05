import type { Metadata } from "next";
import { projects, type Project } from "@/lib/projects";
import { SectionHeading } from "@/components/section-heading";
import { ContactCTA } from "@/components/contact-cta";
import { EstateMap } from "@/components/estate-map";
import { LitRow } from "@/components/lit-row";

/**
 * The index. The map at the top is the platform drawn once, with the five
 * Loweconex case studies as places on it; the rows beneath are every
 * document, in the order a platform team would read them. There used to be
 * seven cards here, each with a terminal pane of invented output beside
 * it; the panes were the one thing on the page a careful reader could
 * catch out.
 */
const ORDER = [
  "heimdall",
  "pipeline-platform",
  "observability",
  "ai-gateway",
  "clarity",
  "smart-home",
  "ml-scheduler",
];

const rows = ORDER.map((id) => projects.find((p) => p.id === id)).filter(
  (p): p is Project => Boolean(p?.href),
);

function Row({ project: p }: { project: Project }) {
  return (
    <LitRow
      href={p.href!}
      className="group grid gap-x-8 gap-y-3 border-t border-border py-7 last:border-b md:grid-cols-[170px_minmax(0,1fr)_auto]"
    >
      <div className="flex flex-col gap-1.5">
        <span className="eyebrow">{p.docType}</span>
        {p.startHere && (
          <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-warn">start here</span>
        )}
        <span className="font-mono text-xs text-muted-foreground/80">
          {p.year} · {p.statusLabel}
        </span>
      </div>

      <div className="min-w-0">
        <h2
          className="display text-2xl text-foreground transition-colors group-hover:text-primary"
          style={{ viewTransitionName: `title-${p.id}` }}
        >
          {p.title}
        </h2>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{p.subtitle}</p>
        {p.context && <p className="mt-1 font-mono text-[11px] text-primary/80">{p.context}</p>}
        {p.outcome && (
          <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">{p.outcome}</p>
        )}
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          {p.indexDescription ?? p.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
          {p.stats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-2">
              <span className="display text-lg text-primary">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <span className="whitespace-nowrap font-mono text-xs text-muted-foreground/80 transition-colors group-hover:text-primary">
        {p.docCta ?? "case study"} →
      </span>
    </LitRow>
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
            lede="Seven documents. Five are systems I built and run at Loweconex, a UK IoT platform business in Northern Ireland; the sixth is my flat, the seventh my dissertation. Each is written as the document it produced."
          />

          <EstateMap />

          <div className="mt-16">
            {rows.map((project) => (
              <Row key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </div>
  );
}

export const metadata: Metadata = {
  alternates: { canonical: "/projects" },
  title: "Projects",
  description:
    "Case studies: Heimdall, a shared CI/CD library, self-hosted observability, an LLM gateway, Clarity, a smart home on K3s, and an MSc dissertation on recovery scheduling in Kubernetes.",
  openGraph: {
    title: "Projects · Jack Devlin",
    description:
      "Seven case studies, each written as the document it produced: a day log, a merged PR, an ADR, an incident review, claims with receipts, a spec sheet and a paper.",
    url: "https://www.devlinops.com/projects",
  },
};
