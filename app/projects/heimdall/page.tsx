"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { HeimdallArchitecture } from "@/components/heimdall-architecture";
import { HeimdallDemo } from "@/components/heimdall-demo";
import {
  CaseStudyLayout,
  CaseStudyHero,
  CaseStudySection,
  StatsGrid,
  TechSidebar,
  CaseStudyCTA,
} from "@/components/case-study-layout";
import { GlassCard, FadeUp } from "@/components/scroll-reveal";
import { TerminalWindow } from "@/components/terminal-window";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Heimdall — Deployment Intelligence Platform",
  description:
    "An internal SRE dashboard answering 'where is my ticket right now?' across a couple dozen services. Used daily by a 20+ person engineering team.",
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
    <FadeUp>
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
    </FadeUp>
  );
}

export default function HeimdallPage() {
  return (
    <CaseStudyLayout schema={articleSchema}>
      <CaseStudyHero
        title="Heimdall"
        subtitle="Deployment intelligence platform"
        description="The dashboard the platform team checks every morning. Answers one question — 'where is my ticket right now?' — across a couple dozen services and four environments."
        date="2025 → ongoing"
        metrics="20+ engineers, daily"
        command="cat case-studies/heimdall.md"
      />

      <div className="container px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="mb-5">
              <span className="font-mono text-sm text-primary">// try it</span>
              <h2 className="mt-2 font-mono font-semibold tracking-tight text-2xl sm:text-3xl text-foreground">
                The environments view, live
              </h2>
              <p className="mt-2 text-muted-foreground max-w-2xl">
                The screenshots below are the real thing. This one you can poke at — pick a
                ticket to trace it across the pipeline, toggle drift, or click any cell for the
                commit, pods and who shipped it. Mock data, real interaction model.
              </p>
            </div>
            <HeimdallDemo />
          </FadeUp>
        </div>
      </div>

      <div className="container px-4">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
          <div className="space-y-12">
            <CaseStudySection eyebrow="// the problem" title="Five tabs, one question">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Across a couple dozen services and a dev → QA → preprod → prod pipeline, the state
                of any given ticket is scattered. The commit&apos;s in Bitbucket. The
                desired state is in the GitOps repo. The pods are in Kubernetes. The
                test results are in the CI / test-report system. The ticket is in JIRA.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Heimdall started life as a small Python service that exposed DORA
                counters to Prometheus — handy for leadership, but it didn&apos;t help
                anyone shipping a feature on a Tuesday afternoon. So I built a UI on
                top, and kept building until it was the first tab people opened.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                It&apos;s now used daily by the engineering team and runs the morning
                stand-up.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// the product" title="A short tour">
              <p className="text-muted-foreground mb-6">
                Six pages. Each one answers a question someone&apos;s about to ask in Slack.
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
                      The pipeline at the top — how many tickets are at each stage,
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
                      green CI just waiting on a merge — usually two or three a day.
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
                      service, one column per environment — a green cell means the env
                      is on the latest commit, red means it&apos;s drifted. This view
                      replaced about five recurring Slack threads.
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

            <CaseStudySection eyebrow="// architecture" title="How it&apos;s built">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                One Python service. A background job pulls from the upstream sources
                every ten minutes and writes everything down — once into a database,
                once into an in-memory cache the web app reads from. The web app
                itself does no fetching, no joins, no slow work. That&apos;s the whole
                trick. Pages stay fast under load because the work happens elsewhere.
              </p>

              <HeimdallArchitecture />

              <p className="text-muted-foreground mt-6 leading-relaxed">
                The data model thinks of a deployment as a lifecycle, not an event:
                PR merged → tag updated → pods healthy → tests pass. A database view
                joins them all into one queryable thing, which is what powers the
                pages above.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// design" title="A few decisions worth flagging">
              <div className="space-y-5">
                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    Treat it as a product, not a script
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The original DORA collector was a back-end service. Useful, but
                    nobody opened it. The lesson I keep coming back to: if a tool
                    doesn&apos;t have a place to look, it doesn&apos;t get used. The UI
                    is what made the work matter.
                  </p>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    Trust pods, not abstractions
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    ArgoCD will happily report a service as healthy while its new pods
                    are crashlooping behind the scenes. Heimdall reads pod state
                    directly, which means the dashboard stays honest in the cases
                    that matter most.
                  </p>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    Make it operable
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The README opens with &quot;is it healthy?&quot; and answers it
                    in one curl. Anyone on-call can diagnose Heimdall without reading
                    the code. That&apos;s the bar I aim for whenever I hand work to a
                    team.
                  </p>
                </GlassCard>
              </div>
            </CaseStudySection>

            <CaseStudySection eyebrow="// impact" title="What changed">
              <StatsGrid
                stats={[
                  { value: "~2 dozen", label: "services tracked" },
                  { value: "20+", label: "engineers using it daily" },
                  { value: "10 min", label: "data freshness" },
                  { value: "1 curl", label: "to know if it's healthy" },
                ]}
              />

              <p className="text-muted-foreground mt-6 leading-relaxed">
                The numbers I care about most aren&apos;t in the table. The team stopped
                pasting kubectl output into Slack to ask if a deploy worked.
                Standup got shorter. Release management started using the same view
                as the engineers, which meant fewer dropped tickets at the seams. I&apos;m
                still finding things to improve.
              </p>
            </CaseStudySection>
          </div>

          <TechSidebar
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
            metrics={[
              { label: "Status", value: "Live, ongoing" },
              { label: "Users", value: "20+ engineers, daily" },
              { label: "Services tracked", value: "A couple dozen, across 4 environments" },
              { label: "Data freshness", value: "Every 10 minutes" },
            ]}
            relatedProjects={[
              { title: "Pipeline Platform — shared CI/CD", href: "/projects/pipeline-platform" },
              { title: "Observability Stack", href: "/projects/observability" },
            ]}
          />
        </div>
      </div>

      <CaseStudyCTA />
    </CaseStudyLayout>
  );
}
