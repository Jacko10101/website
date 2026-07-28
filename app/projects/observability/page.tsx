"use client";

import { MetricsShowcase } from "@/components/metrics-showcase";
import { ObservabilityArchitecture } from "@/components/observability-architecture";
import {
  PHOSPHORS,
  CaseStudyLayout,
  CaseStudyHero,
  StatsGrid,
  TechSidebar,
  CaseStudyCTA,
} from "@/components/case-study-layout";
import { PanelSection as CaseStudySection } from "@/components/case-section-variants";
import { GlassCard } from "@/components/scroll-reveal";

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

            <CaseStudySection eyebrow="// # HELP" title="The calls I'd defend">
              <div className="space-y-5">
                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    Self-hosting was the right call here
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The gap between &quot;we run it&quot; and &quot;they run
                    it&quot; was too wide to ignore. The cluster capacity was
                    already there, the team knew Kubernetes, and the
                    operational overhead has stayed small. I&apos;d make the
                    opposite call at a 3-person startup, but at our scale, the
                    maths was obvious.
                  </p>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    Cheap storage, expensive compute
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Thanos for metrics, S3-backed Loki for logs. Both push the
                    cold data to object storage so we&apos;re only paying premium
                    prices for the recent stuff people actually query. This is
                    where most homegrown stacks get expensive. Getting it right
                    early kept the bill flat as the data grew.
                  </p>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    Dashboards as documentation
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A dashboard is the answer to a recurring question. If nobody&apos;s
                    asking it, the dashboard&apos;s clutter. I do an annual cull:
                    open the audit log, delete anything no one&apos;s viewed in a
                    quarter. Nobody has ever missed one.
                  </p>
                </GlassCard>
              </div>
            </CaseStudySection>

            <CaseStudySection eyebrow="// range: 2024 → now" title="The numbers">
              <StatsGrid
                stats={[
                  { value: "20", label: "services covered, every environment" },
                  { value: "4", label: "environments, one stack" },
                  { value: "50+", label: "alerts, every one with a runbook" },
                  { value: "22", label: "dashboards (I cull the rest annually)" },
                ]}
              />

              <p className="text-muted-foreground mt-6 leading-relaxed">
                The saving got it approved. The outcome I&apos;d actually show
                off is harder to put on a slide: incidents now start with
                someone pasting a Grafana link instead of asking &quot;is it
                just me?&quot;.
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
              { label: "Dashboards", value: "~25 active" },
            ]}
            relatedProjects={[
              { title: "Heimdall · deployment intelligence", href: "/projects/heimdall" },
              { title: "Pipeline Platform · shared CI/CD", href: "/projects/pipeline-platform" },
            ]}
          />
        </div>
      </div>

      <CaseStudyCTA line="If the first alert of the night is still a customer, we should talk." />
    </CaseStudyLayout>
  );
}
