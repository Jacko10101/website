import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { CodeSnippet } from "@/components/code-snippet";
import { ScrollProgress } from "@/components/scroll-progress";
import { DoraArchitecture } from "@/components/dora-architecture";

export const metadata = {
  title: "DORA Metrics & Developer Experience Platform | DevlinOps Case Study",
  description: "Building business intelligence and developer experience tooling—from centralised DORA metrics to intelligent pipeline notifications.",
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "DORA Metrics & Developer Experience Platform",
  "description": "Building comprehensive business intelligence and developer experience tooling—automated metrics collection, intelligent notifications, and deployment gates",
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
  "keywords": ["DORA Metrics", "Developer Experience", "Python", "Prometheus", "Grafana", "Jira API", "Bitbucket API"],
  "dependencies": "Python, Prometheus, Grafana, ArgoCD API, Bitbucket API, Jira API, Teams Webhooks"
};

export default function DORADevExPage() {
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
          DORA Metrics & Developer Experience Platform
        </h1>
        <p className="mb-6 text-xl text-muted-foreground">
          Building comprehensive business intelligence and developer experience tooling—automated metrics collection, intelligent notifications, and deployment gates
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>2024-2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>400 Deploys/Month Visibility</span>
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
                Engineering leadership had <strong className="text-foreground">zero visibility into deployment velocity</strong> across 20 microservices and 4 environments. Critical business questions remained unanswered:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>"How many deployments did we do this month?"</li>
                <li>"What's our average lead time from commit to production?"</li>
                <li>"Which Jira tickets are in the QA release right now?"</li>
                <li>"Where are our deployment bottlenecks?"</li>
                <li>"Why did that deployment fail?"</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Additionally, developers had <strong className="text-foreground">poor visibility into pipeline execution</strong>:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Manual checking of pipeline status across multiple services</li>
                <li>No proactive notifications for deployment events</li>
                <li>Silent security vulnerabilities discovered weeks later</li>
                <li>Premature QA deployments missing required Jira metadata</li>
              </ul>
              <div className="mt-4 rounded-md bg-destructive/10 border border-destructive/50 p-4">
                <p className="text-sm"><strong className="text-destructive">Business Impact:</strong> Leadership couldn't demonstrate engineering velocity to stakeholders, and QA teams were constantly surprised by incomplete releases</p>
              </div>
            </div>
          </section>

          {/* Solution Overview */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">The Solution: Multi-Layered Intelligence Platform</h2>
            <p className="text-muted-foreground mb-4">
              I designed and built a <strong className="text-foreground">comprehensive DevEx platform</strong> consisting of three integrated components that transformed engineering operations:
            </p>

            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-4">
                <h3 className="font-semibold mb-2">1. DORA Metrics Collector</h3>
                <p className="text-xs text-muted-foreground">Python service correlating GitOps, Bitbucket, Jira, and ArgoCD data</p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-4">
                <h3 className="font-semibold mb-2">2. Pipeline Reporter</h3>
                <p className="text-xs text-muted-foreground">Intelligent Teams notifications with rich context and smart routing</p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-4">
                <h3 className="font-semibold mb-2">3. Deployment Gates</h3>
                <p className="text-xs text-muted-foreground">Automated quality checks preventing premature releases</p>
              </div>
            </div>
          </section>

          {/* Architecture Diagram */}
          <section>
            <DoraArchitecture />
          </section>

          {/* Component 1: DORA Metrics */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Component 1: DORA Metrics Collector</h2>
            <p className="text-muted-foreground mb-4">
              A Python service that acts as a <strong className="text-foreground">centralised correlation engine</strong> between disconnected systems.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-3">Technical Architecture</h3>
            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-semibold mb-2 text-primary">📋 Data Sources</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• <strong>ArgoCD Apps Repo</strong> - Desired deployment state (Kustomize manifests)</li>
                  <li>• <strong>ArgoCD API</strong> - Actual deployment state, sync status, health</li>
                  <li>• <strong>Bitbucket API</strong> - Commit metadata, author, timestamp</li>
                  <li>• <strong>Jira API</strong> - Ticket enrichment (status, fix versions, sprint)</li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-semibold mb-2 text-primary">🔄 Processing Pipeline</h4>
                <div className="text-sm text-muted-foreground space-y-2 ml-4">
                  <p>1. <strong>Clone ArgoCD Apps Repo</strong> → Parse Kustomize overlays → Extract image tags per environment</p>
                  <p>2. <strong>Query Bitbucket API</strong> → Map image tags to commit SHAs → Extract Jira tickets from commit messages</p>
                  <p>3. <strong>Query Jira API</strong> → Enrich tickets with metadata (fix versions, status, assignee)</p>
                  <p>4. <strong>Calculate DORA Metrics</strong> → Deployment frequency, lead time, change failure rate</p>
                  <p>5. <strong>Expose Prometheus Metrics</strong> → 15+ custom metrics for dashboarding</p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-semibold mb-2 text-primary">📊 Key Metrics Exposed</h4>
                <div className="grid gap-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <code className="bg-muted px-2 py-1 rounded">deployment_desired_state</code>
                    <code className="bg-muted px-2 py-1 rounded">deployment_actual_state</code>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <code className="bg-muted px-2 py-1 rounded">deployment_lead_time_seconds</code>
                    <code className="bg-muted px-2 py-1 rounded">deployment_age_seconds</code>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <code className="bg-muted px-2 py-1 rounded">ticket_in_environment</code>
                    <code className="bg-muted px-2 py-1 rounded">ticket_fix_version</code>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-3">Implementation Highlights</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary">→</span>
                <span><strong className="text-foreground">Retry Logic with Exponential Backoff:</strong> Handles API rate limits and transient failures gracefully</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">→</span>
                <span><strong className="text-foreground">Git Repository Caching:</strong> Clones repos once, pulls updates to minimize Bitbucket load</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">→</span>
                <span><strong className="text-foreground">Parallel Processing:</strong> Collects metrics for multiple services concurrently (20 services in ~30s)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">→</span>
                <span><strong className="text-foreground">Prometheus Integration:</strong> Flask HTTP server exposes /metrics endpoint for Prometheus scraping</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">→</span>
                <span><strong className="text-foreground">Health Checks:</strong> Collection success/duration metrics for observability of the collector itself</span>
              </li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">Code Samples</h3>
            <div className="space-y-4">
              <CodeSnippet
                title="pipeline_reporter.sh - Graceful Error Handling"
                language="bash"
                code={`#!/bin/bash

# Never fail the pipeline
set +e

# Enable debug if DEBUG=true
if [ "\${DEBUG:-false}" = "true" ]; then
  set -x
  echo "🔍 DEBUG MODE ENABLED"
fi

# Check if webhooks are configured
if [ -z "$TEAMS_WEBHOOK_URL_DEFAULT" ]; then
  echo "❌ ERROR: TEAMS_WEBHOOK_DEFAULT not configured"
  echo "Pipeline notifications are disabled until webhooks are configured"
  echo "Continuing pipeline without notifications..."
  exit 0
fi`}
              />

              <CodeSnippet
                title="jira_fix_version_check.sh - Delta Detection Logic"
                language="bash"
                code={`# Get current QA deployment SHA from ArgoCD kustomization
get_current_qa_deployment() {
    # Clone or update argocd-apps repo (shallow clone for speed)
    if [[ ! -d "argocd-apps" ]]; then
        git clone --depth 1 \\
          "https://x-token-auth:\${ARGOCD_APPS_ACCESS_TOKEN}@bitbucket.org/org/argocd-apps.git" \\
          argocd-apps 2>/dev/null || {
            log_error "Failed to clone argocd-apps repository"
            return 1
        }
    fi

    # Find the kustomization file for this repo's QA environment
    local kustomization_file="argocd-apps/applications/\${BITBUCKET_REPO_SLUG}/overlays/qa/kustomization.yaml"

    # Extract the current image tag from kustomization
    local current_tag=$(grep -A5 "name: \${BITBUCKET_REPO_SLUG}" "$kustomization_file" | \\
                        grep 'newTag:' | \\
                        sed -E 's/.*newTag: *"?([^"]*)"?/\\1/')

    echo "$current_tag"
}`}
              />
            </div>
          </section>

          {/* Component 2: Pipeline Reporter */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Component 2: Intelligent Pipeline Reporter</h2>
            <p className="text-muted-foreground mb-4">
              A 1000+ line Bash script that transforms pipeline events into <strong className="text-foreground">rich, actionable Teams notifications</strong> with smart routing and context.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-3">Core Features</h3>
            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-semibold mb-2 text-primary">🎨 Rich Adaptive Cards</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• <strong>Deployment Notifications:</strong> Service, environment, commit, developer, timestamp</li>
                  <li>• <strong>Security Alerts:</strong> Vulnerability counts, severity, Veracode/Jira links</li>
                  <li>• <strong>Test Results:</strong> Pass/fail status, S3 results links, PostSync job integration</li>
                  <li>• <strong>Feature Branches:</strong> PR links, namespace details, kubectl commands</li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-semibold mb-2 text-primary">🎯 Smart Notification Routing</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Platform Deployments Channel:</strong> Dev, QA, PreProd, Prod deployments</p>
                  <p><strong>Security Channel:</strong> SAST/SCA alerts from Veracode/SourceClear</p>
                  <p><strong>PR Notifications Channel:</strong> Feature branch deployments with PR context</p>
                  <p><strong>QA Team Channel:</strong> QA deployment events for testing coordination</p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-semibold mb-2 text-primary">✨ Easter Eggs & DevEx Enhancements</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• <strong>Special Build Messages:</strong> Build #42, #404, #1337, milestone builds (#1000)</li>
                  <li>• <strong>Time-Based Messages:</strong> "May the Fourth be with this code" (May 4th)</li>
                  <li>• <strong>Friday Evening Prod Deploys:</strong> "Bold." acknowledgment</li>
                  <li>• <strong>Production Deploy Recognition:</strong> Personalized messages per developer</li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-semibold mb-2 text-primary">🔗 Actionable Links</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Deployments:</strong> ArgoCD application URL, Bitbucket pipeline, Test results (S3)</p>
                  <p><strong>Security Alerts:</strong> Jira story creation (pre-filled), Veracode dashboard, Pipeline logs</p>
                  <p><strong>Feature Branches:</strong> PR review link, Pipeline status, kubectl port-forward commands</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-3">Example Notification</h3>
            <div className="rounded-lg border border-border bg-muted p-4 text-sm space-y-2">
              <div className="font-semibold">✅ Configuration Updated: Service A - DEV [Master Branch]</div>
              <div className="grid grid-cols-3 gap-4 text-xs mt-2">
                <div><strong>Build:</strong> #3881</div>
                <div><strong>Environment:</strong> DEV</div>
                <div><strong>Commit:</strong> b7ffa920</div>
              </div>
              <div className="mt-2 p-2 bg-secondary/50 rounded">
                <div className="font-semibold">👤 Developer Name</div>
                <div className="text-xs italic mt-1">PROJ-1234 add dev deployment summary, change to short commit hash</div>
              </div>
              <div className="mt-2 p-2 bg-primary/10 rounded text-xs">
                <div>ℹ️ <strong>Additional Information</strong></div>
                <div className="mt-1">Tests will run automatically after sync completes</div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs">🚀 View in ArgoCD</button>
                <button className="px-3 py-1 bg-secondary rounded text-xs">View Pipeline</button>
              </div>
            </div>
          </section>

          {/* Component 3: Deployment Gates */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Component 3: Automated Deployment Gates</h2>
            <p className="text-muted-foreground mb-4">
              Intelligent checks that <strong className="text-foreground">prevent premature deployments</strong> and enforce quality standards.
            </p>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-lg font-semibold mb-3">Jira Fix Version Check (QA Gate)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                A Bash script that enforces Jira Fix Version assignment before QA deployment, preventing incomplete releases from reaching QA.
              </p>

              <h4 className="font-semibold mb-2 text-sm">How It Works</h4>
              <div className="space-y-2 text-sm text-muted-foreground ml-4">
                <p>1. <strong>Determine Current QA State:</strong> Queries ArgoCD apps repo to find currently deployed commit SHA in QA</p>
                <p>2. <strong>Identify New Commits:</strong> Uses <code className="bg-muted px-1 rounded text-xs">git rev-list</code> to find commits between QA and HEAD</p>
                <p>3. <strong>Extract Jira Tickets:</strong> Regex matching on commit messages to find all JIRA-XXXX patterns</p>
                <p>4. <strong>Validate Fix Versions:</strong> Queries Jira API to check each ticket has Fix Version assigned</p>
                <p>5. <strong>Block or Allow:</strong> Fails pipeline if any ticket missing Fix Version, provides actionable error message</p>
              </div>

              <div className="mt-4 rounded-md bg-primary/10 border border-primary/50 p-3 text-xs">
                <div className="font-semibold mb-1">Example Output</div>
                <pre className="text-muted-foreground whitespace-pre-wrap">
{`════════════════════════════════════════════════════
❌ QA DEPLOYMENT BLOCKED
════════════════════════════════════════════════════

The following 2 ticket(s) are missing Fix Version/s:

  🎫 PROJ-1001
     https://company.atlassian.net/browse/PROJ-1001

  🎫 PROJ-1002
     https://company.atlassian.net/browse/PROJ-1002

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ACTION REQUIRED:
1. Open each ticket above in Jira
2. Set the 'Fix Version/s' field
3. Re-run this QA deployment pipeline`}
                </pre>
              </div>

              <h4 className="font-semibold mb-2 text-sm mt-4">Key Features</h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• <strong>Delta Detection:</strong> Only checks NEW commits, not entire QA history</li>
                <li>• <strong>Error Handling:</strong> Differentiates API errors from validation failures</li>
                <li>• <strong>Bypass Mechanism:</strong> Emergency <code className="bg-muted px-1 rounded">SKIP_JIRA_FIX_VERSION_CHECK=true</code> flag</li>
                <li>• <strong>Debug Mode:</strong> Verbose logging for troubleshooting integration issues</li>
              </ul>
            </div>
          </section>

          {/* Business Impact */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Business Impact</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">413</div>
                <p className="text-sm text-muted-foreground">
                  Deployments tracked per month across all environments (verified via dashboard)
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">2-3 days</div>
                <p className="text-sm text-muted-foreground">
                  Average lead time from Dev → QA → PreProd measured for first time
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">100%</div>
                <p className="text-sm text-muted-foreground">
                  Deployment visibility—leadership can now answer "what's deployed where" instantly
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">4 Channels</div>
                <p className="text-sm text-muted-foreground">
                  Smart notification routing ensuring right people get right information
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">Zero</div>
                <p className="text-sm text-muted-foreground">
                  Incomplete QA releases since Jira Fix Version gate implementation
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">~80%</div>
                <p className="text-sm text-muted-foreground">
                  Reduction in "what version is in QA?" questions to platform team
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
                <span>Built production-grade Python service with retry logic, caching, and parallel processing</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Integrated 4 separate APIs (Bitbucket, Jira, ArgoCD, Prometheus) into unified intelligence layer</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Designed 15+ custom Prometheus metrics enabling comprehensive DORA dashboards</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Implemented sophisticated Bash scripting (1000+ lines) for rich Teams notifications</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Created automated deployment gates with Jira API integration and delta detection</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Deployed as Kubernetes service with Prometheus scraping and Grafana visualisation</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Improved developer experience with actionable notifications and early validation</span>
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
                "Python",
                "Bash",
                "Prometheus",
                "Grafana",
                "ArgoCD API",
                "Bitbucket API",
                "Jira API",
                "Teams Webhooks",
                "Flask",
                "Git",
                "Kubernetes",
                "Adaptive Cards"
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
              <li>• API Integration & Correlation</li>
              <li>• Metrics Design & Exposition</li>
              <li>• Developer Experience Design</li>
              <li>• Business Intelligence Tooling</li>
              <li>• Quality Gates & Automation</li>
              <li>• Notification Systems</li>
              <li>• Python Development</li>
              <li>• Advanced Bash Scripting</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Project Metrics</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="font-semibold text-foreground">Components Built</div>
                <div className="text-muted-foreground">3 integrated tools</div>
              </div>
              <div>
                <div className="font-semibold text-foreground">Code Volume</div>
                <div className="text-muted-foreground">~2000 lines (Python + Bash)</div>
              </div>
              <div>
                <div className="font-semibold text-foreground">APIs Integrated</div>
                <div className="text-muted-foreground">4 (Bitbucket, Jira, ArgoCD, Prometheus)</div>
              </div>
              <div>
                <div className="font-semibold text-foreground">Metrics Exposed</div>
                <div className="text-muted-foreground">15+ Prometheus metrics</div>
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
                href="/projects/observability"
                className="block text-sm font-medium hover:text-primary transition-colors"
              >
                Observability Stack →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </article>
    </>
  );
}
