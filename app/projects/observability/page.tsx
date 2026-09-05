import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MetricsShowcase } from "@/components/metrics-showcase";
import { ObservabilityArchitecture } from "@/components/observability-architecture";
import { SessionVitals } from "@/components/session-vitals";
import { CaseStudyLayout } from "@/components/case-study-layout";
import { PHOSPHORS } from "@/lib/phosphors";

/* --------------------------------------------------------------------------
 * This project was a build-or-buy decision, so the page is the artefact that
 * decision deserved: an ADR, set as a document. Serif type, one measured
 * column, numbered clauses, hairline rules — the only monospace left is in
 * the exhibits, where the content is genuinely technical. The negative
 * consequences are the point; an ADR that only lists upsides is a sales page.
 * ----------------------------------------------------------------------- */

const label =
  "font-serif text-sm tracking-[0.08em] uppercase text-muted-foreground/80 pt-1";

const DECISION: { field: string; tone?: "good" | "bad"; body: string }[] = [
  {
    field: "Context",
    body: "The headline figures are in the title block. What made it a live decision was that we already had the cluster capacity to run this ourselves, so the quote was buying convenience rather than capability.",
  },
  {
    field: "Option A",
    body: "A commercial SaaS platform. Fastest to value, no operational burden, per-host and per-GB pricing that grows with exactly the thing you can't control: how much telemetry your developers decide to emit.",
  },
  {
    field: "Option B",
    body: "Self-host Prometheus, Thanos, Loki, Tempo and Grafana on the existing cluster. Slower to stand up, an operational surface we own, and near-flat cost as the data grows.",
  },
  {
    field: "Decision",
    body: "Option B, at roughly £5k a year all-in. The cluster capacity was already there, the team knew Kubernetes, and the gap between the two numbers was too wide to argue with.",
  },
  {
    field: "Consequence",
    tone: "good",
    body: "Cold data goes to object storage — Thanos for metrics, S3-backed Loki for logs — so we only pay premium prices for the recent data people actually query. That single choice is why the bill stayed flat while the data grew.",
  },
  {
    field: "Consequence",
    tone: "bad",
    body: "It's mine to fix, whatever the hour. There's no support contract behind it, and the stack that reports failures can fail too.",
  },
  {
    field: "Revisit when",
    body: "The team is small enough that a day of my time is worth more than the difference, or the estate grows to where storage costs start tracking the SaaS quote. I'd make the opposite call at a three-person startup without hesitating.",
  },
];

