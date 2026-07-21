"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { BUILD } from "@/lib/build-info";
import { TerminalWindow } from "@/components/terminal-window";

const stages = [
  {
    id: "dev",
    name: "dev",
    gate: "on push",
    headline: "A commit lands.",
    copy: "The pipeline takes it from here — build, test, scan, push the image. Nobody babysits a deploy.",
    log: ["build ✓  unit tests ✓", "trivy scan ✓  image pushed"],
  },
  {
    id: "qa",
    name: "qa",
    gate: "test suite",
    headline: "Tests gate the door.",
    copy: "The suite lives in its own repo and runs against a real environment. Tests are not pipeline steps.",
    log: ["integration suite ✓", "promotion unlocked"],
  },
  {
    id: "preprod",
    name: "preprod",
    gate: "image updater",
    headline: "Git says; the cluster converges.",
    copy: "Image Updater bumps the tag, ArgoCD notices and reconciles. No hands on the wheel.",
    log: ["tag bumped by image-updater", "argocd sync ✓  Healthy"],
  },
  {
    id: "prod",
    name: "prod",
    gate: "argocd",
    headline: "Promotion is a commit.",
    copy: "Rollback is a revert. The audit log is git log. That's the whole trick — and it's why it holds up at 2am.",
    log: ["argocd sync ✓  Healthy", "serving traffic"],
  },
];

const sha = BUILD.shortSha ?? "4f2a91c";

function CommitChip() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary text-primary-foreground font-mono text-xs font-semibold shadow-[0_0_24px_oklch(0.72_0.19_150_/_0.35)]">
      <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
        <path d="M8 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM8 1v3M8 12v3M1 8h4.5M10.5 8H15" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
      {sha}
    </span>
  );
}

function StageCard({
  stage,
  state,
}: {
  stage: (typeof stages)[number];
  state: "pending" | "active" | "done";
}) {
  const border =
    state === "pending" ? "border-border" : "border-primary/60";
  const dim = state === "pending" ? "opacity-50" : "opacity-100";
  return (
    <div
      className={`flex-1 rounded-lg border ${border} ${dim} bg-card/70 backdrop-blur-sm p-4 transition-all duration-500`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-sm font-semibold text-foreground">
          {stage.name}
        </span>
        <span
          className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
            state === "pending"
              ? "text-muted-foreground border-border"
              : state === "active"
                ? "text-warn border-warn/50"
                : "text-primary border-primary/50"
          }`}
        >
          {state === "pending" ? stage.gate : state === "active" ? "syncing…" : "Synced ✓"}
        </span>
      </div>
      <div className="font-mono text-[11px] leading-5 text-muted-foreground min-h-[2.5rem]">
        {state !== "pending" &&
          stage.log.map((line) => (
            <div key={line} className={state === "done" ? "text-primary/80" : ""}>
              {line}
            </div>
          ))}
      </div>
    </div>
  );
}

export function PipelineStory() {
  const outerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [stageIndex, setStageIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  // Commit chip travels the track as you scroll.
  const chipX = useTransform(scrollYProgress, [0.05, 0.92], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(stages.length - 1, Math.floor(v * (stages.length + 0.4)));
    if (idx !== stageIndex) setStageIndex(idx);
  });

  const stage = stages[stageIndex];

  // Static fallback: everything promoted, no scroll theatre.
  if (reduceMotion) {
    return (
      <section className="py-24 md:py-32">
        <div className="container">
          <PipelineHeader />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stages.map((s) => (
              <StageCard key={s.id} stage={s} state="done" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={outerRef} className="relative h-[340vh] hidden md:block">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 grid-background pointer-events-none" aria-hidden />
        <div className="container relative">
          <PipelineHeader />

          {/* Narrative + cumulative log */}
          <div className="mb-12 grid lg:grid-cols-[1.3fr_1fr] gap-8 items-start min-h-[11rem]">
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <h3 className="font-mono text-3xl md:text-4xl font-semibold text-foreground mb-3 glow-soft">
                {stage.headline}
              </h3>
              <p className="text-muted-foreground text-lg max-w-xl">{stage.copy}</p>
            </motion.div>

            <TerminalWindow title={`promotion — ${sha}`} className="hidden lg:block glow-border">
              <div className="p-4 font-mono text-[11px] leading-5 min-h-[9.5rem]">
                {stages.slice(0, stageIndex + 1).map((s, i) => (
                  <div key={s.id}>
                    <div className="text-muted-foreground">$ promote {sha} --to {s.name}</div>
                    {s.log.map((line) => (
                      <div key={line} className={i < stageIndex ? "text-primary/70" : "text-primary"}>
                        {line}
                      </div>
                    ))}
                  </div>
                ))}
                <span className="cursor-blink !h-[0.9em] !w-[0.5em]" aria-hidden />
              </div>
            </TerminalWindow>
          </div>

          {/* Track */}
          <div className="relative">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-border" aria-hidden />
            <motion.div
              className="absolute left-0 top-1/2 h-px bg-primary origin-left"
              style={{ width: chipX }}
              aria-hidden
            />
            <motion.div
              className="absolute -top-10 -translate-x-1/2"
              style={{ left: chipX }}
              aria-hidden
            >
              <CommitChip />
              <div className="w-px h-6 bg-primary/60 mx-auto mt-1" />
            </motion.div>

            <div className="relative flex gap-4 pt-8">
              {stages.map((s, i) => (
                <StageCard
                  key={s.id}
                  stage={s}
                  state={i < stageIndex ? "done" : i === stageIndex ? "active" : "pending"}
                />
              ))}
            </div>
          </div>

          <p className="mt-10 font-mono text-xs text-muted-foreground">
            {BUILD.shortSha
              ? `${sha} is the commit serving you this page.`
              : "every promotion is a commit; every rollback is a revert."}
          </p>
        </div>
      </div>
    </section>
  );
}

function PipelineHeader() {
  return (
    <div className="relative mb-10">
      <span
        aria-hidden
        className="text-outline absolute -top-10 right-0 font-mono font-bold text-[9rem] sm:text-[12rem] leading-none pointer-events-none select-none"
      >
        01
      </span>
      <p className="font-mono text-sm text-primary mb-3" aria-hidden>
        <span className="text-muted-foreground">$</span> git push && watch the promotion
      </p>
      <h2 className="font-mono font-semibold tracking-tight text-3xl sm:text-4xl md:text-5xl text-foreground">
        How my platforms ship
      </h2>
    </div>
  );
}

/**
 * Mobile version — same story, no sticky theatre.
 */
export function PipelineStoryMobile() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;
  return (
    <section className="py-20 md:hidden">
      <div className="container">
        <PipelineHeader />
        <div className="relative pl-6 space-y-6">
          <div className="absolute left-1.5 top-2 bottom-2 w-px bg-border" aria-hidden />
          {stages.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <span className="absolute -left-6 top-2 w-3 h-3 rounded-full border-2 border-primary bg-background" aria-hidden />
              <StageCard stage={s} state="done" />
              <p className="mt-2 text-sm text-muted-foreground">{s.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
