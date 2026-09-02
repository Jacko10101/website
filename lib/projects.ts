// Single source of truth for project data. Previously this lived in three
// places (featured-projects, projects page, CLI) with drifted values.

export type ProjectStatus = "production" | "homelab" | "in-progress";

export interface TerminalLine {
  text: string;
  tone: "cmd" | "ok" | "info" | "warn";
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  /**
   * What Jack did on this, and where. Renders under the subtitle when set,
   * hidden when null. The employer is named once at the top of the projects
   * index rather than repeated on every card.
   * TODO(jack): the one thing still missing here is team size — worth adding
   * if you're comfortable with it ("… · platform team of 3", say).
   */
  context: string | null;
  description: string;
  /**
   * The skim line: what changed because this exists, readable in isolation.
   * Not a description of the system. Leads the homepage tile and the index
   * row; `description` stays the fuller account. Optional only because the
   * dissertation has no outcome to claim yet.
   */
  outcome?: string;
  /**
   * The one case study a first-time reader should open. Rendered as a chip
   * on the homepage tile and the index row. Set on exactly one project.
   */
  startHere?: boolean;
  /**
   * Optional index-only copy override. The projects index renders this
   * instead of `description` when set; every other consumer keeps
   * reading `description`.
   */
  indexDescription?: string;
  /**
   * Document genre badge for the projects index, e.g. "POSTMORTEM",
   * "ADR-001". Each case study is a different document type; this is
   * how the index shows it before the click.
   */
  docType?: string;
  /**
   * Genre-specific link text on the index card, e.g. "read the
   * postmortem". Falls back to "case study" when unset.
   */
  docCta?: string;
  status: ProjectStatus;
  statusLabel: string;
  year: string;
  stats: { value: string; label: string }[];
  tags: string[];
  href: string | null;
  terminal: TerminalLine[];
}

