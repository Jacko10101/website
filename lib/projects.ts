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
      "Prometheus, Grafana and Loki for 20 services across four environments. Built in-house because the commercial quotes were ~£100k and we already had the cluster capacity.",
    status: "production",
    statusLabel: "Synced · Healthy",
    year: "2024–25",
    stats: [
      { value: "~£5k/yr", label: "vs ~£100k commercial" },
      { value: "~25", label: "dashboards" },
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
      "Single-node Kubernetes cluster on a Raspberry Pi 5, GitOps-reconciled by ArgoCD, observable end-to-end through Prometheus and Grafana. Twenty-plus lights, plugs and sensors. Zero ports exposed to the internet. Same discipline I apply at work, sized to a flat.",
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
    title: "GPU-aware Scheduling",
    subtitle: "MSc dissertation, in progress",
    description:
      "Research into GPU-aware scheduling on Kubernetes for ML workloads. The write-up lands with the dissertation — August 2026.",
    status: "in-progress",
    statusLabel: "In progress",
    year: "2026",
    stats: [
      { value: "Aug 2026", label: "write-up due" },
      { value: "K8s", label: "scheduler internals" },
      { value: "GPU", label: "bin-packing & sharing" },
    ],
    tags: ["Kubernetes", "GPU", "Scheduling", "PyTorch"],
    href: null,
    terminal: [
      { text: "$ kubectl get pods -l workload=training", tone: "cmd" },
      { text: "status: research in progress", tone: "warn" },
      { text: "eta: august 2026", tone: "info" },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.href !== null);

// Aggregate proof points, surfaced in the hero. Each traces to a case study.
export const proofPoints = [
  { value: "20+", label: "engineers use Heimdall daily", href: "/projects/heimdall" },
  { value: "~400", label: "deploys/month on my pipeline library", href: "/projects/pipeline-platform" },
  { value: "~£95k/yr", label: "saved on observability", href: "/projects/observability" },
];
