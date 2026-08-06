import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MetricsShowcase } from "@/components/metrics-showcase";
import { ObservabilityArchitecture } from "@/components/observability-architecture";
import { SessionVitals } from "@/components/session-vitals";
import { PHOSPHORS, CaseStudyLayout } from "@/components/case-study-layout";

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
    body: "The headline figures are in the title block. What made it a live decision: we already had the cluster capacity to run this ourselves, and for a company of our size the commercial quote amounted to a second payroll line.",
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
    body: "Cold data goes to object storage — Thanos for metrics, S3-backed Loki for logs — so we only pay premium prices for the recent data people actually query. That single choice is why the bill stayed flat while the data grew, and it's where most self-hosted stacks quietly get expensive.",
  },
  {
    field: "Consequence",
    tone: "bad",
    body: "It's mine to fix at 3am. There is nobody on the other end of a support contract, and the stack that tells you what's broken is itself a thing that can break — at the exact moment you'd most like it not to. That risk is real and it's the price of the number above.",
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

/**
 * The shape of the decision, drawn as the monitoring panel it would be. Two
 * pricing models, not two data series: per-GB SaaS pricing grows with
 * telemetry volume, self-hosting on existing capacity stays near flat. The
 * only numbers on it are the two the page already states — the ~£100k/yr
 * quote and the ~£5k/yr outcome. Palette validated for CVD separation and
 * contrast against this surface (#d76f04 / #488acb).
 */
function CostShape() {
  return (
    <div className="rounded-md border border-border/60 bg-black/40 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-2.5 border-b border-border/60 font-mono text-xs">
        <span className="text-muted-foreground">cost · quote vs self-hosted, by data volume</span>
        <span className="text-muted-foreground/60">pricing shape, not measurement</span>
      </div>
      <div className="px-4 pt-4 pb-2">
        <svg viewBox="0 0 640 250" className="w-full" role="img" aria-label="Two cost curves against growing telemetry volume: per-gigabyte SaaS pricing rises steeply toward the roughly £100k a year quote, while self-hosted cost stays near flat at roughly £5k a year.">
          {/* Recessive grid */}
          {[60, 110, 160, 210].map((y) => (
            <line key={y} x1={56} x2={632} y1={y} y2={y} stroke="currentColor" strokeOpacity={0.08} />
          ))}
          {/* Axes titles, text tokens not series colour */}
          <text x={56} y={24} className="fill-muted-foreground" fontSize={11} fontFamily="var(--font-mono, monospace)">
            annual cost
          </text>
          <text x={632} y={242} textAnchor="end" className="fill-muted-foreground" fontSize={11} fontFamily="var(--font-mono, monospace)">
            telemetry volume →
          </text>

          {/* SaaS per-GB pricing: grows with volume */}
          <path
            d="M 56 206 C 220 198, 420 160, 600 62"
            fill="none"
            stroke="#488acb"
            strokeWidth={2}
            strokeLinecap="round"
          />
          {/* Self-hosted: near flat on existing capacity */}
          <path
            d="M 56 214 C 240 213, 440 210, 600 204"
            fill="none"
            stroke="#d76f04"
            strokeWidth={2}
            strokeLinecap="round"
          />

          {/* Direct labels at line ends, ink for text + a mark for identity */}
          <circle cx={600} cy={62} r={4} fill="#488acb" />
          <text x={592} y={52} textAnchor="end" className="fill-foreground/80" fontSize={12} fontFamily="var(--font-mono, monospace)">
            per-GB SaaS · the quote, ~£100k/yr
          </text>
          <circle cx={600} cy={204} r={4} fill="#d76f04" />
          <text x={592} y={194} textAnchor="end" className="fill-foreground/80" fontSize={12} fontFamily="var(--font-mono, monospace)">
            self-hosted · ~£5k/yr all-in
          </text>
        </svg>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-5 pb-3 font-mono text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 rounded-full" style={{ background: "#488acb" }} aria-hidden />
          per-GB SaaS pricing
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 rounded-full" style={{ background: "#d76f04" }} aria-hidden />
          self-hosted on existing capacity
        </span>
      </div>
    </div>
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

const APPENDIX_SKILLS = [
  "Designing observability for a real team",
  "Running open-source stacks in production",
  "Cost-aware architecture",
  "Alert design and runbook authoring",
  "Dashboard design (and pruning)",
];

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
    url: "https://devlinops.com",
  },
  publisher: {
    "@type": "Organization",
    name: "DevlinOps",
    url: "https://devlinops.com",
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
            <h1 className="font-serif text-4xl sm:text-5xl text-foreground leading-tight mb-3">
              Observability stack — build over buy
            </h1>
            <p className="font-serif text-lg italic text-muted-foreground mb-10">
              Self-hosted monitoring
            </p>

            <dl className="border-t border-border/60 mb-4">
              <div className="grid sm:grid-cols-[9rem_1fr] gap-x-6 gap-y-1 py-4 border-b border-border/60">
                <dt className={label}>Status</dt>
                <dd className="font-serif text-[1.0625rem] leading-[1.75]">
                  <span className="text-primary">Accepted</span>
                  <span className="text-foreground/80">, 2024 · still in force</span>
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
            </dl>
          </div>
        </div>
      </header>

      {/* Document body */}
      <div className="container px-4 pt-12">
        <div className="max-w-[46rem] mx-auto">
          <Clause n="1" title="No dashboards, no logs, no alerts">
            <P>
              Twenty microservices on Kubernetes and not a Grafana panel between
              them. The first sign something was wrong was usually a customer
              noticing. The commercial quotes were a bit silly, which is how
              this became a decision worth recording.
            </P>
            <P>
              So I built it in-house. The stack is unsurprising: Prometheus and
              Thanos for metrics, Loki for logs, Alertmanager for paging,
              Grafana for everyone to actually look at.
            </P>
            <P>
              Standard pieces. The interesting bit was wiring them so people
              could find what they needed while something was breaking.
            </P>
          </Clause>

          <Clause n="2" title="The options, and the call">
            <Exhibit caption="Figure 1 — the shape of the pricing models, not a measurement. The two anchored figures are the ones this record already states.">
              <CostShape />
            </Exhibit>
            <DecisionRecord />
          </Clause>

          <Clause n="3" title="How it fits together">
            <Exhibit caption="Figure 2 — the stack as deployed. Metrics, logs and traces converge on Grafana; cold data ages out to object storage.">
              <ObservabilityArchitecture />
            </Exhibit>
            <P>
              Prometheus scrapes everything and hands the long tail off to
              Thanos in S3, so we aren&apos;t paying hot-storage prices for data
              nobody queries.
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
            <Exhibit caption="Exhibit A — three dashboards of the twenty-two, chosen because they earn their keep.">
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
                      "CPU, memory, disk, network. The boring one that nobody looks at until they need it, then it earns its keep.",
                    imagePath: "/dashboards/node-exporter.png",
                    category: "Infrastructure",
                  },
                ]}
              />
            </Exhibit>
          </Clause>

          <Clause n="5" title="Alerts that don't cry wolf">
            <P>
              Every alert passes two tests. A human has to be able to do
              something about it, and the runbook has to exist before the rule
              ships.
            </P>
            <P>
              The runbook isn&apos;t fancy: symptom, what to check, common
              fixes, who to escalate to. Just enough that the on-call engineer
              isn&apos;t starting from zero at 3am.
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
              The saving is what got it approved. The outcome I&apos;d actually
              show off is harder to put on a slide: an incident now starts with
              someone pasting a Grafana link, instead of asking whether
              it&apos;s just them. Nobody has thanked me for the dashboards.
              They&apos;d notice immediately if they went.
            </P>
            <P>
              And because a record about observability should be observable:
              the panel below is this page measuring itself, in your browser,
              right now.
            </P>
            <Exhibit caption="Exhibit C — your session's real web vitals, measured just now. Nothing here is hardcoded; if a metric can't be measured it shows a dash.">
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
                <dt className={label}>Practice</dt>
                <dd className="font-serif text-[1.0625rem] text-foreground/80">
                  {APPENDIX_SKILLS.join("; ").toLowerCase()}.
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
            <P>
              The 3am question is the interesting one, and I&apos;m happy to be
              asked it.
            </P>
            <div className="flex flex-wrap gap-x-8 gap-y-3 font-serif text-[1.0625rem] mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-primary hover:underline underline-offset-4 group"
              >
                Say hello
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
              >
                All case studies
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </CaseStudyLayout>
  );
}
