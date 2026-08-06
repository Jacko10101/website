import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PHOSPHORS, CaseStudyLayout } from "@/components/case-study-layout";
import { LocalPath } from "@/components/local-path";

/* --------------------------------------------------------------------------
 * This page is a spec sheet, so it is set as one: a hardware datasheet.
 * Part summary table up top, numbered sections addressed by MQTT topic,
 * prose as terse annotations, one figure and one table with numbered
 * captions. Ruled lines and tabular numerals do the styling; nothing
 * animates in and nothing pulses. Deliberately the shortest page.
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

const ARGO_APPS: { name: string; sync: string; health: string }[] = [
  { name: "home-assistant", sync: "Synced", health: "Healthy" },
  { name: "zigbee2mqtt", sync: "Synced", health: "Healthy" },
  { name: "mosquitto", sync: "Synced", health: "Healthy" },
  { name: "prometheus", sync: "Synced", health: "Healthy" },
  { name: "grafana", sync: "Synced", health: "Healthy" },
  { name: "node-exporter", sync: "Synced", health: "Healthy" },
];

/* The part summary table. Everything the build is, before any annotation. */
function SpecPlate() {
  return (
    <div className="border border-border overflow-hidden bg-card/20">
      {/* Nameplate strip */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 px-5 sm:px-7 py-2 border-b border-border bg-card/50 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>Spec sheet · in service 2024 → ongoing</span>
        <span className="text-muted-foreground/60" aria-hidden>
          smart-home · 1 of 1
        </span>
      </div>

      {/* Title block */}
      <div className="px-5 sm:px-7 py-4 border-b border-border">
        <h1 className="font-mono font-semibold tracking-tight text-3xl sm:text-4xl md:text-5xl text-foreground mb-2">
          Smart home on K3s
        </h1>
        <p className="text-muted-foreground">Self-hosted home automation</p>
      </div>

      {/* Design constraint — the one that picked everything else */}
      <div className="px-5 sm:px-7 py-3 border-b border-border bg-primary/5">
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
            className={`flex flex-col-reverse px-5 py-3 border-border max-sm:odd:border-r ${
              i < 2 ? "max-sm:border-b" : ""
            }`}
          >
            <dt className="text-xs text-muted-foreground leading-snug">{f.label}</dt>
            <dd className="font-mono font-semibold text-2xl text-primary tabular-nums mb-0.5">
              {f.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Column heads for the parameter rows */}
      <div
        className="hidden sm:grid sm:grid-cols-[9rem_1fr_16rem] gap-x-4 px-5 sm:px-7 py-1.5 border-b border-border font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70"
        aria-hidden
      >
        <span>Parameter</span>
        <span>Value</span>
        <span>Notes</span>
      </div>

      {/* Parameter rows — ruled, value column aligned */}
      <dl className="divide-y divide-border/60">
        {SPEC.map((s) => (
          <div
            key={s.label}
            className="grid grid-cols-[7.5rem_1fr] sm:grid-cols-[9rem_1fr_16rem] gap-x-4 px-5 sm:px-7 py-2.5"
          >
            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground pt-0.5">
              {s.label}
            </dt>
            <dd className="text-[13px] text-foreground/90 leading-relaxed tabular-nums">
              {s.value}
              {s.note && (
                <span className="sm:hidden block text-muted-foreground text-xs">
                  {s.note}
                </span>
              )}
            </dd>
            <dd className="hidden sm:block text-xs text-muted-foreground leading-relaxed pt-0.5">
              {s.note}
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

/* Datasheet section: a numbered heading on a rule, addressed by its MQTT
 * topic in the right margin. No dots, no chips — the ruled line is the
 * furniture. */
function SpecSection({
  n,
  topic,
  title,
  children,
}: {
  n: string;
  topic: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="flex items-baseline justify-between gap-4 border-b border-border pb-2 mb-4">
        <h2 className="font-mono font-semibold tracking-tight text-lg sm:text-xl text-foreground">
          <span className="text-primary tabular-nums mr-3" aria-hidden>
            {n}
          </span>
          {title}
        </h2>
        <span className="hidden sm:block font-mono text-[11px] text-muted-foreground shrink-0">
          {topic}
        </span>
      </div>
      {children}
    </section>
  );
}

/* Annotation text — the datasheet's register: terse, small, set in two
 * columns where the width allows. */
function Annotations({ children }: { children: React.ReactNode }) {
  return <div className="lg:columns-2 lg:gap-10 space-y-3">{children}</div>;
}

function Annot({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-muted-foreground leading-relaxed break-inside-avoid">
      {children}
    </p>
  );
}

/* Sidebar as datasheet appendix: lettered so it never collides with the
 * numbered sections in the body. */
function SpecMargin() {
  const marginHeading =
    "font-mono text-[11px] uppercase tracking-wider text-primary mb-3";
  return (
    <aside className="lg:sticky lg:top-24 self-start">
      <div className="border border-border divide-y divide-border overflow-hidden bg-card/20 text-sm">
        <section className="px-5 py-4">
          <h3 className={marginHeading}>A.1 · Bill of materials</h3>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>Raspberry Pi 5 (8GB)</li>
            <li>1TB NVMe over USB</li>
            <li>UPS on the power side</li>
            <li>SONOFF Zigbee coordinator</li>
          </ul>
        </section>

        <section className="px-5 py-4">
          <h3 className={marginHeading}>A.2 · Software</h3>
          <p className="font-mono text-[13px] text-muted-foreground leading-relaxed">
            K3s · ArgoCD · Home Assistant · Zigbee2MQTT · Mosquitto MQTT ·
            Prometheus · Grafana · Tailscale
          </p>
        </section>

        <section className="px-5 py-4">
          <h3 className={marginHeading}>A.3 · Operating figures</h3>
          <dl className="space-y-2 text-muted-foreground">
            <div className="flex justify-between gap-4">
              <dt>Status</dt>
              <dd className="text-foreground/90 text-right">Live, ongoing</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Devices</dt>
              <dd className="text-foreground/90 text-right tabular-nums">20+</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Apps</dt>
              <dd className="text-foreground/90 text-right tabular-nums">6</dd>
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
          <h3 className={marginHeading}>A.4 · Practices</h3>
          <ul className="space-y-1.5 text-muted-foreground">
            <li>Self-hosting on constrained hardware</li>
            <li>GitOps applied to small systems</li>
            <li>Local-first architecture</li>
            <li>Network segmentation</li>
            <li>Treating side-projects like production</li>
          </ul>
        </section>

        <section className="px-5 py-4">
          <h3 className={marginHeading}>A.5 · Cross-references</h3>
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
      <header className="pt-24 pb-10 md:pt-28 md:pb-12">
        <div className="container px-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>

          <div className="max-w-4xl">
            <SpecPlate />
          </div>
        </div>
      </header>

      <div className="container px-4 pb-20">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
          <div>
            <SpecSection n="1" topic="home/why-local" title="The same discipline, in miniature">
              <Annotations>
                <Annot>
                  Most smart-home setups end up as a pile of vendor apps tied
                  together with cloud accounts. That works until a vendor goes
                  away, or you realise your motion sensor is reporting to a
                  server in another country.
                </Annot>
                <Annot>
                  I wanted the opposite: everything local, and every change to
                  it in version control. It&apos;s the same shape as the
                  platform I run at work, sized to a flat — less out of rigour
                  than because I already know how to debug this stack at eleven
                  on a Sunday night.
                </Annot>
              </Annotations>
            </SpecSection>

            <SpecSection n="2" topic="zigbee2mqtt/coordinator" title="One Pi, no cloud">
              <Annotations>
                <Annot>
                  A Raspberry Pi 5 (8GB) is the whole control plane. I run NVMe
                  over USB because SD cards die under sustained writes, and a
                  UPS on the power side because Home Assistant restarting at
                  3am after a tripped fuse isn&apos;t an experience I wanted
                  twice. Hardwired ethernet, because Wi-Fi isn&apos;t a
                  network.
                </Annot>
                <Annot>
                  A SONOFF Zigbee USB coordinator handles the radio. Devices
                  pair directly with Zigbee2MQTT, which talks to Home Assistant
                  over MQTT. No bridges, no cloud round-trip. Bulb to
                  coordinator to broker to automation in single-digit
                  milliseconds.
                </Annot>
                <Annot>
                  I&apos;m at twenty-plus endpoints today: Hue bulbs, Innr
                  plugs on power-monitored circuits, temperature and humidity
                  sensors, motion and contact sensors, and a solar-powered
                  camera. The temptation to add a second node is a trap — for a
                  flat, the right number of nodes is one.
                </Annot>
              </Annotations>
            </SpecSection>

            <SpecSection n="3" topic="the path" title="Where a light switch press actually goes">
              <figure>
                <LocalPath />
                <figcaption className="mt-2 font-mono text-[11px] text-muted-foreground">
                  <span className="text-primary">Figure 1</span> — the claim
                  this whole build rests on. Same press, two topologies.
                </figcaption>
              </figure>
            </SpecSection>

            <SpecSection n="4" topic="argocd/apps · 6 synced" title="GitOps for the living room">
              <Annotations>
                <Annot>
                  Everything on the Pi is a Kubernetes deployment, reconciled
                  by ArgoCD from a git repo. Adding a new automation, tweaking
                  a Grafana dashboard, bumping the Home Assistant version. All
                  of it goes through a commit. The cluster pulls; nothing
                  pushes.
                </Annot>
                <Annot>
                  That sounds like overkill for a home lab, and it would be if
                  it were any other tool. ArgoCD on K3s is genuinely 80MB of
                  memory and a few CRDs. The payoff is a setup that survives
                  me. If I blat the SD card tomorrow, a fresh install plus{" "}
                  <code className="text-foreground">argocd app sync</code>{" "}
                  brings everything back.
                </Annot>
              </Annotations>

              <figure className="mt-5 border border-border overflow-hidden bg-card/20">
                <div className="px-4 py-2 border-b border-border/60 font-mono text-xs text-muted-foreground">
                  <span className="text-muted-foreground/60" aria-hidden>
                    ${" "}
                  </span>
                  kubectl get applications -n argocd
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full font-mono text-xs">
                    <thead>
                      <tr className="border-b border-border/60 text-left text-muted-foreground">
                        <th className="px-4 py-1.5 font-normal">NAME</th>
                        <th className="px-4 py-1.5 font-normal">SYNC STATUS</th>
                        <th className="px-4 py-1.5 font-normal">HEALTH STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {ARGO_APPS.map((app) => (
                        <tr key={app.name}>
                          <td className="px-4 py-1.5 text-foreground/90">{app.name}</td>
                          <td className="px-4 py-1.5 text-primary">{app.sync}</td>
                          <td className="px-4 py-1.5 text-primary">{app.health}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <figcaption className="px-4 py-2 border-t border-border/60 font-mono text-[11px] text-muted-foreground">
                  <span className="text-primary">Table 1</span> — argocd apps
                  in the cluster.
                </figcaption>
              </figure>
            </SpecSection>

            <SpecSection n="5" topic="home/sensors/#" title="Power draw and humidity, in Grafana">
              <Annotations>
                <Annot>
                  Prometheus scrapes metrics from Home Assistant&apos;s
                  exporter and from node-exporter on the Pi itself. Innr smart
                  plugs report real-time power draw on the kitchen heater and
                  the hallway lamp. SONOFF LCD sensors report temperature and
                  humidity per room.
                </Annot>
                <Annot>
                  Grafana sits on top, with dashboards for power draw and
                  room-by-room temperature. It&apos;s a small platform
                  monitoring stack in every way that matters.
                </Annot>
              </Annotations>
            </SpecSection>

            <SpecSection n="6" topic="tailscale/status" title="Tailscale, not port-forwarding">
              <Annotations>
                <Annot>
                  Zero ports exposed to the internet. Remote access goes
                  through Tailscale. Every device on my account joins a private
                  overlay network and reaches the Pi by its tailnet IP. Nothing
                  on the router needs opening.
                </Annot>
                <Annot>
                  The blast radius if Home Assistant is compromised is limited
                  to the LAN, and the LAN is segmented so the IoT VLAN
                  can&apos;t reach anything else.
                </Annot>
              </Annotations>
            </SpecSection>

            <SpecSection n="7" topic="home/backlog" title="Next">
              <Annotations>
                <Annot>
                  Smart TRV valves, so heating schedules per room rather than
                  per house. Then presence detection good enough to retire the
                  motion sensors — they&apos;re fine for &quot;is someone in
                  the hallway&quot; and useless for &quot;is anyone home&quot;.
                </Annot>
                <Annot>
                  The longer arc is a small local model on its own node, so
                  voice control doesn&apos;t round-trip to somebody&apos;s API.
                  Same instinct as the rest of it: local data, countable
                  dependencies, nothing that stops working because a company
                  changed its mind.
                </Annot>
              </Annotations>
            </SpecSection>

            {/* Document footer — a spec sheet ends with its revision line,
                not a thanks-for-reading card. */}
            <footer className="border-t border-border pt-6">
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-4">
                Revision — 2024 → ongoing · amended as the flat changes
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
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
          </div>

          <SpecMargin />
        </div>
      </div>
    </CaseStudyLayout>
  );
}
