import Link from "next/link";
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

export const metadata = {
  title: "Services | DevlinOps",
  description: "Comprehensive DevOps and Platform Engineering services for scale-up and enterprise teams.",
};

const services = [
  {
    id: "kubernetes",
    icon: Cloud,
    title: "Kubernetes Platform Engineering & EKS Optimization",
    description:
      "End-to-end Kubernetes platform design and management for production workloads.",
    offerings: [
      "EKS cluster design, deployment, and architecture",
      "Zero-downtime Kubernetes upgrades (1.30 → 1.31 → 1.32+)",
      "Infrastructure as Code (AWS CDK, Terraform, CloudFormation)",
      "Node group optimization and autoscaling strategies",
      "Disaster recovery planning and backup strategies",
      "Cost optimization and resource management",
      "CloudFormation stack recovery and troubleshooting",
    ],
  },
  {
    id: "observability",
    icon: LineChart,
    title: "Enterprise Observability Stack Implementation",
    description:
      "Complete observability platform setup for visibility, alerting, and proactive incident response.",
    offerings: [
      "Prometheus + Grafana + Loki + Tempo stack deployment",
      "Custom business metrics design (DORA metrics, SLIs, SLOs)",
      "Distributed tracing implementation (OpenTelemetry)",
      "Alerting strategy, runbooks, and on-call workflows",
      "Log aggregation pipelines and retention policies",
      "Dashboard development and visualization",
      "MTTR reduction through improved observability",
    ],
  },
  {
    id: "gitops",
    icon: GitBranch,
    title: "GitOps & CI/CD Pipeline Modernization",
    description:
      "Streamline deployments with GitOps best practices and automated pipelines.",
    offerings: [
      "ArgoCD implementation and migration strategies",
      "ApplicationSet automation for dynamic environments",
      "Bitbucket/GitHub/GitLab pipeline optimization",
      "Feature branch workflows and preview environments",
      "PostSync hooks for test orchestration",
      "Deployment automation and rollback strategies",
      "Secrets management (External Secrets Operator, Vault)",
    ],
  },
  {
    id: "security",
    icon: Shield,
    title: "Security & Compliance Automation",
    description:
      "Integrate security into your platform with runtime monitoring and policy enforcement.",
    offerings: [
      "Runtime security monitoring (Falco rule development)",
      "Network intrusion detection (Suricata NIDS)",
      "Security scanning integration (Veracode, Snyk, Trivy)",
      "SIEM integration and compliance reporting",
      "Vulnerability management workflows",
      "Policy-as-code (OPA, Kyverno)",
      "Security audit remediation",
    ],
  },
  {
    id: "service-mesh",
    icon: Network,
    title: "Service Mesh Architecture & Traffic Management",
    description:
      "Implement and manage service mesh for secure, observable microservices communication.",
    offerings: [
      "Istio installation, upgrades, and migration (1.20 → 1.26+)",
      "EnvoyFilter development for custom traffic policies",
      "mTLS implementation and certificate management",
      "Advanced routing (canary, blue-green, A/B testing)",
      "Observability integration (distributed tracing, service graphs)",
      "Performance tuning and troubleshooting",
      "Zero-downtime service mesh upgrades",
    ],
  },
  {
    id: "data-platforms",
    icon: Database,
    title: "Data Platform & Streaming Infrastructure",
    description:
      "Build reliable data pipelines and streaming platforms at scale.",
    offerings: [
      "Kafka/MSK cluster management and upgrades",
      "Stream processing architecture (Flink, Kafka Streams)",
      "Monitoring and alerting for data pipelines",
      "Consumer lag management and optimization",
      "TimescaleDB/PostgreSQL performance tuning",
      "Data migration strategies",
      "JMX metrics and exporter configuration",
    ],
  },
  {
    id: "developer-experience",
    icon: Wrench,
    title: "Developer Experience & Platform Tooling",
    description:
      "Empower your engineers with self-service platforms and productivity tools.",
    offerings: [
      "Self-service developer platforms (internal developer portals)",
      "Feature branch environment automation",
      "Remote debugging infrastructure (JVM, Node.js, Python)",
      "Test suite enhancement and code coverage reporting",
      "Developer onboarding workflows and documentation",
      "Productivity tooling and CLI development",
      "Namespace isolation and resource governance",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Services
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Comprehensive DevOps and Platform Engineering solutions tailored to your infrastructure challenges.
        </p>
      </div>

      <div className="space-y-12">
        {services.map((service, index) => (
          <div
            key={service.id}
            id={service.id}
            className="scroll-mt-20 rounded-lg border border-border bg-card p-6 md:p-8"
          >
            <div className="mb-6 flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <service.icon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="mb-2 text-2xl font-bold">{service.title}</h2>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {service.offerings.map((offering) => (
                <li key={offering} className="flex gap-3 text-sm">
                  <span className="text-primary">✓</span>
                  <span className="text-muted-foreground">{offering}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-border bg-gradient-to-br from-primary/10 via-background to-background p-8 text-center md:p-12">
        <h2 className="mb-4 text-2xl font-bold">Ready to Get Started?</h2>
        <p className="mb-6 text-muted-foreground">
          Let's discuss how these services can transform your infrastructure and accelerate your team.
        </p>
        <Link
          href="/contact"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
        >
          Get in Touch
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
