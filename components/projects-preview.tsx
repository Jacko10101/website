"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";

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
            Featured Work
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Here are a few projects where I got to build something cool and make a real impact.
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
