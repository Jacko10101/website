import type { Metadata } from "next";
import { BUILD, formatBuildDate } from "@/lib/build-info";
import { SessionVitals } from "@/components/session-vitals";
import { OncallInvite } from "@/components/oncall-invite";
import { WorkConnections, QueryDrawer } from "@/components/work-connections";
import { RequestWaterfall } from "@/components/request-waterfall";
import { Whiteboard } from "@/components/whiteboard";
import { PodName } from "@/components/pod-name";
import { ContactCTA } from "@/components/contact-cta";

export const metadata: Metadata = {
  alternates: { canonical: "/lab" },
  title: "Lab",
  description:
    "Take an on-call shift, trace connections between projects, and inspect a live request waterfall from your own browser.",
  openGraph: {
    title: "Lab · Jack Devlin",
    description:
      "An incident simulator, a map of the platform, a browser request waterfall and a Kubernetes recovery experiment.",
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
    <div className="lab-surface folio-surface">
      {/* `.container` is unlayered CSS, so a `max-w-*` utility on the same
          element never wins — the cap has to live on a child. */}
      <div className="container">
        <div className="lab-content mx-auto max-w-6xl">
          <header className="page-intro"><p className="overline">Experiments / The lab</p><h1>A little further<br /><em>under the hood.</em></h1></header>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            The diagram shows how the projects at Loweconex connect. Below it,
            you can work through an incident simulation, explore the tools used
            across projects, inspect this page’s requests or try the Kubernetes recovery demo.
          </p>

          <div className="mt-12"><Whiteboard /></div>

          <nav className="lab-directory" aria-label="Lab instruments"><a href="#shift"><span>01</span>Take the pager ↘</a><a href="#query"><span>02</span>Follow the connections ↘</a><a href="#measure"><span>03</span>Watch the requests ↘</a><a href="#scheduler"><span>04</span>Break a little cluster ↘</a></nav>

          {/* 01 — the shift. */}
          <section id="shift" className="lab-station mt-20">
            <p className="eyebrow mb-4">01 · the shift</p>
            <h2 className="display mb-4 text-2xl text-foreground sm:text-3xl">
              Five incidents to work through
            </h2>
            <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
              These scenarios are based on failures I&apos;ve investigated: an
              OOMKilled JVM, a poison message stuck on a Kafka partition, an
              ArgoCD reconciler undoing a manual scale change.
              The service names are fictional. Inspect the evidence, then choose
              an action; wrong decisions reduce your budget. Use practice mode
              without a timer, or try a timed shift of about five minutes.
            </p>
            <OncallInvite />
          </section>

          {/* 02 — the artefact. */}
          <section id="query" className="lab-station mt-20">
            <p className="eyebrow mb-4">02 · query</p>
            <h2 className="display mb-4 text-2xl text-foreground sm:text-3xl">
              Follow the connections
            </h2>
            <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
              Select a tool to see which projects use it. Prometheus appears in
              the monitoring stack and the homelab; Kubernetes connects the
              production platform with my MSc research. You can also query the
              project data in the SQL workbench.
            </p>
            <WorkConnections />
            <QueryDrawer />
          </section>

          {/* 03 — the instrument. */}
          <section id="measure" className="lab-station mt-20">
            <p className="eyebrow mb-4">03 · measure</p>
            <h2 className="display mb-4 text-2xl text-foreground sm:text-3xl">
              Watch this page arrive
            </h2>
            <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
              These are the requests recorded by your browser during this visit.
              Freeze the view, filter requests and inspect their timings. Opening
              the SQL workbench above also loads its database engine, which appears here.
            </p>
            <RequestWaterfall />
            <p className="eyebrow mb-4 mt-10">The document at a glance</p>
            <SessionVitals />
          </section>

          <section id="scheduler" className="lab-station scheduler-experiment mt-20">
            <p className="eyebrow mb-4">04 · recovery</p>
            <h2 className="display mb-4 text-2xl text-foreground sm:text-3xl">Break a little cluster</h2>
            <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">Every letter is a node, every dot a pod. Click a letter to take it down. The surviving nodes take the most important work first; anything that doesn’t fit waits for room. This is an illustration of the recovery question behind my MSc research.</p>
            <PodName />
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
      <ContactCTA />
    </div>
  );
}
