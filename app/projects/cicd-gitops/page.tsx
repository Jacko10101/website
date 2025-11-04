import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { ScrollProgress } from "@/components/scroll-progress";
import { CicdArchitecture } from "@/components/cicd-architecture";
import { BeforeAfterSlider } from "@/components/before-after-slider";

export const metadata = {
  title: "CI/CD & GitOps Platform Engineering | DevlinOps Case Study",
  description: "Architecting production-ready CI/CD from greenfield microservices migration to 400 deploys/month across 20 services.",
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "CI/CD & GitOps Platform Engineering",
  "description": "Building production-grade CI/CD infrastructure from scratch—evolving a greenfield microservices platform to 400 deploys/month with enterprise security",
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
  "keywords": ["CI/CD", "GitOps", "ArgoCD", "Kubernetes", "Bitbucket Pipelines", "Platform Engineering"],
  "dependencies": "Kubernetes, ArgoCD, Bitbucket Pipelines, Kustomize, Docker, AWS ECR"
};

export default function CicdGitopsPage() {
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
          CI/CD & GitOps Platform Engineering
        </h1>
        <p className="mb-6 text-xl text-muted-foreground">
          Building production-grade CI/CD infrastructure from scratch—evolving a greenfield microservices platform to 400 deploys/month with enterprise security
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>2023-2025 (2-year evolution)</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>20 Microservices • 400 Deploys/Month</span>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          {/* Context Section */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">The Challenge</h2>
            <div className="rounded-lg border border-border bg-secondary/50 p-6 space-y-4">
              <p className="text-muted-foreground">
                I joined as a <strong className="text-foreground">Graduate QA Engineer</strong> at the very beginning of a massive architectural transformation: <strong className="text-foreground">migrating from a legacy monolith to a modern Kubernetes-based microservices platform</strong>.
              </p>
              <p className="text-muted-foreground">
                With no existing CI/CD infrastructure and a blank canvas, I was tasked with designing and implementing the entire deployment pipeline that would serve <strong className="text-foreground">20+ microservices across 4 environments</strong> (Dev, QA, Pre-Prod, Production).
              </p>
              <div className="mt-4 rounded-md bg-muted p-4 border border-border">
                <h4 className="font-semibold mb-2">Initial Requirements</h4>
                <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                  <li>• <strong className="text-foreground">Zero existing infrastructure</strong> — build everything from scratch</li>
                  <li>• <strong className="text-foreground">Multi-environment strategy</strong> — Dev, QA, Pre-Prod, Prod with different promotion rules</li>
                  <li>• <strong className="text-foreground">Security-first approach</strong> — SAST/SCA scanning, compliance gates</li>
                  <li>• <strong className="text-foreground">Developer productivity</strong> — abstract complexity, create "paved path"</li>
                  <li>• <strong className="text-foreground">GitOps-native</strong> — declarative deployments with ArgoCD</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Evolution Section */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">The Evolution</h2>
            <div className="space-y-6">
              <p className="text-muted-foreground">
                Over <strong className="text-foreground">2 years of iterative platform engineering</strong>, I transformed a basic build script into a sophisticated, production-ready CI/CD platform. Here's how it evolved:
              </p>

              <div className="space-y-6">
                {/* Phase 1 */}
                <div className="rounded-lg border border-border bg-card p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <span className="text-primary">Phase 1:</span> Foundation (Months 1-6)
                  </h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>Built the initial pipeline architecture with basic Maven builds, Docker image creation, and manual ECR pushes.</p>
                    <div className="rounded-lg border border-border bg-muted p-4 font-mono text-xs overflow-x-auto">
                      <pre className="text-muted-foreground">
{`# Early Pipeline (bitbucket-pipelines.yml)
image: maven:3.9.6
pipelines:
  branches:
    master:
      - step:
          name: Build, Test, and Push Docker Image
          script:
            - mvn clean install
            - mvn test
            - docker build -t $IMAGE_NAME:$IMAGE_TAG .
            - pipe: atlassian/aws-ecr-push-image:2.2.0

      - step:
          name: Deploy to Dev
          script:
            - git clone git@bitbucket.org:company/argocd-apps.git
            - ./scripts/update_tag.sh  # Update deployment manifest
            - git push origin master`}
                      </pre>
                    </div>
                    <p className="pt-2"><strong className="text-foreground">Key Achievement:</strong> Established GitOps pattern with ArgoCD for declarative deployments</p>
                  </div>
                </div>

                {/* Phase 2 */}
                <div className="rounded-lg border border-border bg-card p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <span className="text-primary">Phase 2:</span> Standardisation & Reusability (Months 6-12)
                  </h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>Created reusable pipeline components and custom base images to eliminate duplication across services.</p>
                    <ul className="space-y-2 ml-4">
                      <li>• <strong className="text-foreground">Custom Base Image</strong> — Pre-built Maven image with kubectl, ArgoCD CLI, AWS CLI, jq</li>
                      <li>• <strong className="text-foreground">Shared Pipeline Scripts</strong> — `pipeline_reporter.sh` for centralised notifications</li>
                      <li>• <strong className="text-foreground">Kustomize Overlays</strong> — Environment-specific configuration management</li>
                      <li>• <strong className="text-foreground">App-of-Apps Pattern</strong> — Hierarchical ArgoCD application management</li>
                    </ul>
                    <div className="mt-3 rounded-md bg-primary/10 border border-primary/50 p-3">
                      <p className="text-xs"><strong className="text-primary">Innovation:</strong> Built custom Docker base image reducing pipeline config by ~40% and ensuring consistency</p>
                    </div>
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="rounded-lg border border-border bg-card p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <span className="text-primary">Phase 3:</span> Security & Quality Gates (Months 12-18)
                  </h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>Integrated enterprise security scanning and quality gates directly into the pipeline.</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-md bg-secondary p-3 border border-border">
                        <h4 className="font-semibold text-foreground mb-1">SAST (Veracode)</h4>
                        <p className="text-xs">Static code analysis blocking critical/high vulnerabilities</p>
                      </div>
                      <div className="rounded-md bg-secondary p-3 border border-border">
                        <h4 className="font-semibold text-foreground mb-1">SCA (SourceClear)</h4>
                        <p className="text-xs">Dependency vulnerability scanning with automated reporting</p>
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-muted p-4 font-mono text-xs overflow-x-auto mt-3">
                      <pre className="text-muted-foreground">
{`# Security Scans in Parallel (Pull Requests)
pipelines:
  pull-requests:
    '**':
      - step: *unit-tests
      - parallel:
          - step: *integration-tests
          - step: *security-scan      # SCA
          - step: *static-analysis    # SAST
          - step: *veracode-ui-upload`}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Phase 4 */}
                <div className="rounded-lg border border-border bg-card p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <span className="text-primary">Phase 4:</span> Test Orchestration & Observability (Months 18-24)
                  </h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>Migrated from brittle pipeline-based testing to robust ArgoCD PostSync hooks with comprehensive observability.</p>
                    <ul className="space-y-2 ml-4">
                      <li>• <strong className="text-foreground">PostSync Hook Architecture</strong> — Tests run AFTER deployment completes (eliminated race conditions)</li>
                      <li>• <strong className="text-foreground">Automated Test Suites</strong> — Newman (API), Cucumber (BDD) packaged as Kubernetes Jobs</li>
                      <li>• <strong className="text-foreground">S3 Integration</strong> — Test results uploaded for historical analysis and compliance</li>
                      <li>• <strong className="text-foreground">Teams Notifications</strong> — Rich webhook messages with test status, deployment info, and ArgoCD links</li>
                      <li>• <strong className="text-foreground">DORA Metrics</strong> — Built custom collector tracking deployment frequency, lead time, MTTR</li>
                    </ul>
                    <div className="mt-3 rounded-md bg-primary/10 border border-primary/50 p-3">
                      <p className="text-xs"><strong className="text-primary">Business Impact:</strong> Reduced false test results by ~90% and provided deployment visibility to entire org</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Architecture Diagram */}
          <section>
            <CicdArchitecture />
          </section>

          {/* Current State */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Current State: Production-Grade Platform</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Today's pipeline is a <strong className="text-foreground">fully standardised, production-ready CI/CD platform</strong> supporting 20 microservices with sophisticated testing, security, and deployment automation.
              </p>

              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <h3 className="text-lg font-semibold mb-3">Pipeline Architecture</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">→</span>
                    <span><strong className="text-foreground">Parallel Test Execution:</strong> Unit, integration, SAST, SCA run concurrently (~5min total)</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">→</span>
                    <span><strong className="text-foreground">Automated Deployments:</strong> Master → Dev (auto), QA (auto w/ Jira gate), Pre-Prod (manual), Prod (manual)</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">→</span>
                    <span><strong className="text-foreground">Jira Integration:</strong> Fix Version validation prevents premature QA deployments</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">→</span>
                    <span><strong className="text-foreground">Reusable Components:</strong> Custom base image, shared scripts, standardised Kustomize overlays</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">→</span>
                    <span><strong className="text-foreground">PostSync Testing:</strong> Kubernetes Jobs execute tests after ArgoCD sync completion</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted p-4 font-mono text-xs overflow-x-auto">
                <pre className="text-muted-foreground">
{`# Modern Pipeline (Standardized for 20 Services)
image: 123456789012.dkr.ecr.region.amazonaws.com/company/pipeline-base-image:v1.2

definitions:
  steps:
    unit-tests: &unit-tests
      name: "Unit Tests"
      script:
        - mvn -B clean install -Pfast-tests
        - pipeline_reporter.sh test_failure ci "Unit Tests"

    integration-tests: &integration-tests
      name: "Integration Tests"
      size: 2x
      script:
        - mvn -B clean verify -Pintegration-tests
        - pipeline_reporter.sh test_failure ci "Integration Tests"

    security-scan: &security-scan
      name: "Software Composition Analysis"
      script:
        - curl -sSL https://download.sourceclear.com/ci.sh | sh
        - pipeline_reporter.sh security_alert pr "Critical vulnerabilities"

    static-analysis: &static-analysis
      name: "Static Analysis"
      script:
        - java -jar pipeline-scan.jar -vid "$VERACODE_API_ID"
        - pipeline_reporter.sh security_alert pr "Code vulnerabilities"

pipelines:
  pull-requests:
    '**':
      - step: *unit-tests
      - parallel:
          - step: *integration-tests
          - step: *security-scan
          - step: *static-analysis

  branches:
    master:
      - step: *unit-tests
      - step:
          name: "Docker Build & Push"
          script:
            - docker build -t $IMAGE_NAME:$IMAGE_TAG .
            - pipe: atlassian/aws-ecr-push-image:2.4.2

      - step:
          name: "Deploy to Dev"
          script:
            - git clone https://x-token-auth:$TOKEN@bitbucket.org/company/argocd-apps.git
            - ./scripts/update_kustomization.sh dev "$IMAGE_TAG"
            - pipeline_reporter.sh deploy_success dev

      - step:
          name: "Jira Fix Version Check - QA Gate"
          script:
            - jira_fix_version_check.sh  # Validates Jira ticket status

      - step:
          name: "Deploy to QA"
          script:
            - ./scripts/update_kustomization.sh qa "$IMAGE_TAG"
            - pipeline_reporter.sh deploy_success qa

  custom:
    preprod-deploy:
      - variables:
          - name: IMAGE_TAG
      - step:
          name: "Deploy to PreProd"
          script:
            - ./scripts/update_kustomization.sh preprod "$IMAGE_TAG"

    prod-deploy:
      - variables:
          - name: IMAGE_TAG
      - step:
          name: "Deploy to Production"
          script:
            - ./scripts/update_kustomization.sh prod "$IMAGE_TAG"`}
                </pre>
              </div>
            </div>
          </section>

          {/* Business Impact */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Business Impact</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">400+</div>
                <p className="text-sm text-muted-foreground">
                  Deployments per month across all environments (verified via custom DORA metrics collector)
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">~5 min</div>
                <p className="text-sm text-muted-foreground">
                  Consistent build time with parallel test execution—optimised through iterative improvements
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">20</div>
                <p className="text-sm text-muted-foreground">
                  Microservices using standardised pipeline—"paved path" reduces onboarding to &lt;1 day
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">Zero</div>
                <p className="text-sm text-muted-foreground">
                  Production incidents from deployment failures—safety gates catch issues pre-prod
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">~90%</div>
                <p className="text-sm text-muted-foreground">
                  Reduction in false test results after PostSync hook migration (eliminated race conditions)
                </p>
              </div>
              <div className="rounded-lg border border-primary/50 bg-primary/10 p-6">
                <div className="mb-2 text-3xl font-bold text-primary">100%</div>
                <p className="text-sm text-muted-foreground">
                  Security scan coverage on all PRs—critical/high vulnerabilities blocked automatically
                </p>
              </div>
            </div>
          </section>

          {/* Before/After Transformation */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Transformation Metrics</h2>
            <p className="mb-6 text-muted-foreground">
              Drag the slider to see the dramatic transformation from manual processes to automated platform engineering.
            </p>
            <BeforeAfterSlider
              metrics={[
                {
                  label: "Deployment Frequency",
                  before: "2/week",
                  after: "400/month",
                },
                {
                  label: "Build Time",
                  before: "15+ min",
                  after: "~5 min",
                },
                {
                  label: "Service Onboarding",
                  before: "1 week",
                  after: "<1 day",
                },
                {
                  label: "Test Reliability",
                  before: "?%",
                  after: "95%+",
                },
              ]}
            />
          </section>

          {/* Key Innovations */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Key Technical Innovations</h2>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-semibold mb-3">1. Custom Pipeline Base Image</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Built a reusable Docker image with pre-installed tooling (kubectl, ArgoCD CLI, AWS CLI, Maven, custom scripts) reducing pipeline configuration by ~40% and ensuring consistency.
                </p>
                <div className="rounded-lg border border-border bg-muted p-3 font-mono text-xs">
                  <pre className="text-muted-foreground">
{`FROM maven:3.9.6
RUN apt-get install -y curl git unzip jq && \\
    curl -LO "https://.../kubectl" && chmod +x kubectl && \\
    curl -sSL -o /usr/local/bin/argocd https://.../argocd-linux-amd64
COPY pipeline_reporter.sh jira_fix_version_check.sh /usr/local/bin/`}
                  </pre>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-semibold mb-3">2. Kustomize-Based Environment Management</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Architected a base + overlays pattern for environment-specific configuration, eliminating duplication and reducing deployment errors.
                </p>
                <div className="text-xs text-muted-foreground space-y-1 ml-4">
                  <p>• <strong className="text-foreground">Base:</strong> Shared Deployment, Service, ConfigMap templates</p>
                  <p>• <strong className="text-foreground">Overlays:</strong> Dev (CPU: 500m), QA (CPU: 1000m), Prod (CPU: 2000m, replicas: 3)</p>
                  <p>• <strong className="text-foreground">Script:</strong> `update_kustomization.sh` updates image tags via `kustomize edit set image`</p>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-semibold mb-3">3. ArgoCD App-of-Apps Pattern</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Designed hierarchical ArgoCD application management where parent apps manage child apps, enabling PostSync hook testing per service.
                </p>
                <div className="rounded-lg border border-border bg-muted p-3 font-mono text-xs">
                  <pre className="text-muted-foreground">
{`apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: myservice-dev
spec:
  sources:
  - repoURL: 'git@bitbucket.org:.../argocd-apps.git'
    path: 'applications/myservice/overlays/dev'
  - repoURL: 'git@bitbucket.org:.../argocd-apps.git'
    path: 'infra/test-suites/job-only'
    kustomize:
      patches:
      - target:
          kind: Job
        patch: |
          - op: add
            path: /metadata/annotations/argocd.argoproj.io~1hook
            value: PostSync`}
                  </pre>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-semibold mb-3">4. Comprehensive Test Orchestration</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Built a 1100+ line Bash orchestrator (`run_all_tests.sh`) managing Newman API tests, Cucumber BDD tests, S3 uploads, and Teams notifications.
                </p>
                <div className="text-xs text-muted-foreground space-y-1 ml-4">
                  <p>• <strong className="text-foreground">Deployment Health:</strong> kubectl checks for CrashLoopBackOff, ImagePullBackOff before tests</p>
                  <p>• <strong className="text-foreground">Test Execution:</strong> Runs all Postman collections + Cucumber features with timeouts</p>
                  <p>• <strong className="text-foreground">Result Processing:</strong> Generates HTML index pages, uploads to S3 with pre-signed URLs</p>
                  <p>• <strong className="text-foreground">Notifications:</strong> Sends rich Teams webhooks with deployment context and test results</p>
                </div>
              </div>
            </div>
          </section>

          {/* Teams Notifications */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Intelligent Notifications & Smart Routing</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Pipeline reporter sends rich Microsoft Teams Adaptive Cards with smart routing across 4 channels—Platform Deployments, Security Alerts, QA notifications, and PR reviews.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl">✅</span>
                  <h4 className="font-semibold text-foreground">Configuration Updated</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3">GitOps state synced to cluster</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Build:</span>
                    <span className="font-medium">#3888</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Environment:</span>
                    <span className="font-medium">QA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Developer:</span>
                    <span className="font-medium">Dohn Joe</span>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="rounded bg-blue-500/20 px-2 py-1 text-[10px] font-medium">🚀 ArgoCD</span>
                  <span className="rounded bg-blue-500/20 px-2 py-1 text-[10px] font-medium">View Pipeline</span>
                </div>
              </div>

              <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <h4 className="font-semibold text-foreground">Security Alert: Identity API</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3">1 High vulnerability in dependencies</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Build:</span>
                    <span className="font-medium">#450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Environment:</span>
                    <span className="font-medium">PULL REQUEST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priority:</span>
                    <span className="font-medium text-red-400">⚡ High</span>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="rounded bg-red-500/20 px-2 py-1 text-[10px] font-medium">📝 Create Jira</span>
                  <span className="rounded bg-red-500/20 px-2 py-1 text-[10px] font-medium">🔍 Veracode</span>
                </div>
              </div>

              <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl">✅</span>
                  <h4 className="font-semibold text-foreground">Smoke Tests Passed</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3">All automated tests completed successfully</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">API Tests:</span>
                    <span className="font-medium text-green-400">✅ Passed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cucumber:</span>
                    <span className="font-medium text-green-400">✅ Passed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">7 minutes</span>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <span className="rounded bg-green-500/20 px-2 py-1 text-[10px] font-medium">📊 Test Results</span>
                  <span className="rounded bg-green-500/20 px-2 py-1 text-[10px] font-medium">🚀 ArgoCD</span>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-secondary/50 p-4">
                <h4 className="font-semibold text-foreground mb-2">Smart Features</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• <strong className="text-foreground">Channel Routing:</strong> Platform, Security, QA, PR</li>
                  <li>• <strong className="text-foreground">Deep Links:</strong> ArgoCD, Veracode, Jira, S3</li>
                  <li>• <strong className="text-foreground">Auto Jira:</strong> Security alerts create stories</li>
                  <li>• <strong className="text-foreground">Easter Eggs:</strong> Build milestones, Friday warnings</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Lessons Learned */}
          <section>
            <h2 className="mb-4 text-2xl font-bold">Lessons Learned</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">→</span>
                <span><strong className="text-foreground">Iterative improvement beats big-bang rewrites:</strong> Each phase built on the previous, allowing production usage throughout</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">→</span>
                <span><strong className="text-foreground">Standardisation is key to scale:</strong> Reusable components (base images, scripts) made onboarding new services trivial</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">→</span>
                <span><strong className="text-foreground">GitOps eliminates deployment drift:</strong> Declarative configs in Git provided audit trail and rollback capability</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">→</span>
                <span><strong className="text-foreground">Testing architecture matters:</strong> Moving from pipeline polling to PostSync hooks eliminated an entire class of flaky tests</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">→</span>
                <span><strong className="text-foreground">Observability from day one:</strong> DORA metrics, deployment notifications, and test reporting enabled data-driven improvements</span>
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
                "Bitbucket Pipelines",
                "ArgoCD",
                "Kubernetes",
                "Kustomize",
                "Docker",
                "Maven",
                "AWS ECR",
                "Veracode (SAST)",
                "SourceClear (SCA)",
                "Bash",
                "Newman",
                "Cucumber",
                "S3",
                "Teams Webhooks",
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
              <li>• Platform Engineering</li>
              <li>• CI/CD Architecture Design</li>
              <li>• GitOps Implementation</li>
              <li>• Container Orchestration</li>
              <li>• Security Integration (SAST/SCA)</li>
              <li>• Test Automation</li>
              <li>• Infrastructure as Code</li>
              <li>• Observability & Metrics</li>
              <li>• Developer Experience</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Project Metrics</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="font-semibold text-foreground">Timeline</div>
                <div className="text-muted-foreground">24 months of iterative development</div>
              </div>
              <div>
                <div className="font-semibold text-foreground">Scale</div>
                <div className="text-muted-foreground">20 microservices, 4 environments</div>
              </div>
              <div>
                <div className="font-semibold text-foreground">Deployment Velocity</div>
                <div className="text-muted-foreground">400+ deploys/month</div>
              </div>
              <div>
                <div className="font-semibold text-foreground">Build Performance</div>
                <div className="text-muted-foreground">~5 minutes (parallel testing)</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold">Related Projects</h3>
            <div className="space-y-3">
              <Link
                href="/projects/dora-devex"
                className="block text-sm font-medium hover:text-primary transition-colors"
              >
                DORA Metrics & DevEx →
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
