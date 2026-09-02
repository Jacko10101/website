"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useReducedMotion } from "framer-motion";
import { Download } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { ContactCTA } from "@/components/contact-cta";
import { profile } from "@/lib/profile";
import { roles, education, tradingAs, stackTiers } from "@/lib/experience";

// The narrative version of the CV. The hard facts — employers, titles, dates —
// live in lib/experience.ts and render above this.
const journey = [
  {
    year: "2021",
    title: "Placement year at OD3",
    description:
      "A year out of my degree writing Tekla Structures API applications, automating drafting work for the in-house architects. First time I'd shipped anything people depended on.",
  },
  {
    year: "2023",
    title: "Joined as a graduate, inherited a migration",
    description:
      "I finished my BSc and landed in the middle of a monolith → microservices migration, writing the test automation that kept it honest. Engineering was five people.",
  },
  {
    year: "2024",
    title: "Earned the platform",
    description:
      "The test work kept exposing infrastructure problems, so I started fixing those instead. Observability from zero, then GitOps with ArgoCD, until 20 services deployed the same way.",
  },
  {
    year: "2025",
    title: "Standardised it, then instrumented it",
    description:
      "I moved CI onto one shared pipeline library across every service, and started the deployment-metrics tool that grew into Heimdall. The team went from asking \"did it deploy?\" to reading the answer off a screen.",
  },
  {
    year: "2026",
    title: "Built the AI platform on top",
    description:
      "The same infrastructure, now carrying LLM workloads: a gateway in front of every model call, and Clarity, a natural-language database product live across ~30 tenants. Alongside it, I submitted my MSc in Artificial Intelligence in September 2026.",
  },
];

// Three things I actually believe, each with the work that taught me it.
const philosophy = [
  {
    title: "A correct system nobody opens is not finished",
    description:
      "The DORA collector behind Heimdall was right for months and nobody ever looked at it. Same data, no front door. Building the UI is what turned it into something twenty people use every morning, and I've stopped treating the interface as the optional half.",
  },
  {
    title: "Boring is a compliment",
    description:
      "The ideal platform fades into the background. Engineers shouldn't have to think about it any more than they think about the office wifi.",
  },
  {
    title: "Operability is a feature",
    description:
      "If a teammate can't tell whether your service is healthy in under a minute, you haven't finished it yet. I default to one-curl health checks and a runbook per alert.",
  },
];

