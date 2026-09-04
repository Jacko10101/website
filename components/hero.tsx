"use client";

import Link from "next/link";
import { RecoveryField } from "@/components/recovery-field";
import { proofPoints } from "@/lib/projects";
import { profile } from "@/lib/profile";

/**
 * One screen, one claim, one object.
 *
 * This used to stack seven blocks: a terminal eyebrow, the name, a role
 * paragraph, a five-line biography, three actions, a four-line availability
 * block and the proof strip — over a live glyph canvas. A reader gives this
 * about forty seconds and there was nothing in it telling them where to look.
 *
 * Now the name is the display type, one sentence says what the work is, and
 * the right side holds the one thing on the site that moves: a small cluster
 * losing a node and recovering it the way the dissertation's scheduler does.
 * The mark that used to sit there held forty percent of the first screen and
 * said nothing; it lives on in the nav and the favicon. The biography is on
 * /about, where someone who wants it will go looking.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 phosphor-ambient pointer-events-none" aria-hidden />

      <div className="container relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <p className="eyebrow mb-7">Platform · AI infrastructure</p>

            <h1 className="display mb-8 text-[clamp(3.5rem,9vw,7.5rem)] text-foreground">
              Jack Devlin
            </h1>

            <p className="mb-12 max-w-2xl text-xl leading-snug text-muted-foreground sm:text-2xl">
              I build the infrastructure AI products run on: Kubernetes and
              CI/CD underneath, an LLM gateway and its guardrails on top.
            </p>

            <div className="mb-12 flex flex-wrap items-center gap-4">
              <Link
                href="/projects"
                className="rounded-md bg-primary px-7 py-3.5 font-mono font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary/90 active:bg-primary/80"
              >
                Read the case studies
              </Link>
              <Link
                href="/contact"
                className="rounded-md border border-border px-7 py-3.5 font-mono text-foreground transition-colors duration-150 hover:border-primary/60 hover:text-primary active:border-primary active:bg-primary/10"
              >
                Say hello
              </Link>
              <a
                href="/cv.pdf"
                download="jack-devlin-cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="-mx-1 inline-flex items-center gap-2 px-1 py-3.5 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Download CV
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
                </svg>
              </a>
            </div>

            {/* The two facts a recruiter needs before anything else: when,
                and whether anyone has to sponsor him. Deliberately no city
                list — naming three excludes everywhere else, and the
                preference isn't a restriction. */}
            <div className="max-w-xl space-y-1.5 font-mono text-sm">
              <p className="flex items-start gap-2 text-foreground/90">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                {profile.availability.status}
              </p>
              <p className="pl-4 text-muted-foreground">{profile.lookingFor.workRights}</p>
              {/* The seniority signal, which used to be three hundred pixels
                  down /about: how long, and how much the place grew around it. */}
              <p className="pl-4 text-muted-foreground">{profile.tenure}</p>
            </div>
          </div>

          {/* Hidden below lg, as the mark was: on a phone the text is the hero. */}
          <RecoveryField className="hidden lg:block" />
        </div>

        {/* Proof strip, evidence before claims */}
        <div className="mt-24 grid divide-y divide-border border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {proofPoints.map((point) => (
            <Link
              key={point.label}
              href={point.href}
              className="group flex flex-col gap-1 py-6 transition-colors first:pl-0 hover:bg-card/60 sm:px-6"
            >
              <span className="display text-3xl text-primary sm:text-4xl">
                {point.value}
              </span>
              <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                {point.label} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
