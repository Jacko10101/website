"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll } from "framer-motion";
import { Download } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { ContactCTA } from "@/components/contact-cta";

// Journey timeline data, styled as git log entries. Hashes are decorative.
const journey = [
  {
    hash: "a1b2c3f",
    year: "2023",
    title: "QA Engineer",
    description:
      "Graduated with a BSc in Computer Science. Jumped straight into a massive monolith → microservices migration, building the first CI/CD pipelines from scratch.",
  },
  {
    hash: "d4e5f6a",
    year: "2024",
    title: "Platform Engineer",
    description:
      "Took ownership of the platform. Built observability from zero, implemented GitOps with ArgoCD, and designed deployment automation for 20+ services.",
  },
  {
    hash: "b7c8d9e",
    year: "2025",
    title: "Site Reliability Engineer",
    description:
      "Standardised the pipeline platform onto one shared library across every service. Started the deployment-metrics tooling that became Heimdall.",
  },
  {
    hash: "f0a1b2c",
    year: "2026",
    title: "Platform & MLOps · MSc AI",
    description:
      "Pivoting toward AI infrastructure. Finishing an MSc in Artificial Intelligence (August 2026). Operating as an independent B2B contractor, focused on the gap between data science and production.",
  },
];

// Things I've come to believe after a few years on platform teams
const philosophy = [
  {
    title: "Build for the morning standup",
    description:
      "If a tool doesn't have a place to look, it doesn't get used. Most of my best work has been adding a UI to something that was already running headless.",
  },
  {
    title: "Boring is a compliment",
    description:
      "The ideal platform fades into the background. Engineers shouldn't have to think about it any more than they think about the office wifi.",
  },
  {
    title: "Operability is a feature",
    description:
      "If a teammate can't tell whether your service is healthy in under a minute, you haven't finished it yet. I default to one-curl health checks and a runbook.",
  },
  {
    title: "Ship the diff, not the rewrite",
    description:
      "Every project I'm proud of started as a small thing that quietly became load-bearing. Big-bang plans almost never survive contact with reality.",
  },
];

