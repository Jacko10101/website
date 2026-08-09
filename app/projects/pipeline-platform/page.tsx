"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { Check } from "lucide-react";
import { CicdArchitecture } from "@/components/cicd-architecture";
import { PHOSPHORS, CaseStudyLayout } from "@/components/case-study-layout";
import { StepSection as CaseStudySection } from "@/components/case-section-variants";
import {
  DIFF,
  FileDiff,
  PrHeader,
  PrSidebar,
  PrMergeFooter,
} from "@/components/pipeline-page-pr";
import { TerminalWindow } from "@/components/terminal-window";

/* --------------------------------------------------------------------------
 * This project was a migration, so the page is shaped like the pull request
 * that landed it — and set the way a code-review interface would set it:
 * threaded review comments, files rendered as diffs, the summary as a
 * unified diff. The objections raised in review, then the merge.
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
      "It is, deliberately. The pipeline stops at an image and a build.json, and Image Updater watches ECR and opens the GitOps commit itself. The old arrangement had the deploy credentials and the promotion rules sitting inside every service's pipeline, so a service could break its own deploy with a typo in its own yaml, and any change to how promotion worked had to ship as a pipeline release and then be adopted, repo by repo, before it was actually in effect. Promotion is one controller's job now.",
  },
  {
    anchor: "postsync/tests",
    question:
      "Why are the tests outside the pipeline? I want the build to go red when they fail.",
    answer:
      "A pipeline that finishes before the pods are healthy is telling you about the build, not the deploy. PostSync runs the tests against what's actually running, and Sentry surfaces the result whether or not anyone was watching. Most of the failures we'd been calling flaky were tests hitting a pod that had started but wasn't serving yet. Nobody had written down that the tests assumed readiness.",
  },
];

/* Each thread is a review comment anchored on a file, and its reply. The
   objection → reply structure IS the thread — no names, no avatars. */
