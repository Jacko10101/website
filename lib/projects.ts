// Single source of truth for project data. Previously this lived in three
// places (featured-projects, projects page, CLI) with drifted values.

export type ProjectStatus = "production" | "homelab" | "in-progress" | "study";

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
    // The one to open first: a DevEx tool on the platform, adopted by the
    // whole team. It serves the platform reader and the AI-infra reader both.
    startHere: true,
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
  },
  {
    id: "ml-scheduler",
    context: "MSc dissertation · Queen's University Belfast",
    title: "Evict the Guilty, Not the Innocent",
    subtitle: "Recovery scheduling under real node failure",
    description:
      "When a node dies and the survivors cannot hold every pod, something decides who comes back and what gets thrown out. I built a scheduler that prices each pod by its importance label times the measured probability it will actually serve, and compared it with stock Kubernetes, PriorityClass preemption and a label-trusting knapsack on real EKS clusters, under an analysis plan fixed before the data.",
    outcome:
      "Over eighteen real node kills the knapsack kept 5.8 points more important work running than stock, every time. Where services lied about their health, checking labels against measured behaviour added 12.9 points more, five of five, at a quarter of PriorityClass's collateral.",
    docType: "Paper",
    docCta: "read the paper",
    status: "study",
    statusLabel: "Submitted",
    year: "2026",
    stats: [
      { value: "199", label: "recorded runs on real EKS" },
      { value: "+12.9 pp", label: "over label trust, 5 of 5, p = 0.005" },
      { value: "7 vs 28", label: "healthy pods evicted, AI vs PriorityClass" },
    ],
    tags: ["Kubernetes", "EKS", "Scheduling", "Python", "Terraform", "Pre-registered analysis"],
    href: "/projects/ml-scheduler",
  },
];

export const featuredProjects = projects.filter((p) => p.href !== null);

// Aggregate proof points, surfaced in the hero. Each traces to a case study.
export const proofPoints = [
  { value: "20+", label: "engineers open my deployment dashboard daily", href: "/projects/heimdall" },
  { value: "~400", label: "deploys a month through my shared pipeline library", href: "/projects/pipeline-platform" },
  { value: "~30", label: "tenants on the AI query product I built", href: "/projects/clarity" },
];
