"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { TerminalWindow, TypedLines } from "@/components/terminal-window";
import { AsciiField } from "@/components/ascii-field";
import { DecodeText } from "@/components/decode-text";
import { BUILD } from "@/lib/build-info";
import { proofPoints, type TerminalLine } from "@/lib/projects";
import { profile } from "@/lib/profile";

function useDeployLog(): TerminalLine[] {
  const [ttfb, setTtfb] = useState<number | null>(null);

  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav) {
      const t = Math.round(nav.responseStart - nav.startTime);
      if (t > 0 && t < 5000) setTtfb(t);
    }
  }, []);

  const lines: TerminalLine[] = [
    { text: "$ git push origin main", tone: "cmd" },
    { text: "pipeline: build ✓  test ✓  scan ✓", tone: "ok" },
    {
      text: `deploy: devlinops.com ${BUILD.shortSha ? `@ ${BUILD.shortSha} ` : ""}Synced · Healthy`,
      tone: "info",
    },
  ];
  if (ttfb !== null) {
    lines.push({
      text: `serving you this page — ttfb ${ttfb}ms, measured just now`,
      tone: "warn",
    });
  }
  return lines;
}

const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  const reduceMotion = useReducedMotion();
  const deployLog = useDeployLog();

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const y = useTransform(scrollY, [0, 500], [0, 60]);

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden pt-28 pb-16">
      <div className="absolute inset-0 phosphor-ambient pointer-events-none" aria-hidden />
      <AsciiField className="[mask-image:radial-gradient(ellipse_75%_90%_at_72%_30%,black_0%,transparent_72%)] opacity-80" />

      <motion.div
        style={reduceMotion ? undefined : { opacity, y }}
        className="container relative z-10"
      >
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Identity — staggered entrance */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
            }}
          >
            <motion.p variants={rise} className="font-mono text-sm text-primary mb-5">
              <span className="text-muted-foreground">jack@devlinops:~</span> $ whoami
            </motion.p>

            <motion.h1 variants={rise} className="font-mono font-semibold tracking-tighter text-6xl sm:text-7xl md:text-8xl text-foreground mb-6 glow-soft">
              <DecodeText text="Jack Devlin" duration={900} />
              <span className="cursor-blink glow-text !w-[0.14em] !h-[0.85em]" aria-hidden />
            </motion.h1>

            <motion.p variants={rise} className="text-xl sm:text-2xl text-foreground/90 mb-4 leading-snug">
              Platform engineer. I build the infrastructure teams ship on —
              pipelines, clusters, and the dashboards that keep them honest.
            </motion.p>

            <motion.p variants={rise} className="text-base text-muted-foreground mb-8 max-w-xl">
              Kubernetes, GitOps, CI/CD and observability, run in production.
              Now taking that discipline to AI workloads —{" "}
              {profile.msc.label}
              {profile.msc.result
                ? ` (${profile.msc.result})`
                : ` finishing ${profile.msc.finishes}`}
              .
            </motion.p>

            <motion.div variants={rise} className="flex flex-wrap gap-4 items-center mb-8">
              <Link
                href="/projects/heimdall"
                className="px-7 py-3.5 rounded-md bg-primary text-primary-foreground font-mono font-semibold hover:bg-primary/90 hover:shadow-[0_0_28px_oklch(0.72_0.19_150_/_0.35)] transition-all"
              >
                See Heimdall
              </Link>
              <Link
                href="/contact"
                className="px-7 py-3.5 rounded-md border border-border text-foreground font-mono hover:border-primary/60 hover:text-primary transition-colors"
              >
                Say hello
              </Link>
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                cv.pdf
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
                </svg>
              </a>
            </motion.div>

            <motion.p variants={rise} className="inline-flex items-start gap-2 font-mono text-sm text-muted-foreground max-w-xl">
              <span className="w-2 h-2 mt-1.5 rounded-full bg-primary animate-pulse shrink-0" aria-hidden />
              {profile.availability.status}
            </motion.p>
          </motion.div>

          {/* Deploy log — this site shipping itself */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
            className="hidden md:block"
          >
            <TerminalWindow title="deploy — devlinops.com" className="glow-border backdrop-blur-sm">
              <div className="p-5">
                <TypedLines lines={deployLog} charDelay={18} lineDelay={260} className="text-[13px] leading-6" />
              </div>
            </TerminalWindow>
          </motion.div>
        </div>

        {/* Proof strip — evidence before claims */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 lg:mt-20 grid sm:grid-cols-3 border-y border-border divide-y sm:divide-y-0 sm:divide-x divide-border"
        >
          {proofPoints.map((point) => (
            <Link
              key={point.label}
              href={point.href}
              className="group py-5 sm:px-6 first:pl-0 flex flex-col gap-1 hover:bg-card/60 transition-colors"
            >
              <span className="font-mono text-2xl sm:text-3xl font-semibold text-primary glow-soft">
                {point.value}
              </span>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {point.label} →
              </span>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
