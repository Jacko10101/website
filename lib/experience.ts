/**
 * Employment and education, in one place.
 *
 * This exists because the site has to do the job a LinkedIn profile would
 * otherwise do: name the employers, give real dates, and let someone check
 * the story. The same data feeds the About page and the JSON-LD in
 * app/layout.tsx, so the two can't drift.
 *
 * Keep it factual. Anything that reads like a bullet on a CV template
 * belongs in a case study instead.
 */

export interface Role {
  company: string;
  /** One clause so a reader who doesn't know the company still follows. */
  companyNote?: string;
  title: string;
  location: string;
  /** Machine-readable, for JSON-LD. */
  startDate: string;
  endDate: string | null;
  /** Human-readable, for the page. */
  dates: string;
  summary: string;
  /** Optional pointer to the case studies that came out of this role. */
  evidence?: { label: string; href: string }[];
}

export const roles: Role[] = [
  {
    company: "Loweconex",
    companyNote: "a UK IoT platform business",
    title: "Platform & Site Reliability Engineer",
    location: "Lisburn, Northern Ireland",
    startDate: "2023-08",
    endDate: null,
    dates: "Aug 2023 – present",
    summary:
      "Core platform engineering, on-call and AI infrastructure for a high-volume microservices estate. Engineering was five people when I joined and is around forty now, so most of what I built was built to keep up with that. I started as a graduate in QA, moved into platform work, and have been contracting through my own company since September 2025.",
    evidence: [
      { label: "Clarity", href: "/projects/clarity" },
      { label: "AI Gateway", href: "/projects/ai-gateway" },
      { label: "Heimdall", href: "/projects/heimdall" },
      { label: "Pipeline platform", href: "/projects/pipeline-platform" },
      { label: "Observability stack", href: "/projects/observability" },
    ],
  },
  {
    company: "OD3 Engineering",
    title: "Software Developer (industrial placement)",
    location: "Magherafelt, Northern Ireland",
    startDate: "2021-08",
    endDate: "2022-08",
    dates: "Aug 2021 – Aug 2022",
    summary:
      "A placement year building Tekla Structures API applications and design-platform integrations, automating drafting work for the in-house architects.",
  },
];

export interface Qualification {
  award: string;
  result: string | null;
  institution: string;
  dates: string;
  note?: string;
}

export const education: Qualification[] = [
  {
    award: "MSc Artificial Intelligence",
    result: "on track for Distinction",
    institution: "Queen's University Belfast",
    dates: "submitted September 2026",
    note: "Dissertation: capacity-aware recovery scheduling for Kubernetes, measured on real EKS clusters under induced node failure.",
  },
  {
    award: "BSc Computer Science",
    result: "2:1",
    institution: "Queen's University Belfast",
    dates: "2019 – 2023",
    note: "First-class dissertation on deep learning for stock-price prediction.",
  },
];

/**
 * The stack, tiered by what Jack has actually been on call for. This lives
 * here rather than on the About page because the JSON-LD `knowsAbout` list
 * is derived from it — two hand-maintained lists had already drifted apart.
 */
export const stackTiers = [
  {
    id: "production",
    label: "run-in-production/",
    note: "Evidenced by the case studies. I have carried a pager for these.",
    items: [
      "Kubernetes",
      "EKS",
      "ArgoCD",
      "Kustomize",
      "Bitbucket Pipelines",
      "Prometheus",
      "Grafana",
      "Loki",
      "Thanos",
      "Alertmanager",
      "Tempo",
      "Kafka",
      "Java 21",
      "Spring AI",
      "LiteLLM",
      "Python",
      "Flask",
      "TimescaleDB",
      "PostgreSQL",
      "OpenTelemetry",
      "AWS",
    ],
  },
  {
    id: "homelab",
    label: "homelab/",
    note: "Running in my flat, reconciled the same way as work. No pager.",
    items: ["K3s", "Home Assistant", "Zigbee2MQTT", "Tailscale", "Raspberry Pi"],
  },
  {
    id: "working",
    label: "working-knowledge/",
    note: "Used on real projects or in coursework. I haven't been on call for any of these.",
    items: [
      "Veracode",
      "SourceClear",
      "Jira",
      "Helm",
      "Terraform",
      "AWS CDK",
      "CloudFormation",
      "Bash",
      "TypeScript",
      "Node",
      "Go",
      "PyTorch",
      "MLflow",
      "KubeFlow",
      "NVIDIA GPU Operator",
      "Triton",
      "Istio",
      "OPA",
      "Falco",
      "Suricata",
      "Redis",
    ],
  },
];

/** Flat list for structured data, so the JSON-LD can't drift from the page. */
export const knowsAbout = [
  "Platform Engineering",
  "Site Reliability Engineering",
  "AI Infrastructure",
  "GitOps",
  "CI/CD",
  "Observability",
  ...stackTiers.flatMap((tier) => tier.items),
];

/** The company Jack contracts through. Named so the site doesn't read as an agency. */
export const tradingAs = {
  name: "Devlinops Ltd",
  note: "my own limited company — devlinops.com is a portfolio, not an agency",
  since: "September 2025",
};
