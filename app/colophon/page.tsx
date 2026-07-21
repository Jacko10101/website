import type { Metadata } from "next";
import { BUILD, formatBuildDate } from "@/lib/build-info";
import { SessionVitals } from "@/components/session-vitals";

export const metadata: Metadata = {
  title: "Colophon — how this site runs",
  description:
    "The stack, the pipeline and the decisions behind devlinops.com — with the site's own build provenance and your session's real web vitals.",
};

const decisions = [
  {
    title: "Numbers are measured or absent",
    body: "Every metric on this site — build SHA, load time, the vitals below — is measured at build or in your browser. If something can't be measured honestly, it isn't shown. A portfolio that sells observability shouldn't fake its own telemetry.",
  },
  {
    title: "The deploy is traceable",
    body: "The footer shows the exact commit serving you this page, linked to the repository. Every deploy is a commit; every rollback is a revert. The same discipline I set up for client platforms, applied to a website.",
  },
  {
    title: "No cookies, no tracking pixels",
    body: "Analytics is Plausible — aggregate, cookie-free, no consent banner needed. The Content-Security-Policy is strict enough that a stray third-party script simply won't load.",
  },
  {
    title: "Fonts are self-hosted",
    body: "JetBrains Mono and Inter ship from this domain via next/font. No requests leave for Google Fonts; the CSP wouldn't allow them anyway.",
  },
  {
    title: "The hero is a canvas, not a video",
    body: "The glyph field on the homepage is ~150 lines of hand-written canvas: two interference waves over a stable character grid, redrawn on a 15fps budget, paused when offscreen, and reduced to a single static frame if you prefer reduced motion. No WebGL library, no shader bundle, no autoplaying video.",
  },
  {
    title: "Dark only, on purpose",
    body: "One audience, one context: engineers, usually at a desk. Maintaining a second theme would double the design surface for a mode almost nobody here would choose.",
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
          like one: shipped from a pipeline, traceable to a commit, and measured
          honestly. Consider this page its runbook.
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
            <span className="text-primary">##</span> Decisions worth flagging
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
      </div>
    </div>
  );
}
