import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { MetricsShowcase } from "@/components/metrics-showcase";
import { ScrollProgress } from "@/components/scroll-progress";
import { ObservabilityArchitecture } from "@/components/observability-architecture";

export const metadata = {
  title: "Enterprise Observability Stack | DevlinOps Case Study",
  description: "Building a production-grade, self-hosted observability platform with Prometheus, Grafana, Loki—delivering full-stack visibility at fraction of cloud costs.",
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Enterprise Observability Stack",
  "description": "Building production-grade, self-hosted observability with Prometheus, Grafana, and Loki—achieving full-stack visibility at a fraction of cloud costs",
  "author": {
    "@type": "Person",
    "name": "Jack Devlin",
    "url": "https://devlinops.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "DevlinOps",
    "url": "https://devlinops.com"
  },
  "datePublished": "2025-01-01",
  "dateModified": "2025-01-01",
  "proficiencyLevel": "Expert",
  "keywords": ["Observability", "Prometheus", "Grafana", "Loki", "Thanos", "Alertmanager", "Kubernetes", "Monitoring"],
  "dependencies": "Prometheus, Grafana, Loki, Thanos, Alertmanager, Promtail, Kubernetes, Kustomize"
};

export default function ObservabilityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article className="container px-4 py-12 md:px-6 md:py-16">
        <ScrollProgress />
      <Link
        href="/projects"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Enterprise Observability Stack
        </h1>
        <p className="mb-6 text-xl text-muted-foreground">
          Building production-grade, self-hosted observability with Prometheus, Grafana, and Loki—achieving full-stack visibility at a fraction of cloud costs
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>2024-2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>20+ Services • 4 Environments</span>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          {/* Problem Section */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">The Challenge</h2>
            <div className="rounded-lg border border-border bg-secondary/50 p-6 space-y-4">
              <p className="text-muted-foreground">
                The platform had <strong className="text-foreground">zero observability</strong> across 20 microservices running on Kubernetes. Critical operational questions remained unanswered:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>"Which service is causing the 500 errors?"</li>
                <li>"Why did the pod restart 5 times in the last hour?"</li>
                <li>"What's our Kafka consumer lag right now?"</li>
                <li>"Are we hitting CPU/memory limits?"</li>
                <li>"Where are the logs for that failed deployment?"</li>
              </ul>

              <div className="mt-4 rounded-md bg-destructive/10 border border-destructive/50 p-4">
                <h4 className="font-semibold mb-2 text-destructive">The Cost Problem</h4>
                <p className="text-sm text-muted-foreground">
                  Cloud observability solutions (Datadog, New Relic, Splunk) would cost <strong className="text-destructive">$50K-150K/year</strong> for our scale—prohibitively expensive for the budget
                </p>
              </div>

              <p className="text-muted-foreground mt-4">
                <strong className="text-foreground">The mandate:</strong> Build enterprise-grade observability in-house at minimal cost while maintaining production reliability
              </p>
            </div>
          </section>

          {/* Solution Overview */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">The Solution: Self-Hosted Observability Platform</h2>
            <p className="text-muted-foreground mb-4">
              I architected and deployed a <strong className="text-foreground">complete self-hosted observability stack</strong> using open-source tooling, achieving enterprise-grade monitoring at &lt;5% of cloud costs.
            </p>

            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-4">
                <h3 className="font-semibold mb-2">Metrics</h3>
                <p className="text-xs text-muted-foreground">Prometheus + Thanos for long-term storage</p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-4">
                <h3 className="font-semibold mb-2">Visualisation</h3>
                <p className="text-xs text-muted-foreground">Grafana with custom dashboards</p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-4">
                <h3 className="font-semibold mb-2">Logs</h3>
                <p className="text-xs text-muted-foreground">Loki (microservices mode) + Promtail</p>
              </div>
            </div>
          </section>

          {/* Architecture */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Architecture & Implementation</h2>

            {/* Architecture Diagram */}
            <div className="mb-8">
              <ObservabilityArchitecture />
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-3">Core Stack Components</h3>
            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-semibold mb-2 text-primary">1. Prometheus (Metrics Collection)</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Configuration:</strong> Kustomize base + environment overlays (dev, qa, preprod, prod)</p>
                  <p><strong>Service Discovery:</strong> Kubernetes SD for automatic service detection</p>
                  <p><strong>Scrape Targets:</strong> API servers, nodes, pods, services, exporters (15+ scrape jobs)</p>
                  <p><strong>Long-term Storage:</strong> Thanos sidecar → S3 for historical data (cost-effective)</p>
                  <p><strong>Retention:</strong> 15 days local, unlimited S3 storage</p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-semibold mb-2 text-primary">2. Exporters (Data Sources)</h4>
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Deployed comprehensive exporters for full-stack visibility:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• <strong>Node Exporter:</strong> CPU, memory, disk, network metrics from EC2 instances</li>
                    <li>• <strong>Kube State Metrics:</strong> Kubernetes object state (pods, deployments, nodes)</li>
                    <li>• <strong>Kafka Exporter:</strong> MSK consumer lag, partition offsets, topic metrics</li>
                    <li>• <strong>Postgres Exporter:</strong> Database connections, query performance, replication lag</li>
                    <li>• <strong>Redis Exporter:</strong> Cache hit ratio, memory usage, key evictions</li>
                    <li>• <strong>CloudWatch Exporter:</strong> AWS service metrics (RDS, MSK, ELB)</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-semibold mb-2 text-primary">3. Grafana (Visualisation)</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Deployment:</strong> Persistent storage with PVC for dashboard retention</p>
                  <p><strong>Data Sources:</strong> Prometheus (metrics), Loki (logs), AWS CloudWatch</p>
                  <p><strong>Dashboards Created:</strong> 25+ service-specific and platform-wide dashboards</p>
                  <p><strong>Access:</strong> Istio VirtualService with environment-specific routing</p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-semibold mb-2 text-primary">4. Loki (Log Aggregation)</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Architecture:</strong> Microservices mode (distributor, ingester, querier, query-frontend, compactor)</p>
                  <p><strong>Storage:</strong> S3 backend for cost-effective log storage</p>
                  <p><strong>Collection:</strong> Promtail DaemonSet scraping pod logs</p>
                  <p><strong>Indexing:</strong> Label-based indexing (namespace, pod, container) for fast queries</p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-semibold mb-2 text-primary">5. Alertmanager (Alert Routing)</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Integration:</strong> Teams webhooks via Power Automate workflows</p>
                  <p><strong>Smart Routing:</strong> Environment-specific channels (Dev → business hours, Prod → 24/7)</p>
                  <p><strong>Alert Inhibition:</strong> Suppress low-severity alerts when critical alerts fire</p>
                  <p><strong>Grouping:</strong> Batch alerts by namespace/service to reduce noise</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-3">Alert Rules Implemented</h3>
            <div className="rounded-lg border border-border bg-muted p-4">
              <div className="grid gap-3 text-sm">
                <div>
                  <strong className="text-primary">Node Alerts:</strong>
                  <span className="text-muted-foreground ml-2">High CPU/Memory/Disk (85% warning, 95% critical)</span>
                </div>
                <div>
                  <strong className="text-primary">Kubernetes Alerts:</strong>
                  <span className="text-muted-foreground ml-2">Pod crash loops, nodes not ready, replica mismatches, PV usage</span>
                </div>
                <div>
                  <strong className="text-primary">Network Alerts:</strong>
                  <span className="text-muted-foreground ml-2">High latency, dropped packets, interface errors</span>
                </div>
                <div>
                  <strong className="text-primary">Application Alerts:</strong>
                  <span className="text-muted-foreground ml-2">Service-specific metrics (HTTP errors, consumer lag, query latency)</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-3">Service Instrumentation</h3>
            <p className="text-muted-foreground mb-3">
              Instrumented all 20 microservices to expose custom Prometheus metrics for business intelligence:
            </p>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong className="text-foreground">Service A (Data Ingestion):</strong> Gateway throughput, active connections, telemetry ingestion rate, data pipeline success rate</p>
                <p><strong className="text-foreground">Service B (Message Processing):</strong> Kafka consumer lag, message processing rate, error rates, device processing outcomes</p>
                <p><strong className="text-foreground">Service C (Rules Engine):</strong> Rule execution count, rule evaluation latency, alarm creation rate</p>
                <p><strong className="text-foreground">Service D (API Gateway):</strong> HTTP request rates, response times, error rates, authentication success/failure</p>
              </div>
            </div>
          </section>

          {/* Dashboards */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Business Intelligence Dashboards</h2>
            <p className="text-muted-foreground mb-4">
              Created <strong className="text-foreground">25+ Grafana dashboards</strong> providing comprehensive visibility from infrastructure to business metrics.
            </p>

            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-semibold mb-2">Platform Overview Dashboards</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• <strong>Kubernetes Cluster Health:</strong> Node status, pod health, resource utilisation</li>
                  <li>• <strong>Infrastructure Metrics:</strong> CPU, memory, disk, network across all nodes</li>
                  <li>• <strong>Service Mesh:</strong> Istio traffic flow, success rates, latencies</li>
                  <li>• <strong>Database Performance:</strong> Postgres connections, query times, replication lag</li>
                  <li>• <strong>Message Queue Health:</strong> Kafka consumer lag, partition metrics, throughput</li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-semibold mb-2">Service-Specific Dashboards</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• <strong>IoT Gateway Intelligence:</strong> Throughput (req/s), active connections, data pipeline success, vendor performance ranking</li>
                  <li>• <strong>Multi-Tenant Analytics:</strong> Tenant activity championship, ingestion rates by tenant, retail chain data flow</li>
                  <li>• <strong>Integration Performance:</strong> Vendor system performance, $750K+ annual savings tracking</li>
                  <li>• <strong>Data Quality:</strong> Validation rates, error rates, processing latencies</li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-semibold mb-2">Example: IoT Gateway Dashboard</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Mission Control Section:</strong> Gateway throughput (20.7 req/s), active IoT connections (3), availability (100%), data pipeline success (100%)</p>
                  <p><strong>Business Intelligence:</strong> Retail chain telemetry ingestion trends, tenant activity rankings, multi-vendor integration performance</p>
                  <p><strong>Cost Savings Tracking:</strong> Annual savings from optimisations ($750K+), vendor performance comparison</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-3">Dashboard Previews</h3>
            <p className="text-muted-foreground mb-4">
              Real production dashboards showing metrics collection, business intelligence, and infrastructure monitoring in action.
            </p>
            <MetricsShowcase
              metrics={[
                {
                  title: "IoT Gateway Mission Control",
                  description: "Real-time gateway throughput (61.9 req/s), active IoT connections, availability tracking, and data pipeline success rates. Includes multi-tenant business intelligence showing retail chain telemetry ingestion and tenant activity rankings.",
                  imagePath: "/dashboards/iot-gateway.png",
                  category: "Service Metrics"
                },
                {
                  title: "Kafka Consumer Lag & Topic Health",
                  description: "Comprehensive Kafka monitoring showing consumer lag trends by group and topic, partition-level lag visualisation, and topic size tracking. Essential for preventing data pipeline bottlenecks and ensuring message processing SLAs.",
                  imagePath: "/dashboards/kafka-metrics.png",
                  category: "Data Platform"
                },
                {
                  title: "Node Exporter Infrastructure Metrics",
                  description: "System-level monitoring via Node Exporter showing CPU pressure, memory usage, disk I/O, network traffic, and system load. Critical for infrastructure health and capacity planning across Kubernetes cluster nodes.",
                  imagePath: "/dashboards/node-exporter.png",
                  category: "Infrastructure"
                }
              ]}
            />
          </section>

          {/* Runbooks */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Operational Runbooks</h2>
            <p className="text-muted-foreground mb-4">
              Created comprehensive runbooks for every alert, enabling <strong className="text-foreground">rapid incident response</strong> and knowledge sharing.
            </p>

            <div className="rounded-lg border border-border bg-card p-6">
              <h4 className="font-semibold mb-3">Runbook Structure</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <strong className="text-foreground">1. Symptom:</strong>
                  <p className="ml-4">Clear description of what triggered the alert</p>
                </div>
                <div>
                  <strong className="text-foreground">2. Investigation Steps:</strong>
                  <p className="ml-4">Decision tree with kubectl commands, log queries, metric queries</p>
                </div>
                <div>
                  <strong className="text-foreground">3. Common Resolution Commands:</strong>
                  <p className="ml-4">Copy-paste commands for typical fixes (restart pods, scale deployment, clear cache)</p>
                </div>
                <div>
                  <strong className="text-foreground">4. Escalation Path:</strong>
                  <p className="ml-4">Who to contact if standard resolution doesn't work</p>
                </div>
              </div>

              <div className="mt-4 rounded-md bg-muted p-3 text-xs font-mono">
                <div className="font-semibold mb-2">Example: Pod Crash Loop Runbook</div>
                <pre className="text-muted-foreground whitespace-pre-wrap">
{`# Check pod status
kubectl get pods -l app=service-a -n production

# View recent logs
kubectl logs service-a-abc123 --tail=100

# Check events
kubectl describe pod service-a-abc123 -n production

# Common fixes:
kubectl rollout restart deployment/service-a -n production
kubectl delete pod service-a-abc123 -n production`}
                </pre>
              </div>
            </div>
          </section>

          {/* Business Impact */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Business Impact</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">&lt;$5K/yr</div>
                <p className="text-sm text-muted-foreground">
                  Total infrastructure cost (vs $50K-150K for cloud solutions)—95%+ savings
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">25+</div>
                <p className="text-sm text-muted-foreground">
                  Grafana dashboards providing platform-wide to service-specific visibility
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">50+</div>
                <p className="text-sm text-muted-foreground">
                  Alert rules covering infrastructure, Kubernetes, network, and application metrics
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">~70%</div>
                <p className="text-sm text-muted-foreground">
                  Reduction in mean time to detect (MTTD)—proactive alerting catches issues early
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">100%</div>
                <p className="text-sm text-muted-foreground">
                  Service coverage—all 20 microservices instrumented and monitored
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">4 Envs</div>
                <p className="text-sm text-muted-foreground">
                  Consistent observability across Dev, QA, PreProd, and Production
                </p>
              </div>
            </div>
          </section>

          {/* Technical Highlights */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Technical Highlights</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Deployed complete self-hosted stack (Prometheus, Grafana, Loki, Alertmanager) with Kustomize</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Configured Loki microservices architecture for scalable log aggregation</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Integrated Thanos for long-term metrics storage in S3 (cost-effective historical data)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Deployed 6+ specialized exporters for comprehensive infrastructure monitoring</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Created 50+ alert rules with smart routing and inhibition logic</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Built 25+ Grafana dashboards from platform infrastructure to business intelligence</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Instrumented all 20 microservices with custom Prometheus metrics</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Authored comprehensive runbooks for rapid incident response</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Achieved 95%+ cost savings vs commercial observability solutions</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {[
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
                "LogQL"
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-secondary px-3 py-1 text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Skills Demonstrated</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Observability Architecture</li>
              <li>• Metrics Design & Instrumentation</li>
              <li>• Log Aggregation at Scale</li>
              <li>• Alert Rule Engineering</li>
              <li>• Dashboard Design & Visualisation</li>
              <li>• Cost Optimisation</li>
              <li>• Kubernetes Deployment</li>
              <li>• Runbook Development</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Project Metrics</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="font-semibold text-foreground">Services Monitored</div>
                <div className="text-muted-foreground">20 microservices</div>
              </div>
              <div>
                <div className="font-semibold text-foreground">Environments</div>
                <div className="text-muted-foreground">4 (Dev, QA, PreProd, Prod)</div>
              </div>
              <div>
                <div className="font-semibold text-foreground">Dashboards Created</div>
                <div className="text-muted-foreground">25+ Grafana dashboards</div>
              </div>
              <div>
                <div className="font-semibold text-foreground">Cost Savings</div>
                <div className="text-muted-foreground">95%+ vs cloud solutions</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Related Projects</h3>
            <div className="space-y-3">
              <Link
                href="/projects/cicd-gitops"
                className="block text-sm font-medium hover:text-primary transition-colors"
              >
                CI/CD & GitOps Platform →
              </Link>
              <Link
                href="/projects/dora-devex"
                className="block text-sm font-medium hover:text-primary transition-colors"
              >
                DORA Metrics & DevEx →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
    </>
  );
}
