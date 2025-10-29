import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Projects & Case Studies | DevlinOps",
  description: "Real-world DevOps and Platform Engineering projects demonstrating strategic thinking and measurable impact.",
};

const projects = [
  {
    title: "Engineering Intelligence Platform",
    subtitle: "DORA Metrics Collection Service",
    description:
      "Built a centralized Python service correlating Bitbucket commits, Jira tickets, and ArgoCD deployments to provide automated DORA metrics and engineering insights.",
    tags: ["Python", "ArgoCD", "Prometheus", "Grafana", "API Integration"],
    href: "/projects/dora-metrics",
  },
  {
    title: "Test Orchestration Modernization",
    subtitle: "GitOps-Native Test Execution",
    description:
      "Refactored 47 PRs to eliminate race conditions by replacing imperative pipeline polling with declarative ArgoCD PostSync hooks.",
    tags: ["ArgoCD", "Kubernetes Jobs", "GitOps", "CI/CD"],
    href: "/projects/test-orchestration",
  },
  {
    title: "Feature Branch Automation",
    subtitle: "Self-Service Developer Environments",
    description:
      "Automated creation of isolated namespaces with full observability on PR open, automatically cleaned up on merge. Eliminated shared environment conflicts.",
    tags: ["ArgoCD ApplicationSets", "Kubernetes", "Observability"],
    href: "/projects/feature-branches",
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
