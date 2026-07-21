"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { CicdArchitecture } from "@/components/cicd-architecture";
import {
  CaseStudyLayout,
  CaseStudyHero,
  CaseStudySection,
  StatsGrid,
  TechSidebar,
  EnhancedCodeBlock,
  CaseStudyCTA,
} from "@/components/case-study-layout";
import { GlassCard, FadeUp } from "@/components/scroll-reveal";
import { TerminalWindow } from "@/components/terminal-window";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Pipeline Platform — Shared CI/CD and ArgoCD-Driven Delivery",
  description:
    "One shared Bitbucket pipeline library imported by every Java and Node service. Tests, reporting and promotion all decoupled. Used across 20 services with ~400 deploys/month.",
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
  dateModified: "2026-04-25",
  proficiencyLevel: "Expert",
  keywords: [
    "CI/CD",
    "GitOps",
    "Bitbucket Shared Pipelines",
    "ArgoCD",
    "ArgoCD Image Updater",
    "ArgoCD Notifications",
    "Kubernetes",
    "Platform Engineering",
    "Sentry",
    "Allure",
  ],
};

function Screenshot({
  src,
  alt,
  caption,
  label,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption: ReactNode;
  label: string;
  width: number;
  height: number;
}) {
  return (
    <FadeUp>
      <TerminalWindow title={label}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
          sizes="(max-width: 1024px) 100vw, 800px"
        />
        <div className="px-5 py-4 border-t border-border bg-card/50 text-sm text-muted-foreground leading-relaxed">
          {caption}
        </div>
      </TerminalWindow>
    </FadeUp>
  );
}