function DecisionRecord() {
  return (
    <dl className="border-t border-border/60">
      {DECISION.map((d, i) => (
        <div
          key={`${d.field}-${i}`}
          className="grid sm:grid-cols-[9rem_1fr] gap-x-6 gap-y-1 py-5 border-b border-border/60"
        >
          <dt className={label}>
            <span
              className={
                d.tone === "good"
                  ? "text-primary"
                  : d.tone === "bad"
                    ? "text-warn"
                    : undefined
              }
            >
              {d.field}
            </span>
            {d.tone && (
              <span aria-hidden className="ml-1.5">
                {d.tone === "good" ? "+" : "−"}
              </span>
            )}
          </dt>
          <dd className="font-serif text-[1.0625rem] text-foreground/80 leading-[1.75]">
            {d.body}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* A numbered clause heading in the document's own voice. */
function Clause({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <h2 className="font-serif text-2xl sm:text-[1.75rem] text-foreground mb-6 flex items-baseline gap-4">
        <span className="text-primary tabular-nums shrink-0" aria-hidden>
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

/* Document body text. */
function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-serif text-[1.0625rem] text-foreground/80 leading-[1.75] mb-5 last:mb-0">
      {children}
    </p>
  );
}

/* A wide technical exhibit inside the measured column. */
function Exhibit({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="my-8 lg:-mx-24">
      {children}
      <figcaption className="mt-3 font-serif text-sm italic text-muted-foreground text-center">
        {caption}
      </figcaption>
    </figure>
  );
}

const APPENDIX_FIGURES = [
  { label: "Services", value: "20, across 4 envs" },
  { label: "Annual cost", value: "~£5k all-in" },
  { label: "Alerts", value: "50+, runbook per rule" },
  { label: "Dashboards", value: "22 active" },
];

const APPENDIX_STACK =
  "Prometheus · Thanos · Loki · Grafana · Alertmanager · Promtail · Kubernetes · Kustomize · S3 · PromQL · LogQL";

const APPENDIX_SEE_ALSO = [
  { title: "Heimdall", note: "deployment intelligence", href: "/projects/heimdall" },
  { title: "Pipeline Platform", note: "shared CI/CD", href: "/projects/pipeline-platform" },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Self-hosted observability stack",
  description:
    "Prometheus, Grafana, Loki and Alertmanager monitoring 20 services across four environments. Built in-house at a fraction of the commercial alternatives.",
  author: {
    "@type": "Person",
    name: "Jack Devlin",
    url: "https://www.devlinops.com",
  },
  publisher: {
    "@type": "Organization",
    name: "DevlinOps",
    url: "https://www.devlinops.com",
  },
  datePublished: "2024-09-01",
  dateModified: "2026-04-25",
  proficiencyLevel: "Expert",
  keywords: [
    "Observability",
    "Prometheus",
    "Grafana",
    "Loki",
    "Thanos",
    "Alertmanager",
    "Kubernetes",
  ],
};

export default function ObservabilityPage() {
  return (
    <CaseStudyLayout schema={articleSchema} phosphor={PHOSPHORS.orange}>
      {/* Title matter */}
      <header className="pt-28 md:pt-32 pb-4">
        <div className="container px-4">
          <div className="max-w-[46rem] mx-auto">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-12 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Projects
            </Link>

            <p className="font-serif text-sm tracking-[0.18em] uppercase text-primary mb-4">
              ADR-001 · Architecture decision record
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl text-foreground leading-tight mb-10" style={{ viewTransitionName: "title-observability" }}>
              Observability stack — build over buy
            </h1>

            <dl className="border-t border-border/60 mb-4">
              <div className="grid sm:grid-cols-[9rem_1fr] gap-x-6 gap-y-1 py-4 border-b border-border/60">
                <dt className={label}>Status</dt>
                <dd className="font-serif text-[1.0625rem] leading-[1.75]">
                  <span className="text-primary">Accepted</span>
                  <span className="text-foreground/80">, 2024 · still in force</span>
                </dd>
              </div>
              {/* TODO(jack): engineering headcount at the time of the decision
                  (2024). I know it went 5 → ~40 across your time there; I'm not
                  guessing where it sat in 2024. Drop the number in below. */}
              <div className="grid sm:grid-cols-[9rem_1fr] gap-x-6 gap-y-1 py-4 border-b border-border/60">
                <dt className={label}>Deciders</dt>
                <dd className="font-serif text-[1.0625rem] text-foreground/80 leading-[1.75]">
                  Jack Devlin, platform engineer · Loweconex, a UK IoT platform
                  business
                </dd>
              </div>
              <div className="grid sm:grid-cols-[9rem_1fr] gap-x-6 gap-y-1 py-4 border-b border-border/60">
                <dt className={label}>Context</dt>
                <dd className="font-serif text-[1.0625rem] text-foreground/80 leading-[1.75]">
                  Twenty services across four environments, no shared monitoring.
                  Commercial quotes came in near £100k a year; self-hosting runs
                  at about £5k.
                </dd>
              </div>
              <div className="grid sm:grid-cols-[9rem_1fr] gap-x-6 gap-y-1 py-4 border-b border-border/60">
                <dt className={label}>Outcome</dt>
                <dd className="font-serif text-[1.0625rem] text-foreground/80 leading-[1.75]">
                  Two years on, an incident starts with someone pasting a
                  Grafana link, and the bill stayed flat while the data grew.
                  Section 6 reviews the decision.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </header>

      {/* Document body */}
      <div className="container px-4 pt-12">
        <div className="max-w-[46rem] mx-auto">
          <Clause n="1" title="The estate had grown faster than its monitoring">
            <P>
              Twenty microservices on Kubernetes, and the tooling around them
              hadn&apos;t kept pace with how quickly the team had grown. Too
              often the first sign something was wrong came from outside rather
              than from a dashboard. Buying a commercial platform was the
              obvious fix, and the quote for it is why we didn&apos;t.
            </P>
            <P>
              So I built it in-house. The stack is unsurprising: Prometheus and
              Thanos for metrics, Loki for logs, Alertmanager for paging,
              Grafana for everyone to actually look at.
            </P>
            <P>
              The pieces are standard; the work was wiring them so people can
              find what they need while something is breaking.
            </P>
          </Clause>

          <Clause n="2" title="The options, and the call">
            <DecisionRecord />
          </Clause>

          <Clause n="3" title="How it fits together">
            <Exhibit caption="Figure 1 — the stack as deployed. Metrics, logs and traces converge on Grafana; cold data ages out to object storage.">
              <ObservabilityArchitecture />
            </Exhibit>
            <P>
              Prometheus scrapes everything and hands the long tail off to
              Thanos in S3, so we aren&apos;t paying hot-storage prices for data
              that is rarely queried.
            </P>
            <P>
              Loki runs in microservices mode for the same reason. Logs are
              cheap to generate and expensive to keep. Alertmanager routes by
              environment: prod pages, dev gets a Teams message in business
              hours.
            </P>
          </Clause>

          <Clause n="4" title="What people actually look at">
            <P>
              I ended up with 22 dashboards, but most of the traffic goes to
              maybe five. The rest exist for the once-a-quarter question they
              answer perfectly. Three I&apos;m happy with:
            </P>
            <Exhibit caption="Exhibit A — three of the twenty-two dashboards, the ones with the most traffic.">
              <MetricsShowcase
                metrics={[
                  {
                    title: "IoT Gateway throughput",
                    description:
                      "Live request rate, connected devices, vendor-by-vendor performance. The first place anyone looks when an integration partner says something's broken.",
                    imagePath: "/dashboards/iot-gateway.png",
                    category: "Service",
                  },
                  {
                    title: "Kafka consumer lag",
                    description:
                      "Per-topic, per-group lag with sensible thresholds. Replaced about a dozen ad-hoc kafka-cli queries that used to live in someone's bash history.",
                    imagePath: "/dashboards/kafka-metrics.png",
                    category: "Data",
                  },
                  {
                    title: "Node infrastructure",
                    description:
                      "CPU, memory, disk, network. The dashboard everyone opens once something is wrong.",
                    imagePath: "/dashboards/node-exporter.png",
                    category: "Infrastructure",
                  },
                ]}
              />
            </Exhibit>
          </Clause>

          <Clause n="5" title="Alerts that don't cry wolf">
            {/* TODO(jack): this clause claims the alerts don't cry wolf but
                never says how often they fire. Roughly how many pages a week
                does the on-call rota actually get? One real figure here would
                do more than the whole clause. */}
            <P>
              Every alert passes two tests. A human has to be able to do
              something about it, and the runbook has to exist before the rule
              ships.
            </P>
            <P>
              The runbook isn&apos;t fancy: symptom, what to check, common
              fixes, who to escalate to. Just enough that whoever picks up the
              page isn&apos;t starting from zero.
            </P>
            <P>
              Routing is by environment more than severity. Prod fires straight
              to the on-call channel. Dev waits until business hours.
            </P>

            <Exhibit caption="Exhibit B — Alertmanager routing, by environment.">
              <div className="rounded-md border border-border/60 bg-black/40 font-mono text-[13px] overflow-hidden">
                <div className="px-5 py-2.5 border-b border-border/60 text-xs text-muted-foreground">
                  alertmanager · routes, by environment
                </div>
                <div className="px-5 py-4 space-y-2">
                  <div className="flex flex-wrap gap-x-3">
                    <span className="text-error w-16 shrink-0">prod</span>
                    <span className="text-muted-foreground">
                      → on-call channel, immediately, any hour
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3">
                    <span className="text-warn w-16 shrink-0">qa</span>
                    <span className="text-muted-foreground">→ Teams, 24/7 channel</span>
                  </div>
                  <div className="flex flex-wrap gap-x-3">
                    <span className="text-primary w-16 shrink-0">dev</span>
                    <span className="text-muted-foreground">
                      → Teams, business hours only
                    </span>
                  </div>
                </div>
              </div>
            </Exhibit>

            <P>
              Inhibition rules kill the cascade of follow-on alerts when one
              root cause takes out a dozen things downstream. Without them, the
              first real incident would have trained everyone to ignore alerts.
            </P>
          </Clause>

          <Clause n="6" title="Review — two years on">
            <P>
              The saving is what got it approved. Two years on, an incident
              starts with someone pasting a Grafana link.
            </P>
            <Exhibit caption="Exhibit C — this page's own web vitals.">
              <SessionVitals />
            </Exhibit>
          </Clause>

          {/* Appendix */}
          <section className="mb-16">
            <h2 className="font-serif text-2xl sm:text-[1.75rem] text-foreground mb-6">
              Appendix A — reference
            </h2>
            <dl className="border-t border-border/60">
              <div className="grid sm:grid-cols-[9rem_1fr] gap-x-6 gap-y-1 py-5 border-b border-border/60">
                <dt className={label}>Stack</dt>
                <dd className="font-mono text-sm text-foreground/90 leading-relaxed">
                  {APPENDIX_STACK}
                </dd>
              </div>
              <div className="grid sm:grid-cols-[9rem_1fr] gap-x-6 gap-y-1 py-5 border-b border-border/60">
                <dt className={label}>Figures</dt>
                <dd>
                  <ul className="space-y-1.5 font-serif text-[1.0625rem] text-foreground/80">
                    {APPENDIX_FIGURES.map((f) => (
                      <li key={f.label}>
                        {f.label}: <span className="text-foreground">{f.value}</span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className="grid sm:grid-cols-[9rem_1fr] gap-x-6 gap-y-1 py-5 border-b border-border/60">
                <dt className={label}>See also</dt>
                <dd className="space-y-1.5">
                  {APPENDIX_SEE_ALSO.map((ref) => (
                    <Link
                      key={ref.href}
                      href={ref.href}
                      className="flex items-center gap-2 font-serif text-[1.0625rem] text-foreground/80 hover:text-primary transition-colors group w-fit"
                    >
                      <span>
                        {ref.title}
                        <span className="text-muted-foreground"> · {ref.note}</span>
                      </span>
                      <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </dd>
              </div>
            </dl>
          </section>

          {/* Sign-off */}
          <footer className="pb-24">
            <p
              className="font-serif text-sm tracking-[0.25em] uppercase text-muted-foreground/70 text-center mb-10"
              aria-hidden
            >
              — end of record —
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-3 font-serif text-[1.0625rem] mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-primary hover:underline underline-offset-4 group"
              >
                Say hello
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </CaseStudyLayout>
  );
}

export const metadata: Metadata = {
  alternates: { canonical: "/projects/observability" },
  title: "Observability Stack · Self-Hosted Monitoring",
  description:
    "Prometheus, Grafana and Loki for 20 services across four environments. 22 dashboards and 50+ alerts, each with a runbook, ~£5k/yr versus ~£100k commercial quotes.",
  openGraph: {
    title: "Observability Stack · Self-Hosted Monitoring",
    description:
      "Self-hosted metrics, logs and alerts for 20 services across four environments, ~£5k/yr versus ~£100k commercial quotes.",
    url: "https://www.devlinops.com/projects/observability",
  },
};
