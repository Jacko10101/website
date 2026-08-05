"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import {
  PHOSPHORS,
  CaseStudyLayout,
  CaseStudyHero,
  TechSidebar,
  CaseStudyCTA,
} from "@/components/case-study-layout";
import { ChatSection as CaseStudySection } from "@/components/case-section-variants";
import { FadeUp } from "@/components/scroll-reveal";
import { TerminalWindow } from "@/components/terminal-window";
import { GroundingDemo } from "@/components/grounding-demo";
import { SqlPlayground } from "@/components/sql-playground";
import { SchemaDirectory } from "@/components/schema-directory";

/* --------------------------------------------------------------------------
 * Evidence. This page argues that the hard part of text-to-SQL is proving the
 * answer, so every claim on it is followed by the artefact that backs it —
 * screenshots sit inline next to the paragraph they prove, not in a gallery
 * at the end. Keyed rather than a list so placement is explicit at the call
 * site. See PERSONAL-TODO.md for what to redact before exporting new ones.
 * ----------------------------------------------------------------------- */
interface Shot {
  src: string;
  alt: string;
  label: string;
  caption: ReactNode;
  width: number;
  height: number;
}

const SHOTS: Record<string, Shot> = {
  answerSql: {
    src: "/clarity/answer-with-sql.png",
    alt: "Clarity answering how many sites are in the estate, with the two SQL statements that produced the answer shown underneath it",
    label: "clarity · chat",
    width: 2000,
    height: 1025,
    caption: (
      <>
        518 sites, and underneath it the two statements that counted them.
        Showing the query costs screen space and turns an oracle into a tool —
        these people read SQL, and letting them check beats any amount of
        confident phrasing.
      </>
    ),
  },
  briefing: {
    src: "/clarity/estate-briefing.png",
    alt: "Generated estate briefing showing site and device counts, a disconnected HVAC unit, onboarding status and an empty maintenance backlog",
    label: "clarity · estate briefing",
    width: 2000,
    height: 1027,
    caption: (
      <>
        The briefing compiles the same grounded context into a readout. Nine
        sites, 170 devices, one HVAC unit offline for over 24 hours. Each card
        names the site it came from rather than summarising the estate in prose,
        so anything surprising can be checked against the thing it describes.
      </>
    ),
  },
  exports: {
    src: "/clarity/report-export.png",
    alt: "Reports page showing a generated CSV of telemetry readings, 39,041 rows and 2.6MB, ready to download",
    label: "clarity · exports",
    width: 2000,
    height: 1003,
    caption: (
      <>
        39,041 rows, 2.6MB, retained 30 days. Exports stream row by row and
        never assemble the result set in heap, which is the whole reason a
        question that returns forty thousand rows doesn&apos;t take the pod with
        it.
      </>
    ),
  },
  dashboard: {
    src: "/clarity/dashboard-from-chat.png",
    alt: "A dashboard built from a Clarity conversation, with the tenant's name and figures redacted, showing widgets and a note about filters",
    label: "clarity · a dashboard the AI built",
    width: 2000,
    height: 856,
    caption: (
      <>
        A dashboard assembled from a conversation, which is the point at which
        it stops being a chat toy. The tenant&apos;s name and their trading
        figures are blacked out — they&apos;re not mine to publish. The note
        above the widgets is real and worth leaving in: widgets built before
        dashboard filters existed can&apos;t be reached by them, so the honest
        fix is to say so in the UI and rebuild from a chat.
      </>
    ),
  },
};

/**
 * A claim's receipt. Renders nothing if the capture doesn't exist yet, so the
 * page degrades to prose rather than to a broken image — same rule the product
 * follows when it has no data to stand an answer on.
 */
