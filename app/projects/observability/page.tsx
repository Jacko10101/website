"use client";

import { MetricsShowcase } from "@/components/metrics-showcase";
import { ObservabilityArchitecture } from "@/components/observability-architecture";
import {
  PHOSPHORS,
  CaseStudyLayout,
  CaseStudyHero,
  TechSidebar,
  CaseStudyCTA,
} from "@/components/case-study-layout";
import { PanelSection as CaseStudySection } from "@/components/case-section-variants";

/* --------------------------------------------------------------------------
 * This project was a build-or-buy decision, so the page ends as the artefact
 * that decision deserved: an ADR, consequences and reversal condition
 * included. The negative consequences are the point — an ADR that only lists
 * upsides is a sales page.
 * ----------------------------------------------------------------------- */
const DECISION: { field: string; tone?: "good" | "bad"; body: string }[] = [
  {
    field: "Status",
    body: "Accepted, 2024. Still in force at the time of writing, and reviewed below.",
  },
  {
    field: "Context",
    body: "Twenty microservices across four environments with no shared monitoring. Commercial quotes came back around £100k a year — for a company of our size, a second payroll line for something we already had the cluster capacity to run.",
  },
  {
    field: "Option A",
    body: "A commercial SaaS platform. Fastest to value, no operational burden, per-host and per-GB pricing that grows with exactly the thing you can't control: how much telemetry your developers decide to emit.",
  },
  {
    field: "Option B",
    body: "Self-host Prometheus, Thanos, Loki, Tempo and Grafana on the existing cluster. Slower to stand up, an operational surface we own, and near-flat cost as the data grows.",
  },
  {
    field: "Decision",
    body: "Option B, at roughly £5k a year all-in. The cluster capacity was already there, the team knew Kubernetes, and the gap between the two numbers was too wide to argue with.",
  },
  {
    field: "Consequence",
    tone: "good",
    body: "Cold data goes to object storage — Thanos for metrics, S3-backed Loki for logs — so we only pay premium prices for the recent data people actually query. That single choice is why the bill stayed flat while the data grew, and it's where most self-hosted stacks quietly get expensive.",
  },
  {
    field: "Consequence",
    tone: "bad",
    body: "It's mine to fix at 3am. There is nobody on the other end of a support contract, and the stack that tells you what's broken is itself a thing that can break — at the exact moment you'd most like it not to. That risk is real and it's the price of the number above.",
  },
  {
    field: "Revisit when",
    body: "The team is small enough that a day of my time is worth more than the difference, or the estate grows to where storage costs start tracking the SaaS quote. I'd make the opposite call at a three-person startup without hesitating.",
  },
];

function DecisionRecord() {
  return (
    <dl className="border-t border-border">
      {DECISION.map((d, i) => (
        <div
          key={`${d.field}-${i}`}
          className="grid sm:grid-cols-[8.5rem_1fr] gap-x-5 gap-y-1 py-4 border-b border-border"
        >
          <dt className="font-mono text-xs uppercase tracking-wider pt-1 text-muted-foreground">
            <span
              className={
                d.tone === "good"
                  ? "text-primary"
                  : d.tone === "bad"
                    ? "text-warn"
                    : undefined
              }
            >
              {d.field}
            </span>
            {d.tone && (
              <span aria-hidden className="ml-1.5">
                {d.tone === "good" ? "+" : "−"}
              </span>
            )}
          </dt>
          <dd className="text-sm text-muted-foreground leading-relaxed">{d.body}</dd>
        </div>
      ))}
    </dl>
  );
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Self-hosted observability stack",
  description:
    "Prometheus, Grafana, Loki and Alertmanager monitoring 20 services across four environments. Built in-house at a fraction of the commercial alternatives.",
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
  datePublished: "2024-09-01",
  dateModified: "2026-04-25",
  proficiencyLevel: "Expert",
  keywords: [
    "Observability",
    "Prometheus",
    "Grafana",
    "Loki",
    "Thanos",
    "Alertmanager",
    "Kubernetes",
  ],
};

