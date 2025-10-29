import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

export const metadata = {
  title: "Test Orchestration Modernization | DevlinOps Case Study",
  description: "Refactoring test execution from imperative pipelines to declarative ArgoCD PostSync hooks across 47 PRs.",
};

export default function TestOrchestrationPage() {
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
          Test Orchestration Modernization
        </h1>
        <p className="mb-6 text-xl text-muted-foreground">
          Eliminating race conditions by refactoring from imperative pipeline polling to declarative ArgoCD PostSync hooks
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Q2-Q3 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>GENX-4449 (47 PRs merged)</span>
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
                Our CI/CD pipeline had a critical reliability issue: <strong className="text-foreground">tests frequently ran against the wrong application version</strong>.
              </p>
              <div className="space-y-3 ml-4">
                <div className="rounded-md bg-destructive/10 border border-destructive/50 p-4">
                  <h4 className="font-semibold mb-2 text-destructive">The Race Condition</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Bitbucket Pipeline triggers ArgoCD sync (via git commit to apps repo)</li>
                    <li>Pipeline immediately starts polling: <code className="text-xs bg-muted px-1 py-0.5 rounded">kubectl wait --for=condition=Ready</code></li>
                    <li>Pods become "Ready" but ArgoCD sync is still in progress</li>
                    <li>Tests run against <strong className="text-destructive">old application version</strong></li>
                    <li>False positives or false negatives in test results</li>
                  </ol>
                </div>
              </div>
              <p className="text-muted-foreground">
                <strong className="text-foreground">The deeper issue:</strong> Imperative polling logic in Bash scripts couldn't account for ArgoCD's eventual consistency model. Tests needed to wait for "sync complete" not "pods ready."
              </p>
            </div>
          </section>

          {/* Solution Section */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">The Solution</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                I led a <strong className="text-foreground">complete architectural shift</strong> from imperative pipeline orchestration to declarative GitOps-native test execution using <strong className="text-foreground">ArgoCD PostSync Hooks</strong>.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Before: Imperative Pipeline Polling</h3>
              <div className="rounded-lg border border-border bg-muted p-4 font-mono text-xs overflow-x-auto">
                <pre className="text-muted-foreground">
{`# Bitbucket Pipeline (Anti-Pattern)
- step: deploy-qa
    script:
      - git commit -m "Deploy to QA"
      - git push origin main
      - sleep 30  # ❌ Hope ArgoCD syncs?
      - kubectl wait --for=condition=Ready pod -l app=myservice
      - ./run-tests.sh  # ❌ Runs against wrong version!`}
                </pre>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3">After: Declarative PostSync Hooks</h3>
              <div className="rounded-lg border border-border bg-muted p-4 font-mono text-xs overflow-x-auto">
                <pre className="text-muted-foreground">
{`# ArgoCD Application Manifest
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myservice-qa
spec:
  # ... deployment config ...
  syncPolicy:
    automated: {}
  # ✅ Test Job runs AFTER sync completes
  postSync:
    - name: integration-tests
      kind: Job
      spec:
        template:
          spec:
            containers:
            - name: tests
              image: myservice:{{ .Values.imageTag }}
              command: ["/bin/sh", "-c"]
              args:
                - |
                  ./run-tests.sh
                  ./upload-results-to-s3.sh
                  ./notify-teams.sh`}
                </pre>
              </div>

              <h3 className="text-xl font-semibold mt-6 mb-3">Implementation</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span><strong className="text-foreground">Refactored 47 Pull Requests</strong> across multiple services (Harmony, Orchestrator, CloudBridge, UI)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span><strong className="text-foreground">Kubernetes Job Design:</strong> Packaged test suites as containerized Jobs with proper resource limits and TTLs</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span><strong className="text-foreground">S3 Integration:</strong> Automated test result uploads (JUnit XML, Cucumber JSON) to S3 for historical analysis</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span><strong className="text-foreground">Teams Notifications:</strong> PostSync Jobs send rich webhook messages with test status, logs, and ArgoCD links</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">→</span>
                  <span><strong className="text-foreground">Pipeline Simplification:</strong> Removed 200+ lines of fragile kubectl polling logic</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Impact Section */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Business Impact</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">Zero</div>
                <p className="text-sm text-muted-foreground">
                  Race condition incidents after migration—tests now reliably run against correct version
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">47 PRs</div>
                <p className="text-sm text-muted-foreground">
                  Merged across multiple repositories to complete the refactoring
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">~60%</div>
                <p className="text-sm text-muted-foreground">
                  Reduction in pipeline complexity—eliminated imperative polling scripts
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">Declarative</div>
                <p className="text-sm text-muted-foreground">
                  Test orchestration now version-controlled and managed via GitOps
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
                <span>Deep understanding of ArgoCD sync lifecycle and eventual consistency</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Kubernetes Job design with proper failure handling and cleanup policies</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>S3 integration for test artifact storage and historical analysis</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Teams webhook notifications with structured, actionable messages</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Large-scale refactoring across 47 PRs with zero downtime</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Shifted testing from imperative "push" to declarative "pull" model</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {["ArgoCD", "Kubernetes Jobs", "Bitbucket Pipelines", "Bash", "S3", "Teams Webhooks", "GitOps", "Kustomize"].map(
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
              <li>• System Architecture Design</li>
              <li>• GitOps Patterns</li>
              <li>• Kubernetes Job Orchestration</li>
              <li>• Large-Scale Refactoring</li>
              <li>• CI/CD Pipeline Optimization</li>
              <li>• Problem-Solving</li>
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
