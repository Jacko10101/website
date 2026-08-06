"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  PHOSPHORS,
  CaseStudyLayout,
  EnhancedCodeBlock,
} from "@/components/case-study-layout";
import { TopicSection as CaseStudySection } from "@/components/case-section-variants";
import { FadeUp } from "@/components/scroll-reveal";
import { LocalPath } from "@/components/local-path";

/* --------------------------------------------------------------------------
 * This page is a spec sheet, so it opens like one: the plate first, prose as
 * annotations. The whole build on one card at the top, rather than a stat
 * grid pretending a flat is an estate.
 * ----------------------------------------------------------------------- */

const HEADLINE_FIGURES: { value: string; label: string }[] = [
  { value: "1", label: "node · Raspberry Pi 5, 8GB" },
  { value: "20+", label: "lights, plugs and sensors" },
  { value: "6", label: "apps, GitOps-reconciled" },
  { value: "0", label: "ports open to the internet" },
];

const SPEC: { label: string; value: string; note?: string }[] = [
  {
    label: "Orchestration",
    value: "Bare-metal K3s, single node",
    note: "control plane and every workload, with room spare",
  },
  { label: "Reconciliation", value: "ArgoCD", note: "the flat's desired state is a git repo" },
  { label: "Automation", value: "Home Assistant" },
  { label: "Radio", value: "Zigbee mesh", note: "no device talks to a vendor cloud" },
  { label: "Transport", value: "MQTT" },
  { label: "Monitoring", value: "Prometheus + Grafana", note: "same stack as work, smaller" },
  {
    label: "Exposure",
    value: "Tailscale only",
    note: "remote access is over the VPN or not at all",
  },
];

