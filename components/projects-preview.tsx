"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Engineering Intelligence Platform",
    subtitle: "DORA Metrics Collection Service",
    description:
      "Built a centralized Python service correlating Bitbucket commits, Jira tickets, and ArgoCD deployments to provide automated DORA metrics and a 'State of the Union' dashboard for engineering insights.",
    tags: ["Python", "ArgoCD", "Prometheus", "Grafana", "API Integration"],
    href: "/projects/dora-metrics",
  },
  {
    title: "Test Orchestration Modernization",
    subtitle: "GitOps-Native Test Execution",
    description:
      "Refactored 47 PRs to eliminate race conditions by replacing imperative pipeline polling with declarative ArgoCD PostSync hooks, dramatically improving test reliability.",
    tags: ["ArgoCD", "Kubernetes Jobs", "GitOps", "CI/CD", "Bash"],
    href: "/projects/test-orchestration",
  },
  {
    title: "Feature Branch Automation",
    subtitle: "Self-Service Developer Environments",
    description:
      "Automated creation of isolated {service}-{branch-slug} namespaces with full observability on PR open, automatically cleaned up on merge. Eliminated shared dev environment conflicts.",
    tags: ["ArgoCD ApplicationSets", "Kubernetes", "Prometheus", "Automation"],
    href: "/projects/feature-branches",
  },
];

export function ProjectsPreview() {
  return (
    <section className="border-b border-border py-24">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Featured Projects
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Real-world case studies demonstrating strategic thinking, technical depth, and measurable business impact.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={project.href}
                className="group block h-full rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
              >
                <div className="mb-4">
                  <h3 className="mb-1 text-xl font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
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
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View all projects
            <ExternalLink className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
