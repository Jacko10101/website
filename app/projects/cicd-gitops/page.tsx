"use client";

import { CicdArchitecture } from "@/components/cicd-architecture";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import {
  CaseStudyLayout,
  CaseStudyHero,
  CaseStudySection,
  ChallengeBox,
  StatsGrid,
  PhaseCard,
  EnhancedCodeBlock,
  TechSidebar,
  LessonItem,
  CaseStudyCTA,
} from "@/components/case-study-layout";
import { GlassCard, FadeUp, StaggerContainer, StaggerItem } from "@/components/scroll-reveal";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "CI/CD & GitOps Platform Engineering",
  description:
    "Building production-grade CI/CD infrastructure from scratch—evolving a greenfield microservices platform to 400 deploys/month with enterprise security",
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
    "CI/CD",
    "GitOps",
    "ArgoCD",
    "Kubernetes",
    "Bitbucket Pipelines",
    "Platform Engineering",
  ],
  dependencies:
    "Kubernetes, ArgoCD, Bitbucket Pipelines, Kustomize, Docker, AWS ECR",
};

export default function CicdGitopsPage() {
  return (
    <CaseStudyLayout schema={articleSchema}>
      <CaseStudyHero
        title="CI/CD & GitOps Platform"
        subtitle="Enterprise Pipeline Architecture"
        description="Building production-grade CI/CD infrastructure from scratch—evolving a greenfield microservices platform to 400 deploys/month with enterprise security"
        date="2023-2025 (2-year evolution)"
        metrics="20 Microservices • 400 Deploys/Month"
        color="#22c55e"
      />

      <div className="container px-4">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
          {/* Main content */}
          <div className="space-y-12">
            {/* Challenge */}
            <CaseStudySection eyebrow="// the challenge" title="The Challenge">
              <ChallengeBox
                callout={{
                  type: "info",
                  text: "Zero existing infrastructure—build everything from scratch for a massive monolith to microservices migration.",
                }}
              >
                <p>
                  I joined as a{" "}
                  <strong className="text-foreground">Graduate QA Engineer</strong> at the very
                  beginning of a massive architectural transformation:{" "}
                  <strong className="text-foreground">
                    migrating from a legacy monolith to a modern Kubernetes-based microservices
                    platform
                  </strong>
                  .
                </p>
                <p>
                  With no existing CI/CD infrastructure and a blank canvas, I was tasked with
                  designing and implementing the entire deployment pipeline that would serve{" "}
                  <strong className="text-foreground">
                    20+ microservices across 4 environments
                  </strong>{" "}
                  (Dev, QA, Pre-Prod, Production).
                </p>

                <div className="mt-6 p-4 rounded-lg bg-secondary/30 border border-border">
                  <h4 className="font-semibold text-foreground mb-3">Initial Requirements</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        <strong className="text-foreground">Zero existing infrastructure</strong> —
                        build everything from scratch
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        <strong className="text-foreground">Multi-environment strategy</strong> —
                        Dev, QA, Pre-Prod, Prod with different promotion rules
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        <strong className="text-foreground">Security-first approach</strong> —
                        SAST/SCA scanning, compliance gates
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        <strong className="text-foreground">GitOps-native</strong> — declarative
                        deployments with ArgoCD
                      </span>
                    </li>
                  </ul>
                </div>
              </ChallengeBox>
            </CaseStudySection>

            {/* Evolution */}
            <CaseStudySection eyebrow="// the evolution" title="The Evolution">
              <p className="text-muted-foreground mb-8">
                Over{" "}
                <strong className="text-foreground">2 years of iterative platform engineering</strong>,
                I transformed a basic build script into a sophisticated, production-ready CI/CD
                platform. Here&apos;s how it evolved:
              </p>

              <StaggerContainer className="space-y-6">
                <StaggerItem>
                  <PhaseCard
                    phase="Phase 1"
                    title="Foundation (Months 1-6)"
                    color="#22c55e"
                    highlight="Established GitOps pattern with ArgoCD for declarative deployments"
                  >
                    <p>
                      Built the initial pipeline architecture with basic Maven builds, Docker image
                      creation, and manual ECR pushes.
                    </p>
                    <EnhancedCodeBlock
                      title="Early Pipeline (bitbucket-pipelines.yml)"
                      code={`image: maven:3.9.6
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
            - ./scripts/update_tag.sh
            - git push origin master`}
                    />
                  </PhaseCard>
                </StaggerItem>

                <StaggerItem>
                  <PhaseCard
                    phase="Phase 2"
                    title="Standardisation & Reusability (Months 6-12)"
                    color="#06b6d4"
                    highlight="Custom Docker base image reducing pipeline config by ~40%"
                  >
                    <p>
                      Created reusable pipeline components and custom base images to eliminate
                      duplication across services.
                    </p>
                    <ul className="space-y-2 mt-3">
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <strong className="text-foreground">Custom Base Image</strong> — Pre-built
                        Maven image with kubectl, ArgoCD CLI, AWS CLI, jq
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <strong className="text-foreground">Shared Pipeline Scripts</strong> —
                        Centralised notifications via pipeline_reporter.sh
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <strong className="text-foreground">Kustomize Overlays</strong> —
                        Environment-specific configuration management
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <strong className="text-foreground">App-of-Apps Pattern</strong> —
                        Hierarchical ArgoCD application management
                      </li>
                    </ul>
                  </PhaseCard>
                </StaggerItem>

                <StaggerItem>
                  <PhaseCard
                    phase="Phase 3"
                    title="Security & Quality Gates (Months 12-18)"
                    color="#8b5cf6"
                    highlight="100% security scan coverage on all PRs"
                  >
                    <p>
                      Integrated enterprise security scanning and quality gates directly into the
                      pipeline.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 mt-4">
                      <GlassCard className="p-4">
                        <h4 className="font-semibold text-foreground mb-1">SAST (Veracode)</h4>
                        <p className="text-xs">
                          Static code analysis blocking critical/high vulnerabilities
                        </p>
                      </GlassCard>
                      <GlassCard className="p-4">
                        <h4 className="font-semibold text-foreground mb-1">SCA (SourceClear)</h4>
                        <p className="text-xs">
                          Dependency vulnerability scanning with automated reporting
                        </p>
                      </GlassCard>
                    </div>
                  </PhaseCard>
                </StaggerItem>

                <StaggerItem>
                  <PhaseCard
                    phase="Phase 4"
                    title="Test Orchestration & Observability (Months 18-24)"
                    color="#f59e0b"
                    highlight="Reduced false test results by ~90%"
                  >
                    <p>
                      Migrated from brittle pipeline-based testing to robust ArgoCD PostSync hooks
                      with comprehensive observability.
                    </p>
                    <ul className="space-y-2 mt-3">
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <strong className="text-foreground">PostSync Hook Architecture</strong> —
                        Tests run AFTER deployment completes
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <strong className="text-foreground">Automated Test Suites</strong> — JUnit
                        (API), Cucumber + Playwright (UI) as Kubernetes Jobs
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span>
                        <strong className="text-foreground">DORA Metrics</strong> — Custom collector
                        tracking deployment frequency, lead time, MTTR
                      </li>
                    </ul>

                    <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <h5 className="text-sm font-semibold text-amber-400 mb-2">Why PostSync {">"} Pipeline Testing</h5>
                      <p className="text-xs text-muted-foreground">
                        Pipeline tests run <em>before</em> pods are healthy, causing false negatives when services aren&apos;t ready.
                        PostSync hooks wait for ArgoCD sync completion, then validate pods are ready before running tests —
                        eliminating an entire class of flaky failures.
                      </p>
                    </div>
                  </PhaseCard>
                </StaggerItem>
              </StaggerContainer>
            </CaseStudySection>

            {/* Architecture */}
            <CaseStudySection eyebrow="// architecture" title="Architecture">
              <CicdArchitecture />
            </CaseStudySection>

            {/* Current State */}
            <CaseStudySection
              eyebrow="// current state"
              title="Current State: Production-Grade Platform"
            >
              <FadeUp>
                <GlassCard className="p-8 border-primary/30">
                  <h3 className="text-xl font-semibold mb-4 text-primary">Pipeline Architecture</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <div className="flex gap-2">
                      <span className="text-primary font-bold">→</span>
                      <span>
                        <strong className="text-foreground">Parallel Test Execution:</strong> Unit,
                        integration, SAST, SCA run concurrently (~5min total)
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-bold">→</span>
                      <span>
                        <strong className="text-foreground">Automated Deployments:</strong> Master →
                        Dev (auto), QA (auto w/ Jira gate), Pre-Prod (manual), Prod (manual)
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-bold">→</span>
                      <span>
                        <strong className="text-foreground">Jira Integration:</strong> Release Version
                        validation prevents premature QA deployments
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary font-bold">→</span>
                      <span>
                        <strong className="text-foreground">PostSync Testing:</strong> Kubernetes
                        Jobs execute tests after ArgoCD sync completion
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </FadeUp>
            </CaseStudySection>

            {/* Business Impact */}
            <CaseStudySection eyebrow="// impact" title="Business Impact">
              <StatsGrid
                color="#22c55e"
                stats={[
                  { value: "400+", label: "Deployments per month across all environments" },
                  { value: "~5 min", label: "Consistent build time with parallel testing" },
                  { value: "20+", label: "Microservices using standardised pipeline" },
                  { value: "50+", label: "Alert rules for rapid incident response" },
                  { value: "~90%", label: "Reduction in false test results" },
                  { value: "100%", label: "Security scan coverage on all PRs" },
                ]}
              />
            </CaseStudySection>

            {/* Before/After */}
            <CaseStudySection
              eyebrow="// transformation"
              title="Transformation Metrics"
            >
              <p className="text-muted-foreground mb-6">
                Drag the slider to see the dramatic transformation from manual processes to
                automated platform engineering.
              </p>
              <BeforeAfterSlider
                metrics={[
                  { label: "Deployment Frequency", before: "2/week", after: "400/month" },
                  { label: "Build Time", before: "15+ min", after: "~5 min" },
                  { label: "Service Onboarding", before: "1 week", after: "<1 day" },
                  { label: "Test Reliability", before: "?%", after: "95%+" },
                ]}
              />
            </CaseStudySection>

            {/* Lessons Learned */}
            <CaseStudySection eyebrow="// lessons" title="Lessons Learned">
              <ul className="space-y-4">
                <LessonItem highlight="Iterative improvement beats big-bang rewrites">
                  Each phase built on the previous, allowing production usage throughout
                </LessonItem>
                <LessonItem highlight="Standardisation is key to scale">
                  Reusable components (base images, scripts) made onboarding new services trivial
                </LessonItem>
                <LessonItem highlight="GitOps eliminates deployment drift">
                  Declarative configs in Git provided audit trail and rollback capability
                </LessonItem>
                <LessonItem highlight="Testing architecture matters">
                  Moving from pipeline polling to PostSync hooks eliminated an entire class of
                  flaky tests
                </LessonItem>
                <LessonItem highlight="Observability from day one">
                  DORA metrics, deployment notifications, and test reporting enabled data-driven
                  improvements
                </LessonItem>
              </ul>
            </CaseStudySection>
          </div>

          {/* Sidebar */}
          <TechSidebar
            technologies={[
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
            ]}
            skills={[
              "Platform Engineering",
              "CI/CD Architecture Design",
              "GitOps Implementation",
              "Container Orchestration",
              "Security Integration (SAST/SCA)",
              "Test Automation",
              "Infrastructure as Code",
              "Observability & Metrics",
              "Developer Experience",
            ]}
            metrics={[
              { label: "Timeline", value: "24 months of iterative development" },
              { label: "Scale", value: "20 microservices, 4 environments" },
              { label: "Deployment Velocity", value: "400+ deploys/month" },
              { label: "Build Performance", value: "~5 minutes (parallel testing)" },
            ]}
            relatedProjects={[
              { title: "DORA Metrics & DevEx", href: "/projects/dora-devex" },
              { title: "Observability Stack", href: "/projects/observability" },
            ]}
          />
        </div>
      </div>

      <CaseStudyCTA />
    </CaseStudyLayout>
  );
}