export default function ObservabilityPage() {
  return (
    <CaseStudyLayout schema={articleSchema} phosphor={PHOSPHORS.orange}>
      <CaseStudyHero
        title="Observability stack"
        subtitle="Self-hosted monitoring"
        description="Prometheus, Grafana, Loki and Alertmanager monitoring 20 services across four environments. Built in-house, because the commercial quotes were a bit silly."
        date="2024 → 2025"
        metrics="20 services, 4 environments"
        command="cat case-studies/observability.md"
        phosphor={PHOSPHORS.orange.label}
      />

      <div className="container px-4">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
          <div className="space-y-12">
            <CaseStudySection eyebrow="// absent(up)" title="No dashboards, no logs, no alerts">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Twenty microservices on Kubernetes and not a Grafana panel between
                them. The first sign something was wrong was usually a customer
                noticing. The commercial quotes read like a second payroll, which
                wasn&apos;t happening.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                So I built it in-house. The stack is unsurprising: Prometheus
                and Thanos for metrics, Loki for logs, Alertmanager for paging,
                Grafana for everyone to actually look at.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Standard pieces. The interesting bit was wiring them so people
                could find what they needed while something was breaking.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// sum by (layer)" title="How it fits together">
              <ObservabilityArchitecture />

              <p className="text-muted-foreground mt-6 leading-relaxed">
                Prometheus scrapes everything and hands the long tail off to
                Thanos in S3, so we aren&apos;t paying hot-storage prices for data
                nobody queries.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Loki runs in microservices mode for the same reason. Logs are
                cheap to generate and expensive to keep. Alertmanager routes by
                environment: prod pages, dev gets a Teams message in business
                hours.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// topk(5, dashboard_views)" title="What people actually look at">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                I ended up with 22 dashboards, but most of the
                traffic goes to maybe five. The rest exist for the once-a-quarter
                question they answer perfectly. Three I&apos;m happy with:
              </p>

              <MetricsShowcase
                metrics={[
                  {
                    title: "IoT Gateway throughput",
                    description:
                      "Live request rate, connected devices, vendor-by-vendor performance. The first place anyone looks when an integration partner says something's broken.",
                    imagePath: "/dashboards/iot-gateway.png",
                    category: "Service",
                  },
                  {
                    title: "Kafka consumer lag",
                    description:
                      "Per-topic, per-group lag with sensible thresholds. Replaced about a dozen ad-hoc kafka-cli queries that used to live in someone's bash history.",
                    imagePath: "/dashboards/kafka-metrics.png",
                    category: "Data",
                  },
                  {
                    title: "Node infrastructure",
                    description:
                      "CPU, memory, disk, network. The boring one that nobody looks at until they need it, then it earns its keep.",
                    imagePath: "/dashboards/node-exporter.png",
                    category: "Infrastructure",
                  },
                ]}
              />
            </CaseStudySection>

            <CaseStudySection eyebrow={'// ALERTS{alertstate="firing"}'} title="Alerts that don&apos;t cry wolf">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every alert passes two tests. A human has to be able to do
                something about it, and the runbook has to exist before the rule
                ships.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The runbook isn&apos;t fancy: symptom, what to check, common
                fixes, who to escalate to. Just enough that the on-call engineer
                isn&apos;t starting from zero at 3am.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Routing is by environment more than severity. Prod fires
                straight to the on-call channel. Dev waits until business hours.
              </p>

              <div className="rounded-lg border border-border bg-black/40 font-mono text-[13px] overflow-hidden mb-5">
                <div className="px-5 py-2.5 border-b border-border text-xs text-muted-foreground">
                  alertmanager · routes, by environment
                </div>
                <div className="px-5 py-4 space-y-2">
                  <div className="flex flex-wrap gap-x-3">
                    <span className="text-error w-16 shrink-0">prod</span>
                    <span className="text-muted-foreground">→ on-call channel, immediately, any hour</span>
                  </div>
                  <div className="flex flex-wrap gap-x-3">
                    <span className="text-warn w-16 shrink-0">qa</span>
                    <span className="text-muted-foreground">→ Teams, 24/7 channel</span>
                  </div>
                  <div className="flex flex-wrap gap-x-3">
                    <span className="text-primary w-16 shrink-0">dev</span>
                    <span className="text-muted-foreground">→ Teams, business hours only</span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Inhibition rules kill the cascade of follow-on alerts when one
                root cause takes out a dozen things downstream. Without them, the
                first real incident would have trained everyone to ignore
                alerts.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// adr-001" title="Build or buy, written down">
              <p className="text-muted-foreground leading-relaxed mb-6">
                This was a decision before it was a stack, so here it is in the
                form it deserved at the time — including the consequences that
                went against it and the condition that would reverse it.
              </p>

              <DecisionRecord />
            </CaseStudySection>

            <CaseStudySection eyebrow="// range: 2024 → now" title="Two years on">
              <p className="text-muted-foreground leading-relaxed">
                The saving is what got it approved. The outcome I&apos;d
                actually show off is harder to put on a slide: an incident now
                starts with someone pasting a Grafana link, instead of asking
                whether it&apos;s just them. Nobody has thanked me for the
                dashboards. They&apos;d notice immediately if they went.
              </p>
            </CaseStudySection>
          </div>

          <TechSidebar
            technologies={[
              "Prometheus",
              "Grafana",
              "Loki",
              "Thanos",
              "Alertmanager",
              "Promtail",
              "Kubernetes",
              "Kustomize",
              "S3",
              "PromQL",
              "LogQL",
            ]}
            skills={[
              "Designing observability for a real team",
              "Running open-source stacks in production",
              "Cost-aware architecture",
              "Alert design and runbook authoring",
              "Dashboard design (and pruning)",
            ]}
            metrics={[
              { label: "Services covered", value: "20 across 4 environments" },
              { label: "Annual cost", value: "~£5k all-in" },
              { label: "Alerts", value: "50+, runbook per rule" },
              { label: "Dashboards", value: "22 active" },
            ]}
            relatedProjects={[
              { title: "Heimdall · deployment intelligence", href: "/projects/heimdall" },
              { title: "Pipeline Platform · shared CI/CD", href: "/projects/pipeline-platform" },
            ]}
          />
        </div>
      </div>

      <CaseStudyCTA line="The 3am question is the interesting one, and I'm happy to be asked it." />
    </CaseStudyLayout>
  );
}
