"use client";

import { MetricsShowcase } from "@/components/metrics-showcase";
import { ObservabilityArchitecture } from "@/components/observability-architecture";
import {
  CaseStudyLayout,
  CaseStudyHero,
  CaseStudySection,
  StatsGrid,
  TechSidebar,
  CaseStudyCTA,
} from "@/components/case-study-layout";
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
    <CaseStudyLayout schema={articleSchema}>
      <CaseStudyHero
        title="Observability stack"
        subtitle="Self-hosted monitoring"
        description="Prometheus, Grafana, Loki and Alertmanager monitoring 20 services across four environments. Built in-house, because the commercial quotes were a bit silly."
        date="2024 → 2025"
        metrics="20 services, 4 environments"
        command="cat case-studies/observability.md"
      />

      <div className="container px-4">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
          <div className="space-y-12">
            <CaseStudySection eyebrow="// the setup" title="No dashboards, no logs, no alerts">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Twenty microservices on Kubernetes and not a Grafana panel between
                them. The first sign something was wrong was usually a customer
                noticing. Datadog quoted somewhere in the £100k/year range, which
                wasn&apos;t happening.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                So we built it ourselves. The stack is unsurprising: Prometheus and
                Thanos for metrics, Loki for logs, Alertmanager for paging, Grafana
                for everyone to actually look at. Standard pieces. The interesting
                bit was wiring them together so the people who needed them could
                actually find what they were after when something broke.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// architecture" title="How it fits together">
              <ObservabilityArchitecture />

              <p className="text-muted-foreground mt-6 leading-relaxed">
                Prometheus scrapes everything, hands the long tail off to Thanos in
                S3 so we&apos;re not paying for hot storage on data nobody queries.
                Loki runs in microservices mode for the same reason — logs are cheap
                to generate and expensive to store, so we lean on S3 and let the
                ingesters do the work. Alertmanager routes by environment: prod
                pages, dev gets a Teams message during business hours.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// dashboards" title="What people actually look at">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We ended up with a couple of dozen dashboards, but most of the
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

            <CaseStudySection eyebrow="// alerts" title="Alerts that don&apos;t cry wolf">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every alert has to pass two tests: a human has to be able to do
                something about it, and the runbook has to exist before the rule
                ships. The runbook isn&apos;t fancy — symptom, what to check, common
                fixes, who to escalate to. Just enough that the on-call engineer
                isn&apos;t starting from zero at 3am.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Routing is by environment more than by severity. Prod fires
                straight to the on-call channel. Dev waits until business hours.
                Inhibition rules suppress the cascade of follow-on alerts when one
                root cause takes out a dozen things downstream — without that, the
                first incident I would&apos;ve trained people to ignore alerts.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// design" title="A few decisions worth flagging">
              <div className="space-y-5">
                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    Self-hosting was the right call here
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The cost gap between &quot;we run it&quot; and &quot;they run
                    it&quot; was an order of magnitude. We had the cluster
                    capacity, we had Kubernetes expertise on the team, and the
                    operational overhead has been small. I&apos;d make the opposite
                    call at a 3-person startup — but at our scale, the maths was
                    obvious.
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
                    where most homegrown stacks get expensive — getting it right
                    early kept the bill flat as the data grew.
                  </p>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    Dashboards as documentation
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A dashboard is the answer to a recurring question. If nobody&apos;s
                    asking it, the dashboard&apos;s clutter. I do an annual cull —
                    open the audit log, delete anything no one&apos;s viewed in a
                    quarter. Engineering teams accumulate dashboards the way attics
                    accumulate boxes; both benefit from a periodic clear-out.
                  </p>
                </GlassCard>
              </div>
            </CaseStudySection>

            <CaseStudySection eyebrow="// impact" title="The numbers">
              <StatsGrid
                stats={[
                  { value: "20", label: "services covered, every environment" },
                  { value: "~£5k/yr", label: "running cost (vs ~£100k commercial)" },
                  { value: "50+", label: "alerts, every one with a runbook" },
                  { value: "~25", label: "dashboards (we cull the rest annually)" },
                ]}
              />

              <p className="text-muted-foreground mt-6 leading-relaxed">
                The cost saving is the headline, but the better outcome is harder
                to put on a slide: incidents now start with someone pasting a
                Grafana link instead of asking &quot;is it just me?&quot;. That&apos;s
                the bar I was aiming for.
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
              { title: "Heimdall — deployment intelligence", href: "/projects/heimdall" },
              { title: "Pipeline Platform — shared CI/CD", href: "/projects/pipeline-platform" },
            ]}
          />
        </div>
      </div>

      <CaseStudyCTA />
    </CaseStudyLayout>
  );
}
