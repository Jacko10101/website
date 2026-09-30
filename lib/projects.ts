import { caseStories } from "./case-studies";

export type ProjectStatus = "production" | "homelab" | "in-progress" | "study";
export interface Project {
  id: string;
  title: string;
  subtitle: string;
  context: string | null;
  description: string;
  outcome?: string;
  startHere?: boolean;
  indexDescription?: string;
  docType?: string;
  docCta?: string;
  status: ProjectStatus;
  statusLabel: string;
  year: string;
  stats: { value: string; label: string }[];
  tags: string[];
  href: string | null;
}

export const READING_ORDER = [
  "nightshift", "heimdall", "clarity", "pipeline-platform",
  "observability", "ai-gateway", "ml-scheduler", "smart-home",
] as const;

const evidence: Record<string, Project["stats"]> = {
  nightshift: [{ value: "Pilot", label: "Jira ticket delivery" }, { value: "Draft PR", label: "human review before merge" }],
  heimdall: [{ value: "25", label: "services" }, { value: "4", label: "environments" }],
  clarity: [{ value: "SQL", label: "answers grounded in query results" }, { value: "CSV", label: "downloadable reports" }],
  "pipeline-platform": [{ value: "25", label: "services" }, { value: "~400", label: "deployments per month" }],
  observability: [{ value: "4", label: "environments" }, { value: "72", label: "alerts linked to runbooks" }],
  "ai-gateway": [{ value: "Shared", label: "model access point" }, { value: "Per consumer", label: "access and usage attribution" }],
  "ml-scheduler": [{ value: "199", label: "recorded experimental runs" }, { value: "Distinction", label: "MSc Artificial Intelligence" }],
  "smart-home": [{ value: "Local", label: "device control" }, { value: "GitOps", label: "configuration and deployment" }],
};

export const projects: Project[] = READING_ORDER.map((id) => {
  const story = caseStories[id];
  const status: ProjectStatus = id === "nightshift" ? "in-progress" : id === "smart-home" ? "homelab" : id === "ml-scheduler" ? "study" : "production";
  return {
    id, title: story.title, subtitle: story.headline, context: story.role,
    description: story.intro, outcome: story.takeaway,
    startHere: id === "nightshift", docType: story.category, docCta: "Read the story",
    status, statusLabel: story.status, year: ({ heimdall: "2025–26", clarity: "2025–26", "pipeline-platform": "2024–26", observability: "2024–26", "smart-home": "2024–26" } as Record<string, string>)[id] ?? "2026", stats: evidence[id],
    tags: story.stack, href: `/projects/${id}`,
  };
});

export const featuredProjects = projects.filter((p) => p.href !== null);
export const inReadingOrder = (): (Project & { href: string })[] =>
  projects.filter((p): p is Project & { href: string } => typeof p.href === "string");
export const firstSentence = (text: string) => text.match(/^.*?\.(?=\s|$)/)?.[0] ?? text;
export const proofPoints = [
  { value: "25", label: "services in one deployment view", href: "/projects/heimdall" },
  { value: "~400", label: "deployments a month through shared delivery tooling", href: "/projects/pipeline-platform" },
  { value: "Distinction", label: "MSc in Artificial Intelligence, completed alongside work", href: "/projects/ml-scheduler" },
];
