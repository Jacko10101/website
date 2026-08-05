"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { CicdArchitecture } from "@/components/cicd-architecture";
import {
  PHOSPHORS,
  CaseStudyLayout,
  CaseStudyHero,
  TechSidebar,
  EnhancedCodeBlock,
  CaseStudyCTA,
} from "@/components/case-study-layout";
import { StepSection as CaseStudySection } from "@/components/case-section-variants";
import { FadeUp } from "@/components/scroll-reveal";
import { TerminalWindow } from "@/components/terminal-window";

/* --------------------------------------------------------------------------
 * This project was a migration, so the page is shaped like the pull request
 * that landed it: the objections raised in review, then the merge summary.
 * ----------------------------------------------------------------------- */
const REVIEW_THREADS: { anchor: string; question: string; answer: string }[] = [
  {
    anchor: ".ci/builds.yaml",
    question:
      "Some of us need the Veracode and Jira gates and some of us don't. Why aren't there two templates?",
    answer:
      "Because two templates become five. Both kinds use the same shared pipeline tag and the difference is an env var, not a different selector. The library stays a singleton, and the diff between any two services' CI is something you can read in their builds.yaml instead of tracing through forks.",
  },
  {
    anchor: "argocd-image-updater",
    question:
      "The old pipeline deployed. This one stops after the build. Isn't that a step backwards?",
    answer:
      "The pipeline emits build metadata and stops; Image Updater does the GitOps bump separately. So a service can't break its own deploy by misconfiguring its yaml, and fixing promotion behaviour doesn't need a new pipeline release for twenty repos.",
  },
  {
    anchor: "postsync/tests",
    question:
      "Why are the tests outside the pipeline? I want the build to go red when they fail.",
    answer:
      "A pipeline that finishes before the pods are healthy is telling you about the build, not the deploy. PostSync runs tests against what's actually running, and Sentry surfaces the result whether or not anyone was watching. Most of the flaky-test bucket turned out to be the readiness assumption nobody had written down.",
  },
];

