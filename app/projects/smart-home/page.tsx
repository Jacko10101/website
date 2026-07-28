"use client";

import {
  PHOSPHORS,
  CaseStudyLayout,
  CaseStudyHero,
  StatsGrid,
  TechSidebar,
  EnhancedCodeBlock,
  CaseStudyCTA,
} from "@/components/case-study-layout";
import { TopicSection as CaseStudySection } from "@/components/case-section-variants";
import { GlassCard, FadeUp } from "@/components/scroll-reveal";
import { LocalPath } from "@/components/local-path";

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
      <CaseStudyHero
        title="Smart home on K3s"
        subtitle="Self-hosted home automation"
        description="Single-node Kubernetes cluster on a Raspberry Pi 5. Home Assistant, ArgoCD, Prometheus and Grafana, all GitOps-reconciled. Twenty-plus lights, plugs and sensors. Zero ports exposed to the internet."
        date="2024 → ongoing"
        metrics="Single-node K3s, 20+ devices, 0 cloud accounts"
        command="cat case-studies/smart-home.md"
        phosphor={PHOSPHORS.violet.label}
      />

      <div className="container px-4">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
          <div className="space-y-12">
            <CaseStudySection eyebrow="// home/why-local" title="The same discipline, in miniature">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most smart-home setups end up as a pile of vendor apps tied
                together with cloud accounts. That works until a vendor goes
                away, or you realise your motion sensor is reporting to a
                server in another country.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                I wanted the opposite: everything local, and every change to it
                in version control. Prometheus scrapes the lot. It&apos;s the
                same shape as the platform I run at work, sized to a flat.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                One Raspberry Pi 5, K3s, ArgoCD, and a Zigbee dongle. The bill
                of materials fits on a postcard.
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
                motion and contact sensors, and a solar-powered camera. Every
                one of them reports to Prometheus.
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
                stack in every way that matters; the targets just happen to be
                bulbs and a kettle.
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
                reach anything else. Boring threat-model, boring controls.
                That&apos;s the point.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// home/decisions" title="Why it's built this way">
              <div className="space-y-5">
                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    Local-first by default
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    No vendor cloud, and no remote kill-switch someone else
                    holds. If my internet goes down the lights still work.
                    That one constraint picked most of the devices and the
                    network topology for me.
                  </p>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    Treat it like work
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Same git, same ArgoCD, same Prometheus. The cost of
                    applying real discipline to a home lab is small. The cost
                    of not doing it is a fragile pile of config that nobody,
                    me included, wants to debug at the weekend.
                  </p>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    Right-sized infrastructure
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    K3s and ArgoCD aren&apos;t heavy. The whole control plane
                    plus every workload runs comfortably on a single Pi 5 with
                    room to spare. The temptation to add a second node for
                    &quot;HA&quot; is a trap. For a flat, the right number of
                    nodes is one.
                  </p>
                </GlassCard>
              </div>
            </CaseStudySection>

            <CaseStudySection eyebrow="// home/backlog" title="Where this might go">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Smart TRV radiator valves are next, which would let me
                schedule heating per room instead of per house. After that,
                presence detection that&apos;s good enough to stop relying on
                motion sensors. They&apos;re fine for &quot;is someone in the
                hallway&quot; and bad for &quot;is anyone home&quot;.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The longer arc is local LLM integration: a small model on a
                separate node, so voice control and natural-language automation
                don&apos;t round-trip to a cloud API. Same instinct as the rest
                of the system. Local data, countable dependencies.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// home/state" title="What it adds up to">
              <StatsGrid
                stats={[
                  { value: "Single-node", label: "K3s + ArgoCD + Prometheus" },
                  { value: "20+", label: "lights, plugs and sensors" },
                  { value: "6", label: "GitOps-reconciled apps" },
                  { value: "0", label: "ports exposed to the internet" },
                ]}
              />

              <p className="text-muted-foreground mt-6 leading-relaxed">
                What I actually get out of it: the house runs on kit I own and
                config I can read, and nothing in it phones home. When
                something breaks, I debug it the way I&apos;d debug anything at
                work, and it stays fixed.
              </p>
            </CaseStudySection>
          </div>

          <TechSidebar
            technologies={[
              "K3s",
              "ArgoCD",
              "Home Assistant",
              "Zigbee2MQTT",
              "Mosquitto MQTT",
              "Prometheus",
              "Grafana",
              "Tailscale",
              "Raspberry Pi 5",
              "SONOFF Zigbee",
            ]}
            skills={[
              "Self-hosting on constrained hardware",
              "GitOps applied to small systems",
              "Local-first architecture",
              "Network segmentation",
              "Treating side-projects like production",
            ]}
            metrics={[
              { label: "Status", value: "Live, ongoing" },
              { label: "Hardware", value: "Raspberry Pi 5 (8GB), 1TB NVMe, UPS" },
              { label: "Devices", value: "20+ lights, plugs and sensors" },
              { label: "Apps", value: "6 GitOps-reconciled deployments" },
              { label: "Internet exposure", value: "Zero ports" },
              { label: "Remote access", value: "Tailscale only" },
            ]}
            relatedProjects={[
              { title: "Heimdall · deployment intelligence", href: "/projects/heimdall" },
              { title: "Observability stack", href: "/projects/observability" },
            ]}
          />
        </div>
      </div>

      <CaseStudyCTA line="If you also run ArgoCD at home, we'll get on." />
    </CaseStudyLayout>
  );
}
