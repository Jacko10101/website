import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

export const metadata = {
  title: "DORA Metrics Intelligence Platform | DevlinOps Case Study",
  description: "How I built a centralized service to unify release visibility across GitOps, CI/CD, and project management systems.",
};

export default function DORAMetricsPage() {
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
          Engineering Intelligence Platform
        </h1>
        <p className="mb-6 text-xl text-muted-foreground">
          Building a centralized DORA Metrics service to unify release visibility across GitOps, CI/CD, and project management
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Q4 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>GENX-4639</span>
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
                Engineering leadership had zero visibility into deployment velocity, lead times, or release status across environments. Critical questions remained unanswered:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>"What version is deployed in QA right now?"</li>
                <li>"How long does it take from commit to production?"</li>
                <li>"Which Jira tickets are included in the preprod release?"</li>
                <li>"Where are our deployment bottlenecks?"</li>
              </ul>
              <p className="text-muted-foreground">
                <strong className="text-foreground">The root cause:</strong> Data lived in three disconnected systems (Bitbucket, Jira, ArgoCD) with no correlation layer. Release tracking was manual, error-prone, and consumed hours of engineering time.
              </p>
            </div>
          </section>

          {/* Solution Section */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">The Solution</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                I designed and built a Python-based <strong className="text-foreground">centralized DORA Metrics collection service</strong> that acts as an intelligent correlation engine between Bitbucket, Jira, and ArgoCD.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Architecture</h3>
              <div className="rounded-lg border border-border bg-muted p-6 space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">1. GitOps Repository Parsing</h4>
                  <p className="text-sm text-muted-foreground">
                    Parsed ArgoCD application manifests to extract deployed image tags per environment (dev, qa, preprod, prod).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. API Polling & Correlation</h4>
                  <p className="text-sm text-muted-foreground">
                    Queried Bitbucket API to map image tags → commit SHAs → commit messages → Jira ticket IDs (via regex extraction).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. Jira Enrichment</h4>
                  <p className="text-sm text-muted-foreground">
                    Retrieved full ticket metadata (status, assignee, labels, sprint) to provide context for each deployment.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">4. State Reconciliation</h4>
                  <p className="text-sm text-muted-foreground">
                    Maintained persistent state to track deployment history and calculate DORA metrics (deployment frequency, lead time for changes).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">5. Metrics Exposition</h4>
                  <p className="text-sm text-muted-foreground">
                    Exposed custom Prometheus metrics and created Grafana dashboards for real-time visibility.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3">Key Technical Decisions</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span><strong className="text-foreground">Python + Kubernetes Service:</strong> Deployed as a long-running service with scheduled polling intervals to minimize API rate limit impact.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span><strong className="text-foreground">Persistent Storage:</strong> Used PersistentVolumeClaims to maintain state across pod restarts.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span><strong className="text-foreground">GitOps-Native Deployment:</strong> Managed via ArgoCD to practice what we preach.</span>
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
                  Automated release visibility—eliminated manual Jira/Bitbucket cross-referencing
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">Real-time</div>
                <p className="text-sm text-muted-foreground">
                  "State of the Union" dashboard—leadership now sees deployment status at a glance
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">Data-Driven</div>
                <p className="text-sm text-muted-foreground">
                  DORA metrics enable bottleneck identification and process improvements
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">5+ Hours/Week</div>
                <p className="text-sm text-muted-foreground">
                  Saved across engineering team previously spent on manual release tracking
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
                <span>Multi-system integration across three distinct APIs (Bitbucket, Jira, ArgoCD GitOps repos)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Intelligent commit message parsing using regex to extract Jira ticket IDs</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>State management for tracking deployment history and calculating metrics</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Custom Prometheus metric design and Grafana dashboard creation</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Production-ready error handling, logging, and observability</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {["Python", "Kubernetes", "ArgoCD", "Bitbucket API", "Jira API", "Prometheus", "Grafana", "Persistent Volumes", "GitOps"].map(
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
              <li>• API Integration Architecture</li>
              <li>• State Management</li>
              <li>• Data Correlation Logic</li>
              <li>• Observability Design</li>
              <li>• Dashboard Development</li>
              <li>• Strategic Thinking</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Related Projects</h3>
            <div className="space-y-3">
              <Link
                href="/projects/test-orchestration"
                className="block text-sm font-medium hover:text-primary transition-colors"
              >
                Test Orchestration Modernization →
              </Link>
              <Link
                href="/projects/feature-branches"
                className="block text-sm font-medium hover:text-primary transition-colors"
              >
                Feature Branch Automation →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
