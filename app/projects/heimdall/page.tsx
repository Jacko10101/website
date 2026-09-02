"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { HeimdallArchitecture } from "@/components/heimdall-architecture";
import { HeimdallDemo } from "@/components/heimdall-demo";
import { PHOSPHORS, CaseStudyLayout } from "@/components/case-study-layout";
import {
  DayLogHeader,
  DayLogSidebar,
  DayLogClose,
  LogEntry,
} from "@/components/heimdall-page-frame";
import { TerminalWindow } from "@/components/terminal-window";

/* --------------------------------------------------------------------------
 * A day on the platform team, set as the shift log itself: one rail runs down
 * the left margin and every section is an entry appended to it. Clock times
 * appear only on the entries that really are moments in a day (the morning
 * ones and the 17:40 close); the build and source-map entries sit on the same
 * rail without a time. The rail geometry lives in heimdall-page-frame.
 * ----------------------------------------------------------------------- */

/* --------------------------------------------------------------------------
 * The source map. Heimdall is an aggregator, so the decision that matters is
 * which upstream it believes for each fact, including the one case where the
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
      "Not its health verdict. ArgoCD will report a service healthy while its new pods crashloop behind it, so Heimdall checks the pods directly instead.",
  },
  {
    system: "Kubernetes",
    reads: "Pod state, read directly. This is what health actually means here, and it's why Heimdall can disagree with ArgoCD.",
  },
  {
    system: "Test runs",
    reads: "Post-deploy verification. Heimdall records whether the tests came back green after the new pods came up.",
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
    "An internal SRE dashboard answering 'where is my ticket right now?' across 20 services. Built solo at Loweconex and used every day by more than 20 engineers.",
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
      {/* 08:52 — the day starts; the rail opens here. */}
      <DayLogHeader />

      <div className="container px-4">
        <div className="max-w-7xl mx-auto pb-20 md:pb-24">
          {/* 08:55 — the instrument. Full width, still on the rail. */}
          <LogEntry
            time="08:55"
            label="try it first"
            title="The environments view, in your browser"
          >
            <figure>
              <figcaption className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-5">
                This is the environments view, rebuilt so you can use it. It opens
                on PLAT-2033, a change that reached QA and stopped there. Pick a
                different ticket to trace it across the pipeline, or click any cell
                for the commit, the pods and who shipped it.
              </figcaption>
              <HeimdallDemo />
            </figure>
          </LogEntry>

          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div>
              <LogEntry
                time="08:57"
                label="five tabs open"
                title="Five tabs, one question"
              >
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Across 20 services and a dev → QA → preprod → prod pipeline, the
                  state of any given ticket is spread across five systems. Bitbucket
                  holds the commit and the PR, JIRA holds the ticket, and Kubernetes
                  holds the pods that are actually running. In between sits the GitOps
                  repo, which holds the desired state: the commit each environment is
                  supposed to be on, which isn&apos;t always the one it&apos;s on.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Heimdall started as a small Python service that pushed the four DORA
                  metrics (deploy frequency, lead time, change failure rate, time to
                  restore) into Prometheus. The original collector was correct and
                  nobody ever opened it. Building the UI is what turned it into
                  something more than 20 engineers now use every day.
                </p>
              </LogEntry>

              <LogEntry
                time="09:00"
                label="standup, on one screen"
                title="A short tour"
              >
                <p className="text-muted-foreground mb-6">
                  Six pages; these three do most of the work.
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
                </div>

                <p className="text-muted-foreground leading-relaxed mt-6">
                  There&apos;s also a PR triage view sorted by what unblocks shipping
                  rather than what&apos;s most recent, and an activity feed of every
                  deploy, sync and promotion, which is the first place anyone looks
                  during an incident.
                </p>
              </LogEntry>

              <LogEntry label="architecture" title="How it's built">
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
              </LogEntry>

              <LogEntry
                label="source map"
                title="What it reads, and what it refuses to believe"
              >
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Heimdall&apos;s real job is reconciling five systems that each
                  hold one piece of the answer. The design decision that mattered
                  was which one to believe when they disagree.
                </p>

                <SourceMap />

                <p className="text-muted-foreground mt-6 leading-relaxed">
                  Reading five systems means five things that can be down, so
                  Heimdall has to be diagnosable by someone who has never seen
                  its code. The README opens with &quot;is it healthy?&quot;
                  and answers it in one curl: collection age, pool usage, every
                  circuit breaker.
                </p>
              </LogEntry>

              <LogEntry
                time="17:40"
                label="end of the day"
                title="What actually changed"
              >
                <p className="text-muted-foreground leading-relaxed">
                  The team stopped pasting kubectl output into Teams to ask
                  whether a deploy had worked. Standup got shorter. Release
                  management started using the same view as the engineers, so
                  fewer tickets fell down the gap between them.
                </p>
              </LogEntry>

              {/* 18:05 — the rail ends here. */}
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
              related={[
                { title: "Pipeline Platform · shared CI/CD", href: "/projects/pipeline-platform" },
                { title: "Observability Stack", href: "/projects/observability" },
              ]}
            />
          </div>
        </div>
      </div>
    </CaseStudyLayout>
  );
}
