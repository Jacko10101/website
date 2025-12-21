"use client";

import { MetricsShowcase } from "@/components/metrics-showcase";
import { ObservabilityArchitecture } from "@/components/observability-architecture";
import {
  CaseStudyLayout,
  CaseStudyHero,
  CaseStudySection,
  ChallengeBox,
  StatsGrid,
  EnhancedCodeBlock,
  TechSidebar,
  LessonItem,
  CaseStudyCTA,
} from "@/components/case-study-layout";
import { GlassCard, FadeUp, StaggerContainer, StaggerItem } from "@/components/scroll-reveal";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Enterprise Observability Stack",
  description:
    "Building production-grade, self-hosted observability with Prometheus, Grafana, and Loki—achieving full-stack visibility at a fraction of cloud costs",
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
  datePublished: "2025-01-01",
  dateModified: "2025-01-01",
  proficiencyLevel: "Expert",
  keywords: [
    "Observability",
    "Prometheus",
    "Grafana",
    "Loki",
    "Thanos",
    "Alertmanager",
    "Kubernetes",
    "Monitoring",
  ],
  dependencies:
    "Prometheus, Grafana, Loki, Thanos, Alertmanager, Promtail, Kubernetes, Kustomize",
};

export default function ObservabilityPage() {
  return (
    <CaseStudyLayout schema={articleSchema}>
      <CaseStudyHero
        title="Enterprise Observability Stack"
        subtitle="Self-Hosted Monitoring Platform"
        description="Building production-grade, self-hosted observability with Prometheus, Grafana, and Loki—achieving full-stack visibility at a fraction of cloud costs"
        date="2024-2025"
        metrics="20+ Services • 4 Environments"
        color="#e6522c"
      />

      <div className="container px-4">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
          {/* Main content */}
          <div className="space-y-12">
            {/* Challenge */}
            <CaseStudySection eyebrow="// the challenge" title="The Challenge">
              <ChallengeBox
                callout={{
                  type: "warning",
                  text: "Cloud observability solutions (Datadog, New Relic, Splunk) would cost $50K-150K/year for our scale—prohibitively expensive for the budget",
                }}
              >
                <p>
                  The platform had{" "}
                  <strong className="text-foreground">zero observability</strong> across 20
                  microservices running on Kubernetes. Critical operational questions remained
                  unanswered:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                  <li>&quot;Which service is causing the 500 errors?&quot;</li>
                  <li>&quot;Why did the pod restart 5 times in the last hour?&quot;</li>
                  <li>&quot;What&apos;s our Kafka consumer lag right now?&quot;</li>
                  <li>&quot;Are we hitting CPU/memory limits?&quot;</li>
                  <li>&quot;Where are the logs for that failed deployment?&quot;</li>
                </ul>
                <p className="mt-4">
                  <strong className="text-foreground">The mandate:</strong> Build enterprise-grade
                  observability in-house at minimal cost while maintaining production reliability
                </p>
              </ChallengeBox>
            </CaseStudySection>

            {/* Solution Overview */}
            <CaseStudySection
              eyebrow="// the solution"
              title="The Solution: Self-Hosted Observability Platform"
            >
              <p className="text-muted-foreground mb-6">
                I architected and deployed a{" "}
                <strong className="text-foreground">complete self-hosted observability stack</strong>{" "}
                using open-source tooling, achieving enterprise-grade monitoring at &lt;5% of cloud
                costs.
              </p>

              <StaggerContainer className="grid gap-4 md:grid-cols-3">
                <StaggerItem>
                  <GlassCard className="p-6 h-full border-orange-500/30">
                    <div className="text-orange-400 font-mono text-sm mb-2">Metrics</div>
                    <h3 className="font-semibold text-foreground mb-2">Prometheus + Thanos</h3>
                    <p className="text-xs text-muted-foreground">
                      Time-series metrics with S3 long-term storage
                    </p>
                  </GlassCard>
                </StaggerItem>
                <StaggerItem>
                  <GlassCard className="p-6 h-full border-orange-500/30">
                    <div className="text-orange-400 font-mono text-sm mb-2">Visualisation</div>
                    <h3 className="font-semibold text-foreground mb-2">Grafana</h3>
                    <p className="text-xs text-muted-foreground">25+ custom dashboards</p>
                  </GlassCard>
                </StaggerItem>
                <StaggerItem>
                  <GlassCard className="p-6 h-full border-orange-500/30">
                    <div className="text-orange-400 font-mono text-sm mb-2">Logs</div>
                    <h3 className="font-semibold text-foreground mb-2">Loki + Promtail</h3>
                    <p className="text-xs text-muted-foreground">Microservices mode with S3</p>
                  </GlassCard>
                </StaggerItem>
              </StaggerContainer>
            </CaseStudySection>

            {/* Architecture */}
            <CaseStudySection eyebrow="// architecture" title="Architecture">
              <ObservabilityArchitecture />
            </CaseStudySection>

            {/* Stack Components */}
            <CaseStudySection eyebrow="// implementation" title="Core Stack Components">
              <div className="space-y-4">
                <GlassCard className="p-6">
                  <h4 className="font-semibold mb-3 text-orange-400">1. Prometheus (Metrics Collection)</h4>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      <strong className="text-foreground">Configuration:</strong> Kustomize base +
                      environment overlays (dev, qa, preprod, prod)
                    </p>
                    <p>
                      <strong className="text-foreground">Service Discovery:</strong> Kubernetes SD
                      for automatic service detection
                    </p>
                    <p>
                      <strong className="text-foreground">Long-term Storage:</strong> Thanos sidecar
                      → S3 for historical data
                    </p>
                    <p>
                      <strong className="text-foreground">Retention:</strong> 15 days local,
                      unlimited S3 storage
                    </p>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h4 className="font-semibold mb-3 text-orange-400">2. Exporters (Data Sources)</h4>
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-3">Deployed comprehensive exporters for full-stack visibility:</p>
                    <ul className="space-y-1">
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <strong className="text-foreground">Node Exporter:</strong> CPU, memory,
                        disk, network from EC2 instances
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <strong className="text-foreground">Kube State Metrics:</strong> Kubernetes
                        object state (pods, deployments, nodes)
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <strong className="text-foreground">Kafka Exporter:</strong> MSK consumer
                        lag, partition offsets, topic metrics
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <strong className="text-foreground">Postgres Exporter:</strong> Database
                        connections, query performance
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <strong className="text-foreground">CloudWatch Exporter:</strong> AWS
                        service metrics (RDS, MSK, ELB)
                      </li>
                    </ul>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h4 className="font-semibold mb-3 text-orange-400">3. Loki (Log Aggregation)</h4>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      <strong className="text-foreground">Architecture:</strong> Microservices mode
                      (distributor, ingester, querier, query-frontend, compactor)
                    </p>
                    <p>
                      <strong className="text-foreground">Storage:</strong> S3 backend for
                      cost-effective log storage
                    </p>
                    <p>
                      <strong className="text-foreground">Collection:</strong> Promtail DaemonSet
                      scraping pod logs
                    </p>
                    <p>
                      <strong className="text-foreground">Indexing:</strong> Label-based indexing
                      (namespace, pod, container)
                    </p>
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h4 className="font-semibold mb-3 text-orange-400">4. Alertmanager (Alert Routing)</h4>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      <strong className="text-foreground">Integration:</strong> Teams webhooks via
                      Power Automate workflows
                    </p>
                    <p>
                      <strong className="text-foreground">Smart Routing:</strong> Environment-specific
                      channels (Dev → business hours, Prod → 24/7)
                    </p>
                    <p>
                      <strong className="text-foreground">Alert Inhibition:</strong> Suppress
                      low-severity alerts when critical alerts fire
                    </p>
                    <p>
                      <strong className="text-foreground">Grouping:</strong> Batch alerts by
                      namespace/service to reduce noise
                    </p>
                  </div>
                </GlassCard>
              </div>
            </CaseStudySection>

            {/* Alert Rules */}
            <CaseStudySection eyebrow="// alerting" title="Alert Rules Implemented">
              <GlassCard className="p-6">
                <div className="grid gap-4 text-sm">
                  <div>
                    <strong className="text-orange-400">Node Alerts:</strong>
                    <span className="text-muted-foreground ml-2">
                      High CPU/Memory/Disk (85% warning, 95% critical)
                    </span>
                  </div>
                  <div>
                    <strong className="text-orange-400">Kubernetes Alerts:</strong>
                    <span className="text-muted-foreground ml-2">
                      Pod crash loops, nodes not ready, replica mismatches, PV usage
                    </span>
                  </div>
                  <div>
                    <strong className="text-orange-400">Network Alerts:</strong>
                    <span className="text-muted-foreground ml-2">
                      High latency, dropped packets, interface errors
                    </span>
                  </div>
                  <div>
                    <strong className="text-orange-400">Application Alerts:</strong>
                    <span className="text-muted-foreground ml-2">
                      Service-specific metrics (HTTP errors, consumer lag, query latency)
                    </span>
                  </div>
                </div>
              </GlassCard>
            </CaseStudySection>

            {/* Dashboards */}
            <CaseStudySection
              eyebrow="// visualisation"
              title="Business Intelligence Dashboards"
            >
              <p className="text-muted-foreground mb-6">
                Created{" "}
                <strong className="text-foreground">10+ custom Grafana dashboards</strong> providing
                comprehensive visibility from infrastructure to business metrics.
              </p>

              <div className="space-y-4 mb-8">
                <GlassCard className="p-6">
                  <h4 className="font-semibold mb-3 text-orange-400">Platform Overview Dashboards</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <strong className="text-foreground">Kubernetes Cluster Health:</strong> Node
                      status, pod health, resource utilisation
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <strong className="text-foreground">Infrastructure Metrics:</strong> CPU,
                      memory, disk, network across all nodes
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <strong className="text-foreground">Message Queue Health:</strong> Kafka
                      consumer lag, partition metrics, throughput
                    </li>
                  </ul>
                </GlassCard>

                <GlassCard className="p-6">
                  <h4 className="font-semibold mb-3 text-orange-400">Service-Specific Dashboards</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <strong className="text-foreground">IoT Gateway Intelligence:</strong> Throughput
                      (req/s), active connections, vendor performance ranking
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <strong className="text-foreground">Multi-Tenant Analytics:</strong> Tenant
                      activity championship, ingestion rates by tenant
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <strong className="text-foreground">Integration Performance:</strong> Vendor
                      system performance, $750K+ annual savings tracking
                    </li>
                  </ul>
                </GlassCard>
              </div>

              <MetricsShowcase
                metrics={[
                  {
                    title: "IoT Gateway Mission Control",
                    description:
                      "Real-time gateway throughput (61.9 req/s), active IoT connections, availability tracking, and data pipeline success rates.",
                    imagePath: "/dashboards/iot-gateway.png",
                    category: "Service Metrics",
                  },
                  {
                    title: "Kafka Consumer Lag & Topic Health",
                    description:
                      "Comprehensive Kafka monitoring showing consumer lag trends by group and topic, partition-level lag visualisation.",
                    imagePath: "/dashboards/kafka-metrics.png",
                    category: "Data Platform",
                  },
                  {
                    title: "Node Exporter Infrastructure Metrics",
                    description:
                      "System-level monitoring via Node Exporter showing CPU pressure, memory usage, disk I/O, network traffic.",
                    imagePath: "/dashboards/node-exporter.png",
                    category: "Infrastructure",
                  },
                ]}
              />
            </CaseStudySection>

            {/* Runbooks */}
            <CaseStudySection eyebrow="// operations" title="Operational Runbooks">
              <p className="text-muted-foreground mb-6">
                Created comprehensive runbooks for every alert, enabling{" "}
                <strong className="text-foreground">rapid incident response</strong> and knowledge
                sharing.
              </p>

              <GlassCard className="p-6">
                <h4 className="font-semibold mb-4 text-orange-400">Runbook Structure</h4>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <strong className="text-foreground">1. Symptom:</strong>
                    <p className="ml-4">Clear description of what triggered the alert</p>
                  </div>
                  <div>
                    <strong className="text-foreground">2. Investigation Steps:</strong>
                    <p className="ml-4">
                      Decision tree with kubectl commands, log queries, metric queries
                    </p>
                  </div>
                  <div>
                    <strong className="text-foreground">3. Common Resolution Commands:</strong>
                    <p className="ml-4">
                      Copy-paste commands for typical fixes (restart pods, scale deployment)
                    </p>
                  </div>
                  <div>
                    <strong className="text-foreground">4. Escalation Path:</strong>
                    <p className="ml-4">Who to contact if standard resolution doesn&apos;t work</p>
                  </div>
                </div>

                <div className="mt-6">
                  <EnhancedCodeBlock
                    title="Example: Pod Crash Loop Runbook"
                    code={`# Check pod status
kubectl get pods -l app=service-a -n production

# View recent logs
kubectl logs service-a-abc123 --tail=100

# Check events
kubectl describe pod service-a-abc123 -n production

# Common fixes:
kubectl rollout restart deployment/service-a -n production
kubectl delete pod service-a-abc123 -n production`}
                  />
                </div>
              </GlassCard>
            </CaseStudySection>

            {/* Business Impact */}
            <CaseStudySection eyebrow="// impact" title="Business Impact">
              <StatsGrid
                color="#e6522c"
                stats={[
                  { value: "<$5K/yr", label: "Total cost (vs $50K-150K for cloud solutions)" },
                  { value: "10+", label: "Custom Grafana dashboards built from scratch" },
                  { value: "50+", label: "Alert rules covering infrastructure and apps" },
                  { value: "6", label: "Prometheus exporters deployed across stack" },
                  { value: "100%", label: "Service coverage across all microservices" },
                  { value: "4", label: "Environments with consistent observability" },
                ]}
              />
            </CaseStudySection>

            {/* Technical Highlights */}
            <CaseStudySection eyebrow="// highlights" title="Technical Highlights">
              <ul className="space-y-4">
                <LessonItem>
                  Deployed complete self-hosted stack (Prometheus, Grafana, Loki, Alertmanager) with
                  Kustomize
                </LessonItem>
                <LessonItem>
                  Configured Loki microservices architecture for scalable log aggregation
                </LessonItem>
                <LessonItem>
                  Integrated Thanos for long-term metrics storage in S3 (cost-effective historical
                  data)
                </LessonItem>
                <LessonItem>
                  Deployed 6+ specialised exporters for comprehensive infrastructure monitoring
                </LessonItem>
                <LessonItem>
                  Created 50+ alert rules with smart routing and inhibition logic
                </LessonItem>
                <LessonItem>
                  Instrumented all 20 microservices with custom Prometheus metrics
                </LessonItem>
                <LessonItem>
                  Authored comprehensive runbooks for rapid incident response
                </LessonItem>
                <LessonItem>
                  Achieved 95%+ cost savings vs commercial observability solutions
                </LessonItem>
              </ul>
            </CaseStudySection>
          </div>

          {/* Sidebar */}
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
              "Istio",
              "Node Exporter",
              "Kube State Metrics",
              "Kafka Exporter",
              "S3",
              "PromQL",
              "LogQL",
            ]}
            skills={[
              "Observability Architecture",
              "Metrics Design & Instrumentation",
              "Log Aggregation at Scale",
              "Alert Rule Engineering",
              "Dashboard Design & Visualisation",
              "Cost Optimisation",
              "Kubernetes Deployment",
              "Runbook Development",
            ]}
            metrics={[
              { label: "Services Monitored", value: "20+ microservices" },
              { label: "Environments", value: "4 (Dev, QA, PreProd, Prod)" },
              { label: "Dashboards Created", value: "10+ custom dashboards" },
              { label: "Cost Savings", value: "95%+ vs cloud solutions" },
            ]}
            relatedProjects={[
              { title: "CI/CD & GitOps Platform", href: "/projects/cicd-gitops" },
              { title: "DORA Metrics & DevEx", href: "/projects/dora-devex" },
            ]}
          />
        </div>
      </div>

      <CaseStudyCTA />
    </CaseStudyLayout>
  );
}
