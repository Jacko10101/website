"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

/* --------------------------------------------------------------------------
 * Incident-report frame for the AI Gateway case study. The page's genre is
 * a postmortem, so it is set the way an incident review is set: front matter
 * as an aligned field table, body sections numbered as findings on the
 * trace rail, appendices as flat end-matter, and a sign-off with the open
 * item still on record. No card glow — report density, hairline rules, the
 * flat calm of a document written after the pager stopped.
 * ----------------------------------------------------------------------- */

/* One row of a report field table: aligned label column, hairline rule. */
function ReportField({
  label,
  children,
  muted = false,
}: {
  label: string;
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] sm:grid-cols-[9rem_1fr] gap-x-6 py-2.5 border-b border-border/60">
      <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground pt-0.5">
        {label}
      </dt>
      <dd
        className={`text-sm leading-relaxed ${muted ? "text-muted-foreground" : "text-foreground/85"}`}
      >
        {children}
      </dd>
    </div>
  );
}

export function IncidentHeader() {
  return (
    <header className="relative pt-24 pb-8 md:pt-24 md:pb-10 overflow-hidden">
      <div className="absolute inset-0 grid-background pointer-events-none" aria-hidden />

      <div className="container px-4 relative z-10">
        {/* Back link */}
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
          {/* Document class */}
          <p className="font-mono text-sm text-primary mb-3">
            incident review{" "}
            <span className="text-muted-foreground">· ai-gateway</span>
          </p>

          {/* Title */}
          <h1 className="font-mono font-semibold tracking-tight text-4xl sm:text-5xl text-foreground mb-3">
            AI Gateway
          </h1>

          {/* Subtitle */}
          <p className="font-mono text-sm text-muted-foreground mb-8">
            One endpoint for every model
          </p>

          {/* Front matter — the report's field table */}
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
            front matter <span className="normal-case">· ai-gateway</span>
          </p>
          <dl className="border-t border-border/60">
            <ReportField label="status">
              <span className="inline-flex items-center gap-2 text-foreground/90">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                  aria-hidden
                />
                resolved · monitoring
              </span>
            </ReportField>
            <ReportField label="date">2026</ReportField>
            <ReportField label="filed by">
              Jack Devlin, platform engineer · Loweconex, a UK IoT platform
              business
            </ReportField>
            <ReportField label="scope">
              every AI workload, one endpoint
            </ReportField>
            <ReportField label="impact">
              none — built while there were two consumers, not twelve
            </ReportField>
            <ReportField label="outcome">
              adding an AI feature is a config change now, not a new secret
              and a billing conversation — and spend lands against the tenant
              and feature that caused it
            </ReportField>
            <ReportField label="summary">
              A self-hosted LLM gateway in front of every AI workload. Services
              hold a virtual key with a model allowlist, not a provider key.
            </ReportField>
          </dl>
        </div>
      </div>
    </header>
  );
}

/* --------------------------------------------------------------------------
 * Body sections — findings on the trace rail. The span dot and rail stay
 * from the trace anatomy; the marker line numbers each section the way a
 * postmortem numbers its findings. Every section carries a marker: findings
 * are numbered, and the closing status names itself instead ("resolution"),
 * so the rail never runs unlabelled.
 * ----------------------------------------------------------------------- */

