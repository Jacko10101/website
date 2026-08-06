"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { AsciiField } from "@/components/ascii-field";
import { DecodeText } from "@/components/decode-text";
import { CareerQuery } from "@/components/career-query";
import { proofPoints } from "@/lib/projects";
import { profile } from "@/lib/profile";

const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/**
 * The hero leads with the site's most differentiated artefact: a real SQLite
 * database about the work, queryable in the visitor's browser. Identity on the
 * left, evidence on the right. The identity column gets the one entrance
 * animation the page allows itself; everything else renders instantly.
 */
export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden pt-28 pb-16">
      <div className="absolute inset-0 phosphor-ambient pointer-events-none" aria-hidden />
      <AsciiField className="[mask-image:radial-gradient(ellipse_75%_90%_at_72%_30%,black_0%,transparent_72%)] opacity-80" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-center">
          {/* Identity, staggered entrance */}
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
              Platform engineer. I build the infrastructure AI products run on:
              Kubernetes and CI/CD underneath, an LLM gateway and guardrails on top.
            </motion.p>

            <motion.p variants={rise} className="text-base text-muted-foreground mb-8 max-w-xl">
              Three years of production Kubernetes, GitOps and observability.
              The last year went to AI workloads: a gateway in front of every
              model call, and a natural-language query product live across ~30
              tenant databases.{" "}
              {profile.msc.label}
              {profile.msc.result ? `, ${profile.msc.result},` : ""} finishing{" "}
              {profile.msc.finishes}.
            </motion.p>

            <motion.div variants={rise} className="flex flex-wrap gap-4 items-center mb-8">
              <Link
                href="/projects/clarity"
                className="px-7 py-3.5 rounded-md bg-primary text-primary-foreground font-mono font-semibold hover:bg-primary/90 hover:shadow-[0_0_28px_oklch(0.72_0.19_150_/_0.35)] transition-all"
              >
                See Clarity
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

          {/* The artefact: ask the site a question, get the SQL back. */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">
              Don&apos;t take my word for any of it
            </p>
            <p className="text-sm text-muted-foreground mb-4 max-w-xl">
              My day job is an AI that answers questions about a database and
              shows you the SQL. This is that, pointed at my own work — real
              SQLite, running in your browser. Pick a question, read the query,
              then edit it and run your own.
            </p>
            <CareerQuery />
          </div>
        </div>

        {/* Proof strip, evidence before claims */}
        <div className="mt-16 lg:mt-20 grid sm:grid-cols-3 border-y border-border divide-y sm:divide-y-0 sm:divide-x divide-border">
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
        </div>
      </div>
    </section>
  );
}
