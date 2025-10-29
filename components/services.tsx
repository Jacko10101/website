"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Cloud,
  LineChart,
  GitBranch,
  Shield,
  Network,
  Database,
  Wrench,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: Cloud,
    title: "Kubernetes & EKS",
    description:
      "EKS cluster design, zero-downtime upgrades, infrastructure as code (CDK/Terraform), disaster recovery, and cost optimization.",
    href: "/services#kubernetes",
  },
  {
    icon: LineChart,
    title: "Enterprise Observability",
    description:
      "Complete Prometheus/Grafana/Loki/Tempo stack, custom metrics, distributed tracing, alerting strategies, and MTTR reduction.",
    href: "/services#observability",
  },
  {
    icon: GitBranch,
    title: "GitOps & CI/CD",
    description:
      "ArgoCD implementation, ApplicationSet automation, pipeline modernization, feature branch workflows, and deployment strategies.",
    href: "/services#gitops",
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description:
      "Runtime security (Falco), network intrusion detection (Suricata), security scanning integration, and policy-as-code.",
    href: "/services#security",
  },
  {
    icon: Network,
    title: "Service Mesh",
    description:
      "Istio installation & upgrades, EnvoyFilter development, mTLS implementation, traffic management, and observability integration.",
    href: "/services#service-mesh",
  },
  {
    icon: Database,
    title: "Data Platforms",
    description:
      "Kafka/MSK management, stream processing architecture, monitoring & alerting, consumer lag optimization, and data migrations.",
    href: "/services#data-platforms",
  },
  {
    icon: Wrench,
    title: "Developer Experience",
    description:
      "Self-service platforms, feature branch automation, remote debugging infrastructure, test enhancement, and productivity tooling.",
    href: "/services#developer-experience",
  },
];

export function Services() {
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
            What I Do
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            I tackle the platform engineering challenges that keep your team from shipping fast.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={service.href}
                className="group block h-full rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
              >
                <service.icon className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {service.description}
                </p>
                <div className="flex items-center text-sm font-medium text-primary">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
