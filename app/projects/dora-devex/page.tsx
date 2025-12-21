"use client";

import { CodeSnippet } from "@/components/code-snippet";
import { DoraArchitecture } from "@/components/dora-architecture";
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
  headline: "DORA Metrics & Developer Experience Platform",
  description:
    "Building comprehensive business intelligence and developer experience tooling—automated metrics collection, intelligent notifications, and deployment gates",
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
    "DORA Metrics",
    "Developer Experience",
    "Python",
    "Prometheus",
    "Grafana",
    "Jira API",
    "Bitbucket API",
  ],
  dependencies:
    "Python, Prometheus, Grafana, ArgoCD API, Bitbucket API, Jira API, Teams Webhooks",
};

export default function DORADevExPage() {
  return (
    <CaseStudyLayout schema={articleSchema}>
      <CaseStudyHero
        title="DORA Metrics Platform"
        subtitle="Developer Experience & Business Intelligence"
        description="Building comprehensive business intelligence and developer experience tooling—automated metrics collection, intelligent notifications, and deployment gates"
        date="2024-2025"
        metrics="400 Deploys/Month Visibility"
        color="#f59e0b"
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
                  text: "Leadership couldn't demonstrate engineering velocity to stakeholders, and QA teams were constantly surprised by incomplete releases",
                }}
              >
                <p>
                  Engineering leadership had{" "}
                  <strong className="text-foreground">
                    zero visibility into deployment velocity
                  </strong>{" "}
                  across 20 microservices and 4 environments. Critical business questions remained
                  unanswered:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                  <li>&quot;How many deployments did we do this month?&quot;</li>
                  <li>&quot;What&apos;s our average lead time from commit to production?&quot;</li>
                  <li>&quot;Which Jira tickets are in the QA release right now?&quot;</li>
                  <li>&quot;Where are our deployment bottlenecks?&quot;</li>
                </ul>
                <p className="mt-4">
                  Additionally, developers had{" "}
                  <strong className="text-foreground">poor visibility into pipeline execution</strong>:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                  <li>Manual checking of pipeline status across multiple services</li>
                  <li>No proactive notifications for deployment events</li>
                  <li>Silent security vulnerabilities discovered weeks later</li>
                  <li>Premature QA deployments missing required Jira metadata</li>
                </ul>
              </ChallengeBox>
            </CaseStudySection>

            {/* Solution Overview */}
            <CaseStudySection
              eyebrow="// the solution"
              title="The Solution: Multi-Layered Intelligence Platform"
            >
              <p className="text-muted-foreground mb-6">
                I designed and built a{" "}
                <strong className="text-foreground">comprehensive DevEx platform</strong> consisting
                of three integrated components that transformed engineering operations:
              </p>

              <StaggerContainer className="grid gap-4 md:grid-cols-3">
                <StaggerItem>
                  <GlassCard className="p-6 h-full border-amber-500/30">
                    <div className="text-amber-400 font-mono text-sm mb-2">01</div>
                    <h3 className="font-semibold text-foreground mb-2">DORA Metrics Collector</h3>
                    <p className="text-xs text-muted-foreground">
                      Python service correlating GitOps, Bitbucket, Jira, and ArgoCD data
                    </p>
                  </GlassCard>
                </StaggerItem>
                <StaggerItem>
                  <GlassCard className="p-6 h-full border-amber-500/30">
                    <div className="text-amber-400 font-mono text-sm mb-2">02</div>
                    <h3 className="font-semibold text-foreground mb-2">Pipeline Reporter</h3>
                    <p className="text-xs text-muted-foreground">
                      Intelligent Teams notifications with rich context and smart routing
                    </p>
                  </GlassCard>
                </StaggerItem>
                <StaggerItem>
                  <GlassCard className="p-6 h-full border-amber-500/30">
                    <div className="text-amber-400 font-mono text-sm mb-2">03</div>
                    <h3 className="font-semibold text-foreground mb-2">Deployment Gates</h3>
                    <p className="text-xs text-muted-foreground">
                      Automated quality checks preventing premature releases
                    </p>
                  </GlassCard>
                </StaggerItem>
              </StaggerContainer>
            </CaseStudySection>

            {/* Architecture */}
            <CaseStudySection eyebrow="// architecture" title="Architecture">
              <DoraArchitecture />
            </CaseStudySection>

            {/* Component 1 */}
            <CaseStudySection
              eyebrow="// component 1"
              title="DORA Metrics Collector"
            >
              <p className="text-muted-foreground mb-6">
                A Python service that acts as a{" "}
                <strong className="text-foreground">centralised correlation engine</strong> between
                disconnected systems.
              </p>

              <div className="space-y-4">
                <GlassCard className="p-6">
                  <h4 className="font-semibold mb-3 text-amber-400">Data Sources</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <strong className="text-foreground">ArgoCD Apps Repo</strong> — Desired
                      deployment state (Kustomize manifests)
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <strong className="text-foreground">ArgoCD API</strong> — Actual deployment
                      state, sync status, health
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <strong className="text-foreground">Bitbucket API</strong> — Commit metadata,
                      author, timestamp
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <strong className="text-foreground">Jira API</strong> — Ticket enrichment
                      (status, release versions, sprint)
                    </li>
                  </ul>
                </GlassCard>

                <GlassCard className="p-6">
                  <h4 className="font-semibold mb-3 text-amber-400">Key Metrics Exposed</h4>
                  <div className="grid gap-2 text-xs font-mono">
                    <div className="grid grid-cols-2 gap-2">
                      <code className="bg-secondary px-2 py-1 rounded">deployment_desired_state</code>
                      <code className="bg-secondary px-2 py-1 rounded">deployment_actual_state</code>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <code className="bg-secondary px-2 py-1 rounded">deployment_lead_time_seconds</code>
                      <code className="bg-secondary px-2 py-1 rounded">deployment_age_seconds</code>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <code className="bg-secondary px-2 py-1 rounded">ticket_in_environment</code>
                      <code className="bg-secondary px-2 py-1 rounded">ticket_fix_version</code>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </CaseStudySection>

            {/* Component 2 */}
            <CaseStudySection
              eyebrow="// component 2"
              title="Intelligent Pipeline Reporter"
            >
              <p className="text-muted-foreground mb-6">
                A 1000+ line Bash script that transforms pipeline events into{" "}
                <strong className="text-foreground">rich, actionable Teams notifications</strong>{" "}
                with smart routing and context.
              </p>

              <div className="space-y-4">
                <GlassCard className="p-6">
                  <h4 className="font-semibold mb-3 text-amber-400">Smart Notification Routing</h4>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      <strong className="text-foreground">Platform Deployments Channel:</strong> Dev,
                      QA, PreProd, Prod deployments
                    </p>
                    <p>
                      <strong className="text-foreground">Security Channel:</strong> SAST/SCA alerts
                      from Veracode/SourceClear
                    </p>
                    <p>
                      <strong className="text-foreground">PR Notifications Channel:</strong> Feature
                      branch deployments with PR context
                    </p>
                    <p>
                      <strong className="text-foreground">QA Team Channel:</strong> QA deployment
                      events for testing coordination
                    </p>
                  </div>
                </GlassCard>

                <GlassCard className="p-6 border-amber-500/30">
                  <h4 className="font-semibold mb-3 text-amber-400">Easter Eggs & DevEx Enhancements</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Because developer experience means making the boring stuff enjoyable:
                  </p>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex gap-3 items-start">
                      <span className="text-amber-400 shrink-0">Build #42:</span>
                      <span className="text-muted-foreground italic">&quot;The answer to life, the universe, and this deployment&quot;</span>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-amber-400 shrink-0">Build #404:</span>
                      <span className="text-muted-foreground italic">&quot;This build was not found... wait, yes it was&quot;</span>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-amber-400 shrink-0">Friday 5pm:</span>
                      <span className="text-muted-foreground italic">&quot;Bold.&quot;</span>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="text-amber-400 shrink-0">May 4th:</span>
                      <span className="text-muted-foreground italic">&quot;May the Fourth be with this code&quot;</span>
                    </div>
                  </div>
                </GlassCard>

                {/* Example notification */}
                <GlassCard className="p-6">
                  <h4 className="font-semibold mb-4 text-amber-400">Example Test Results Notification</h4>
                  <div className="rounded-lg border border-red-500/30 bg-gradient-to-b from-red-900/40 to-card overflow-hidden text-sm">
                    {/* Header */}
                    <div className="bg-red-900/60 px-4 py-3 flex items-center gap-3">
                      <span className="text-red-400 text-xl">✕</span>
                      <div>
                        <div className="font-semibold text-foreground">Harmony • DEV</div>
                        <div className="text-xs text-red-400">Tests Failed</div>
                      </div>
                    </div>
                    {/* Stats */}
                    <div className="p-4">
                      <div className="grid grid-cols-4 gap-4 text-center mb-4">
                        <div>
                          <div className="text-2xl font-bold text-green-400">88</div>
                          <div className="text-xs text-green-400">Passed</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-400">27</div>
                          <div className="text-xs text-red-400">Failed</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-foreground">119</div>
                          <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-foreground">74%</div>
                          <div className="text-xs text-muted-foreground">Success</div>
                        </div>
                      </div>
                      {/* Test Breakdown */}
                      <div className="space-y-1 text-xs mb-3">
                        <div className="font-semibold text-muted-foreground">Test Breakdown</div>
                        <div><strong className="text-foreground">API Tests</strong>   87/113 passed (4 skipped)</div>
                        <div><strong className="text-foreground">UI Tests</strong>    1/6 passed</div>
                      </div>
                      {/* Meta */}
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <div>Version: a5ece15-b4280</div>
                        <div>Tags: api-smoke, harmony, @ui-sanity</div>
                      </div>
                      {/* Buttons */}
                      <div className="flex gap-2 mt-4">
                        <span className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded text-xs font-medium flex items-center gap-1">
                          <span>◉</span> Open in ArgoCD
                        </span>
                        <span className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded text-xs font-medium flex items-center gap-1">
                          <span>📊</span> View Test Report
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </CaseStudySection>

            {/* Component 3 */}
            <CaseStudySection
              eyebrow="// component 3"
              title="Automated Deployment Gates"
            >
              <p className="text-muted-foreground mb-6">
                Intelligent checks that{" "}
                <strong className="text-foreground">prevent premature deployments</strong> and
                enforce quality standards.
              </p>

              <GlassCard className="p-6">
                <h4 className="font-semibold mb-4 text-amber-400">
                  Jira Release Version Check (QA Gate)
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A Bash script that enforces Jira Release Version assignment before QA deployment,
                  preventing incomplete releases from reaching QA.
                </p>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    1. <strong className="text-foreground">Determine Current QA State:</strong>{" "}
                    Queries ArgoCD apps repo to find currently deployed commit SHA
                  </p>
                  <p>
                    2. <strong className="text-foreground">Identify New Commits:</strong> Uses{" "}
                    <code className="bg-secondary px-1 rounded text-xs">git rev-list</code> to find
                    commits between QA and HEAD
                  </p>
                  <p>
                    3. <strong className="text-foreground">Extract Jira Tickets:</strong> Regex
                    matching on commit messages
                  </p>
                  <p>
                    4. <strong className="text-foreground">Validate Release Versions:</strong> Queries
                    Jira API to check each ticket
                  </p>
                  <p>
                    5. <strong className="text-foreground">Block or Allow:</strong> Fails pipeline
                    with actionable error message
                  </p>
                </div>

                <div className="mt-6">
                  <EnhancedCodeBlock
                    title="Example Error Output"
                    code={`════════════════════════════════════════════════════
❌ QA DEPLOYMENT BLOCKED
════════════════════════════════════════════════════

The following 2 ticket(s) are missing Release Version/s:

  🎫 PROJ-1001
     https://company.atlassian.net/browse/PROJ-1001

  🎫 PROJ-1002
     https://company.atlassian.net/browse/PROJ-1002

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ACTION REQUIRED:
1. Open each ticket above in Jira
2. Set the 'Release Version/s' field
3. Re-run this QA deployment pipeline`}
                  />
                </div>
              </GlassCard>
            </CaseStudySection>

            {/* Business Impact */}
            <CaseStudySection eyebrow="// impact" title="Business Impact">
              <StatsGrid
                color="#f59e0b"
                stats={[
                  { value: "400+", label: "Deployments tracked per month" },
                  { value: "2-3 days", label: "Average lead time measured" },
                  { value: "100%", label: "Deployment visibility for leadership" },
                  { value: "4", label: "Smart notification channels" },
                  { value: "Zero", label: "Incomplete QA releases" },
                  { value: "Self-serve", label: "Release visibility for all stakeholders" },
                ]}
              />
            </CaseStudySection>

            {/* Technical Highlights */}
            <CaseStudySection eyebrow="// highlights" title="Technical Highlights">
              <ul className="space-y-4">
                <LessonItem>
                  Built production-grade Python service with retry logic, caching, and parallel
                  processing
                </LessonItem>
                <LessonItem>
                  Integrated 4 separate APIs (Bitbucket, Jira, ArgoCD, Prometheus) into unified
                  intelligence layer
                </LessonItem>
                <LessonItem>
                  Designed 50+ custom Prometheus metrics enabling comprehensive DORA dashboards
                </LessonItem>
                <LessonItem>
                  Implemented sophisticated Bash scripting (1000+ lines) for rich Teams notifications
                </LessonItem>
                <LessonItem>
                  Created automated deployment gates with Jira API integration and delta detection
                </LessonItem>
                <LessonItem>
                  Improved developer experience with actionable notifications and early validation
                </LessonItem>
              </ul>
            </CaseStudySection>
          </div>

          {/* Sidebar */}
          <TechSidebar
            technologies={[
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
              "Adaptive Cards",
            ]}
            skills={[
              "API Integration & Correlation",
              "Metrics Design & Exposition",
              "Developer Experience Design",
              "Business Intelligence Tooling",
              "Quality Gates & Automation",
              "Notification Systems",
              "Python Development",
              "Advanced Bash Scripting",
            ]}
            metrics={[
              { label: "Components Built", value: "3 integrated tools" },
              { label: "Code Volume", value: "~8000 lines (Python + Bash)" },
              { label: "APIs Integrated", value: "4 (Bitbucket, Jira, ArgoCD, Prometheus)" },
              { label: "Metrics Exposed", value: "50+ Prometheus metrics" },
            ]}
            relatedProjects={[
              { title: "CI/CD & GitOps Platform", href: "/projects/cicd-gitops" },
              { title: "Observability Stack", href: "/projects/observability" },
            ]}
          />
        </div>
      </div>

      <CaseStudyCTA />
    </CaseStudyLayout>
  );
}
