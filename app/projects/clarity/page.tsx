"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import {
  PHOSPHORS,
  CaseStudyLayout,
  CaseStudyHero,
  StatsGrid,
  TechSidebar,
  CaseStudyCTA,
} from "@/components/case-study-layout";
import { ChatSection as CaseStudySection } from "@/components/case-section-variants";
import { GlassCard, FadeUp } from "@/components/scroll-reveal";
import { TerminalWindow } from "@/components/terminal-window";
import { GroundingDemo } from "@/components/grounding-demo";
import { SqlPlayground } from "@/components/sql-playground";
import { SchemaDirectory } from "@/components/schema-directory";

/* --------------------------------------------------------------------------
 * Screenshots. Empty by default so nothing renders until real captures exist.
 * Drop PNGs in public/clarity/ and add an entry; see PERSONAL-TODO.md for the
 * shot list and what to redact before exporting.
 * ----------------------------------------------------------------------- */
const SHOTS: {
  src: string;
  alt: string;
  label: string;
  caption: ReactNode;
  width: number;
  height: number;
}[] = [];

function Screenshot({
  src,
  alt,
  caption,
  label,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption: ReactNode;
  label: string;
  width: number;
  height: number;
}) {
  return (
    <FadeUp>
      <TerminalWindow title={label}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto"
          sizes="(max-width: 1024px) 100vw, 800px"
        />
        <div className="px-5 py-4 border-t border-border bg-card/50 text-sm text-muted-foreground leading-relaxed">
          {caption}
        </div>
      </TerminalWindow>
    </FadeUp>
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
              <p className="text-muted-foreground leading-relaxed">
                So I stopped reading feature requests and read transcripts
                instead. The gap was never capability. It was trust.
              </p>
            </CaseStudySection>

            {SHOTS.length > 0 && (
              <CaseStudySection eyebrow="> show me" title="What it looks like">
                <div className="space-y-6">
                  {SHOTS.map((shot) => (
                    <Screenshot key={shot.src} {...shot} />
                  ))}
                </div>
              </CaseStudySection>
            )}

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

            <CaseStudySection eyebrow="> why is it built like that?" title="Two calls worth explaining">
              <p className="text-muted-foreground leading-relaxed mb-6">
                Before either of them: every answer carries the query that
                produced it, verbatim. It costs screen space and turns an oracle
                into a tool. These people can read SQL, and letting them check
                beats any amount of confident phrasing.
              </p>
              <div className="space-y-5">
                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    Two stores, routed, never joined
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Operational data on a per-tenant database, telemetry in a
                    shared time-series store. Generated SQL gets routed to
                    exactly one. Cross-store joins are impossible by
                    construction, not discouraged by prompt, which kills a whole
                    category of confidently wrong answer.
                  </p>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    Loops with a budget
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Every turn carries a tool-call cap, enforced around the
                    agent loop rather than requested in the prompt. Blow it and
                    the model is told to summarise what it found and stop. A
                    per-tenant token bucket sits on top, so a runaway
                    conversation can&apos;t become runaway spend.
                  </p>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    A test that fails when the docs drift
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A unit test compares every registered metric against the
                    documented table, both directions. That&apos;s how a series
                    nobody could query survived for months, and how a
                    total-outage signal sat there unalerted.
                  </p>
                </GlassCard>
              </div>
            </CaseStudySection>

            <CaseStudySection eyebrow="> where does it stand?" title="Where it stands">
              <StatsGrid
                stats={[
                  { value: "~30", label: "tenants, a database each" },
                  { value: "~20", label: "daily users" },
                  { value: "5", label: "lies detected per turn" },
                  { value: "500+", label: "tests" },
                ]}
              />

              <p className="text-muted-foreground mt-6 leading-relaxed">
                Straight about status: the trust layer is built and running, and
                the proof it&apos;s driven fabrication to zero isn&apos;t in yet.
                The transcript analysis that started this hasn&apos;t been re-run
                against the current build. I&apos;d rather say that than put up a
                number I can&apos;t back.
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
              { label: "Tenants", value: "13, isolated per database" },
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

      <CaseStudyCTA line="If you're fighting hallucinations in production, or just want to argue about vector stores, I'm easy to find." />
    </CaseStudyLayout>
  );
}
