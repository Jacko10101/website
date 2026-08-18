"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  GitBranch,
  GitMerge,
  GitPullRequest,
} from "lucide-react";

/* --------------------------------------------------------------------------
 * PR-native chrome for the pipeline-platform case study. The genre is the
 * migration PR, and a pull request is a web application document — so the
 * authentic register is UI chrome, not prose furniture: a sans title with a
 * Merged chip, branch lozenges, an author row, a diffstat with real +/− diff
 * colouring, a slim meta rail where a PR keeps its labels, and a merge event
 * to close. Every number here already appears in the page body. No PR
 * number, no reviewers, no avatars.
 *
 * Diff colouring is the genre's own palette, like the ADR's chart colours:
 * additions are diff-green regardless of this page's white phosphor,
 * deletions use the site's error red.
 * ----------------------------------------------------------------------- */

export const DIFF = {
  add: "oklch(0.72 0.19 150)",
  addBg: "oklch(0.72 0.19 150 / 0.09)",
  addBgFaint: "oklch(0.72 0.19 150 / 0.04)",
} as const;

function MergedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-primary/15 border border-primary/40 font-mono text-xs font-semibold uppercase tracking-wider text-primary">
      <GitMerge className="w-3.5 h-3.5" aria-hidden />
      Merged
    </span>
  );
}

function BranchLozenge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded bg-secondary border border-border px-2 py-0.5 text-secondary-foreground">
      <GitBranch className="w-3 h-3 text-muted-foreground" aria-hidden />
      {children}
    </span>
  );
}

const DIFFSTAT: {
  path: string;
  change: string;
  tone: "add" | "del" | "mixed";
}[] = [
  {
    path: "bitbucket-pipelines.yml × 20",
    change: "~500 lines → a six-line import",
    tone: "mixed",
  },
  { path: "pipeline reporter (bash)", change: "−1,071", tone: "del" },
  { path: "orchestrator, five modules", change: "+142", tone: "add" },
];

