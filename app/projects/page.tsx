import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Projects & Case Studies | DevlinOps",
  description: "Real-world DevOps and Platform Engineering projects demonstrating strategic thinking and measurable impact.",
};

const projects = [
  {
    title: "DORA Metrics & Developer Experience Platform",
    subtitle: "Business Intelligence & DevEx Tooling",
    description:
      "Built comprehensive DevEx platform with DORA metrics collector, intelligent pipeline notifications, and automated deployment gates—transforming engineering visibility and developer productivity.",
    tags: ["Python", "Bash", "Prometheus", "Grafana", "Teams", "Jira API"],
    href: "/projects/dora-devex",
  },
  {
    title: "CI/CD & GitOps Platform Engineering",
    subtitle: "Enterprise Pipeline Architecture from Scratch",
    description:
      "Built production-grade CI/CD from greenfield microservices migration—evolved to 400 deploys/month across 20 services with enterprise security and GitOps automation.",
    tags: ["GitOps", "ArgoCD", "Kubernetes", "SAST/SCA", "Bitbucket Pipelines"],
    href: "/projects/cicd-gitops",
  },
  {
    title: "Enterprise Observability Stack",
    subtitle: "Self-Hosted Monitoring Platform",
    description:
      "Built production-grade observability with Prometheus, Grafana, and Loki—achieving full-stack visibility for 20 services at 95%+ cost savings vs cloud solutions like Datadog.",
    tags: ["Prometheus", "Grafana", "Loki", "Thanos", "Kubernetes", "Alertmanager"],
    href: "/projects/observability",
  },
];

export default function ProjectsPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Projects & Case Studies
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Real-world examples of strategic DevOps and Platform Engineering work with measurable business impact.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.title}
            href={project.href}
            className="group block h-full rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="mb-4">
              <h2 className="mb-1 text-xl font-semibold group-hover:text-primary transition-colors">
                {project.title}
              </h2>
              <p className="text-sm text-muted-foreground">{project.subtitle}</p>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              {project.description}
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-secondary px-2 py-1 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center text-sm font-medium text-primary">
              Read case study
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
