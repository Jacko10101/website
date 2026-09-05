import type { Metadata } from "next";
import { BUILD, formatBuildDate } from "@/lib/build-info";
import { SessionVitals } from "@/components/session-vitals";
import { OncallInvite } from "@/components/oncall-invite";
import { CareerQuery } from "@/components/career-query";

export const metadata: Metadata = {
  alternates: { canonical: "/lab" },
  title: "Lab · take the pager",
  description:
    "An incident simulator, a SQLite database of my work you can query, and your own session's web vitals. All of it runs in your browser.",
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
    <div className="pb-28 pt-28 md:pt-36">
      {/* `.container` is unlayered CSS, so a `max-w-*` utility on the same
          element never wins — the cap has to live on a child. */}
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow mb-5">lab</p>
          <h1 className="display text-4xl text-foreground sm:text-5xl md:text-6xl">
            Take the pager
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            An incident simulator, a database of my work you can query, and
            your own session measured as you read. All of it runs in your
            browser and nothing leaves it.
          </p>

          {/* 01 — the shift. */}
          <section className="mt-20">
            <p className="eyebrow mb-4">01 · the shift</p>
            <h2 className="display mb-4 text-2xl text-foreground sm:text-3xl">
              One shift, five pages
            </h2>
            <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
              The failure modes are ones I&apos;ve been paged for: an
              OOMKilled JVM, a poison message stuck on a Kafka partition, an
              ArgoCD reconciler quietly undoing someone&apos;s manual scale.
              The service names are made up. Reading the evidence costs a
              little error budget and guessing costs a lot. It takes about
              five minutes.
            </p>
            <OncallInvite />
            {/* Two of the fourteen lessons, for the reader who won't play. */}
            <ul className="mt-8 max-w-2xl space-y-2 border-l border-border pl-4 font-mono text-xs leading-relaxed text-muted-foreground">
              <li>When the spike starts at a deploy boundary, stop reading logs and start reading the deploy history.</li>
              <li>Latency that hits every service at once is rarely in any of them. Check the shared dependencies.</li>
            </ul>
          </section>

          {/* 02 — the artefact. */}
          <section className="mt-20">
            <p className="eyebrow mb-4">02 · query</p>
            <h2 className="display mb-4 text-2xl text-foreground sm:text-3xl">
              Ask the database
            </h2>
            <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
              A SQLite database of my work, compiled to WebAssembly and
              running in your tab. Pick a question, read the SQL that answers
              it, then edit it and run your own. The box is guarded by the same
              validator that refuses model-generated SQL in Clarity.
            </p>
            <CareerQuery />
          </section>

          {/* 03 — the instrument. */}
          <section className="mt-20">
            <p className="eyebrow mb-4">03 · measure</p>
            <h2 className="display mb-4 text-2xl text-foreground sm:text-3xl">
              Your session, measured live
            </h2>
            <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
              The same numbers I&apos;d put on a dashboard, taken from this page
              as you read it. Each one says what it means and what would count
              as bad.
            </p>
            <SessionVitals />
          </section>

          {/* The provenance, as a footnote. It is the one claim this page makes
              about itself, so it should be checkable and it should be small. */}
          <section className="mt-20 border-t border-border pt-8">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              the build serving you this page
            </p>
            <div className="flex flex-wrap gap-x-10 gap-y-2 font-mono text-sm">
              <span className="flex gap-3">
                <span className="text-muted-foreground">commit</span>
                {BUILD.commitUrl ? (
                  <a
                    href={BUILD.commitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {BUILD.shortSha}
                  </a>
                ) : (
                  <span className="text-primary">{BUILD.shortSha ?? "unknown"}</span>
                )}
              </span>
              <span className="flex gap-3">
                <span className="text-muted-foreground">branch</span>
                <span className="text-foreground/80">{BUILD.branch ?? "unknown"}</span>
              </span>
              <span className="flex gap-3">
                <span className="text-muted-foreground">shipped</span>
                <span className="text-foreground/80">{buildDate ?? "unknown"}</span>
              </span>
              {BUILD.repoUrl && (
                <span className="flex gap-3">
                  <span className="text-muted-foreground">source</span>
                  <a
                    href={BUILD.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
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