export function PrHeader() {
  return (
    <header className="pt-24 pb-10 md:pt-28 md:pb-12 border-b border-border/60">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-10 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>

          <p className="flex items-center gap-2 font-mono text-sm text-primary mb-3">
            <GitPullRequest className="w-4 h-4" aria-hidden />
            pull request · Shared CI/CD library
          </p>

          {/* PR titles are set in the app's sans, not a heading face — the
              mono lives in the branch lozenges and the diffstat. */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mb-3">
            <h1 className="font-semibold tracking-tight text-3xl sm:text-4xl md:text-[2.5rem] text-foreground">
              Pipeline platform
            </h1>
            <MergedBadge />
          </div>

          <p className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-xs text-muted-foreground mb-3">
            <BranchLozenge>platform/shared-pipeline-library</BranchLozenge>
            <span aria-hidden>→</span>
            <BranchLozenge>main</BranchLozenge>
          </p>

          {/* The one field this genre has that the others don't: an author. */}
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground mb-6">
            <span className="text-muted-foreground/80">Author</span>
            <span aria-hidden>·</span>
            <span className="text-foreground/90">Jack Devlin</span>
            <span aria-hidden>·</span>
            <span>platform engineer</span>
            <span aria-hidden>·</span>
            <span>Loweconex, a UK IoT platform business</span>
          </p>

          <p className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-2xl">
            A change to the build pattern used to mean a pull request to twenty
            repos, so it didn&apos;t get made. It now ships once: one Bitbucket
            pipeline library, imported by every Java and Node service. Tests
            live in their own repo. Promotion and reporting belong to ArgoCD.
          </p>

          <div className="rounded-md border border-border overflow-hidden max-w-2xl">
            <div className="flex items-center justify-between gap-4 px-4 py-2 border-b border-border bg-card/60 font-mono text-xs">
              <span className="text-muted-foreground">diffstat</span>
              <span className="space-x-2">
                <span style={{ color: DIFF.add }}>+142</span>
                <span className="text-error/90">−1,071</span>
              </span>
            </div>
            <ul className="px-4 py-3 font-mono text-[13px] leading-6 space-y-1">
              {DIFFSTAT.map((row) => (
                <li
                  key={row.path}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5"
                >
                  <span className="text-muted-foreground">{row.path}</span>
                  {row.tone === "add" ? (
                    <span style={{ color: DIFF.add }}>{row.change}</span>
                  ) : (
                    <span
                      className={
                        row.tone === "del" ? "text-error/90" : "text-foreground/85"
                      }
                    >
                      {row.change}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {/* The instrument carries its own reading. */}
            <p className="px-4 pb-3 text-[13px] text-muted-foreground leading-relaxed">
              The −1,071 is the bash reporter that posted to Teams at every
              stage. It worked, and it had grown to the point where changing it
              safely was hard. The +142 is its replacement: an orchestrator in
              five modules, each tested.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5 border-t border-border bg-card/40 font-mono text-xs text-muted-foreground">
              <span>2024 → ongoing</span>
              <span>20 services</span>
              <span>~400 deploys/month</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------
 * A file added by this PR, rendered as the new-file diff it would be:
 * mono, every line a +, a hairline gutter, the added-line count in the
 * file header.
 * ---------------------------------------------------------------------- */

export function FileDiff({
  path,
  note,
  code,
}: {
  path: string;
  note?: string;
  code: string;
}) {
  const lines = code.split("\n");
  return (
    <div className="rounded-md border border-border overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 border-b border-border bg-card/60 font-mono text-xs">
        <span className="text-foreground/90">
          {path}
          {note && <span className="text-muted-foreground"> · {note}</span>}
        </span>
        <span style={{ color: DIFF.add }}>+{lines.length}</span>
      </div>
      <div tabIndex={0} className="overflow-x-auto bg-black/40">
        <div className="min-w-full w-fit font-mono text-xs leading-6">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span
                className="w-8 shrink-0 text-center select-none border-r border-border/60"
                style={{ color: DIFF.add, background: DIFF.addBg }}
                aria-hidden
              >
                +
              </span>
              <span
                className="flex-1 px-3 whitespace-pre text-foreground/85"
                style={{ background: DIFF.addBgFaint }}
              >
                {line === "" ? " " : line}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Sidebar — the PR's slim meta rail, the way a PR UI keeps labels and
 * metadata beside the conversation. No card chrome: a hairline rail and
 * hairline-separated sections.
 * ---------------------------------------------------------------------- */

const TOUCHES = [
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
];

const NUMBERS: { label: string; value: string }[] = [
  { label: "status", value: "Live, ongoing" },
  { label: "library", value: "java + node, semver-tagged" },
  { label: "per-service config", value: "one .ci/builds.yaml" },
  { label: "deploys", value: "~400/month across 4 envs" },
];

const SKILLS = [
  "Bitbucket shared pipelines, semver-tagged and imported by tag",
  "Build that stops at the image, with promotion left to ArgoCD",
  "Optional scan and Jira gates switched by env var, not by forking",
  "Tests run from an ArgoCD PostSync hook, after the deploy is healthy",
  "Test results from 20 services aggregated into one dashboard",
];

const LINKED: { title: string; href: string }[] = [
  { title: "Heimdall · deployment intelligence", href: "/projects/heimdall" },
  { title: "Observability stack", href: "/projects/observability" },
];

function RailLabel({ children }: { children: string }) {
  return (
    <h3 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
      {children}
    </h3>
  );
}

export function PrSidebar() {
  return (
    <aside className="lg:sticky lg:top-24 self-start">
      <div className="lg:border-l lg:border-border/60 lg:pl-6 divide-y divide-border/60">
        <section className="pb-5">
          <RailLabel>labels · systems touched</RailLabel>
          <div className="flex flex-wrap gap-1.5">
            {TOUCHES.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-secondary px-2.5 py-0.5 font-mono text-[11px] text-secondary-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        <section className="py-5">
          <RailLabel>the numbers</RailLabel>
          <dl className="space-y-3 text-sm">
            {NUMBERS.map((n) => (
              <div key={n.label}>
                <dt className="font-mono text-xs text-muted-foreground">
                  {n.label}
                </dt>
                <dd className="text-foreground/90">{n.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="py-5">
          <RailLabel>skills</RailLabel>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {SKILLS.map((skill) => (
              <li key={skill} className="flex gap-2">
                <span
                  className="font-mono shrink-0"
                  style={{ color: DIFF.add }}
                  aria-hidden
                >
                  +
                </span>
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <section className="pt-5">
          <RailLabel>linked work</RailLabel>
          <div className="space-y-3">
            {LINKED.map((project) => (
              <Link
                key={project.href}
                href={project.href}
                className="flex items-center justify-between gap-2 text-sm font-medium hover:text-primary transition-colors group"
              >
                <span>{project.title}</span>
                <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------
 * Merge footer — the PR's closing timeline event: the merge icon in its
 * ring, the Merged line, then the sign-off.
 * ---------------------------------------------------------------------- */

export function PrMergeFooter() {
  return (
    <section className="py-16 border-t border-border/60">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-4">
            <span
              className="mt-0.5 flex w-8 h-8 shrink-0 items-center justify-center rounded-full bg-primary/15 border border-primary/40"
              aria-hidden
            >
              <GitMerge className="w-4 h-4 text-primary" />
            </span>
            <div>
              <p className="font-mono text-sm">
                <span className="text-primary font-semibold">Merged</span>
                <span className="text-muted-foreground text-xs">
                  {" "}
                  · 20 services · one library
                </span>
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed max-w-2xl">
                I&apos;d do it the same way again. If you want the awkward
                parts of the migration, ask me.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-sm">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-primary hover:underline group"
                >
                  Say hello
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/projects"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  All case studies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
