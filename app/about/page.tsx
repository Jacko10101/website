import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { ContactCTA } from "@/components/contact-cta";
import { profile } from "@/lib/profile";
import { roles, education, tradingAs, stackTiers } from "@/lib/experience";

// The narrative under each employer card. The hard facts (employers, titles,
// dates, the one-line summary) live in lib/experience.ts and feed the JSON-LD
// as well; this is the part that only makes sense on the page. Keyed by
// company, so a role without a story just renders its summary.
const roleStory: Record<string, string> = {
  Loweconex:
    "I arrived in the middle of a monolith to microservices migration, writing the test automation that kept it honest. The test work kept exposing infrastructure problems, so I started fixing those instead: observability from zero, then GitOps with ArgoCD, until 20 services deployed the same way. In 2025 I moved CI onto one shared pipeline library and started the deployment-metrics tool that grew into Heimdall. The team went from asking \"did it deploy?\" to reading the answer off a screen. Since then the same platform has carried the AI work: a gateway in front of every model call, Clarity, and agents pointed at the platform's own operational load: security findings into tickets, and a first pass on incidents against the runbooks that already exist.",
  "OD3 Engineering": "First time I'd shipped anything people depended on.",
};

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
                  observability underneath them. I submitted my MSc in
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

// The facts a recruiter would otherwise go to LinkedIn for. Deliberately
// plain: employers named, real dates, no bullet-point CV register. The story
// of each role sits under its summary; there used to be a separate timeline
// telling the same three years again.
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
              {roleStory[role.company] ? (
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {roleStory[role.company]}
                </p>
              ) : null}

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

// How I work: one paragraph, not three numbered cards. The case studies were
// rid of the three-card template ending; this page shouldn't keep one.
function PhilosophySection() {
  return (
    <section className="relative py-24">
      <div className="container px-4">
        <SectionHeading label="principles" title="How I work" align="center" />

        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-muted-foreground leading-relaxed">
            A correct system nobody opens is not finished: the DORA collector
            behind Heimdall was right for months and nobody looked at it, until
            it had a UI and twenty people started opening it every morning.
            Boring is a compliment: the platform should fade into the background
            the way the office wifi does. Operability is a feature, so I default
            to one-curl health checks and a runbook per alert. If a teammate
            can&apos;t tell whether a service is healthy in under a minute, it
            isn&apos;t done.
          </p>
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
