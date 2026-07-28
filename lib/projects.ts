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
   * Role/duration/setting line, e.g. "Sole platform engineer · 8 months ·
   * UK IoT company (anonymised)". Renders under the subtitle when set;
   * hidden when null. TODO(jack): only you know these — fill them in.
   */
  context: string | null;
  description: string;
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
    context: null, // TODO(jack): e.g. role · duration · company setting
    title: "Clarity",
    subtitle: "Natural-language database interface",
    description:
      "Ask the estate a question in English, get an answer backed by SQL that actually ran. Around thirty tenant databases, about twenty people using it daily. There's no vector store anywhere; compiled schema knowledge does the grounding, and five classes of hallucination get caught on every turn.",
    status: "production",
    statusLabel: "Synced · Healthy",
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
    context: null, // TODO(jack): e.g. role · duration · company setting
    title: "AI Gateway",
    subtitle: "One endpoint for every model",
    description:
      "A self-hosted LLM gateway in front of every AI workload. Services hold virtual keys with allowlists that fail closed, so I can tell you what any tenant or feature spent, and nothing reaches a model I didn't approve.",
    status: "production",
    statusLabel: "Synced · Healthy",
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
    context: null, // TODO(jack): e.g. role · duration · company setting
    title: "Heimdall",
    subtitle: "Deployment intelligence platform",
    description:
      "The dashboard the platform team checks every morning. Answers one question: where is my ticket right now? Used daily by 20+ engineers across a couple dozen services.",
    status: "production",
    statusLabel: "Synced · Healthy",
    year: "2025",
    stats: [
      { value: "~2 dozen", label: "services tracked" },
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
    context: null, // TODO(jack): e.g. role · duration · company setting
    title: "Pipeline Platform",
    subtitle: "Shared CI/CD library",
    description:
      "One Bitbucket pipeline library, imported by every Java and Node service. Tests live in their own repo, promotion belongs to ArgoCD. ~400 deploys/month across 20 services on a single .ci/builds.yaml.",
    status: "production",
    statusLabel: "Synced · Healthy",
    year: "2024–25",
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
    context: null, // TODO(jack): e.g. role · duration · company setting
    title: "Observability Stack",
    subtitle: "Self-hosted monitoring",
    description:
      "Prometheus, Grafana and Loki for 20 services across four environments. Built in-house because the commercial quotes were silly money and we already had the cluster capacity going spare.",
    status: "production",
    statusLabel: "Synced · Healthy",
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
      { text: "~25 dashboards active", tone: "info" },
      { text: "50+ alert rules, runbook each", tone: "ok" },
    ],
  },
  {
    id: "smart-home",
    context: null, // TODO(jack): e.g. role · duration · company setting
    title: "Smart Home on K3s",
    subtitle: "Self-hosted home automation",
    description:
      "A single-node K3s cluster on a Raspberry Pi 5, reconciled by ArgoCD and watched by Prometheus. Twenty-plus lights, plugs and sensors, and not one port open to the internet. It's the discipline I use at work, sized to a flat.",
    status: "homelab",
    statusLabel: "Synced · Healthy",
    year: "2025",
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
    context: null, // TODO(jack): e.g. role · duration · company setting
    title: "Recovery Scheduling under Node Failure",
    subtitle: "MSc dissertation, in progress",
    description:
      "When a machine dies, nothing decides how the workload comes back: displaced pods rejoin the queue blind to what matters and to how loaded the survivors already are. I'm building a capacity-aware recovery scheduler and measuring it against stock kube-scheduler and PriorityClass preemption, on real clusters where node failure means actually killing the machine. Submission September 2026.",
    status: "in-progress",
    statusLabel: "In progress",
    year: "2026",
    stats: [
      { value: "Sep 2026", label: "submission" },
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
  { value: "20+", label: "engineers use Heimdall daily", href: "/projects/heimdall" },
  { value: "~400", label: "deploys/month on my pipeline library", href: "/projects/pipeline-platform" },
  { value: "~30", label: "tenants live on Clarity, my AI query product", href: "/projects/clarity" },
];
