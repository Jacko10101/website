import type { Metadata } from "next";
import { BUILD, formatBuildDate } from "@/lib/build-info";
import { SessionVitals } from "@/components/session-vitals";
import { OncallInvite } from "@/components/oncall-invite";
import { CareerQuery } from "@/components/career-query";

export const metadata: Metadata = {
  alternates: { canonical: "/oncall" },
  title: "On call · take the pager",
  description:
    "An incident simulator drawn from pages I have actually been woken up for, a real SQLite database of my work you can query, and your session's live web vitals. All of it runs in your browser.",
  openGraph: {
    title: "On call · Jack Devlin",
    description:
      "Take the pager: an incident simulator drawn from real pages, plus a database of the work you can query in your browser.",
    url: "/oncall",
  },
};

/**
 * The page for anyone still here, led by the best thing on the site.
 *
 * This was /playground, and before that a colophon. The on-call simulator
 * sat third on it, under a name no hiring manager clicks, so almost nobody
 * found it. Now the page is named for it and opens on it. The career query
 * and the vitals follow; the build provenance stays a footnote.
 */
export default function OncallPage() {
  const buildDate = formatBuildDate(BUILD.time);

  return (
    <div className="pb-28 pt-28 md:pt-36">
      {/* `.container` is unlayered CSS, so a `max-w-*` utility on the same
          element never wins — the cap has to live on a child. */}
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow mb-5">on call</p>
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
              Drawn from failures I have actually been woken up for: an
              OOMKilled JVM, a poison message stuck on a Kafka partition, an
              ArgoCD reconciler quietly undoing someone&apos;s manual scale.
              Reading the evidence costs a little error budget and guessing
              costs a lot. It takes about five minutes.
            </p>
            <OncallInvite />
          </section>

          {/* 02 — the artefact. */}
          <section className="mt-20">
            <p className="eyebrow mb-4">02 · query</p>
            <h2 className="display mb-4 text-2xl text-foreground sm:text-3xl">
              Ask the database
            </h2>
            <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
              A real SQLite database of my work, compiled to WebAssembly and
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
