"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { PHOSPHORS, CaseStudyLayout } from "@/components/case-study-layout";
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
 * The front page of the ledger. This document's genre is claims-and-receipts,
 * so it opens the way an audit does: state the claims up front, say which
 * carry receipts, and be honest about the one that doesn't. Six claims, five
 * receipts, one left open on purpose — the closing paragraph explains why.
 * ----------------------------------------------------------------------- */
const LEDGER: { claim: string; receipt: string; open?: boolean }[] = [
  { claim: "Answers arrive with the SQL that produced them", receipt: "screenshot" },
  { claim: "It knows the whole estate, not one table at a time", receipt: "screenshot" },
  { claim: "Generated SQL can only ever read", receipt: "try it below" },
  { claim: "A 39,041-row export won't take the pod with it", receipt: "screenshot" },
  { claim: "A conversation can become a dashboard", receipt: "screenshot" },
  { claim: "Fabrication is at zero", receipt: "none yet", open: true },
];

function ClaimsLedgerHeader() {
  return (
    <header className="relative pt-28 pb-20 md:pt-32 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 grid-background pointer-events-none" aria-hidden />

      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
        </motion.div>

        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs uppercase tracking-[0.2em] text-primary mb-4"
            aria-hidden
          >
            claims &amp; receipts
          </motion.p>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-mono font-semibold tracking-tight text-4xl sm:text-5xl md:text-6xl text-foreground mb-4"
          >
            Clarity
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-mono text-sm text-muted-foreground mb-6"
          >
            Natural-language database interface
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-10 leading-relaxed"
          >
            Ask the estate a question in English, get an answer with the SQL
            that produced it. Generating the SQL was the easy bit. The hard
            part was proving the answers, so this page is written the way the
            product works: every claim sits next to the thing that backs it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-lg border border-border bg-card/40 overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2.5 border-b border-border bg-card/60 font-mono text-[11px]">
              <span className="uppercase tracking-wider text-primary">
                what this page claims
              </span>
              <span className="text-muted-foreground">
                2025 → ongoing · ~30 tenants · ~20 daily users
              </span>
            </div>
            <ol className="font-mono text-sm">
              {LEDGER.map((row, i) => (
                <li
                  key={row.claim}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5 px-4 py-3 border-b border-border/60"
                >
                  <span
                    className="text-xs text-muted-foreground/60 tabular-nums"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`flex-1 min-w-[14rem] ${
                      row.open ? "text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {row.claim}
                  </span>
                  <span
                    className={`text-[11px] rounded border px-2 py-0.5 ${
                      row.open
                        ? "border-border text-muted-foreground"
                        : "border-primary/30 text-primary"
                    }`}
                  >
                    {row.open ? "no receipt" : `receipt · ${row.receipt}`}
                  </span>
                </li>
              ))}
            </ol>
            <p className="px-4 py-3 font-mono text-xs text-muted-foreground leading-relaxed">
              Five receipts on this page. The sixth claim is left open on
              purpose — it&apos;s the last paragraph, and it stays open until
              the evidence exists.
            </p>
          </motion.div>
        </div>
      </div>
    </header>
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
      "The canary evals from the section above: canned questions after every deploy, asserted against the audit record rather than the prose.",
  },
  {
    claim: "Generated SQL can only ever read",
    where: "a Postgres role, not the prompt",
    detail:
      "A dedicated read-only role, provisioned on every tenant database at startup. It fails closed — no pool, no query — and there is no code path that falls back to the admin connection.",
  },
  {
    claim: "The two data stores can never be joined",
    where: "routing, by construction",
    detail:
      "Operational data lives on a per-tenant database, telemetry in a shared time-series store, and generated SQL is routed to exactly one of them. A cross-store join can't be expressed at all, which removes a whole category of wrong answer.",
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

/* --------------------------------------------------------------------------
 * The audit record. Every case study carries the same facts — stack, skills,
 * numbers, cross-references — but here they're filed as one continuous
 * document rather than the shared `$ stack` cards, because on this page even
 * the sidebar is part of the ledger.
 * ----------------------------------------------------------------------- */
function RecordLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-mono text-[11px] uppercase tracking-wider text-primary mb-3">
      {children}
    </h3>
  );
}

function AuditRecord() {
  return (
    <aside className="lg:sticky lg:top-24 self-start">
      <FadeUp delay={0.1}>
        <div className="rounded-lg border border-border bg-card/40 overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border bg-card/60 font-mono text-[11px]">
            <span className="uppercase tracking-wider text-primary">
              audit record
            </span>
            <span className="text-muted-foreground">clarity</span>
          </div>

          <div className="px-5 py-5 border-b border-border/60">
            <RecordLabel>built with</RecordLabel>
            <p className="font-mono text-xs text-muted-foreground leading-loose">
              Java 21 · Spring Boot · Spring AI · Gemini 2.5 Flash · LiteLLM ·
              PostgreSQL · TimescaleDB · Flyway · S3 · Caffeine · Micrometer ·
              OpenTelemetry · Kubernetes
            </p>
          </div>

          <div className="px-5 py-5 border-b border-border/60">
            <RecordLabel>entered in evidence</RecordLabel>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "LLM grounding and hallucination detection",
                "Evaluation that doesn't rely on a model",
                "Securing model-generated SQL",
                "Multi-tenant data isolation",
                "Streaming exports at constant memory",
                "Instrumenting AI so failures are visible",
              ].map((skill) => (
                <li key={skill} className="flex gap-2">
                  <span className="text-primary shrink-0" aria-hidden>
                    –
                  </span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="px-5 py-5 border-b border-border/60">
            <RecordLabel>for the record</RecordLabel>
            <ul className="space-y-2.5 text-sm leading-relaxed">
              {[
                { label: "Tenants", value: "~30, isolated per database" },
                { label: "Grounding checks", value: "5 classes, every turn" },
                { label: "Vector stores", value: "none — compiled knowledge" },
                { label: "Export ceiling", value: "50k rows, flat memory" },
              ].map((metric) => (
                <li key={metric.label}>
                  <span className="font-medium text-foreground">
                    {metric.label}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    — {metric.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-5 py-5">
            <RecordLabel>cross-referenced</RecordLabel>
            <div className="space-y-3">
              {[
                {
                  title: "AI Gateway · one endpoint for every model",
                  href: "/projects/ai-gateway",
                },
                {
                  title: "Observability · self-hosted monitoring",
                  href: "/projects/observability",
                },
              ].map((project) => (
                <Link
                  key={project.href}
                  href={project.href}
                  className="group flex items-baseline justify-between gap-3 text-sm font-medium hover:text-primary transition-colors"
                >
                  <span>{project.title}</span>
                  <span
                    className="font-mono text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                    aria-hidden
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 px-5 py-3 border-t border-border bg-card/60 font-mono text-[11px] text-muted-foreground">
            <span
              className="w-1.5 h-1.5 rounded-full bg-primary glow-soft"
              aria-hidden
            />
            rendered on phosphor {PHOSPHORS.blue.label}
          </div>
        </div>
      </FadeUp>
    </aside>
  );
}

/* --------------------------------------------------------------------------
 * Closing the ledger out. Sits after the one claim without a receipt, which
 * is the whole ending — this just balances the books and says goodbye.
 * ----------------------------------------------------------------------- */
function LedgerSignOff() {
  return (
    <section className="container px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <FadeUp>
          <div className="rounded-lg border border-border bg-card/40 overflow-hidden font-mono">
            <div className="px-5 py-3 border-b border-border bg-card/60 text-[11px] uppercase tracking-wider text-primary">
              ledger closed
            </div>
            <dl className="px-5 py-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">receipts attached</dt>
                <dd className="text-foreground tabular-nums">5</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">claims left open</dt>
                <dd className="text-primary">1 · marked above</dd>
              </div>
            </dl>
          </div>
          <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
            Everything above has its receipt except the last paragraph, and I
            told you which one that was. I&apos;d hold work to the same
            standard —{" "}
            <Link
              href="/contact"
              className="text-primary hover:underline underline-offset-4"
            >
              say hello
            </Link>{" "}
            if that sounds useful, or head{" "}
            <Link
              href="/projects"
              className="text-primary hover:underline underline-offset-4"
            >
              back to the projects
            </Link>
            .
          </p>
        </FadeUp>
      </div>
    </section>
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
      <ClaimsLedgerHeader />

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
                export is ready when nothing was ever written. Each of those
                does more damage than an error, because nobody can tell it
                happened.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                So I stopped reading feature requests and read transcripts
                instead. The gap wasn&apos;t capability, it was trust.
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
                it&apos;s two models agreeing in the same wrong direction.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                So the evals are canary questions instead. Canned questions
                replay after every deploy, asserted against the audit record
                rather than the prose. Answer contains a number, SQL must have
                run. Fabricated-names list must be empty. Export claimed, report
                row must have completed.
              </p>
            </CaseStudySection>

            <CaseStudySection
              eyebrow="> what stops it, though?"
              title="Five guarantees, none of them a prompt"
            >
              <p className="text-muted-foreground leading-relaxed mb-6">
                A system prompt is a request. Everything below is a property of
                the system, and each entry names where it&apos;s actually
                enforced.
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
                run, and it builds them things they keep using afterwards.
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

          <AuditRecord />
        </div>
      </div>

      <LedgerSignOff />
    </CaseStudyLayout>
  );
}
