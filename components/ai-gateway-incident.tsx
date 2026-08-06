"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

/* --------------------------------------------------------------------------
 * Incident-report frame for the AI Gateway case study. The page's genre is
 * a postmortem, so it opens with front matter, carries its appendices in
 * the sidebar, and closes with a sign-off — instead of the shared hero,
 * TechSidebar and CTA the other case studies use.
 * ----------------------------------------------------------------------- */

function FrontMatterField({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[6rem_1fr] gap-1 ${wide ? "sm:col-span-2" : ""}`}
    >
      <dt className="font-mono text-xs text-primary/90 pt-0.5">{label}</dt>
      <dd className="text-sm text-muted-foreground leading-relaxed">
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
            <span className="text-muted-foreground">
              · filed before the incident
            </span>
          </p>

          {/* Title */}
          <h1 className="font-mono font-semibold tracking-tight text-4xl sm:text-5xl text-foreground mb-3">
            AI Gateway
          </h1>

          {/* Subtitle */}
          <p className="font-mono text-sm text-muted-foreground mb-6">
            One endpoint for every model
          </p>

          {/* Front matter */}
          <div className="rounded-lg border border-border bg-card/40 overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 px-5 py-2.5 border-b border-border font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-primary" aria-hidden />
              <span className="text-primary font-semibold">front matter</span>
              <span className="text-muted-foreground">· ai-gateway</span>
            </div>
            <dl className="px-5 py-3.5 grid gap-x-10 gap-y-2.5 sm:grid-cols-2">
              <FrontMatterField label="status">
                <span className="inline-flex items-center gap-2 text-foreground/90">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                    aria-hidden
                  />
                  resolved · monitoring
                </span>
              </FrontMatterField>
              <FrontMatterField label="date">2026</FrontMatterField>
              <FrontMatterField label="scope">
                every AI workload, one endpoint
              </FrontMatterField>
              <FrontMatterField label="impact">
                none — caught at the third key
              </FrontMatterField>
              <FrontMatterField label="summary" wide>
                A self-hosted LLM gateway in front of every AI workload.
                Services hold a virtual key with an allowlist, not a provider
                key, and spend lands against the tenant that caused it.
              </FrontMatterField>
            </dl>
          </div>
        </div>
      </div>
    </header>
  );
}

/* --------------------------------------------------------------------------
 * Sidebar — the review's appendices. Same facts a TechSidebar would carry,
 * dressed as attachments to the document.
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

const FACTS: { label: string; value: string }[] = [
  { label: "consumers", value: "Every AI workload in the estate" },
  { label: "access model", value: "Virtual key + allowlist" },
  { label: "attribution", value: "Tenant, environment, feature" },
  { label: "model upgrades", value: "Config, not code" },
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
      <div className="rounded-lg border border-border bg-card/30 overflow-hidden">
        <div className="px-5 py-3 border-b border-border font-mono text-xs text-muted-foreground">
          appendices · attached to this review
        </div>

        <section className="px-5 py-4 border-b border-border">
          <AppendixLabel index="A" label="systems involved" />
          <p className="font-mono text-sm text-muted-foreground leading-relaxed">
            {SYSTEMS.map((system, i) => (
              <span key={system}>
                <span className="whitespace-nowrap">{system}</span>
                {i < SYSTEMS.length - 1 && (
                  <span className="mx-1.5 text-muted-foreground/40" aria-hidden>
                    ·
                  </span>
                )}
              </span>
            ))}
          </p>
        </section>

        <section className="px-5 py-4 border-b border-border">
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

        <section className="px-5 py-4 border-b border-border">
          <AppendixLabel index="C" label="facts on file" />
          <dl className="space-y-3 text-sm">
            {FACTS.map((fact) => (
              <div key={fact.label} className="grid grid-cols-[7rem_1fr] gap-1">
                <dt className="font-mono text-xs text-primary/90 pt-0.5">
                  {fact.label}
                </dt>
                <dd className="text-muted-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="px-5 py-4">
          <AppendixLabel index="D" label="linked reviews" />
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
      </div>
    </aside>
  );
}

/* --------------------------------------------------------------------------
 * Sign-off — the review closed out, with the one item still open on record.
 * ----------------------------------------------------------------------- */

export function IncidentSignoff() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 grid-background pointer-events-none" aria-hidden />

      <div className="container px-4 relative z-10">
        <div className="max-w-3xl mx-auto rounded-lg border border-border bg-card/40 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-primary" aria-hidden />
            <span className="text-primary font-semibold">review closed</span>
            <span className="text-muted-foreground">· ai-gateway · sign-off</span>
          </div>

          <div className="px-5 py-5 md:px-8 md:py-6">
            <dl className="space-y-3 text-sm mb-6">
              <div className="grid sm:grid-cols-[7rem_1fr] gap-1">
                <dt className="font-mono text-xs text-primary/90 pt-0.5">
                  reviewed by
                </dt>
                <dd className="text-muted-foreground">Jack Devlin</dd>
              </div>
              <div className="grid sm:grid-cols-[7rem_1fr] gap-1">
                <dt className="font-mono text-xs text-primary/90 pt-0.5">
                  status
                </dt>
                <dd className="text-muted-foreground">resolved · monitoring</dd>
              </div>
              <div className="grid sm:grid-cols-[7rem_1fr] gap-1">
                <dt className="font-mono text-xs text-primary/90 pt-0.5">
                  follow-up
                </dt>
                <dd className="text-muted-foreground">
                  Dashboard price constants still need checking against what
                  the provider actually charges.{" "}
                  <span className="ml-1 font-mono text-[10px] uppercase tracking-wider border rounded px-2 py-0.5 text-warn border-warn/50 align-middle">
                    open
                  </span>
                </dd>
              </div>
            </dl>

            <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-5">
              One action item is still open, and the pricing bug has a longer
              version. Happy to talk through either —{" "}
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
      </div>
    </section>
  );
}
