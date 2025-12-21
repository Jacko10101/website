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
                      (status, fix versions, sprint)
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

                <GlassCard className="p-6">
                  <h4 className="font-semibold mb-3 text-amber-400">Easter Eggs & DevEx Enhancements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <strong className="text-foreground">Special Build Messages:</strong> Build #42,
                      #404, #1337, milestone builds
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <strong className="text-foreground">Time-Based Messages:</strong> &quot;May the
                      Fourth be with this code&quot;
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <strong className="text-foreground">Friday Evening Prod Deploys:</strong>{" "}
                      &quot;Bold.&quot; acknowledgment
                    </li>
                  </ul>
                </GlassCard>

                {/* Example notification */}
                <GlassCard className="p-6">
                  <h4 className="font-semibold mb-4 text-amber-400">Example Notification</h4>
                  <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4 text-sm space-y-2">
                    <div className="font-semibold flex items-center gap-2">
                      <span className="text-green-400">✅</span>
                      Configuration Updated: Service A - DEV [Master Branch]
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs mt-3">
                      <div>
                        <strong>Build:</strong> #3881
                      </div>
                      <div>
                        <strong>Environment:</strong> DEV
                      </div>
                      <div>
                        <strong>Commit:</strong> b7ffa920
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-secondary/50 rounded text-xs">
                      <div className="font-semibold">Developer Name</div>
                      <div className="italic mt-1">
                        PROJ-1234 add dev deployment summary, change to short commit hash
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                        View in ArgoCD
                      </span>
                      <span className="px-3 py-1 bg-secondary rounded text-xs">View Pipeline</span>
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
                  Jira Fix Version Check (QA Gate)
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A Bash script that enforces Jira Fix Version assignment before QA deployment,
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
                    4. <strong className="text-foreground">Validate Fix Versions:</strong> Queries
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
                  />
                </div>
              </GlassCard>
            </CaseStudySection>

            {/* Business Impact */}
            <CaseStudySection eyebrow="// impact" title="Business Impact">
              <StatsGrid
                color="#f59e0b"
                stats={[
                  { value: "413", label: "Deployments tracked per month" },
                  { value: "2-3 days", label: "Average lead time measured" },
                  { value: "100%", label: "Deployment visibility for leadership" },
                  { value: "4", label: "Smart notification channels" },
                  { value: "Zero", label: "Incomplete QA releases" },
                  { value: "~80%", label: "Fewer 'what version?' questions" },
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
                  Designed 15+ custom Prometheus metrics enabling comprehensive DORA dashboards
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
              { label: "Code Volume", value: "~2000 lines (Python + Bash)" },
              { label: "APIs Integrated", value: "4 (Bitbucket, Jira, ArgoCD, Prometheus)" },
              { label: "Metrics Exposed", value: "15+ Prometheus metrics" },
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
