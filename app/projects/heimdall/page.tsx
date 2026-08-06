"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { HeimdallArchitecture } from "@/components/heimdall-architecture";
import { HeimdallDemo } from "@/components/heimdall-demo";
import { PHOSPHORS, CaseStudyLayout } from "@/components/case-study-layout";
import { DaySection as CaseStudySection } from "@/components/case-section-variants";
import {
  DayLogHeader,
  DayLogSidebar,
  DayLogClose,
} from "@/components/heimdall-page-frame";
import { TerminalWindow } from "@/components/terminal-window";

/* --------------------------------------------------------------------------
 * The source map. Heimdall is an aggregator, so the decision that matters is
 * which upstream it believes for each fact — and the one case where the
 * obvious source is confidently wrong.
 * ----------------------------------------------------------------------- */
const SOURCES: {
  system: string;
  reads: string;
  caveat?: string;
}[] = [
  {
    system: "Jira",
    reads: "The ticket, so the whole thing can be asked in a human's terms: where is PLAT-2044 right now?",
  },
  {
    system: "Bitbucket",
    reads: "PRs, merges and review state. This is where the bottleneck usually is, and it's the part people are least willing to guess at.",
  },
  {
    system: "ArgoCD",
    reads: "Sync status and the revision each environment is meant to be running.",
    caveat:
      "Not its health verdict. ArgoCD will happily report a service healthy while its new pods crashloop behind it — the exact moment you most need the truth.",
  },
  {
    system: "Kubernetes",
    reads: "Pod state, read directly. This is what health actually means here, and it's why Heimdall can disagree with ArgoCD.",
  },
  {
    system: "Test runs",
    reads: "Post-deploy verification, so 'deployed' and 'working' stay separate words.",
  },
];