export const projects: Project[] = [
  {
    id: "clarity",
    context: "Built the infrastructure and trust layer · Loweconex",
    title: "Clarity",
    subtitle: "Natural-language database interface",
    description:
      "Ask the estate a question in English, get an answer backed by SQL that actually ran. Around thirty tenant databases, about twenty people using it daily. There's no vector store anywhere; compiled schema knowledge does the grounding, and five classes of hallucination get caught on every turn.",
    outcome:
      "Customers who wanted a number out of their estate used to raise a ticket and wait for an analyst. Now they ask directly — about twenty people a day, across roughly thirty tenants.",
    indexDescription:
      "Ask the estate a question in English, get an answer backed by SQL that actually ran. There's no vector store anywhere; compiled schema knowledge does the grounding, and five classes of hallucination get caught on every turn.",
    startHere: true,
    docType: "Claims + receipts",
    docCta: "check the receipts",
    status: "production",
    statusLabel: "Live",
    year: "2025–26",
    stats: [
      { value: "~30", label: "tenants, a database each" },
      { value: "5", label: "hallucination classes per turn" },
      { value: "0", label: "vector stores" },
    ],
    tags: ["Java 21", "Spring AI", "Gemini", "PostgreSQL", "TimescaleDB", "Kubernetes"],
    href: "/projects/clarity",
    terminal: [
      { text: "$ curl clarity/chat -d '{\"question\":\"hottest sites?\"}'", tone: "cmd" },
      { text: "sql_statements: 1 executed", tone: "ok" },
      { text: "fabricated_names: []", tone: "ok" },
      { text: "grounding.regenerate: not required", tone: "info" },
    ],
  },
  {
    id: "ai-gateway",
    context: "Built it and still own it · Loweconex",
    title: "AI Gateway",
    subtitle: "One endpoint for every model",
    description:
      "A self-hosted LLM gateway in front of every AI workload. Services hold virtual keys with allowlists that fail closed, so I can tell you what any tenant or feature spent, and nothing reaches a model I didn't approve.",
    outcome:
      "Adding an AI feature stopped meaning a new provider key and a billing conversation. It's a config change now, and spend traces to the tenant and feature that caused it.",
    indexDescription:
      "A self-hosted LLM gateway in front of every AI workload. Services hold virtual keys with model allowlists that fail closed, so nothing reaches a model I didn't approve.",
    docType: "Postmortem",
    docCta: "read the postmortem",
    status: "production",
    statusLabel: "Live",
    year: "2026",
    stats: [
      { value: "1", label: "endpoint, every AI workload" },
      { value: "Per-key", label: "model allowlists" },
      { value: "3 tags", label: "tenant, env, feature" },
    ],
    tags: ["LiteLLM", "Kubernetes", "ArgoCD", "Gemini", "Prometheus", "FinOps"],
    href: "/projects/ai-gateway",
    terminal: [
      { text: "$ curl -H \"Authorization: Bearer $KEY\" $GATEWAY/v1/models", tone: "cmd" },
      { text: "gemini-2.5-flash    permitted", tone: "ok" },
      { text: "gemini-3.6-flash    permitted", tone: "ok" },
      { text: "everything else     401", tone: "warn" },
    ],
  },
  {
    id: "heimdall",
    context: "Built and run it · Loweconex",
    title: "Heimdall",
    subtitle: "Where every ticket and service actually is",
    description:
      "The dashboard the platform team checks every morning. Answers one question: where is my ticket right now? Used daily by 20+ engineers across 20 services.",
    outcome:
      "The team stopped pasting kubectl output into Teams to ask whether a deploy had worked. Standup got shorter, and release management reads the same screen as the engineers.",
    docType: "Day log",
    docCta: "read the day log",
    status: "production",
    statusLabel: "Live",
    year: "2025",
    stats: [
      { value: "20", label: "services tracked" },
      { value: "20+", label: "engineers daily" },
      { value: "10 min", label: "data freshness" },
    ],
    tags: ["Python", "Flask", "TimescaleDB", "Prometheus", "ArgoCD", "Kubernetes"],
    href: "/projects/heimdall",
    terminal: [
      { text: "$ curl heimdall/api/v1/debug | jq .", tone: "cmd" },
      { text: "collection.age_seconds: 142", tone: "ok" },
      { text: "db_pool.checked_out: 2 / 10", tone: "info" },
      { text: "circuit_breakers: all closed", tone: "ok" },
    ],
  },
  {
    id: "pipeline-platform",
    context: "Built the shared pipeline library · Loweconex · still in use",
    title: "Pipeline Platform",
    subtitle: "Shared CI/CD library",
    description:
      "One Bitbucket pipeline library, imported by every Java and Node service. Tests live in their own repo, promotion belongs to ArgoCD. ~400 deploys/month across 20 services on a single .ci/builds.yaml.",
    outcome:
      "A change to the build pattern used to mean a PR to twenty repos, so it didn't get made. It now ships once, and every service adopts it by bumping a tag.",
    docType: "PR · Merged",
    docCta: "review the PR",
    status: "production",
    statusLabel: "Live",
    year: "2024–26",
    stats: [
      { value: "20", label: "services, one library" },
      { value: "~400", label: "deploys/month" },
      { value: "1 file", label: "to onboard" },
    ],
    tags: ["Bitbucket Shared Pipelines", "ArgoCD", "Image Updater", "Kubernetes", "Kustomize"],
    href: "/projects/pipeline-platform",
    terminal: [
      { text: "$ cat .ci/builds.yaml", tone: "cmd" },
      { text: "service: payments-api", tone: "ok" },
      { text: "import: java-shared-pipeline:1.4.0", tone: "info" },
      { text: "→ Image Updater handles the rest", tone: "warn" },
    ],
  },
  {
    id: "observability",
    context: "Built and run the stack · Loweconex",
    title: "Observability Stack",
    subtitle: "Self-hosted monitoring",
    description:
      "Prometheus, Grafana and Loki for 20 services across four environments. Built in-house because the commercial quotes came in near £100k a year against roughly £5k to run it ourselves, and we already had the cluster capacity going spare.",
    outcome:
      "Monitoring quoted near £100k a year runs in-house for about £5k, and two years on an incident starts with someone pasting a Grafana link.",
    indexDescription:
      "Prometheus, Grafana and Loki for 20 services across four environments, run on cluster capacity we already had going spare. Cold data ages out to object storage, which is why the bill stayed flat while the data grew.",
    docType: "ADR-001",
    docCta: "read the ADR",
    status: "production",
    statusLabel: "Live",
    year: "2024–25",
    stats: [
      { value: "4", label: "environments, one stack" },
      { value: "22", label: "dashboards, managed as code" },
      { value: "50+", label: "alerts, runbook each" },
    ],
    tags: ["Prometheus", "Grafana", "Loki", "Thanos", "Alertmanager"],
    href: "/projects/observability",
    terminal: [
      { text: "$ promtool check targets", tone: "cmd" },
      { text: "20/20 targets healthy", tone: "ok" },
      { text: "22 dashboards active", tone: "info" },
      { text: "50+ alert rules, runbook each", tone: "ok" },
    ],
  },
  {
    id: "smart-home",
    context: "Personal project · my flat",
    title: "Smart Home on K3s",
    subtitle: "Self-hosted home automation",
    description:
      "A single-node K3s cluster on a Raspberry Pi 5, reconciled by ArgoCD and watched by Prometheus. Twenty-plus lights, plugs and sensors, and not one port open to the internet. It's the discipline I use at work, sized to a flat.",
    outcome:
      "If the internet goes down, the lights still work — and nothing in the flat is reachable from outside the VPN.",
    indexDescription:
      "A single-node K3s cluster on a Raspberry Pi 5, reconciled by ArgoCD and watched by Prometheus. Twenty-plus lights, plugs and sensors on a Zigbee mesh that never talks to a vendor cloud. It's the discipline I use at work, sized to a flat.",
    docType: "Spec sheet",
    docCta: "read the spec sheet",
    status: "homelab",
    statusLabel: "Homelab",
    year: "2024–26",
    stats: [
      { value: "Single-node", label: "K3s control plane" },
      { value: "20+", label: "lights, plugs and sensors" },
      { value: "0", label: "ports exposed to the internet" },
    ],
    tags: ["K3s", "ArgoCD", "Home Assistant", "Zigbee2MQTT", "Prometheus", "Grafana", "Tailscale"],
    href: "/projects/smart-home",
    terminal: [
      { text: "$ kubectl get apps -n argocd", tone: "cmd" },
      { text: "home-assistant      Synced  Healthy", tone: "ok" },
      { text: "zigbee2mqtt         Synced  Healthy", tone: "ok" },
      { text: "prometheus, grafana Synced  Healthy", tone: "info" },
    ],
  },
  {
    id: "ml-scheduler",
    context: "MSc dissertation · Queen's University Belfast",
    title: "Recovery Scheduling under Node Failure",
    subtitle: "MSc dissertation, submitted September 2026",
    description:
      "When a machine dies, nothing decides how the workload comes back: displaced pods rejoin the queue blind to what matters and to how loaded the survivors already are. I built a capacity-aware recovery scheduler and measured it against stock kube-scheduler and PriorityClass preemption, on real EKS clusters where node failure means actually terminating the machine.",
    docType: "Study · Submitted",
    status: "in-progress",
    statusLabel: "Submitted",
    year: "2026",
    stats: [
      { value: "Submitted", label: "September 2026" },
      { value: "3 arms", label: "kube-scheduler, PriorityClass, selection" },
      { value: "Real kills", label: "no simulated results reported" },
    ],
    tags: ["Kubernetes", "Scheduling", "EKS", "Python", "Pre-registered analysis"],
    href: null,
    terminal: [
      { text: "$ aws ec2 terminate-instances --instance-ids i-0f3a…", tone: "cmd" },
      { text: "node/ip-10-0-4-91 NotReady", tone: "warn" },
      { text: "recovery: importance-aware policy engaged", tone: "info" },
      { text: "measuring against noise floor…", tone: "ok" },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.href !== null);

// Aggregate proof points, surfaced in the hero. Each traces to a case study.
export const proofPoints = [
  { value: "20+", label: "engineers open my deployment dashboard daily", href: "/projects/heimdall" },
  { value: "~400", label: "deploys a month through my shared pipeline library", href: "/projects/pipeline-platform" },
  { value: "~30", label: "tenants on the AI query product I built", href: "/projects/clarity" },
];