export function ReportSection({
  finding,
  marker,
  eyebrow,
  title,
  children,
  className = "",
}: {
  /** postmortem finding number; omit for non-finding sections */
  finding?: number;
  /** marker text for a section that isn't a numbered finding, e.g. "resolution" */
  marker?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const label = eyebrow?.replace(/^\/\/\s*/, "");
  const markerText = finding !== undefined ? `finding ${finding}` : marker;
  return (
    <section className={`mb-14 relative pl-8 ${className}`}>
      <span
        className="absolute left-[5px] top-6 bottom-0 w-px bg-border"
        aria-hidden
      />
      <span
        className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-2 border-primary bg-background glow-border"
        aria-hidden
      />
      {(markerText || label) && (
        <p className="mb-3 font-mono text-xs tracking-wider">
          {markerText && (
            <span className="text-primary font-semibold uppercase">
              {markerText}
            </span>
          )}
          {markerText && label && (
            <span className="mx-2 text-muted-foreground/50" aria-hidden>
              ·
            </span>
          )}
          {label && (
            <span
              className={
                markerText ? "text-muted-foreground" : "text-primary"
              }
            >
              {label}
            </span>
          )}
        </p>
      )}
      {title && (
        <h2 className="font-mono font-semibold tracking-tight text-2xl sm:text-3xl text-foreground mb-6">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

/* --------------------------------------------------------------------------
 * Sidebar — the review's appendices, set as flat end-matter. Same facts a
 * TechSidebar would carry, ruled like the rest of the report.
 * ----------------------------------------------------------------------- */

const SYSTEMS = [
  "LiteLLM",
  "Kubernetes",
  "ArgoCD",
  "Kustomize",
  "Gemini",
  "Prometheus",
  "Grafana",
  "AWS Secrets Manager",
  "Istio",
];

const WORK = [
  "LLM platform design",
  "Cost attribution for AI workloads",
  "Credential and access boundaries",
  "GitOps-managed shared services",
  "Writing the runbook people actually need",
];

const LINKED_REVIEWS = [
  { title: "Clarity · natural-language database interface", href: "/projects/clarity" },
  { title: "Pipeline Platform · shared CI/CD", href: "/projects/pipeline-platform" },
];

function AppendixLabel({ index, label }: { index: string; label: string }) {
  return (
    <h3 className="mb-3 font-mono text-xs tracking-wider">
      <span className="text-muted-foreground">appendix {index} ·</span>{" "}
      <span className="text-primary font-semibold">{label}</span>
    </h3>
  );
}

export function IncidentAppendices() {
  return (
    <aside className="lg:sticky lg:top-24 self-start">
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground pb-3 border-b border-border/60">
        appendices <span className="normal-case">· attached to this review</span>
      </p>

      <section className="py-5 border-b border-border/60">
        <AppendixLabel index="A" label="systems involved" />
        <p className="font-mono text-sm text-muted-foreground leading-relaxed">
          {SYSTEMS.map((system, i) => (
            <span key={system}>
              <span className="whitespace-nowrap">{system}</span>
              {i < SYSTEMS.length - 1 && (
                <span className="mx-1.5 text-muted-foreground/40" aria-hidden>
                  ·
                </span>
              )}{" "}
            </span>
          ))}
        </p>
      </section>

      <section className="py-5 border-b border-border/60">
        <AppendixLabel index="B" label="the work" />
        <ul className="space-y-2 text-sm text-muted-foreground">
          {WORK.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-primary shrink-0" aria-hidden>
                —
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="py-5 border-b border-border/60">
        <AppendixLabel index="C" label="linked reviews" />
        <div className="space-y-3">
          {LINKED_REVIEWS.map((review) => (
            <Link
              key={review.href}
              href={review.href}
              className="flex items-center justify-between gap-2 text-sm font-medium hover:text-primary transition-colors group"
            >
              <span>{review.title}</span>
              <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </section>
    </aside>
  );
}

/* --------------------------------------------------------------------------
 * Sign-off. Deliberately just the rule and a paragraph: status and the open
 * item are already on record above, and repeating them here made the page
 * end four times.
 * ----------------------------------------------------------------------- */

export function IncidentSignoff() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 grid-background pointer-events-none" aria-hidden />

      <div className="container px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-border/60 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-primary" aria-hidden />
            <span className="text-primary font-semibold">review closed</span>
            <span className="text-muted-foreground">· ai-gateway · sign-off</span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed pt-5">
            The pricing bug has a longer version than fits here, and so does
            the runbook. Happy to talk through either,{" "}
            <Link
              href="/contact"
              className="text-primary hover:underline underline-offset-4"
            >
              say hello
            </Link>
            . Or head back to the{" "}
            <Link
              href="/projects"
              className="text-primary hover:underline underline-offset-4"
            >
              other case studies
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