export default function CicdGitopsPage() {
  return (
    <CaseStudyLayout schema={articleSchema}>
      <CaseStudyHero
        title="Pipeline platform"
        subtitle="Shared CI/CD library"
        description="One Bitbucket pipeline library, imported by every Java and Node service. Tests live in their own repo. Promotion and reporting belong to ArgoCD."
        date="2023 → ongoing"
        metrics="20 services, ~400 deploys/month"
        command="cat case-studies/pipeline-platform.md"
      />

      <div className="container px-4">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
          <div className="space-y-12">
            <CaseStudySection eyebrow="// the shape that broke" title="Twenty pipelines that drifted">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Twenty services each shipped their own bitbucket-pipelines.yml.
                Same rough shape — build, test, scan, push, deploy — but each
                one slightly different. A change in the build pattern meant a
                PR to twenty repos.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A 1000-line bash pipeline reporter lived in the base image and
                posted to Teams at every stage. It worked. Nobody wanted to
                touch it.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Tests ran inside the pipeline, before pods were healthy. They
                were flaky and most failures weren&apos;t real.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Jira gates, Veracode and SourceClear were copy-pasted into
                every yaml.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// the pipeline" title="One library, imported by every service">
              <p className="text-muted-foreground leading-relaxed mb-4">
                The pipeline lives in two repos now:{" "}
                <code className="text-foreground">java-shared-pipeline</code>{" "}
                and <code className="text-foreground">node-shared-pipeline</code>.
                Each exports a set of Bitbucket selectors using Bitbucket&apos;s
                Shared Pipelines Configuration. Service repos import them by
                tag.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Per-service config is one file. Name, runtime, dockerfile,
                image repo, build commands. That&apos;s all a service author
                has to know about CI.
              </p>

              <div className="space-y-4 mb-6">
                <EnhancedCodeBlock
                  title=".ci/builds.yaml — the per-service surface"
                  language="yaml"
                  code={`service:
  name: payments-api
  type: java           # java | node
  dockerfile: Dockerfile
  image:
    repository: payments-api
build:
  java:
    maven_cmd: "mvn -B -ntp test"
gitops:
  repo: platform/gitops-apps
  base_branch: main
  app_path: apps/payments-api
  strategy: kustomize`}
                />

                <EnhancedCodeBlock
                  title="bitbucket-pipelines.yml — the import"
                  language="yaml"
                  code={`pipelines:
  pull-requests:
    '**':
      import: java-shared-pipeline:1.4.0:feature-java
  branches:
    main:
      import: java-shared-pipeline:1.4.0:main-java`}
                />
              </div>

              <p className="text-muted-foreground leading-relaxed mb-4">
                Optional gates — Veracode SAST, SourceClear SCA, Jira Fix
                Version validation — are env-gated in the same library. One
                library handles services that need them and services that
                don&apos;t. The difference is an env var on the import, not a
                fork of the pipeline.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The library is semver-tagged. Services adopt a new version on
                their own schedule by bumping the tag. Old tags stay around as
                long as anyone is still on them.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// tests, extracted" title="Tests are not pipeline steps">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Test infra is its own repo now. The pipeline builds and pushes
                the image, then stops. A separate ArgoCD PostSync hook runs
                the test job after the deploy is actually healthy, so the
                tests run against the real running thing rather than half a
                pod.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Allure reports per run. Pass/fail published to a result store.
                Sentry — a small dashboard I built on top — is where you go to
                ask &quot;is the fleet green?&quot;.
              </p>

              <div className="space-y-6">
                <Screenshot
                  label="sentry — fleet"
                  src="/sentry/fleet-dashboard.png"
                  width={2376}
                  height={1746}
                  alt="Sentry fleet dashboard with platform foundation tiles and per-service test cards"
                  caption={
                    <>
                      Eleven services green, four red. Platform Foundation
                      across the top — cluster, Kafka, databases, secrets —
                      lives separately from per-service test health, because
                      &quot;the cluster is broken&quot; and &quot;Data Flow has
                      a flaky test&quot; are different conversations. POSTSYNC
                      and CONTINUOUS triggers are tagged so it&apos;s obvious
                      what kind of run produced the result.
                    </>
                  }
                />

                <Screenshot
                  label="sentry — per service"
                  src="/sentry/test-results.png"
                  width={2576}
                  height={1538}
                  alt="Sentry per-service test results page for cloudbridge in preprod"
                  caption={
                    <>
                      Drilldown for a single service. The full Allure report is
                      one click away; the recent runs table on the bottom makes
                      regressions obvious without anyone having to dig into a
                      pipeline.
                    </>
                  }
                />
              </div>
            </CaseStudySection>

            <CaseStudySection eyebrow="// reporting & promotion" title="ArgoCD took over the rest">
              <p className="text-muted-foreground leading-relaxed mb-4">
                The bash reporter is gone. The bits worth keeping moved into a
                shared-scripts repo. The rest retired when ArgoCD&apos;s
                Notifications controller took over deploy reporting.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Promotion is decoupled from build. The pipeline emits{" "}
                <code className="text-foreground">.ci/out/build.json</code> —
                commit, image, digest, tags, build url — and stops. ArgoCD
                Image Updater watches ECR and opens the GitOps bump itself
                when it sees a new tag.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Build does one thing. Promote does another. The pipeline
                doesn&apos;t know which environment its image will land in.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// architecture" title="How it fits together">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Four layers, top to bottom: a service repo and the shared
                libraries it imports; a Bitbucket run that produces an image
                and a metadata file; an Image-Updater-driven promotion that
                ends in a Kubernetes deploy; and a PostSync hook that closes
                the loop with a test result in Sentry.
              </p>

              <CicdArchitecture />
            </CaseStudySection>

            <CaseStudySection eyebrow="// design" title="A few decisions worth flagging">
              <div className="space-y-5">
                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    Optional gates are env-gated, not template-forked
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Some services run Veracode and Jira gates. Some don&apos;t.
                    Both kinds use the same shared pipeline tag — the
                    difference is an env var, not a different selector. The
                    library stays a singleton, and the diff between two
                    services&apos; CI is something you can read in their{" "}
                    <code className="text-foreground">.ci/builds.yaml</code>{" "}
                    rather than tracing through forks.
                  </p>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    Build doesn&apos;t promote
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The pipeline emits build metadata and stops. ArgoCD Image
                    Updater handles the GitOps bump separately. The upshot:
                    a service can&apos;t break its own deploy by misconfiguring
                    its yaml, and a fix to promotion behaviour doesn&apos;t
                    need a new pipeline release.
                  </p>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    Tests are not pipeline steps
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Pipelines that fail before pods are healthy lie. PostSync
                    runs tests against the actual running deploy, and Sentry
                    surfaces the result independently of whether anyone was
                    watching the pipeline. Most of the &quot;flaky test&quot;
                    bucket evaporated when the readiness assumption stopped
                    being implicit.
                  </p>
                </GlassCard>
              </div>
            </CaseStudySection>

            <CaseStudySection eyebrow="// impact" title="What changed">
              <StatsGrid
                stats={[
                  { value: "20", label: "services on one shared library" },
                  { value: "~400", label: "deploys per month" },
                  { value: "~5 min", label: "build time" },
                  { value: "1 file", label: "to onboard a new service" },
                ]}
              />

              <p className="text-muted-foreground mt-6 leading-relaxed">
                The change I care about most isn&apos;t in the table. Onboarding
                a new service used to mean copy-pasting somebody else&apos;s
                yaml and quietly hoping. Now it&apos;s a builds.yaml and a
                tag. The diff between two services&apos; CI is small,
                readable and intentional.
              </p>
            </CaseStudySection>
          </div>

          <TechSidebar
            technologies={[
              "Bitbucket Shared Pipelines",
              "ArgoCD",
              "ArgoCD Image Updater",
              "ArgoCD Notifications",
              "Kubernetes",
              "Kustomize",
              "AWS ECR",
              "Veracode",
              "SourceClear",
              "Allure",
              "Jira",
              "Bash",
            ]}
            skills={[
              "Extracting shared concerns into versioned libraries",
              "Decoupling build from promotion",
              "Env-gated optional steps",
              "Fleet observability for tests",
              "Internal tooling as a product",
            ]}
            metrics={[
              { label: "Status", value: "Live, ongoing" },
              { label: "Pipeline library", value: "java + node, semver-tagged" },
              { label: "Per-service config", value: "one .ci/builds.yaml" },
              { label: "Deploys", value: "~400/month across 4 envs" },
            ]}
            relatedProjects={[
              { title: "Heimdall — deployment intelligence", href: "/projects/heimdall" },
              { title: "Observability stack", href: "/projects/observability" },
            ]}
          />
        </div>
      </div>

      <CaseStudyCTA />
    </CaseStudyLayout>
  );
}
