import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";

/**
 * What I run, as a manifest rather than a diagram.
 *
 * This was a boxes-and-arrows SVG with a detail panel: eleven nodes, one
 * visible description at a time, and nothing readable until you clicked
 * something. A stack diagram of a stack everyone already knows the shape of
 * tells a reader very little — what they want is which parts are actually
 * yours, and how much of each.
 *
 * So it is a ruled index now: the name on the left, the evidence on the
 * right, every row legible without touching anything. Same facts, same
 * wording. Anything that isn't production would say so on its own line.
 */

interface Capability {
  id: string;
  title: string;
  /** The concrete tooling, set as a spec line under the name. */
  spec: string;
  description: string;
  /** Set where the honest answer isn't "in production". */
  caveat?: string;
}

const capabilities: Capability[] = [
  {
    id: "cluster",
    title: "Kubernetes & EKS",
    spec: "EKS · K3s",
    description:
      "Cluster operations end to end: node groups, zero-downtime upgrades, right-sizing for cost. The same discipline runs my single-node K3s homelab.",
  },
  {
    id: "gitops",
    title: "GitOps with ArgoCD",
    spec: "ArgoCD · Image Updater · git",
    description:
      "ArgoCD and Image Updater reconcile the cluster to whatever git says, so nobody deploys by hand and the audit trail is the repository history. Everything downstream is derived state.",
  },
  {
    id: "ci",
    title: "CI/CD pipelines",
    spec: "shared pipeline library",
    description:
      "One shared pipeline library imported by every service: build, test, scan, push. ~400 deploys/month across 20 services on a single .ci/builds.yaml.",
  },
  {
    id: "obs",
    title: "Observability",
    spec: "Prometheus · Grafana · Loki",
    description:
      "Self-hosted Prometheus, Grafana and Loki. 22 dashboards managed as code, 50+ alerts with a runbook each, across four environments.",
  },
  {
    id: "security",
    title: "Security automation",
    spec: "SAST · SCA · policy",
    description:
      "Veracode SAST and SourceClear SCA wired into CI so scanning isn't optional, with findings filed straight to Jira. Falco and Suricata I've used, but not carried a pager for.",
  },
  {
    id: "data",
    title: "Data platforms",
    spec: "Kafka · MSK",
    description:
      "Kafka for service-to-service events, and the schema discipline that stops a producer change breaking every consumer downstream.",
  },
  {
    id: "aws",
    title: "AWS",
    spec: "EKS · VPC · IAM · MSK · RDS",
    description:
      "EKS, IAM, VPC, Route 53, S3, MSK, RDS. The boring fundamentals, done properly.",
  },
  {
    id: "agents",
    title: "AI agents doing platform work",
    spec: "security triage · incident response",
    description:
      "Agents pointed at the platform's own operational load rather than at a chat box: turning security findings into tickets, and taking the first pass on an incident against the runbooks that already exist.",
  },
];

function CapabilityRow({ item, index }: { item: Capability; index: number }) {
  return (
    <div className="grid gap-x-10 gap-y-3 border-t border-border py-8 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
      <div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="display text-2xl text-foreground sm:text-[1.75rem]">
            {item.title}
          </h3>
        </div>
        <p className="mt-2 pl-8 font-mono text-xs tracking-wide text-primary/90">
          {item.spec}
        </p>
      </div>

      <div>
        <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">
          {item.description}
        </p>
        {item.caveat && (
          <p className="mt-2 font-mono text-xs text-warn">{item.caveat}</p>
        )}
      </div>
    </div>
  );
}

export function SystemMap() {
  return (
    <section className="relative py-28 md:py-36">
      <div className="container">
        <SectionHeading
          label="capability"
          title="What I build"
          index="03"
          lede="Everything here is something I run in production or at home."
        />

        <div className="border-b border-border">
          {capabilities.map((item, i) => (
            <CapabilityRow key={item.id} item={item} index={i} />
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-primary transition-colors hover:text-foreground"
          >
            Or just look at what I&apos;ve shipped →
          </Link>
        </div>
      </div>
    </section>
  );
}