function ReviewThreads() {
  return (
    <div className="space-y-5">
      {REVIEW_THREADS.map((t) => (
        <div key={t.anchor} className="rounded-md border border-border overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 border-b border-border bg-card/60 font-mono text-xs">
            <span className="text-foreground/90">{t.anchor}</span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Check className="w-3.5 h-3.5" style={{ color: DIFF.add }} aria-hidden />
              resolved
            </span>
          </div>
          <div className="divide-y divide-border/60">
            <div className="px-4 py-4 sm:px-5">
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                review · objection
              </p>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {t.question}
              </p>
            </div>
            {/* The reply sits behind a comment rail, one level in. */}
            <div className="relative px-4 py-4 pl-9 sm:pl-11 bg-card/40">
              <span
                className="absolute left-4 sm:left-5 top-4 bottom-4 w-px bg-border"
                aria-hidden
              />
              <p className="font-mono text-[11px] uppercase tracking-wider text-primary mb-2">
                ↳ reply
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const MERGE_LINES: { sign: "+" | "-"; text: string }[] = [
  { sign: "-", text: "the bash reporter, one file, zero tests" },
  { sign: "-", text: "20 bespoke bitbucket-pipelines.yml, drifted apart" },
  { sign: "+", text: "1 shared pipeline library, versioned by tag" },
  { sign: "+", text: "1 .ci/builds.yaml per service, ~5 min build" },
  { sign: "+", text: "Veracode and SourceClear findings filed straight to Jira" },
  { sign: "+", text: "Sentry verifying ~400 deploys a month after they land" },
];

/* The merge summary as the unified diff it claims to be: sign gutter,
   hairline rule, hunk header, deletion and addition tints. */
/* TODO(jack): none of the "+" lines has a baseline, so the reader can't tell
   what changed. Fill these in from real records and they go in as paired
   lines (a "−" line with the before, a "+" line with the after):
     build time     before: ___ min                 after: ~5 min
     onboarding     before: ___ per new service     after: one builds.yaml + one import
     deploys/month  before: ~___                    after: ~400
   Anything you can't source, leave blank and it stays out. Do not estimate. */
function MergeSummary() {
  return (
    <div className="rounded-md border border-border overflow-hidden font-mono text-[13px] leading-6">
      <div className="px-4 py-2 border-b border-border bg-card/60 text-xs text-muted-foreground">
        the change, in six lines
      </div>
      <div className="bg-black/40">
        <div className="flex">
          <span
            className="w-8 shrink-0 border-r border-border/60 bg-card/40"
            aria-hidden
          />
          <span className="flex-1 px-3 py-0.5 text-muted-foreground/70">
            @@ 20 services · one library @@
          </span>
        </div>
        {MERGE_LINES.map((l) => (
          <div key={l.text} className="flex">
            <span
              className={`w-8 shrink-0 text-center select-none border-r border-border/60 ${
                l.sign === "-" ? "text-error bg-error/10" : ""
              }`}
              style={
                l.sign === "+"
                  ? { color: DIFF.add, background: DIFF.addBg }
                  : undefined
              }
              aria-hidden
            >
              {l.sign === "-" ? "−" : "+"}
            </span>
            <span
              className={`flex-1 px-3 py-0.5 ${
                l.sign === "-" ? "bg-error/5 text-foreground/70" : "text-foreground/90"
              }`}
              style={l.sign === "+" ? { background: DIFF.addBgFaint } : undefined}
            >
              {l.text}
            </span>
          </div>
        ))}
      </div>
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
  datePublished: "2024-01-01",
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
  );
}

export default function CicdGitopsPage() {
  return (
    <CaseStudyLayout schema={articleSchema} phosphor={PHOSPHORS.white}>
      <PrHeader />

      <div className="container px-4 pt-10 md:pt-12">
        <div className="grid gap-10 lg:gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] max-w-5xl mx-auto">
          <div className="space-y-12 min-w-0">
            <CaseStudySection eyebrow="// exit 1 · twenty drifting pipelines" title="Every service had its own CI">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Loweconex runs a UK IoT platform. Behind it are twenty Java and
                Node services, deployed across four environments: dev, qa,
                preprod and prod.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Each of those twenty shipped its own
                bitbucket-pipelines.yml, around five hundred lines apiece. Same
                rough shape every time: build, test, scan, push, deploy, but no
                two of them the same. A change to the build pattern meant a PR
                to twenty repos, and in practice that meant it didn&apos;t get
                made.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A 1,071-line bash pipeline reporter lived in the base image and
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
                <FileDiff
                  path=".ci/builds.yaml"
                  note="the per-service surface"
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

                <FileDiff
                  path="bitbucket-pipelines.yml"
                  note="the import"
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
                Three gates are optional: Veracode SAST, SourceClear SCA, and
                Jira Fix Version validation. All three live in the same
                library and are switched on by env var. One library handles
                the services that need them and the services that don&apos;t.
                The difference is an env var on the import, not a fork of the
                pipeline.
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
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every run produces an Allure report, and pass/fail goes into a
                result store. I built a dashboard on top of that store. I
                called it Sentry, which was a mistake given the error-tracking
                product of the same name, but it&apos;s what everyone calls it
                now. It answers one question: is the fleet green?
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                It scores the platform separately from the services on it.
                Cluster, Kafka, databases and secrets sit across the top as
                Platform Foundation; per-service test health sits below.
                &quot;The cluster is broken&quot; and &quot;Data Flow has a
                flaky test&quot; are different conversations, and they usually
                need different people, so they get scored separately.
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
                      Eleven services green, four red, with Platform
                      Foundation scored on its own across the top. POSTSYNC and
                      CONTINUOUS triggers are tagged, so it&apos;s obvious what
                      kind of run produced each result.
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

            <CaseStudySection eyebrow="// step: the run, end to end" title="How it fits together">
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

              {/* TODO(jack): if you can source it, the onboarding figure goes
                  here — "used to take about ___ per new service". Left out
                  rather than guessed. */}
              <p className="text-muted-foreground mt-6 leading-relaxed">
                Onboarding a new service used to mean copying someone
                else&apos;s yaml and editing it until it built. It now takes
                one builds.yaml and one import line, and the difference between
                any two services&apos; CI fits on a screen.
              </p>
            </CaseStudySection>
          </div>

          <PrSidebar />
        </div>
      </div>

      <PrMergeFooter />
    </CaseStudyLayout>
  );
}