function SourceMap() {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {SOURCES.map((s) => (
        <div
          key={s.system}
          className="grid sm:grid-cols-[8rem_1fr] gap-x-5 gap-y-1 px-5 py-4 border-b border-border last:border-b-0 odd:bg-card/20"
        >
          <span className="font-mono text-sm text-primary">{s.system}</span>
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.reads}</p>
            {s.caveat && (
              <p className="mt-2 text-sm text-warn/90 leading-relaxed border-l-2 border-warn/40 pl-3">
                {s.caveat}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Heimdall · Deployment Intelligence Platform",
  description:
    "An internal SRE dashboard answering 'where is my ticket right now?' across 20 services. Used daily by a 20+ person engineering team.",
  author: {
    "@type": "Person",
    name: "Jack Devlin",
    url: "https://devlinops.com",
  },
  publisher: {
    "@type": "Organization",
    name: "DevlinOps",
    url: "https://devlinops.com",
  },
  datePublished: "2025-06-01",
  dateModified: "2026-04-25",
  proficiencyLevel: "Expert",
  keywords: [
    "Heimdall",
    "Platform Engineering",
    "SRE",
    "DORA Metrics",
    "Python",
    "Flask",
    "TimescaleDB",
    "Kubernetes",
    "ArgoCD",
  ],
};

function Screenshot({
  src,
  alt,
  caption,
  label,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption: ReactNode;
  label: string;
  width: number;
  height: number;
}) {
  return (
    <TerminalWindow title={label}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto"
        sizes="(max-width: 1024px) 100vw, 800px"
      />
      <div className="px-5 py-4 border-t border-border bg-card/50 text-sm text-muted-foreground leading-relaxed">
        {caption}
      </div>
    </TerminalWindow>
  );
}

export default function HeimdallPage() {
  return (
    <CaseStudyLayout schema={articleSchema} phosphor={PHOSPHORS.green}>
      <DayLogHeader />

      <div className="container px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-5">
            <span className="font-mono text-sm text-primary">// 08:55 · try it first</span>
            <h2 className="mt-2 font-mono font-semibold tracking-tight text-2xl sm:text-3xl text-foreground">
              The environments view, live
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              The screenshots below are the real thing. This one you can poke at. Pick a
              ticket to trace it across the pipeline, toggle drift, or click any cell for the
              commit, pods and who shipped it. Mock data, real interaction model.
            </p>
          </div>
          <HeimdallDemo />
        </div>
      </div>

      <div className="container px-4">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
          <div className="space-y-12">
            <CaseStudySection eyebrow="// 08:57 · five tabs open" title="Five tabs, one question">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Across 20 services and a dev → QA → preprod → prod pipeline, the state
                of any given ticket is scattered. The commit&apos;s in Bitbucket. The
                desired state is in the GitOps repo. The pods are in Kubernetes. The
                test results are in the CI / test-report system. The ticket is in JIRA.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Heimdall started life as a small Python service that exposed DORA
                counters to Prometheus. Handy for leadership, but it didn&apos;t help
                anyone shipping a feature on a Tuesday afternoon. So I built a UI on
                top, and kept building until it was the first tab people opened.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                It&apos;s now used daily by the engineering team and runs the morning
                stand-up.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// 09:00 · standup, on one screen" title="A short tour">
              <p className="text-muted-foreground mb-6">
                Six pages. Each one answers a question someone&apos;s about to ask in Teams.
              </p>

              <div className="space-y-6">
                <Screenshot
                  label="dashboard"
                  src="/heimdall/dashboard.png"
                  width={2192}
                  height={1810}
                  alt="Heimdall dashboard with pipeline stages, last-24h deploys and 30-day rollup"
                  caption={
                    <>
                      The pipeline at the top: how many tickets are at each stage,
                      and how long each handover takes. Underneath, the last 24 hours
                      of deploys and a 30-day rollup. DORA metrics in a glance, no
                      Grafana detour required.
                    </>
                  }
                />

                <Screenshot
                  label="tickets"
                  src="/heimdall/tickets.png"
                  width={2258}
                  height={1786}
                  alt="Heimdall tickets view grouped by environment with stuck callouts"
                  caption={
                    <>
                      Every open ticket grouped by environment, stuck ones first. The
                      &quot;PRs ready&quot; card surfaces the PRs with approval and
                      green CI just waiting on a merge, usually two or three a day.
                    </>
                  }
                />

                <Screenshot
                  label="environments"
                  src="/heimdall/environments.png"
                  width={2222}
                  height={1774}
                  alt="Heimdall environments view with per-env activity and SHA matrix"
                  caption={
                    <>
                      Per-environment cards on top. The matrix below is one row per
                      service, one column per environment. A green cell means the env
                      is on the latest commit, red means it&apos;s drifted. This view
                      replaced about five recurring Teams threads.
                    </>
                  }
                />

                <Screenshot
                  label="environment detail"
                  src="/heimdall/environment-detail.png"
                  width={2172}
                  height={1784}
                  alt="Heimdall environment detail with promotion-ready services and per-service health"
                  caption={
                    <>
                      Drilldown for one environment. &quot;Ready to promote&quot;
                      lists the services where the next env can safely take the new
                      commit. Below that, per-service health, error rate, p95, and
                      pod resource pressure.
                    </>
                  }
                />

                <Screenshot
                  label="pull requests"
                  src="/heimdall/pull-requests.png"
                  width={2356}
                  height={1562}
                  alt="Heimdall pull request triage sorted ready, CI failing, needs review, stale"
                  caption={
                    <>
                      The same PRs Bitbucket has, but sorted by what unblocks shipping
                      rather than what&apos;s most recent. Ready first, then CI failing,
                      then needs review, then stale.
                    </>
                  }
                />

                <Screenshot
                  label="activity"
                  src="/heimdall/activity.png"
                  width={2316}
                  height={1764}
                  alt="Heimdall activity feed of deploys, syncs and promotions"
                  caption={
                    <>
                      A chronological feed of every deploy, sync, and promotion. The
                      first place you look during an incident, and a useful way to
                      open standup.
                    </>
                  }
                />
              </div>
            </CaseStudySection>

            <CaseStudySection eyebrow="// 12:30 · how it's wired" title="How it&apos;s built">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                One Python service. A background job pulls from the upstream sources
                every ten minutes and writes everything down: once into a database,
                once into an in-memory cache the web app reads from. The web app
                itself does no fetching, no joins, no slow work. Pages stay fast
                under load because the work happens elsewhere.
              </p>

              <HeimdallArchitecture />

              <p className="text-muted-foreground mt-6 leading-relaxed">
                The data model thinks of a deployment as a lifecycle, not an event:
                PR merged → tag updated → pods healthy → tests pass. A database view
                joins them all into one queryable thing, which is what powers the
                pages above.
              </p>
            </CaseStudySection>

            <CaseStudySection
              eyebrow="// 15:00 · five sources, one of them a liar"
              title="What it reads, and what it refuses to believe"
            >
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Heimdall&apos;s only real job is reconciling five systems that
                each hold one piece of the answer. Which means the interesting
                design work isn&apos;t what it reads — it&apos;s the one place
                where the obvious source is wrong.
              </p>

              <SourceMap />

              <p className="text-muted-foreground mt-6 leading-relaxed">
                Reading five systems means five things that can be down, so
                Heimdall has to be diagnosable by someone who has never seen its
                code. The README opens with &quot;is it healthy?&quot; and
                answers it in one curl: collection age, pool usage, every
                circuit breaker. That&apos;s the bar I try to hit whenever I
                hand something to a team — if the on-call engineer needs me,
                I&apos;ve not finished it.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// 17:40 · end of the day" title="What actually changed">
              <p className="text-muted-foreground leading-relaxed mb-4">
                The team stopped pasting kubectl output into Teams to ask
                whether a deploy had worked. Standup got shorter. Release
                management started using the same view as the engineers, so
                fewer tickets fell down the gap between them.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The thing I&apos;d tell anyone building an internal tool: the
                original DORA collector was a back-end service, it was correct,
                and nobody opened it. Same data, no front door, no users. The UI
                is what made the work count. Twenty-plus people open this one
                every morning, and that&apos;s the only metric I fully trust.
              </p>
            </CaseStudySection>

            <DayLogClose />
          </div>

          <DayLogSidebar
            vitals={[
              { label: "status", value: "Live, ongoing" },
              { label: "users", value: "20+ engineers, daily" },
              { label: "tracking", value: "20 services · 4 environments" },
              { label: "freshness", value: "Every 10 minutes" },
            ]}
            technologies={[
              "Python",
              "Flask",
              "TimescaleDB",
              "SQLAlchemy",
              "Tailwind",
              "Prometheus",
              "Thanos",
              "ArgoCD",
              "Kubernetes",
            ]}
            skills={[
              "Designing internal tools as products",
              "Backend + frontend, end to end",
              "Pragmatic concurrency",
              "Zero-downtime data migrations",
              "Operability and documentation",
            ]}
            related={[
              { title: "Pipeline Platform · shared CI/CD", href: "/projects/pipeline-platform" },
              { title: "Observability Stack", href: "/projects/observability" },
            ]}
          />
        </div>
      </div>
    </CaseStudyLayout>
  );
}