function Evidence({ of }: { of: keyof typeof SHOTS }) {
  const shot = SHOTS[of];
  if (!shot) return null;
  const { src, alt, caption, label, width, height } = shot;
  return (
    <FadeUp>
      <figure className="my-7">
        <TerminalWindow title={label}>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-auto"
            sizes="(max-width: 1024px) 100vw, 800px"
          />
          <figcaption className="px-5 py-4 border-t border-border bg-card/50 text-sm text-muted-foreground leading-relaxed">
            <span className="font-mono text-[11px] uppercase tracking-wider text-primary block mb-1.5">
              the receipt
            </span>
            {caption}
          </figcaption>
        </TerminalWindow>
      </figure>
    </FadeUp>
  );
}

/* --------------------------------------------------------------------------
 * The enforcement ledger. The argument this whole project rests on is that a
 * guarantee written into a prompt isn't a guarantee, so each one is listed
 * against the place it actually holds. Deliberately not three cards in a row.
 * ----------------------------------------------------------------------- */
const GUARANTEES: { claim: string; where: string; detail: string }[] = [
  {
    claim: "An answer with a number in it ran a query",
    where: "canary evals, post-deploy",
    detail:
      "Canned questions replay after every deploy and assert against the audit record rather than the prose. Answer contains a number, SQL must have run. Export claimed, report row must have completed.",
  },
  {
    claim: "Generated SQL can only ever read",
    where: "a Postgres role, not the prompt",
    detail:
      "Queries run as a dedicated read-only role provisioned on every tenant database at startup. It fails closed: no pool, no query. It never falls back to the admin connection, which is the sort of helpfulness that ends up in an incident report.",
  },
  {
    claim: "The two data stores can never be joined",
    where: "routing, by construction",
    detail:
      "Operational data lives on a per-tenant database, telemetry in a shared time-series store, and generated SQL is routed to exactly one of them. A cross-store join isn't discouraged, it's unavailable — which kills a whole category of confidently wrong answer.",
  },
  {
    claim: "A conversation can't become runaway spend",
    where: "around the agent loop",
    detail:
      "Every turn carries a tool-call cap enforced around the loop, not requested inside it. Blow it and the model is told to summarise what it found and stop. A per-tenant token bucket sits on top.",
  },
  {
    claim: "The documentation can't drift from the metrics",
    where: "a unit test, both directions",
    detail:
      "Every registered metric is compared against the documented table and back again. That's how a series nobody could query survived for months, and how a total-outage signal sat there unalerted.",
  },
];