function SpecPlate() {
  return (
    <div className="rounded-lg border border-border overflow-hidden bg-card/20">
      {/* Nameplate strip */}
      <div className="flex items-center justify-between gap-4 px-5 sm:px-7 py-2.5 border-b border-border bg-card/50 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>Spec sheet · in service 2024 → ongoing</span>
        <span
          className="flex items-center gap-2 normal-case px-2.5 py-0.5 rounded border border-primary/40 text-primary"
          title="Every case study renders on its own CRT phosphor. This one's tube."
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary glow-soft" aria-hidden />
          phosphor {PHOSPHORS.violet.label}
        </span>
      </div>

      {/* Title block */}
      <div className="px-5 sm:px-7 py-6 border-b border-border">
        <h1 className="font-mono font-semibold tracking-tight text-3xl sm:text-4xl md:text-5xl text-foreground mb-2">
          Smart home on K3s
        </h1>
        <p className="text-muted-foreground">Self-hosted home automation</p>
      </div>

      {/* Design constraint — the one that picked everything else */}
      <div className="px-5 sm:px-7 py-4 border-b border-border bg-primary/5">
        <p className="text-sm text-foreground/90 leading-relaxed">
          <span className="font-mono text-[11px] uppercase tracking-wider text-primary mr-3">
            Design constraint
          </span>
          If the internet goes down, the lights still work. Everything below
          follows from that.
        </p>
      </div>

      {/* Headline figures */}
      <dl className="grid grid-cols-2 sm:grid-cols-4 border-b border-border sm:divide-x sm:divide-border">
        {HEADLINE_FIGURES.map((f, i) => (
          <div
            key={f.label}
            className={`flex flex-col-reverse px-5 py-4 border-border max-sm:odd:border-r ${
              i < 2 ? "max-sm:border-b" : ""
            }`}
          >
            <dt className="text-xs text-muted-foreground leading-snug">{f.label}</dt>
            <dd className="font-mono font-semibold text-3xl text-primary mb-1">{f.value}</dd>
          </div>
        ))}
      </dl>

      {/* System rows */}
      <dl className="divide-y divide-border">
        {SPEC.map((s) => (
          <div
            key={s.label}
            className="grid grid-cols-[7.5rem_1fr] sm:grid-cols-[9rem_1fr] gap-x-4 px-5 sm:px-7 py-3 odd:bg-card/20"
          >
            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground pt-1">
              {s.label}
            </dt>
            <dd className="text-sm text-foreground/90 leading-relaxed">
              {s.value}
              {s.note && (
                <span className="block text-muted-foreground text-[13px]">{s.note}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      {/* Plate footer */}
      <div className="px-5 sm:px-7 py-2.5 border-t border-border bg-card/50 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        0 cloud accounts · 0 vendor apps required to turn on a light
      </div>
    </div>
  );
}

/* Sidebar as datasheet margin: numbered sections, hairline rules. On a spec
 * sheet the sidebar is spec too — it just isn't the same furniture as the
 * other five case studies. */
function SpecMargin() {
  const marginHeading = "font-mono text-[11px] uppercase tracking-wider text-primary mb-3";
  return (
    <aside className="lg:sticky lg:top-24 self-start">
      <FadeUp delay={0.15}>
        <div className="rounded-lg border border-border divide-y divide-border overflow-hidden bg-card/20 text-sm">
          <section className="px-5 py-4">
            <h3 className={marginHeading}>1 · Bill of materials</h3>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>Raspberry Pi 5 (8GB)</li>
              <li>1TB NVMe over USB</li>
              <li>UPS on the power side</li>
              <li>SONOFF Zigbee coordinator</li>
            </ul>
          </section>

          <section className="px-5 py-4">
            <h3 className={marginHeading}>2 · Software</h3>
            <p className="font-mono text-[13px] text-muted-foreground leading-relaxed">
              K3s · ArgoCD · Home Assistant · Zigbee2MQTT · Mosquitto MQTT ·
              Prometheus · Grafana · Tailscale
            </p>
          </section>

          <section className="px-5 py-4">
            <h3 className={marginHeading}>3 · Operating figures</h3>
            <dl className="space-y-2 text-muted-foreground">
              <div className="flex justify-between gap-4">
                <dt>Status</dt>
                <dd className="text-foreground/90 text-right">Live, ongoing</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Devices</dt>
                <dd className="text-foreground/90 text-right">20+</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Apps</dt>
                <dd className="text-foreground/90 text-right">6</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Ports exposed</dt>
                <dd className="text-foreground/90 text-right">Zero</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Remote access</dt>
                <dd className="text-foreground/90 text-right">Tailscale only</dd>
              </div>
            </dl>
          </section>

          <section className="px-5 py-4">
            <h3 className={marginHeading}>4 · Practices</h3>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>Self-hosting on constrained hardware</li>
              <li>GitOps applied to small systems</li>
              <li>Local-first architecture</li>
              <li>Network segmentation</li>
              <li>Treating side-projects like production</li>
            </ul>
          </section>

          <section className="px-5 py-4">
            <h3 className={marginHeading}>5 · Cross-references</h3>
            <div className="space-y-2.5">
              <Link
                href="/projects/heimdall"
                className="flex items-center justify-between font-medium hover:text-primary transition-colors group"
              >
                <span>Heimdall · deployment intelligence</span>
                <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/projects/observability"
                className="flex items-center justify-between font-medium hover:text-primary transition-colors group"
              >
                <span>Observability stack</span>
                <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </section>
        </div>
      </FadeUp>
    </aside>
  );
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Smart Home on K3s · self-hosted home automation",
  description:
    "K3s on a Raspberry Pi 5 running Home Assistant, Zigbee2MQTT, ArgoCD and Prometheus. The platform stack at home, scaled down. Zero internet exposure.",
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
  datePublished: "2024-06-01",
  dateModified: "2026-04-30",
  proficiencyLevel: "Expert",
  keywords: [
    "K3s",
    "Kubernetes",
    "Home Assistant",
    "ArgoCD",
    "GitOps",
    "Prometheus",
    "Grafana",
    "Tailscale",
    "Zigbee",
    "Raspberry Pi",
    "Self-hosted",
  ],
};

export default function SmartHomePage() {
  return (
    <CaseStudyLayout schema={articleSchema} phosphor={PHOSPHORS.violet}>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl"
          >
            <SpecPlate />
          </motion.div>
        </div>
      </header>

      <div className="container px-4 pb-20">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
          <div className="space-y-12">
            <CaseStudySection eyebrow="// home/why-local" title="The same discipline, in miniature">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most smart-home setups end up as a pile of vendor apps tied
                together with cloud accounts. That works until a vendor goes
                away, or you realise your motion sensor is reporting to a
                server in another country.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I wanted the opposite: everything local, and every change to it
                in version control. It&apos;s the same shape as the platform I
                run at work, sized to a flat — less out of rigour than because
                I already know how to debug this stack at eleven on a Sunday
                night.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// zigbee2mqtt/coordinator" title="One Pi, no cloud">
              <p className="text-muted-foreground leading-relaxed mb-4">
                A Raspberry Pi 5 (8GB) is the whole control plane. I run NVMe
                over USB because SD cards die under sustained writes, and a UPS
                on the power side because Home Assistant restarting at 3am
                after a tripped fuse isn&apos;t an experience I wanted twice.
                Hardwired ethernet, because Wi-Fi isn&apos;t a network.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A SONOFF Zigbee USB coordinator handles the radio. Devices
                pair directly with Zigbee2MQTT, which talks to Home Assistant
                over MQTT. No bridges, no cloud round-trip. Bulb to coordinator
                to broker to automation in single-digit milliseconds.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I&apos;m at twenty-plus endpoints today: Hue bulbs, Innr plugs
                on power-monitored circuits, temperature and humidity sensors,
                motion and contact sensors, and a solar-powered camera. The
                temptation to add a second node is a trap — for a flat, the
                right number of nodes is one.
              </p>
            </CaseStudySection>

            <div className="mb-12">
              <FadeUp>
                <span className="font-mono text-sm text-primary">// the path</span>
                <h2 className="mt-2 mb-2 font-mono font-semibold tracking-tight text-2xl sm:text-3xl text-foreground">
                  Where a light switch press actually goes
                </h2>
                <p className="mb-5 text-muted-foreground max-w-2xl">
                  The claim this whole build rests on. Same press, two
                  topologies.
                </p>
                <LocalPath />
              </FadeUp>
            </div>

            <CaseStudySection eyebrow="// argocd/apps · 6 synced" title="GitOps for the living room">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Everything on the Pi is a Kubernetes deployment, reconciled by
                ArgoCD from a git repo. Adding a new automation, tweaking a
                Grafana dashboard, bumping the Home Assistant version. All of
                it goes through a commit. The cluster pulls; nothing pushes.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                That sounds like overkill for a home lab, and it would be if it
                were any other tool. ArgoCD on K3s is genuinely 80MB of memory
                and a few CRDs. The payoff is a setup that survives me. If I
                blat the SD card tomorrow, a fresh install plus{" "}
                <code className="text-foreground">argocd app sync</code> brings
                everything back.
              </p>

              <EnhancedCodeBlock
                title="argocd apps in the cluster"
                language="bash"
                code={`$ kubectl get applications -n argocd
NAME                  SYNC STATUS   HEALTH STATUS
home-assistant        Synced        Healthy
zigbee2mqtt           Synced        Healthy
mosquitto             Synced        Healthy
prometheus            Synced        Healthy
grafana               Synced        Healthy
node-exporter         Synced        Healthy`}
              />
            </CaseStudySection>

            <CaseStudySection eyebrow="// home/sensors/#" title="Power draw and humidity, in Grafana">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Prometheus scrapes metrics from Home Assistant&apos;s exporter
                and from node-exporter on the Pi itself. Innr smart plugs
                report real-time power draw on the kitchen heater and the
                hallway lamp. SONOFF LCD sensors report temperature and
                humidity per room.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Grafana sits on top, with dashboards for power draw and
                room-by-room temperature. It&apos;s a small platform monitoring
                stack in every way that matters.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// tailscale/status" title="Tailscale, not port-forwarding">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Zero ports exposed to the internet. Remote access goes through
                Tailscale. Every device on my account joins a private overlay
                network and reaches the Pi by its tailnet IP. Nothing on the
                router needs opening.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The blast radius if Home Assistant is compromised is limited
                to the LAN, and the LAN is segmented so the IoT VLAN can&apos;t
                reach anything else.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// home/backlog" title="Next">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Smart TRV valves, so heating schedules per room rather than per
                house. Then presence detection good enough to retire the motion
                sensors — they&apos;re fine for &quot;is someone in the
                hallway&quot; and useless for &quot;is anyone home&quot;.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The longer arc is a small local model on its own node, so voice
                control doesn&apos;t round-trip to somebody&apos;s API. Same
                instinct as the rest of it: local data, countable dependencies,
                nothing that stops working because a company changed its mind.
              </p>
            </CaseStudySection>

            {/* Document footer — a spec sheet ends with its revision line,
                not a thanks-for-reading card. */}
            <FadeUp>
              <footer className="border-t border-border pt-6">
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
                  Revision — 2024 → ongoing · amended as the flat changes
                </p>
                <p className="text-muted-foreground leading-relaxed mb-5">
                  It&apos;s a flat, not an estate. Ask me about the parts that
                  were genuinely fiddly.
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-sm">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-primary hover:underline group"
                  >
                    Say hello
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/projects"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Other case studies
                  </Link>
                </div>
              </footer>
            </FadeUp>
          </div>

          <SpecMargin />
        </div>
      </div>
    </CaseStudyLayout>
  );
}
