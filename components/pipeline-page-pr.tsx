"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, GitMerge, GitPullRequest } from "lucide-react";
import { FadeUp } from "@/components/scroll-reveal";

/* --------------------------------------------------------------------------
 * PR-native chrome for the pipeline-platform case study. The other five
 * pages open with CaseStudyHero; this one is the migration PR, so it opens
 * like a pull request instead: title, Merged badge, branch framing, a
 * diffstat. Every number here already appears in the page body — nothing
 * is invented, no PR number, no reviewers.
 * ----------------------------------------------------------------------- */

const fade = (delay: number) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, delay },
});

function MergedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 bg-primary/15 border border-primary/40 font-mono text-xs font-semibold uppercase tracking-wider text-primary">
      <GitMerge className="w-3.5 h-3.5" aria-hidden />
      Merged
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

const CHANGE_TONE: Record<"add" | "del" | "mixed", string> = {
  add: "text-primary",
  del: "text-error/90",
  mixed: "text-foreground/85",
};

export function PrHeader() {
  return (
    <header className="relative pt-28 pb-16 md:pt-32 md:pb-20 overflow-hidden">
      <div className="absolute inset-0 grid-background pointer-events-none" aria-hidden />

      <div className="container px-4 relative z-10">
        <motion.div {...fade(0)}>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
        </motion.div>

        <div className="max-w-4xl">
          <motion.p
            {...fade(0.05)}
            className="inline-flex items-center gap-2 font-mono text-sm text-primary mb-4"
          >
            <GitPullRequest className="w-4 h-4" aria-hidden />
            pull request · Shared CI/CD library
          </motion.p>

          <motion.div
            {...fade(0.1)}
            className="flex flex-wrap items-center gap-x-4 gap-y-3 mb-5"
          >
            <h1 className="font-mono font-semibold tracking-tight text-3xl sm:text-4xl md:text-5xl text-foreground">
              Pipeline platform
            </h1>
            <MergedBadge />
          </motion.div>

          <motion.div
            {...fade(0.15)}
            className="flex flex-wrap items-center gap-2 font-mono text-xs mb-6"
          >
            <span className="rounded bg-secondary border border-border px-2.5 py-1 text-secondary-foreground">
              twenty bespoke pipelines
            </span>
            <span className="text-muted-foreground" aria-hidden>
              →
            </span>
            <span className="rounded bg-secondary border border-border px-2.5 py-1 text-secondary-foreground">
              one shared library
            </span>
          </motion.div>

          <motion.p
            {...fade(0.2)}
            className="text-xl text-muted-foreground mb-8 leading-relaxed"
          >
            One Bitbucket pipeline library, imported by every Java and Node
            service. Tests live in their own repo. Promotion and reporting
            belong to ArgoCD.
          </motion.p>

          <motion.div
            {...fade(0.3)}
            className="rounded-lg border border-border overflow-hidden max-w-2xl"
          >
            <div className="px-4 py-2 border-b border-border bg-card/60 font-mono text-xs text-muted-foreground">
              diffstat
            </div>
            <ul className="p-4 font-mono text-[13px] leading-6 space-y-1">
              {DIFFSTAT.map((row) => (
                <li
                  key={row.path}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5"
                >
                  <span className="text-muted-foreground">{row.path}</span>
                  <span className={CHANGE_TONE[row.tone]}>{row.change}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 border-t border-border bg-card/40 font-mono text-xs text-muted-foreground">
              <span>2023 → ongoing</span>
              <span>20 services</span>
              <span>~400 deploys/month</span>
              <span
                className="flex items-center gap-2 px-2.5 py-0.5 rounded border border-primary/40 text-primary"
                title="Every case study renders on its own CRT phosphor. This one's tube."
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-primary glow-soft"
                  aria-hidden
                />
                phosphor P4 · white
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------
 * Sidebar — the PR's right rail rather than the shared `$ label` blocks.
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
  "Extracting shared concerns into versioned libraries",
  "Decoupling build from promotion",
  "Env-gated optional steps",
  "Fleet observability for tests",
  "Internal tooling as a product",
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
      <FadeUp delay={0.1}>
        <div className="rounded-lg border border-border bg-card/30 divide-y divide-border">
          <section className="p-5">
            <RailLabel>systems this PR touches</RailLabel>
            <p className="font-mono text-[13px] leading-6 text-secondary-foreground">
              {TOUCHES.join(" · ")}
            </p>
          </section>

          <section className="p-5">
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

          <section className="p-5">
            <RailLabel>skills</RailLabel>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {SKILLS.map((skill) => (
                <li key={skill} className="flex gap-2">
                  <span
                    className="font-mono text-primary shrink-0"
                    aria-hidden
                  >
                    +
                  </span>
                  {skill}
                </li>
              ))}
            </ul>
          </section>

          <section className="p-5">
            <RailLabel>linked work</RailLabel>
            <div className="space-y-3">
              {LINKED.map((project) => (
                <Link
                  key={project.href}
                  href={project.href}
                  className="flex items-center justify-between text-sm font-medium hover:text-primary transition-colors group"
                >
                  <span>{project.title}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </FadeUp>
    </aside>
  );
}

/* -------------------------------------------------------------------------
 * Merge footer — the PR's closing event instead of the shared CTA card.
 * ---------------------------------------------------------------------- */

export function PrMergeFooter() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 grid-background pointer-events-none" aria-hidden />

      <div className="container px-4 relative z-10">
        <FadeUp>
          <div className="max-w-3xl mx-auto rounded-lg border border-primary/40 overflow-hidden">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 px-6 py-3.5 border-b border-border bg-primary/10 font-mono text-sm">
              <GitMerge className="w-4 h-4 text-primary" aria-hidden />
              <span className="text-primary font-semibold">Merged</span>
              <span className="text-muted-foreground text-xs">
                20 services · one library
              </span>
            </div>
            <div className="p-6 md:p-8 space-y-6 bg-card/30">
              <p className="text-muted-foreground leading-relaxed">
                Merged, and I&apos;d do it the same way again. The bash
                reporter is not missed.
              </p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-sm">
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
        </FadeUp>
      </div>
    </section>
  );
}