function GuaranteeLedger() {
  return (
    <ol className="border-t border-border">
      {GUARANTEES.map((g, i) => (
        <li key={g.claim} className="border-b border-border py-5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
            <span className="font-mono text-xs text-muted-foreground/60 tabular-nums" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-mono font-semibold tracking-tight text-foreground">
              {g.claim}
            </h3>
            <span className="font-mono text-[11px] text-primary border border-primary/30 rounded px-2 py-0.5">
              {g.where}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed pl-0 sm:pl-8">
            {g.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Clarity · a natural-language interface to a multi-tenant database estate",
  description:
    "Text-to-SQL across ~30 tenant databases. Generating the SQL was the easy bit. Proving the answer was real took the other eight months.",
  author: { "@type": "Person", name: "Jack Devlin", url: "https://devlinops.com" },
  publisher: { "@type": "Organization", name: "DevlinOps", url: "https://devlinops.com" },
  datePublished: "2025-11-01",
  dateModified: "2026-07-28",
  proficiencyLevel: "Expert",
  keywords: [
    "LLM",
    "Text-to-SQL",
    "Grounding",
    "Hallucination detection",
    "Spring AI",
    "Gemini",
    "Multi-tenancy",
  ],
};

export default function ClarityPage() {
  return (
    <CaseStudyLayout schema={articleSchema} phosphor={PHOSPHORS.blue}>
      <CaseStudyHero
        title="Clarity"
        subtitle="Natural-language database interface"
        description="Ask the estate a question in English, get an answer with the SQL that produced it. Around thirty tenant databases, about twenty people daily. Generating SQL was the easy bit."
        date="2025 → ongoing"
        metrics="~30 tenants, ~20 daily users"
        command="cat case-studies/clarity.md"
        phosphor={PHOSPHORS.blue.label}
      />

      <div className="container px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="mb-5">
              <span className="font-mono text-sm text-primary">&gt; try it yourself</span>
              <h2 className="mt-2 font-mono font-semibold tracking-tight text-2xl sm:text-3xl text-foreground">
                Five ways an answer can lie
              </h2>
              <p className="mt-2 text-muted-foreground max-w-2xl">
                Toggle it off for what the model said. On for what ships. All
                five are simplified from cases the detectors caught in
                production.
              </p>
            </div>
            <GroundingDemo />
          </FadeUp>
        </div>
      </div>

      <div className="container px-4">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
          <div className="space-y-12">
            <CaseStudySection
              eyebrow="> how hard is text-to-sql, really?"
              title="Text-to-SQL demos in an afternoon"
            >
              <p className="text-muted-foreground leading-relaxed mb-4">
                Point a decent model at a schema and you&apos;ll have something
                working before lunch. That part really is easy now.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Day two is the problem. It answers from a table that died a year
                ago. It quotes a number without running a query. It says your
                export is ready when nothing was ever written. Each one beats a
                stack trace for damage, because nobody can tell it happened.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                So I stopped reading feature requests and read transcripts
                instead. The gap was never capability. It was trust.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Which is why everything below comes with the thing that proves
                it. Clarity won&apos;t assert a number without showing the query
                behind it, and this page holds itself to the same standard.
              </p>

              <Evidence of="answerSql" />
            </CaseStudySection>

            <CaseStudySection eyebrow="> where's the vector store?" title="No vector store. Anywhere.">
              <p className="text-muted-foreground leading-relaxed mb-4">
                The default move is embeddings. Chunk the schema, load it into a
                vector database, retrieve per question. I&apos;d push back on
                anyone reaching for that first: a schema isn&apos;t an unbounded
                corpus, it&apos;s a few hundred tables you can simply describe.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A nightly job compiles a knowledge document per tenant. Business
                summary per table, a glossary, SQL recipes known to work. It goes
                into every conversation as cached context, byte-identical so the
                provider can actually cache it.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The model turns up already knowing the estate. Live discovery
                stays as a fallback, so a table added this morning works this
                morning. This is what it gets handed:
              </p>

              <SchemaDirectory />

              <p className="text-muted-foreground leading-relaxed mt-6">
                Compiled knowledge is what lets it answer about the whole estate
                at once rather than one table at a time:
              </p>

              <Evidence of="briefing" />
            </CaseStudySection>

            <CaseStudySection eyebrow="> which sites are running hottest?" title="The bug that changed the design">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Someone asked which sites were running hottest. Clarity said
                there was no data. There was loads of data. It had found a
                promisingly named table, dead for months, while the live
                telemetry sat somewhere less obvious.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A wrong &quot;no data&quot; is the nastiest failure in the set.
                Nobody escalates it. They decide the tool is useless and stop
                asking, and no metric ever tells you.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Now the compile probes each table for its newest timestamp and
                marks the directory:{" "}
                <code className="text-primary">(no rows)</code>,{" "}
                <code className="text-primary">(no new data since …)</code>. The
                model routes around dead tables because it can see they&apos;re
                dead. Freshness stays out of the change-detection hash, or a
                timestamp moving nightly would re-summarise the whole estate
                nightly to tell us nothing changed.
              </p>
            </CaseStudySection>

            <CaseStudySection
              eyebrow="> drop table sites;"
              title="Try to get something past it"
            >
              <p className="text-muted-foreground leading-relaxed mb-4">
                Generated SQL is untrusted input that happens to be executable.
                The system prompt says read-only, which is worth nothing on its
                own, so the enforcement lives in the database.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Queries run as a dedicated read-only role, provisioned on every
                tenant database at startup. It fails closed: no pool, no query.
                It never falls back to the admin connection, which is the sort of
                helpfulness that ends up in an incident report.
              </p>

              <SqlPlayground />

              <p className="text-muted-foreground mt-6 leading-relaxed">
                Validation lexes SQL to canonical tokens before checking
                anything. String matching loses to quoting and comments, so{" "}
                <code className="text-primary">FROM/**/pg_tables</code> would
                walk straight past it. Failures return as data, not exceptions,
                so the model reads its own error and corrects itself.
              </p>
            </CaseStudySection>

            <CaseStudySection
              eyebrow="> how do you know it works?"
              title="I won't use a model to grade a model"
            >
              <p className="text-muted-foreground leading-relaxed mb-4">
                LLM-as-judge is the obvious approach and I rejected it. A grader
                that hallucinates can&apos;t certify a system whose defining
                failure is hallucination. The bad case isn&apos;t a wrong score,
                it&apos;s two models agreeing confidently in the same wrong
                direction with a green dashboard on top.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Canned questions replay after every deploy, asserted against the
                audit record rather than the prose. Answer contains a number, SQL
                must have run. Fabricated-names list must be empty. Export
                claimed, report row must have completed. Nothing to argue with at
                2am.
              </p>
            </CaseStudySection>

            <CaseStudySection
              eyebrow="> what stops it, though?"
              title="Five guarantees, none of them a prompt"
            >
              <p className="text-muted-foreground leading-relaxed mb-6">
                A system prompt is a request. Everything below is a property of
                the system, which is the difference between a rule and a wish.
                Each one names where it&apos;s actually enforced.
              </p>

              <GuaranteeLedger />

              <Evidence of="exports" />
            </CaseStudySection>

            <CaseStudySection
              eyebrow="> is it actually working?"
              title="An honest answer"
            >
              <p className="text-muted-foreground leading-relaxed mb-4">
                It answers questions people used to queue up for an analyst to
                run, and it builds them things — the point at which it stops
                being a chat toy and starts being a product.
              </p>

              <Evidence of="dashboard" />

              <p className="text-muted-foreground leading-relaxed mt-2">
                And the part I can&apos;t show you: the trust layer is built and
                running, but the proof it has driven fabrication to zero
                isn&apos;t in yet. The transcript analysis that started all of
                this hasn&apos;t been re-run against the current build. By the
                standard this page has been holding itself to, that claim has no
                receipt, so I&apos;m not making it.
              </p>
            </CaseStudySection>
          </div>

          <TechSidebar
            technologies={[
              "Java 21",
              "Spring Boot",
              "Spring AI",
              "Gemini 2.5 Flash",
              "LiteLLM",
              "PostgreSQL",
              "TimescaleDB",
              "Flyway",
              "S3",
              "Caffeine",
              "Micrometer",
              "OpenTelemetry",
              "Kubernetes",
            ]}
            skills={[
              "LLM grounding and hallucination detection",
              "Evaluation that doesn't rely on a model",
              "Securing model-generated SQL",
              "Multi-tenant data isolation",
              "Streaming exports at constant memory",
              "Instrumenting AI so failures are visible",
            ]}
            metrics={[
              { label: "Tenants", value: "~30, isolated per database" },
              { label: "Grounding checks", value: "5 classes, every turn" },
              { label: "Vector stores", value: "None. Compiled knowledge" },
              { label: "Export ceiling", value: "50k rows, flat memory" },
            ]}
            relatedProjects={[
              { title: "AI Gateway · one endpoint for every model", href: "/projects/ai-gateway" },
              { title: "Observability · self-hosted monitoring", href: "/projects/observability" },
            ]}
          />
        </div>
      </div>

      <CaseStudyCTA line="Everything above has its receipt except the last paragraph, and I told you which one that was. I'd hold work to the same standard." />
    </CaseStudyLayout>
  );
}
