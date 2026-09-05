import Link from "next/link";
import { LitRow } from "@/components/lit-row";
import { projects } from "@/lib/projects";
import { SectionHeading } from "@/components/section-heading";

/**
 * The case studies as an index, not a grid.
 *
 * Six identical cards with three stat tiles each was the one place the
 * homepage read as a template. A row per document, in the order a platform
 * team would read them: the dashboard they'd open, the pipeline underneath,
 * the monitoring, then the AI layer on top.
 */
const ORDER = ["heimdall", "pipeline-platform", "observability", "ai-gateway", "clarity"];

const rows = ORDER.map((id) => projects.find((p) => p.id === id)).filter(
  (p): p is NonNullable<typeof p> => Boolean(p?.href),
);
const paper = projects.find((p) => p.id === "ml-scheduler");
const flat = projects.find((p) => p.id === "smart-home");

/** The first sentence of the outcome: one hook per row, the rest on the page. */
function hook(text: string) {
  return text.split(/(?<=\.)\s+/)[0];
}

export function CaseIndex() {
  return (
    <section className="py-24 md:py-28">
      <div className="container">
        <SectionHeading
          label="case studies"
          title="Shipped and running"
          lede="Five systems I built and run at Loweconex, a UK IoT platform business in Northern Ireland. Each is written up as the document it produced."
        />

        <div>
          {rows.map((p) => (
            <LitRow
              key={p.id}
              href={p.href!}
              className="group grid gap-x-6 gap-y-1.5 border-t border-border py-5 last:border-b md:grid-cols-[170px_220px_minmax(0,1fr)_auto] md:items-baseline"
            >
              <span className="eyebrow">{p.docType}</span>
              <span
                className="display text-xl text-foreground transition-colors group-hover:text-primary"
                style={{ viewTransitionName: `title-${p.id}` }}
              >
                {p.title}
                {p.startHere && (
                  <span className="ml-2 align-middle font-mono text-[9.5px] uppercase tracking-[0.14em] text-warn">
                    start here
                  </span>
                )}
              </span>
              <span className="text-[15px] leading-relaxed text-muted-foreground">
                {hook(p.outcome ?? p.description)}
              </span>
              <span className="whitespace-nowrap font-mono text-xs text-muted-foreground/80 transition-colors group-hover:text-primary">
                {p.docCta ?? "case study"} →
              </span>
            </LitRow>
          ))}
        </div>

        <p className="mt-5 font-mono text-xs text-muted-foreground/80">
          Also:{" "}
          {paper?.href && (
            <Link href={paper.href} className="border-b border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              the dissertation, as a paper →
            </Link>
          )}
          {paper?.href && flat?.href && " and "}
          {flat?.href && (
            <Link href={flat.href} className="border-b border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              the flat, as a spec sheet →
            </Link>
          )}
        </p>
      </div>
    </section>
  );
}
