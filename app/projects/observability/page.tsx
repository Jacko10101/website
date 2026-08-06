"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MetricsShowcase } from "@/components/metrics-showcase";
import { ObservabilityArchitecture } from "@/components/observability-architecture";
import { PHOSPHORS, CaseStudyLayout } from "@/components/case-study-layout";
import { PanelSection as CaseStudySection } from "@/components/case-section-variants";

/* --------------------------------------------------------------------------
 * This project was a build-or-buy decision, so the whole page is the artefact
 * that decision deserved: an ADR. The title plate is the record's header, the
 * sections its body and consequences, the sidebar its appendix, the footer
 * its sign-off. The negative consequences are the point — an ADR that only
 * lists upsides is a sales page.
 * ----------------------------------------------------------------------- */

const fieldLabelClass =
  "font-mono text-xs uppercase tracking-wider pt-1 text-muted-foreground";

/* The record's body. Status and headline figures live in the title plate
 * above, so they aren't restated here. */
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
    <dl className="border-t border-border">
      {DECISION.map((d, i) => (
        <div
          key={`${d.field}-${i}`}
          className="grid sm:grid-cols-[8.5rem_1fr] gap-x-5 gap-y-1 py-4 border-b border-border"
        >
          <dt className={fieldLabelClass}>
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
          <dd className="text-sm text-muted-foreground leading-relaxed">{d.body}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ADR title plate — the record's header, in place of the shared hero. */
function AdrTitlePlate() {
  return (
    <header className="relative pt-28 pb-16 md:pt-32 md:pb-20 overflow-hidden">
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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl rounded-lg border border-border bg-card/30 overflow-hidden"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-2.5 border-b border-border bg-card/60 font-mono text-xs">
            <span className="tracking-wider">
              <span className="text-primary">ADR-001</span>
              <span className="text-muted-foreground"> · architecture decision record</span>
            </span>
            <span
              className="text-muted-foreground"
              title="Every case study renders on its own CRT phosphor. This one's tube."
            >
              phosphor {PHOSPHORS.orange.label}
            </span>
          </div>

          <div className="px-5 py-6 md:px-8 md:py-8">
            <h1 className="font-mono font-semibold tracking-tight text-3xl sm:text-4xl md:text-5xl text-foreground mb-3">
              Observability stack <span className="text-muted-foreground">—</span> build
              over buy
            </h1>
            <p className="font-mono text-sm text-muted-foreground mb-6">
              Self-hosted monitoring
            </p>

            <dl className="border-t border-border">
              <div className="grid sm:grid-cols-[8.5rem_1fr] gap-x-5 gap-y-1 py-3 border-b border-border">
                <dt className={fieldLabelClass}>Status</dt>
                <dd className="text-sm leading-relaxed">
                  <span className="text-primary">Accepted</span>
                  <span className="text-muted-foreground">, 2024 · </span>
                  <span className="inline-flex items-baseline gap-1.5 text-muted-foreground">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse self-center"
                      aria-hidden
                    />
                    still in force
                  </span>
                </dd>
              </div>
              <div className="grid sm:grid-cols-[8.5rem_1fr] gap-x-5 gap-y-1 py-3 border-b border-border">
                <dt className={fieldLabelClass}>Context</dt>
                <dd className="text-sm text-muted-foreground leading-relaxed">
                  Twenty services across four environments, no shared monitoring.
                  Commercial quotes came in near £100k a year; self-hosting runs at
                  about £5k.
                </dd>
              </div>
            </dl>
          </div>
        </motion.div>
      </div>
    </header>
  );
}

/* Appendix — the record's reference block, in place of the shared sidebar. */
const APPENDIX_FIGURES = [
  { label: "Services", value: "20, across 4 envs" },
  { label: "Annual cost", value: "~£5k all-in" },
  { label: "Alerts", value: "50+, runbook per rule" },
  { label: "Dashboards", value: "22 active" },
];

const APPENDIX_STACK = [
  "Prometheus",
  "Thanos",
  "Loki",
  "Grafana",
  "Alertmanager",
  "Promtail",
  "Kubernetes",
  "Kustomize",
  "S3",
  "PromQL",
  "LogQL",
];

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

function AdrAppendix() {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="lg:sticky lg:top-24 self-start"
    >
      <div className="rounded-lg border border-border bg-card/30 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-2.5 border-b border-border bg-card/60">
          <h2 className="font-mono text-xs text-primary tracking-wider">
            Appendix A
          </h2>
          <span className="font-mono text-xs text-muted-foreground">reference</span>
        </div>

        <dl className="px-5 py-2">
          <div className="py-4 border-b border-border">
            <dt className={`${fieldLabelClass} mb-2 pt-0`}>Stack</dt>
            <dd className="font-mono text-sm text-foreground leading-relaxed">
              {APPENDIX_STACK.join(" · ")}
            </dd>
          </div>

          <div className="py-4 border-b border-border">
            <dt className={`${fieldLabelClass} mb-3 pt-0`}>Figures</dt>
            <dd>
              <ul className="space-y-2 text-sm">
                {APPENDIX_FIGURES.map((f) => (
                  <li
                    key={f.label}
                    className="flex items-baseline justify-between gap-3"
                  >
                    <span className="text-muted-foreground">{f.label}</span>
                    <span className="font-mono text-foreground text-right">
                      {f.value}
                    </span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>

          <div className="py-4 border-b border-border">
            <dt className={`${fieldLabelClass} mb-3 pt-0`}>Practice</dt>
            <dd>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {APPENDIX_SKILLS.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </dd>
          </div>

          <div className="py-4">
            <dt className={`${fieldLabelClass} mb-3 pt-0`}>See also</dt>
            <dd className="space-y-2.5">
              {APPENDIX_SEE_ALSO.map((ref) => (
                <Link
                  key={ref.href}
                  href={ref.href}
                  className="flex items-center justify-between gap-3 text-sm group hover:text-primary transition-colors"
                >
                  <span>
                    <span className="font-medium">{ref.title}</span>
                    <span className="text-muted-foreground"> · {ref.note}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </motion.aside>
  );
}

/* ADR footer — sign-off in place of the shared CTA. */
function AdrFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="container px-4 pb-24 pt-4"
    >
      <div className="max-w-7xl mx-auto border-t border-border pt-10">
        <p
          className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8"
          aria-hidden
        >
          — end of record —
        </p>

        <dl className="max-w-3xl mb-8">
          <div className="grid sm:grid-cols-[8.5rem_1fr] gap-x-5 gap-y-1 pb-4">
            <dt className={fieldLabelClass}>Status</dt>
            <dd className="text-sm text-muted-foreground leading-relaxed">
              Still in force — re-affirmed by the review above.
            </dd>
          </div>
          <div className="grid sm:grid-cols-[8.5rem_1fr] gap-x-5 gap-y-1 pb-4">
            <dt className={fieldLabelClass}>Revisit when</dt>
            <dd className="text-sm text-muted-foreground leading-relaxed">
              As written in the record. Neither condition has arrived yet.
            </dd>
          </div>
        </dl>

        <p className="text-muted-foreground leading-relaxed max-w-3xl mb-6">
          The 3am question is the interesting one, and I&apos;m happy to be asked
          it.
        </p>

        <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
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
      </div>
    </motion.footer>
  );
}

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
      <AdrTitlePlate />

      <div className="container px-4">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
          <div className="space-y-12">
            <CaseStudySection eyebrow="// context · absent(up)" title="No dashboards, no logs, no alerts">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Twenty microservices on Kubernetes and not a Grafana panel between
                them. The first sign something was wrong was usually a customer
                noticing. The commercial quotes were a bit silly, which is how
                this became a decision worth recording.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                So I built it in-house. The stack is unsurprising: Prometheus
                and Thanos for metrics, Loki for logs, Alertmanager for paging,
                Grafana for everyone to actually look at.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Standard pieces. The interesting bit was wiring them so people
                could find what they needed while something was breaking.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// implementation · sum by (layer)" title="How it fits together">
              <ObservabilityArchitecture />

              <p className="text-muted-foreground mt-6 leading-relaxed">
                Prometheus scrapes everything and hands the long tail off to
                Thanos in S3, so we aren&apos;t paying hot-storage prices for data
                nobody queries.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Loki runs in microservices mode for the same reason. Logs are
                cheap to generate and expensive to keep. Alertmanager routes by
                environment: prod pages, dev gets a Teams message in business
                hours.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// in force · topk(5, dashboard_views)" title="What people actually look at">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                I ended up with 22 dashboards, but most of the
                traffic goes to maybe five. The rest exist for the once-a-quarter
                question they answer perfectly. Three I&apos;m happy with:
              </p>

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
            </CaseStudySection>

            <CaseStudySection eyebrow={'// in force · ALERTS{alertstate="firing"}'} title="Alerts that don&apos;t cry wolf">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every alert passes two tests. A human has to be able to do
                something about it, and the runbook has to exist before the rule
                ships.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The runbook isn&apos;t fancy: symptom, what to check, common
                fixes, who to escalate to. Just enough that the on-call engineer
                isn&apos;t starting from zero at 3am.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Routing is by environment more than severity. Prod fires
                straight to the on-call channel. Dev waits until business hours.
              </p>

              <div className="rounded-lg border border-border bg-black/40 font-mono text-[13px] overflow-hidden mb-5">
                <div className="px-5 py-2.5 border-b border-border text-xs text-muted-foreground">
                  alertmanager · routes, by environment
                </div>
                <div className="px-5 py-4 space-y-2">
                  <div className="flex flex-wrap gap-x-3">
                    <span className="text-error w-16 shrink-0">prod</span>
                    <span className="text-muted-foreground">→ on-call channel, immediately, any hour</span>
                  </div>
                  <div className="flex flex-wrap gap-x-3">
                    <span className="text-warn w-16 shrink-0">qa</span>
                    <span className="text-muted-foreground">→ Teams, 24/7 channel</span>
                  </div>
                  <div className="flex flex-wrap gap-x-3">
                    <span className="text-primary w-16 shrink-0">dev</span>
                    <span className="text-muted-foreground">→ Teams, business hours only</span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Inhibition rules kill the cascade of follow-on alerts when one
                root cause takes out a dozen things downstream. Without them, the
                first real incident would have trained everyone to ignore
                alerts.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// options → decision" title="Build or buy, written down">
              <p className="text-muted-foreground leading-relaxed mb-6">
                The title block carries the status and the headline numbers.
                This is the body of the record — the options as they stood, the
                call, and the consequences that went against it.
              </p>

              <DecisionRecord />
            </CaseStudySection>

            <CaseStudySection eyebrow="// review · range: 2024 → now" title="Two years on">
              <p className="text-muted-foreground leading-relaxed">
                The saving is what got it approved. The outcome I&apos;d
                actually show off is harder to put on a slide: an incident now
                starts with someone pasting a Grafana link, instead of asking
                whether it&apos;s just them. Nobody has thanked me for the
                dashboards. They&apos;d notice immediately if they went.
              </p>
            </CaseStudySection>
          </div>

          <AdrAppendix />
        </div>
      </div>

      <AdrFooter />
    </CaseStudyLayout>
  );
}
