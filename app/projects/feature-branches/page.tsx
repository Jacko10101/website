import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

export const metadata = {
  title: "Feature Branch Automation | DevlinOps Case Study",
  description: "Self-service isolated environments with automated namespace creation tied to PR lifecycle.",
};

export default function FeatureBranchesPage() {
  return (
    <article className="container px-4 py-12 md:px-6 md:py-16">
      <Link
        href="/projects"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <header className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Feature Branch Automation
        </h1>
        <p className="mb-6 text-xl text-muted-foreground">
          Enabling true parallel development with self-service isolated environments and enterprise-grade observability
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Q1-Q2 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>GENX-3533, GENX-3642, GENX-3365 (19+ PRs)</span>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          {/* Problem Section */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">The Problem</h2>
            <div className="rounded-lg border border-border bg-secondary/50 p-6 space-y-4">
              <p className="text-muted-foreground">
                Our development environment was a <strong className="text-foreground">shared battleground</strong>. Multiple engineers deploying feature branches to the same <code className="text-xs bg-muted px-1 py-0.5 rounded">dev</code> namespace created chaos:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong className="text-foreground">Deployment Conflicts:</strong> "My feature just got overwritten by someone else's deploy!"</li>
                <li><strong className="text-foreground">Test Unreliability:</strong> Tests running against unknown application versions</li>
                <li><strong className="text-foreground">Debugging Nightmares:</strong> Which logs belong to which feature branch?</li>
                <li><strong className="text-foreground">Blocked Work:</strong> Engineers waiting for others to finish testing before deploying</li>
              </ul>
              <p className="text-muted-foreground">
                <strong className="text-foreground">The root cause:</strong> No isolation between feature branches. Manual namespace creation was too slow and engineers bypassed it.
              </p>
            </div>
          </section>

          {/* Solution Section */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">The Solution</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                I designed and implemented <strong className="text-foreground">automated feature branch namespace creation</strong> using ArgoCD ApplicationSets, tied directly to the pull request lifecycle.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Architecture</h3>
              <div className="rounded-lg border border-border bg-muted p-6 space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">1. ApplicationSet Generator</h4>
                  <p className="text-sm text-muted-foreground">
                    ArgoCD ApplicationSet watches Bitbucket API for open pull requests. For each PR, generates a dedicated Application targeting <code className="text-xs bg-secondary px-1 py-0.5 rounded">{`{service}-{branch-slug}`}</code> namespace.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Automated Namespace Provisioning</h4>
                  <p className="text-sm text-muted-foreground">
                    On PR open, ArgoCD automatically creates isolated namespace with ResourceQuotas (CPU/memory limits), NetworkPolicies (default deny ingress/egress), and RBAC.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. Full Observability Stack</h4>
                  <p className="text-sm text-muted-foreground">
                    Each namespace gets Prometheus ServiceMonitor, Loki LogQL queries scoped to namespace, and dedicated Grafana dashboard links.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">4. Automatic Cleanup</h4>
                  <p className="text-sm text-muted-foreground">
                    On PR merge/close, ApplicationSet detects removal and ArgoCD prunes the namespace and all resources—zero manual intervention.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3">Example: Harmony Service (19 PRs)</h3>
              <div className="rounded-lg border border-border bg-muted p-4 font-mono text-xs overflow-x-auto">
                <pre className="text-muted-foreground">
{`# PR: feature/alarm-processing-optimization
# Auto-created namespace: harmony-alarm-processing-optimization

apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: harmony-feature-branches
spec:
  generators:
    - pullRequest:
        bitbucketServer:
          project: GENX
          repo: harmony
          api: https://bitbucket.company.com
  template:
    metadata:
      name: 'harmony-{{ .branch }}'
    spec:
      destination:
        namespace: 'harmony-{{ .branch }}'
      source:
        path: manifests/harmony
        helm:
          values:
            imageTag: '{{ .head_sha }}'
            namespace: 'harmony-{{ .branch }}'`}
                </pre>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3">Observability Integration (GENX-3365)</h3>
              <p className="text-muted-foreground">
                Combined this with <strong className="text-foreground">enterprise observability implementation</strong> for Harmony service (430+ lines of custom code):
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span><strong className="text-foreground">Custom Business Metrics:</strong> Device activity counters, alarm processing latency, tenant-specific metrics</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span><strong className="text-foreground">Distributed Tracing:</strong> End-to-end traces from Kafka ingestion → aliasing → telemetry delivery with MDC context propagation</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span><strong className="text-foreground">Structured Logging:</strong> JSON logs with traceId, spanId, and tenant correlation for Loki queries</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span><strong className="text-foreground">Grafana Dashboards:</strong> Per-namespace dashboards auto-generated with LogQL queries scoped to namespace labels</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Impact Section */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Business Impact</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">100%</div>
                <p className="text-sm text-muted-foreground">
                  Isolation—zero deployment conflicts between feature branches
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">Self-Service</div>
                <p className="text-sm text-muted-foreground">
                  Engineers no longer wait for manual namespace provisioning
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">3-5 PRs</div>
                <p className="text-sm text-muted-foreground">
                  Can be tested in parallel without conflicts—previously limited to 1
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">Zero Cleanup</div>
                <p className="text-sm text-muted-foreground">
                  Automatic namespace deletion on PR merge—no orphaned resources
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
                <span>ArgoCD ApplicationSet pull request generator with Bitbucket Server API integration</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Kubernetes ResourceQuotas and NetworkPolicies for resource governance</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Prometheus ServiceMonitor auto-discovery for feature branch namespaces</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Spring Boot custom metrics (430+ lines) with OpenTelemetry distributed tracing</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>MDC (Mapped Diagnostic Context) for async operation trace correlation</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Grafana dashboard templates with namespace-scoped queries</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Rolled out across Harmony, Orchestrator, CloudBridge, UI services</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {["ArgoCD ApplicationSets", "Kubernetes", "ResourceQuotas", "NetworkPolicies", "Prometheus", "Grafana", "Loki", "Tempo", "Spring Boot", "OpenTelemetry", "MDC"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-secondary px-3 py-1 text-sm font-medium"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Skills Demonstrated</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Developer Experience Design</li>
              <li>• GitOps Automation</li>
              <li>• Resource Governance</li>
              <li>• Observability Architecture</li>
              <li>• Distributed Tracing</li>
              <li>• Multi-Service Rollout</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Related Projects</h3>
            <div className="space-y-3">
              <Link
                href="/projects/dora-metrics"
                className="block text-sm font-medium hover:text-primary transition-colors"
              >
                DORA Metrics Platform →
              </Link>
              <Link
                href="/projects/test-orchestration"
                className="block text-sm font-medium hover:text-primary transition-colors"
              >
                Test Orchestration Modernization →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