function ReviewThreads() {
  return (
    <div className="space-y-4">
      {REVIEW_THREADS.map((t) => (
        <div key={t.anchor} className="rounded-lg border border-border overflow-hidden">
          <div className="px-4 py-2 border-b border-border bg-card/60 font-mono text-xs text-muted-foreground">
            {t.anchor}
          </div>
          <div className="p-5 space-y-4">
            <p className="text-sm text-foreground/90 leading-relaxed border-l-2 border-border pl-4">
              {t.question}
            </p>
            <div className="flex gap-3">
              <span className="font-mono text-xs text-primary shrink-0 pt-0.5" aria-hidden>
                ↳
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const MERGE_LINES: { sign: "+" | "-"; text: string }[] = [
  { sign: "-", text: "1,071-line bash reporter, one file, zero tests" },
  { sign: "-", text: "20 bespoke bitbucket-pipelines.yml, drifted apart" },
  { sign: "+", text: "1 shared pipeline library, versioned by tag" },
  { sign: "+", text: "1 .ci/builds.yaml per service, ~5 min build" },
  { sign: "+", text: "Veracode and SourceClear findings filed straight to Jira" },
  { sign: "+", text: "Sentry verifying ~400 deploys a month after they land" },
];

function MergeSummary() {
  return (
    <div className="rounded-lg border border-primary/40 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-primary/10 font-mono text-xs">
        <span className="w-2 h-2 rounded-full bg-primary" aria-hidden />
        <span className="text-primary font-semibold">Merged</span>
        <span className="text-muted-foreground">· 20 services · one library</span>
      </div>
      <ul className="font-mono text-[13px] leading-6 p-5 space-y-0.5">
        {MERGE_LINES.map((l) => (
          <li
            key={l.text}
            className={l.sign === "+" ? "text-primary" : "text-error/80"}
          >
            <span aria-hidden>{l.sign} </span>
            <span className={l.sign === "+" ? "text-foreground/85" : "text-muted-foreground line-through decoration-error/40"}>
              {l.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Pipeline Platform · Shared CI/CD and ArgoCD-Driven Delivery",
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
    <CaseStudyLayout schema={articleSchema} phosphor={PHOSPHORS.white}>
      <CaseStudyHero
        title="Pipeline platform"
        subtitle="Shared CI/CD library"
        description="One Bitbucket pipeline library, imported by every Java and Node service. Tests live in their own repo. Promotion and reporting belong to ArgoCD."
        date="2023 → ongoing"
        metrics="20 services, ~400 deploys/month"
        command="cat case-studies/pipeline-platform.md"
        phosphor={PHOSPHORS.white.label}
      />

      <div className="container px-4">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
          <div className="space-y-12">
            <CaseStudySection eyebrow="// exit 1 · the shape that broke" title="Twenty pipelines that drifted">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Twenty services each shipped their own bitbucket-pipelines.yml.
                Same rough shape: build, test, scan, push, deploy, but each
                one slightly different. A change in the build pattern meant a
                PR to twenty repos.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A 1071-line bash pipeline reporter lived in the base image and
                posted to Teams at every stage. It worked. Nobody wanted to
                touch it.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Tests ran inside the pipeline, before pods were healthy. They
                were flaky and most failures weren&apos;t real.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Jira gates, Veracode and SourceClear were copy-pasted into
                every yaml.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 font-mono text-sm">
                <div className="rounded-lg border border-error/30 bg-error/5 p-5">
                  <p className="text-xs text-error/90 font-semibold mb-3">then</p>
                  <ul className="space-y-2 text-muted-foreground text-[13px] leading-relaxed">
                    <li>~500-line bitbucket-pipelines.yml, per service</li>
                    <li>1071-line bash reporter, one file, zero tests</li>
                    <li>a build-pattern change = a PR to twenty repos</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-5">
                  <p className="text-xs text-primary font-semibold mb-3">now</p>
                  <ul className="space-y-2 text-muted-foreground text-[13px] leading-relaxed">
                    <li>a six-line import, pinned to a tag</li>
                    <li>142-line orchestrator, five modules, each tested</li>
                    <li>a build-pattern change = one release, adopted by bump</li>
                  </ul>
                </div>
              </div>
            </CaseStudySection>

            <CaseStudySection eyebrow="// step: build" title="One library, imported by every service">
              <p className="text-muted-foreground leading-relaxed mb-4">
                I split the pipeline into two repos:{" "}
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
                  title=".ci/builds.yaml · the per-service surface"
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
                  title="bitbucket-pipelines.yml · the import"
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
                Optional gates, Veracode SAST, SourceClear SCA, Jira Fix
                Version validation, are env-gated in the same library. One
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

            <CaseStudySection eyebrow="// step: verify" title="Tests aren't pipeline steps">
              <p className="text-muted-foreground leading-relaxed mb-4">
                I pulled test infra out into its own repo. The pipeline builds
                and pushes the image, then stops. A separate ArgoCD PostSync hook runs
                the test job after the deploy is actually healthy, so the
                tests run against the real running thing rather than half a
                pod.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Allure reports per run. Pass/fail published to a result store.
                Sentry, a small dashboard I built on top, is where you go to
                ask &quot;is the fleet green?&quot;.
              </p>

              <div className="space-y-6">
                <Screenshot
                  label="sentry · fleet"
                  src="/sentry/fleet-dashboard.png"
                  width={2376}
                  height={1746}
                  alt="Sentry fleet dashboard with platform foundation tiles and per-service test cards"
                  caption={
                    <>
                      Eleven services green, four red. Platform Foundation
                      sits across the top (cluster, Kafka, databases, secrets)
                      and is scored separately from per-service test health,
                      because &quot;the cluster is broken&quot; and &quot;Data
                      Flow has a flaky test&quot; are different conversations.
                      POSTSYNC and CONTINUOUS triggers are tagged so it&apos;s
                      obvious what kind of run produced the result.
                    </>
                  }
                />

                <Screenshot
                  label="sentry · per service"
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

            <CaseStudySection eyebrow="// step: promote" title="ArgoCD took over the rest">
              <p className="text-muted-foreground leading-relaxed mb-4">
                The bash reporter is gone. I moved the bits worth keeping into
                a shared-scripts repo and retired the rest when ArgoCD&apos;s
                Notifications controller took over deploy reporting.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Promotion is decoupled from build. The pipeline emits{" "}
                <code className="text-foreground">.ci/out/build.json</code>:
                commit, image, digest, tags, build url, and stops. ArgoCD
                Image Updater watches ECR and opens the GitOps bump itself
                when it sees a new tag.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Build does one thing. Promote does another. The pipeline
                doesn&apos;t know which environment its image will land in.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// the whole run" title="How it fits together">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Four layers, top to bottom. A service repo and the shared
                libraries it imports. A Bitbucket run that produces an image
                and a metadata file. Image Updater promotes it into a
                Kubernetes deploy, and a PostSync hook writes the test result
                into Sentry.
              </p>

              <CicdArchitecture />
            </CaseStudySection>

            <CaseStudySection eyebrow="// review comments" title="The three questions it had to answer">
              <p className="text-muted-foreground leading-relaxed mb-6">
                A migration like this has to survive twenty people with twenty
                services to protect, each of whom can veto it by simply not
                adopting it. These are the three objections the design had to
                answer.
              </p>

              <ReviewThreads />
            </CaseStudySection>

            <CaseStudySection eyebrow="// exit 0 · merged" title="What the diff came to">
              <MergeSummary />

              <p className="text-muted-foreground mt-6 leading-relaxed">
                None of which is the real change. Onboarding a service used to
                mean copy-pasting somebody else&apos;s yaml and quietly hoping.
                Now it&apos;s a builds.yaml and a tag, and the difference
                between two services&apos; CI fits on one screen — which means a
                change to how everything builds is one merge, not twenty.
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
              { title: "Heimdall · deployment intelligence", href: "/projects/heimdall" },
              { title: "Observability stack", href: "/projects/observability" },
            ]}
          />
        </div>
      </div>

      <CaseStudyCTA line="Merged, and I'd do it the same way again. The bash reporter is not missed." />
    </CaseStudyLayout>
  );
}
