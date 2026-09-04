import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PHOSPHORS, CaseStudyLayout } from "@/components/case-study-layout";
import { LocalPath } from "@/components/local-path";

/* --------------------------------------------------------------------------
 * This page is a spec sheet, so it is set as one: a hardware datasheet.
 * Part summary table up top, numbered sections, prose as terse annotations,
 * one figure with a numbered caption. Ruled lines and tabular numerals do
 * the styling; nothing animates in and nothing pulses. Deliberately the
 * shortest page, and the only one that isn't professional work.
 * ----------------------------------------------------------------------- */

/**
 * The one thing on this page that broke and what changed because of it.
 * Set it to a sentence or two and section 7 renders; leave it null and the
 * section stays hidden. The site never shows a placeholder.
 */
const WHAT_I_GOT_WRONG: string | null = null;

const HEADLINE_FIGURES: { value: string; label: string }[] = [
  { value: "20+", label: "lights, plugs and sensors" },
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

/* The part summary table. Everything the build is, before any annotation. */
function SpecPlate() {
  return (
    <div className="border border-border overflow-hidden bg-card/20">
      {/* Nameplate strip */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 px-5 sm:px-7 py-2 border-b border-border bg-card/50 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>Personal project · spec sheet · my flat, 2024 → ongoing</span>
        <span className="text-muted-foreground/60" aria-hidden>
          smart-home · 1 of 1
        </span>
      </div>

      {/* Title block */}
      <div className="px-5 sm:px-7 py-4 border-b border-border">
        <h1 className="display text-3xl sm:text-4xl text-foreground mb-2">
          Smart home on K3s
        </h1>
        <p className="text-muted-foreground">
          Self-hosted home automation, in my own flat
        </p>
      </div>

      {/* The one sentence the rest of the build follows from. */}
      <div className="px-5 sm:px-7 py-5 border-b border-border bg-primary/5">
        <p className="text-xl sm:text-2xl text-foreground leading-snug tracking-tight">
          If the internet goes down, the lights still work. Everything below
          follows from that.
        </p>
      </div>

      {/* Headline figures */}
      <dl className="grid grid-cols-2 border-b border-border divide-x divide-border">
        {HEADLINE_FIGURES.map((f) => (
          <div key={f.label} className="flex flex-col-reverse px-5 py-3">
            <dt className="text-xs text-muted-foreground leading-snug">{f.label}</dt>
            <dd className="font-mono font-semibold text-2xl text-primary tabular-nums mb-0.5">
              {f.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Column heads for the parameter rows */}
      <div
        className="hidden sm:grid sm:grid-cols-[9rem_1fr_10rem] lg:grid-cols-[9rem_1fr_16rem] gap-x-4 px-5 sm:px-7 py-1.5 border-b border-border font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/80"
        aria-hidden
      >
        <span>Parameter</span>
        <span>Value</span>
        <span>Notes</span>
      </div>

      {/* Parameter rows: ruled, value column aligned */}
      <dl className="divide-y divide-border/60">
        {SPEC.map((s) => (
          <div
            key={s.label}
            className="grid grid-cols-[7.5rem_1fr] sm:grid-cols-[9rem_1fr_10rem] lg:grid-cols-[9rem_1fr_16rem] gap-x-4 px-5 sm:px-7 py-2.5"
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
    </div>
  );
}

/* Datasheet section: a numbered heading on a rule. No dots, no chips. The
 * ruled line is the furniture. */
function SpecSection({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="border-b border-border pb-2 mb-4">
        <h2 className="display text-lg sm:text-xl text-foreground">
          <span className="font-mono text-primary tabular-nums mr-3" aria-hidden>
            {n}
          </span>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

/* Annotation text, the datasheet's register: terse, small, set in two
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
              <dt>Nodes</dt>
              <dd className="text-foreground/90 text-right tabular-nums">1</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Remote access</dt>
              <dd className="text-foreground/90 text-right">Tailscale only</dd>
            </div>
          </dl>
        </section>

        <section className="px-5 py-4">
          <h3 className={marginHeading}>A.4 · Cross-references</h3>
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
    "A personal project: K3s on a Raspberry Pi 5 in my flat, running Home Assistant, Zigbee2MQTT, ArgoCD and Prometheus. Everything local, nothing exposed to the internet.",
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
          <div className="max-w-6xl mx-auto">
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
        </div>
      </header>

      <div className="container px-4 pb-20">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-6xl mx-auto">
          <div>
            <SpecSection n="1" title="Why it all runs locally">
              <Annotations>
                <Annot>
                  Most smart-home setups end up as a pile of vendor apps tied
                  together with cloud accounts. That works until a vendor goes
                  away, or you realise your motion sensor is reporting to a
                  server in another country.
                </Annot>
                <Annot>
                  I wanted the opposite: everything local, and every change to
                  it in version control. It&apos;s the same stack I run at
                  work, sized to a flat. Mostly because I already know how to
                  debug it.
                </Annot>
              </Annotations>
            </SpecSection>

            <SpecSection n="2" title="Everything runs on one Pi">
              <Annotations>
                <Annot>
                  A Raspberry Pi 5 (8GB) is the whole control plane. I run NVMe
                  over USB because SD cards die under sustained writes, and a
                  UPS on the power side because Home Assistant restarting at
                  3am after a tripped fuse isn&apos;t an experience I wanted
                  twice. It&apos;s on wired ethernet. The Pi is the thing every
                  light depends on, and I didn&apos;t want it depending on the
                  router&apos;s Wi-Fi as well.
                </Annot>
                <Annot>
                  A SONOFF Zigbee USB coordinator handles the radio. Devices
                  pair directly with Zigbee2MQTT, which talks to Home Assistant
                  over MQTT. No bridges, no cloud round-trip.
                </Annot>
                <Annot>
                  I&apos;m at twenty-plus endpoints today: Hue bulbs, Innr
                  plugs on power-monitored circuits, temperature and humidity
                  sensors, motion and contact sensors, and a solar-powered
                  camera. One node covers all of it, and I&apos;ve had no
                  reason to add a second.
                </Annot>
              </Annotations>
            </SpecSection>

            <SpecSection n="3" title="What happens when I press a light switch">
              <figure>
                <LocalPath />
                <figcaption className="mt-2 font-mono text-[11px] text-muted-foreground">
                  <span className="text-primary">Figure 1</span> — the same
                  press, with and without a cloud in the path.
                </figcaption>
              </figure>
            </SpecSection>

            <SpecSection n="4" title="The whole flat is a git repo">
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
            </SpecSection>

            <SpecSection n="5" title="Power draw and humidity, in Grafana">
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
                  room-by-room temperature.
                </Annot>
              </Annotations>
            </SpecSection>

            <SpecSection n="6" title="Remote access goes over Tailscale">
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

            {/* TODO(jack): the page has no failure in it, and the ADR works
                precisely because it has one. What actually broke: Zigbee mesh
                range? The NVMe-over-USB firmware? An ArgoCD sync that took the
                lights out? Put it in WHAT_I_GOT_WRONG and the section appears.
                Nothing renders until then, so this is safe to leave. */}
            {WHAT_I_GOT_WRONG && (
              <SpecSection n="7" title="What I got wrong">
                <Annotations>
                  <Annot>{WHAT_I_GOT_WRONG}</Annot>
                </Annotations>
              </SpecSection>
            )}

            <SpecSection n={WHAT_I_GOT_WRONG ? "8" : "7"} title="Next">
              <Annotations>
                <Annot>
                  Smart TRV valves next, so heating schedules run per room
                  rather than per flat. After that, presence detection good
                  enough to retire the motion sensors. They&apos;re fine for
                  &quot;is someone in the hallway&quot; and useless for &quot;is
                  anyone home&quot;.
                </Annot>
              </Annotations>
            </SpecSection>

            {/* Document footer: a spec sheet ends with its revision line,
                not a thanks-for-reading card. */}
            <footer className="border-t border-border pt-6">
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-5">
                Revision — 2024 → ongoing · amended as the flat changes
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-sm">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-primary hover:underline group"
                >
                  Say hello
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