// Hero section
function AboutHero() {
  return (
    <section className="relative pt-28 md:pt-36 pb-20 overflow-hidden">
      <div className="absolute inset-0 grid-background pointer-events-none" aria-hidden />

      <div className="container px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">
            {/* Photo */}
            <div
              className="flex-shrink-0 w-64 md:w-72"
            >
              {/* The photo stays natural — the CRT duotone suited the old
                  placeholder avatar but read as a green filter on a real
                  face (Jack's call, 16 Aug 2026). The frame does the tying-in. */}
              {/* 4:5 rather than square — the source portrait's face fills
                  ~83% of the widest square crop, so a square frame is always
                  tight at the chin or the hair. */}
              <div className="relative w-64 aspect-[4/5] md:w-72 rounded-md border border-border overflow-hidden glow-border">
                <Image
                  src="/jack-photo.jpg"
                  alt="Jack Devlin"
                  fill
                  sizes="(min-width: 768px) 288px, 256px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Exif-style caption */}
              <div className="mt-3 rounded-md border border-border bg-card px-4 py-3 font-mono text-xs text-muted-foreground space-y-1">
                <p>Jack Devlin · Northern Ireland · platform engineer</p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden />
                  <span className="text-foreground/80">{profile.availability.from}</span>
                </p>
              </div>
            </div>

            {/* Intro text */}
            <div className="text-center lg:text-left flex-1">
              <div>
                <p className="eyebrow mb-4">About</p>
                <h1 className="display text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
                  Hey, I&apos;m Jack
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                  Platform engineer, based in Northern Ireland. Day job is
                  Clarity, a natural-language database product running across
                  about thirty tenants, and the LLM gateway every AI workload at
                  the company goes through. I built the Kubernetes, pipelines and
                  observability underneath them as well. I submitted my MSc in
                  Artificial Intelligence in September 2026.
                </p>
              </div>

              <div
                className="flex flex-wrap gap-4 justify-center lg:justify-start items-center"
              >
                <a
                  href="/cv.pdf"
                  download="jack-devlin-cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md border border-border text-foreground font-mono font-semibold hover:border-primary/60 hover:text-primary transition-colors"
                >
                  Download CV
                  <Download className="w-4 h-4" aria-hidden />
                </a>
                <span className="font-mono text-xs text-muted-foreground">
                  PDF · updated August 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Timeline section, styled as `git log`
function JourneyTimeline() {
  const listRef = useRef<HTMLOListElement>(null);
  // A motion value bound through `style` is never animated by framer, so
  // MotionConfig's reducedMotion="user" does not reach it — this scroll-linked
  // line has to opt out itself.
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.8", "end 0.55"],
  });

  return (
    <section className="relative py-24">
      <div className="container px-4">
        <SectionHeading
          title="How it went"
          lede="Three years at Loweconex, and the scope kept growing. Each year built on what the last one shipped."
          align="center"
        />

        <div className="max-w-3xl mx-auto">
          <ol ref={listRef} className="relative">
            {/* Static track */}
            <div
              className="absolute left-[7px] top-2 bottom-2 w-px bg-border"
              aria-hidden
            />
            {/* Line that draws itself with scroll progress */}
            <motion.div
              style={{ scaleY: reduce ? 1 : scrollYProgress }}
              className="absolute left-[7px] top-2 bottom-2 w-px bg-primary origin-top"
              aria-hidden
            />

            {journey.map((item) => (
              <li
                key={item.year}
                className="relative pl-10 pb-12 last:pb-0"
              >
                {/* Commit dot */}
                <span
                  className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-primary bg-background"
                  aria-hidden
                />

                <p className="font-mono text-sm mb-2 text-primary">{item.year}</p>
                <h3 className="font-mono font-semibold tracking-tight text-xl text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// The facts a recruiter would otherwise go to LinkedIn for. Deliberately
// plain: employers named, real dates, no bullet-point CV register.
function ExperienceSection() {
  return (
    <section className="relative py-24">
      <div className="container px-4">
        <SectionHeading
          title="Where I've worked"
          lede="Named, dated and checkable. There's a PDF of the same thing if you'd rather have one."
          align="center"
        />

        <div className="max-w-3xl mx-auto space-y-5">
          {roles.map((role) => (
            <div
              key={role.company}
              className="rounded-md border border-border bg-card p-6 md:p-8"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-1">
                <h3 className="font-mono font-semibold tracking-tight text-xl text-foreground">
                  {role.company}
                  {role.companyNote ? (
                    <span className="font-normal text-base text-muted-foreground">
                      {" "}
                      — {role.companyNote}
                    </span>
                  ) : null}
                </h3>
                <p className="font-mono text-sm text-primary shrink-0">{role.dates}</p>
              </div>
              <p className="font-mono text-sm text-muted-foreground mb-4">
                {role.title} · {role.location}
              </p>
              <p className="text-muted-foreground leading-relaxed">{role.summary}</p>

              {role.evidence ? (
                <p className="mt-4 text-sm text-muted-foreground">
                  What came out of it:{" "}
                  {role.evidence.map((item, i) => (
                    <span key={item.href}>
                      {i > 0 ? ", " : ""}
                      <Link href={item.href} className="text-primary hover:underline">
                        {item.label}
                      </Link>
                    </span>
                  ))}
                  .
                </p>
              ) : null}
            </div>
          ))}

          <div className="rounded-md border border-border bg-card p-6 md:p-8">
            <h3 className="font-mono font-semibold tracking-tight text-xl text-foreground mb-5">
              Education
            </h3>
            <div className="space-y-5">
              {education.map((item) => (
                <div key={item.award}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="font-mono text-base text-foreground">
                      {item.award}
                      {item.result ? (
                        <span className="text-primary">, {item.result}</span>
                      ) : null}
                    </p>
                    <p className="font-mono text-sm text-muted-foreground shrink-0">
                      {item.dates}
                    </p>
                  </div>
                  <p className="font-mono text-sm text-muted-foreground">
                    {item.institution}
                  </p>
                  {item.note ? (
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                      {item.note}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Since {tradingAs.since} I&apos;ve worked through {tradingAs.name},{" "}
            {tradingAs.note}. {profile.visaNote}
          </p>
        </div>
      </div>
    </section>
  );
}

// Philosophy section
function PhilosophySection() {
  return (
    <section className="relative py-24">
      <div className="container px-4">
        <SectionHeading
          label="principles"
          title="How I work"
          lede="Three things I've come to believe after a few years on platform teams."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {philosophy.map((item, index) => (
            <div
              key={item.title}
              className="rounded-md border border-border bg-card p-8 h-full"
            >
              <p className="font-mono text-sm text-primary mb-3" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="font-mono font-semibold tracking-tight text-xl text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Tech stack section, tiered by what's actually been run in production
function TechStackSection() {
  return (
    <section className="relative py-24">
      <div className="container px-4">
        <SectionHeading
          label="stack"
          title="Tech stack"
          lede="Split three ways, so you know which is which: what I've been on call for, what runs in my flat, and what I've only used."
          align="center"
        />

        <div className="max-w-4xl mx-auto space-y-6">
          {stackTiers.map((tier) => (
            <div
              key={tier.id}
              className="rounded-md border border-border bg-card p-6 md:p-8"
            >
              <h3 className="font-mono font-semibold tracking-tight text-lg text-primary mb-1">
                {tier.label}
              </h3>
              <p className="text-sm text-muted-foreground mb-5">{tier.note}</p>
              <div className="flex flex-wrap gap-2">
                {tier.items.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-sm font-mono rounded-md bg-secondary text-secondary-foreground border border-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Currently section
function CurrentlySection() {
  return (
    <section className="relative py-24">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-md border border-border bg-card p-8 md:p-12"
          >
            <p className="eyebrow mb-4">Status</p>
            <h2 className="display text-3xl sm:text-4xl md:text-5xl text-foreground mb-3">
              Right now
            </h2>
            <p className="font-mono text-sm text-primary mb-6">
              Shipping Clarity · MSc submitted · Available now
            </p>
            <p className="text-lg text-foreground leading-relaxed mb-5">
              I&apos;m available now, permanent or contract, for platform
              engineering, developer experience, observability or AI
              infrastructure work. I work remote-first and I&apos;m open to
              relocating. As an Irish and British citizen I need no sponsorship
              in the UK or the EU.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              I&apos;m wrapping up my current contract on the platform team I
              helped build. Most of this year went to the AI side: Clarity live
              across ~30 tenant databases, and the gateway that fronts every AI
              workload. Heimdall still opens every morning.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The dissertation is submitted. It builds a capacity-aware
              scheduler for recovering Kubernetes workloads after node failure,
              measured on real EKS clusters where failure means actually
              terminating the machine. It&apos;s the same problem I keep hitting
              on the platform side.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main page component
export default function AboutPage() {
  return (
    <div className="bg-background">
      <AboutHero />
      <ExperienceSection />
      <JourneyTimeline />
      <PhilosophySection />
      <TechStackSection />
      <CurrentlySection />
      <ContactCTA
        title="Still reading?"
        lede="Drop me a note. About a role, an AI infrastructure problem, or anything that overlaps with the work above."
      />
    </div>
  );
}
