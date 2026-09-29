import type { Metadata } from "next";
import { BUILD, formatBuildDate } from "@/lib/build-info";
import { SessionVitals } from "@/components/session-vitals";
import { OncallInvite } from "@/components/oncall-invite";
import { WorkConnections, QueryDrawer } from "@/components/work-connections";
import { RequestWaterfall } from "@/components/request-waterfall";
import { Whiteboard } from "@/components/whiteboard";
import { PodName } from "@/components/pod-name";

export const metadata: Metadata = {
  alternates: { canonical: "/lab" },
  title: "Experiments · follow the work",
  description:
    "Take an on-call shift, trace connections between projects, and inspect a live request waterfall from your own browser.",
  openGraph: {
    title: "Lab · Jack Devlin",
    description:
      "Take the pager: an incident simulator drawn from real pages, plus a database of the work you can query in your browser.",
    url: "/lab",
  },
};

/**
 * The page for anyone still here, led by the best thing on the site.
 *
 * This was /playground, then briefly /oncall, and before both a colophon.
 * The on-call simulator sat third on it, under a name no hiring manager
 * clicks, so almost nobody found it. Now the page opens on it. The career
 * query and the vitals follow; the build provenance stays a footnote.
 */
export default function LabPage() {
  const buildDate = formatBuildDate(BUILD.time);

  return (
    <div className="lab-surface folio-surface pb-28 pt-28 md:pt-36">
      {/* `.container` is unlayered CSS, so a `max-w-*` utility on the same
          element never wins — the cap has to live on a child. */}
      <div className="container">
        <div className="lab-content mx-auto max-w-6xl">
          <p className="eyebrow mb-5">lab</p>
          <h1 className="lab-heading">
            Open the tools.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            The whiteboard is the platform I work on, drawn the way I’d draw it
            for you in an interview. Below it: take an on-call shift, break my
            name, follow a tool through the work, or watch this page arrive.
          </p>

          <div className="mt-12"><Whiteboard /></div>

          <nav className="lab-directory lab-directory-four" aria-label="Lab instruments"><a href="#shift"><span>01 / Decide</span>Take the pager ↘</a><a href="#break"><span>02 / Break</span>Break my name ↘</a><a href="#query"><span>03 / Inspect</span>Follow the connections ↘</a><a href="#measure"><span>04 / Observe</span>Watch the requests ↘</a></nav>

          {/* 01 — the shift. */}
          <section id="shift" className="lab-station mt-20">
            <p className="eyebrow mb-4">01 · the shift</p>
            <h2 className="display mb-4 text-2xl text-foreground sm:text-3xl">
              One shift, five pages
            </h2>
            <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
              The failure modes are ones I&apos;ve been paged for: an
              OOMKilled JVM, a poison message stuck on a Kafka partition, an
              ArgoCD reconciler quietly undoing someone&apos;s manual scale.
              The service names are made up. Reading the evidence is free. Wrong moves cost budget.
              Take your time in practice mode, or choose a timed shift.
              A full shift takes about five minutes.
            </p>
            <OncallInvite />
            {/* Two of the fourteen lessons, for the reader who won't play. */}
            <ul className="mt-8 max-w-2xl space-y-2 border-l border-border pl-4 font-mono text-xs leading-relaxed text-muted-foreground">
              <li>When the spike starts at a deploy boundary, stop reading logs and start reading the deploy history.</li>
              <li>Latency that hits every service at once is rarely in any of them. Check the shared dependencies.</li>
            </ul>
          </section>

          {/* 02 — the name as a cluster. */}
          <section id="break" className="lab-station mt-20">
            <p className="eyebrow mb-4">02 · break</p>
            <h2 className="display mb-4 text-2xl text-foreground sm:text-3xl">
              Break my name
            </h2>
            <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
              Each letter is a node and each square is a pod. Knock a node over
              and the surviving letters take the most important pods first; the
              rest wait for room. It’s the rule from my MSc research, at the size
              of a heading.
            </p>
            <PodName />
          </section>

          {/* 03 — the artefact. */}
          <section id="query" className="lab-station mt-20">
            <p className="eyebrow mb-4">03 · query</p>
            <h2 className="display mb-4 text-2xl text-foreground sm:text-3xl">
              Follow the connections
            </h2>
            <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
              The same tools turn up in different places. Follow Prometheus from
              the platform into my flat, or Kubernetes from production into the
              research. Pick a thread and see the work it connects.
            </p>
            <WorkConnections />
            <QueryDrawer />
          </section>

          {/* 04 — the instrument. */}
          <section id="measure" className="lab-station mt-20">
            <p className="eyebrow mb-4">04 · measure</p>
            <h2 className="display mb-4 text-2xl text-foreground sm:text-3xl">
              Watch this page arrive
            </h2>
            <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
              A flight recorder for this visit. Freeze it, filter the requests,
              and inspect the timings. Open the SQL workbench above and its
              database engine will leave a trace here too.
            </p>
            <RequestWaterfall />
            <p className="eyebrow mb-4 mt-10">The document at a glance</p>
            <SessionVitals />
          </section>

          {/* The provenance, as a footnote. It is the one claim this page makes
              about itself, so it should be checkable and it should be small. */}
          <section className="mt-20 border-t border-border pt-8">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              the build serving you this page
            </p>
            <div className="flex flex-wrap gap-x-10 gap-y-2 font-mono text-sm">
              <span className="flex min-w-0 flex-wrap gap-x-3 gap-y-1">
                <span className="text-muted-foreground">commit</span>
                {BUILD.commitUrl ? (
                  <a
                    href={BUILD.commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-primary hover:underline"
                  >
                    {BUILD.shortSha}
                  </a>
                ) : (
                  <span className="text-primary">{BUILD.shortSha ?? "unknown"}</span>
                )}
              </span>
              <span className="flex min-w-0 flex-wrap gap-x-3 gap-y-1">
                <span className="text-muted-foreground">branch</span>
                <span className="text-foreground/80">{BUILD.branch ?? "unknown"}</span>
              </span>
              <span className="flex min-w-0 flex-wrap gap-x-3 gap-y-1">
                <span className="text-muted-foreground">shipped</span>
                <span className="text-foreground/80">{buildDate ?? "unknown"}</span>
              </span>
              {BUILD.repoUrl && (
                <span className="flex min-w-0 flex-wrap gap-x-3 gap-y-1">
                  <span className="text-muted-foreground">source</span>
                  <a
                    href={BUILD.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-primary hover:underline"
                  >
                    {BUILD.repoUrl.replace("https://", "")}
                  </a>
                </span>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
