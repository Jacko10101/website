import type { Metadata } from "next";
import { BUILD, formatBuildDate } from "@/lib/build-info";
import { SessionVitals } from "@/components/session-vitals";
import { OncallInvite } from "@/components/oncall-invite";

export const metadata: Metadata = {
  title: "Colophon · how this site runs",
  description:
    "The stack, the pipeline and the decisions behind devlinops.com, with the site's own build provenance and your session's real web vitals.",
};

const decisions = [
  {
    title: "Numbers are measured or absent",
    body: "Every metric on this site (build SHA, load time, the vitals below) is measured at build or in your browser. If something can't be measured honestly, it isn't shown. The terminal is the exception: press / anywhere on the site and most of what comes back is invented, which is why its terraform plan owns up to being theatre. Its neofetch reads the real build instead.",
  },
  {
    title: "The deploy is traceable",
    body: "The footer shows the exact commit serving you this page, linked to the repository. The same discipline I set up on the platform at work, applied to a website.",
  },
  {
    title: "No cookies, no tracking pixels",
    body: "Analytics is Plausible: aggregate, cookie-free, no consent banner needed. The Content-Security-Policy is strict enough that a stray third-party script simply won't load.",
  },
  {
    title: "Fonts are self-hosted",
    body: "JetBrains Mono and Inter ship from this domain via next/font. No requests leave for Google Fonts; the CSP wouldn't allow them anyway.",
  },
  {
    title: "The hero is a canvas, not a video",
    body: "The glyph field on the homepage is ~150 lines of hand-written canvas: two interference waves over a stable character grid, redrawn on a 15fps budget and paused when offscreen. If you prefer reduced motion it collapses to a single static frame. No WebGL, no autoplaying video.",
  },
  {
    title: "Dark only, on purpose",
    body: "One audience, one context: engineers, usually at a desk. Maintaining a second theme would double the design surface for a mode almost nobody here would choose.",
  },
  {
    title: "One console, six tubes",
    body: "Every case study renders on its own CRT phosphor, and they're real tube designations: P1 green for Heimdall, P3 amber for the gateway, P11 blue for Clarity, P4 white for the pipeline, P26 orange for observability, P16 violet for the homelab. Same console, different glass. The chip in each hero tells you which tube you're looking at.",
  },
];

const stack = [
  { name: "Next.js 16", detail: "App Router, static-first" },
  { name: "React 19", detail: "server components where possible" },
  { name: "Tailwind CSS 4", detail: "CSS-first @theme tokens" },
  { name: "Framer Motion", detail: "reduced-motion aware" },
  { name: "TypeScript", detail: "strict" },
  { name: "Plausible", detail: "cookie-free analytics" },
];

export default function ColophonPage() {
  const buildDate = formatBuildDate(BUILD.time);

  return (
    <div className="pt-32 pb-24">
      <div className="container max-w-4xl">
        <p className="font-mono text-sm text-primary mb-3" aria-hidden>
          <span className="text-muted-foreground">$</span> cat colophon.md
        </p>
        <h1 className="font-mono font-semibold tracking-tight text-4xl sm:text-5xl text-foreground mb-6">
          How this site runs
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed mb-16 max-w-2xl">
          This website is the smallest production system I operate, and it&apos;s run
          like one: it ships from a pipeline, and every number on it is measured.
          This page is the record of how it was put together and why.
        </p>

        {/* Provenance */}
        <section className="mb-16">
          <h2 className="font-mono font-semibold text-2xl text-foreground mb-6">
            <span className="text-primary">##</span> The build serving you this page
          </h2>
          <div className="rounded-lg border border-border bg-card/60 p-6 font-mono text-sm space-y-2">
            <div className="flex gap-3">
              <span className="text-muted-foreground w-20">commit</span>
              {BUILD.commitUrl ? (
                <a href={BUILD.commitUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {BUILD.shortSha}
                </a>
              ) : (
                <span className="text-primary">{BUILD.shortSha ?? "unknown"}</span>
              )}
            </div>
            <div className="flex gap-3">
              <span className="text-muted-foreground w-20">branch</span>
              <span className="text-foreground/80">{BUILD.branch ?? "unknown"}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-muted-foreground w-20">shipped</span>
              <span className="text-foreground/80">{buildDate ?? "unknown"}</span>
            </div>
            {BUILD.repoUrl && (
              <div className="flex gap-3">
                <span className="text-muted-foreground w-20">source</span>
                <a href={BUILD.repoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {BUILD.repoUrl.replace("https://", "")}
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Live vitals */}
        <section className="mb-16">
          <h2 className="font-mono font-semibold text-2xl text-foreground mb-6">
            <span className="text-primary">##</span> Your session, measured live
          </h2>
          <SessionVitals />
        </section>

        {/* Stack */}
        <section className="mb-16">
          <h2 className="font-mono font-semibold text-2xl text-foreground mb-6">
            <span className="text-primary">##</span> The stack
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {stack.map((item) => (
              <div key={item.name} className="rounded-md border border-border bg-card/60 px-4 py-3 flex items-baseline justify-between gap-3">
                <span className="font-mono text-sm text-foreground">{item.name}</span>
                <span className="text-xs text-muted-foreground text-right">{item.detail}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Decisions */}
        <section>
          <h2 className="font-mono font-semibold text-2xl text-foreground mb-6">
            <span className="text-primary">##</span> Decisions
          </h2>
          <div className="space-y-6">
            {decisions.map((decision) => (
              <div key={decision.title} className="rounded-lg border border-border bg-card/60 p-6">
                <h3 className="font-mono font-semibold text-primary mb-2">{decision.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{decision.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The on-call simulator, which otherwise only the konami code finds. */}
        <section className="mt-16">
          <h2 className="font-mono font-semibold text-2xl text-foreground mb-6">
            <span className="text-primary">##</span> Take the pager
          </h2>
          <div className="rounded-lg border border-border bg-card/60 p-6">
            <p className="text-muted-foreground leading-relaxed text-sm mb-4">
              There is an incident simulator built into this site. One shift,
              five pages, drawn from failures I have actually been woken up for:
              an OOMKilled JVM, a poison message stuck on a Kafka partition, an
              ArgoCD reconciler quietly undoing someone&apos;s manual scale.
              Reading the evidence costs a little error budget and guessing costs
              a lot. It takes about five minutes.
            </p>
            <OncallInvite />
          </div>
        </section>
      </div>
    </div>
  );
}
