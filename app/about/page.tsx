import Link from "next/link";
import { ArrowRight, Award, Briefcase, Code2 } from "lucide-react";

export const metadata = {
  title: "About | DevlinOps",
  description: "Learn about Jack Devlin and DevlinOps - expert DevOps and Platform Engineering consulting.",
};

export default function AboutPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          About DevlinOps
        </h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-xl text-muted-foreground mb-8">
            I'm Jack Devlin, a DevOps and Platform Engineering consultant specializing in cloud-native infrastructure,
            observability, and GitOps for scale-up and enterprise teams.
          </p>

          <div className="grid gap-6 md:grid-cols-3 not-prose mb-12">
            <div className="rounded-lg border border-border bg-card p-6">
              <Briefcase className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">Experience</h3>
              <p className="text-sm text-muted-foreground">
                7,500+ tickets delivered across enterprise-scale Kubernetes platforms
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <Code2 className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">Expertise</h3>
              <p className="text-sm text-muted-foreground">
                AWS, Kubernetes, ArgoCD, Prometheus, Grafana, Terraform, and more
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <Award className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">Approach</h3>
              <p className="text-sm text-muted-foreground">
                Strategic thinking combined with hands-on implementation
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4">What I Do</h2>
          <p className="text-muted-foreground mb-6">
            I help engineering teams modernize their infrastructure and improve reliability through:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-8">
            <li className="flex gap-3">
              <span className="text-primary">→</span>
              <span><strong className="text-foreground">Kubernetes Platform Engineering:</strong> EKS cluster design, upgrades, and optimization</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">→</span>
              <span><strong className="text-foreground">Enterprise Observability:</strong> Complete Prometheus/Grafana/Loki/Tempo stack implementation</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">→</span>
              <span><strong className="text-foreground">GitOps & CI/CD:</strong> ArgoCD implementation and pipeline modernization</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">→</span>
              <span><strong className="text-foreground">Security & Compliance:</strong> Runtime security and policy automation</span>
            </li>
          </ul>

          <h2 className="text-3xl font-bold mb-4">Why Work With Me</h2>
          <p className="text-muted-foreground mb-6">
            I bring a unique combination of strategic thinking and deep technical execution:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-8">
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span><strong className="text-foreground">Proven Track Record:</strong> Successfully delivered complex multi-environment platform migrations</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span><strong className="text-foreground">Business Focus:</strong> I measure success in business impact, not just technical metrics</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span><strong className="text-foreground">Full-Stack Platform Engineering:</strong> From infrastructure to observability to developer experience</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span><strong className="text-foreground">GitOps Native:</strong> Everything version-controlled, automated, and reproducible</span>
            </li>
          </ul>

          <h2 className="text-3xl font-bold mb-4">Technologies</h2>
          <div className="not-prose mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                "AWS", "EKS", "Kubernetes", "ArgoCD", "Terraform", "AWS CDK",
                "Prometheus", "Grafana", "Loki", "Tempo", "Istio", "Kafka",
                "Bitbucket Pipelines", "Python", "Bash", "Docker", "Helm",
                "Falco", "Suricata", "Veracode", "PostgreSQL", "TimescaleDB"
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-border bg-gradient-to-br from-primary/10 via-background to-background p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold">Let's Work Together</h2>
          <p className="mb-6 text-muted-foreground">
            Ready to modernize your infrastructure? Let's discuss your challenges and goals.
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
    </div>
  );
}