// Tech stack, tiered honestly: what the case studies evidence in production
// versus what I've used but wouldn't claim to have operated at scale.
const stackTiers = [
  {
    id: "production",
    label: "run-in-production/",
    note: "Evidenced by the case studies. I have carried a pager for these.",
    items: [
      "Kubernetes",
      "EKS",
      "ArgoCD",
      "Kustomize",
      "Bitbucket Pipelines",
      "Prometheus",
      "Grafana",
      "Loki",
      "Thanos",
      "Alertmanager",
      "Kafka",
      "Python",
      "Flask",
      "TimescaleDB",
      "AWS",
      "K3s",
      "Home Assistant",
      "Zigbee2MQTT",
      "Tailscale",
    ],
  },
  {
    id: "working",
    label: "working-knowledge/",
    note: "Used in projects, coursework or smaller doses — not yet run at production scale.",
    items: [
      "Helm",
      "Terraform",
      "AWS CDK",
      "CloudFormation",
      "Bash",
      "TypeScript",
      "Go",
      "PyTorch",
      "MLflow",
      "KubeFlow",
      "NVIDIA GPU Operator",
      "Triton",
      "Tempo",
      "Istio",
      "OPA",
      "Falco",
      "Veracode",
      "PostgreSQL",
      "Redis",
    ],
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
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0 w-64 md:w-72"
            >
              {/* CRT-phosphor treatment — the photo renders as if on the
                  site's own monitor: green duotone + scanlines + vignette. */}
              <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-md border border-border overflow-hidden glow-border">
                <Image
                  src="/jack-photo.jpg"
                  alt="Jack Devlin"
                  fill
                  className="object-cover grayscale contrast-125 brightness-90 [filter:grayscale(1)_contrast(1.2)_brightness(0.9)_sepia(1)_hue-rotate(90deg)_saturate(1.4)]"
                  priority
                />
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none [background-image:repeating-linear-gradient(0deg,transparent_0_2px,oklch(0_0_0_/_0.18)_2px_3px)]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_at_center,transparent_55%,oklch(0_0_0_/_0.45)_100%)]"
                />
              </div>

              {/* Exif-style caption */}
              <div className="mt-3 rounded-md border border-border bg-card px-4 py-3 font-mono text-xs text-muted-foreground space-y-1">
                <p>jack.jpg · UK · platform engineer</p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden />
                  <span className="text-foreground/80">available September 2026</span>
                </p>
              </div>
            </motion.div>

            {/* Intro text */}
            <div className="text-center lg:text-left flex-1">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <p className="font-mono text-sm text-primary mb-3" aria-hidden>
                  <span className="text-muted-foreground">$</span> whoami
                </p>
                <h1 className="font-mono font-semibold tracking-tight text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
                  Hey, I&apos;m Jack
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                  Independent B2B contractor based in the UK. I sit between data
                  science and production, and I build the platforms that get models
                  and services off a laptop and onto a Kubernetes cluster that
                  doesn&apos;t fall over. Day job: Heimdall, a deployment dashboard
                  20+ engineers open every morning, a shared CI/CD library across
                  20 services, and the observability stack underneath. Night job:
                  MSc in Artificial Intelligence, finishing August 2026.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap gap-2 justify-center lg:justify-start mb-8"
              >
                {[
                  "Platform Engineering",
                  "MLOps",
                  "Kubernetes",
                  "AI Infrastructure",
                  "Observability",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-sm font-mono rounded-md bg-secondary text-secondary-foreground border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start items-center"
              >
                <a
                  href="/cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md border border-border text-foreground font-mono font-semibold hover:border-primary/60 hover:text-primary transition-colors"
                >
                  Download CV
                  <Download className="w-4 h-4" aria-hidden />
                </a>
              </motion.div>
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
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.8", "end 0.55"],
  });

  return (
    <section className="relative py-24">
      <div className="container px-4">
        <SectionHeading
          command="git log --oneline --reverse"
          title="The story"
          lede="From graduate QA to platform engineering. Here's how I got here."
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
              style={{ scaleY: scrollYProgress }}
              className="absolute left-[7px] top-2 bottom-2 w-px bg-primary origin-top"
              aria-hidden
            />

            {journey.map((item) => (
              <motion.li
                key={item.year}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className="relative pl-10 pb-12 last:pb-0"
              >
                {/* Commit dot */}
                <span
                  className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-primary bg-background"
                  aria-hidden
                />

                <p className="font-mono text-sm mb-2">
                  <span className="text-primary">{item.hash}</span>{" "}
                  <span className="text-muted-foreground">(tag: {item.year})</span>
                </p>
                <h3 className="font-mono font-semibold tracking-tight text-xl text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.li>
            ))}
          </ol>
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
          command="cat principles.md"
          title="How I work"
          lede="A few things I've come to believe after a few years on platform teams."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {philosophy.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (index % 2) * 0.08 }}
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
            </motion.div>
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
          command="ls stack/"
          title="Tech stack"
          lede="What I work with, split honestly: things I've run in production, and things I know my way around."
          align="center"
        />

        <div className="max-w-4xl mx-auto space-y-6">
          {stackTiers.map((tier) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="rounded-md border border-border bg-card p-6 md:p-8"
            >
              <h3 className="font-mono font-semibold text-sm text-primary mb-1">
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
            </motion.div>
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
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="rounded-md border border-border bg-card p-8 md:p-12"
          >
            <p className="font-mono text-sm text-primary mb-4" aria-hidden>
              <span className="text-muted-foreground">$</span> status --now
            </p>
            <h2 className="font-mono font-semibold tracking-tight text-2xl md:text-3xl text-foreground mb-3">
              Right now
            </h2>
            <p className="font-mono text-sm text-primary mb-6">
              Shipping Heimdall · Finishing the MSc · Lining up September 2026
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Wrapping up my current contract on the platform team I helped
              build. Heimdall is still the centre of gravity — a deployment
              intelligence dashboard used daily by 20+ engineers across a
              couple dozen services.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Finishing an MSc in Artificial Intelligence in August 2026. The
              dissertation looks at deep learning applied to compute resource
              allocation — the same problem I keep running into on the platform
              side, so the two halves are converging.
            </p>
            <p className="text-sm text-muted-foreground/70">
              Available from September 2026 — contracting (Outside IR35 or
              international equivalent) preferred, full-time considered,
              remote-first with relocation on the table. Platform
              engineering, SRE, and MLOps / AI infrastructure work.
            </p>
          </motion.div>
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
      <JourneyTimeline />
      <PhilosophySection />
      <TechStackSection />
      <CurrentlySection />
      <ContactCTA
        command="say-hello"
        title="Still reading?"
        lede="Drop me a note. About a B2B engagement, an AI infrastructure problem, or anything that overlaps with the work above."
      />
    </div>
  );
}
