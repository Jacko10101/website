import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, Briefcase, Code2 } from "lucide-react";

export const metadata = {
  title: "About | DevlinOps",
  description: "Learn about Jack Devlin and DevlinOps - expert DevOps and Platform Engineering consulting.",
};

export default function AboutPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12 mb-12">
          <div className="flex-1">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Hey, I&apos;m Jack
            </h1>
            <p className="text-xl text-muted-foreground">
              I&apos;m a platform engineer who loves building infrastructure that just works.
              I spend most of my time helping teams wrangle Kubernetes, set up observability that actually helps,
              and build CI/CD pipelines that don&apos;t make developers want to cry.
            </p>
          </div>

          <div className="flex-shrink-0">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-lg overflow-hidden border-2 border-primary/20 shadow-xl">
              <Image
                src="/jack-photo.jpg"
                alt="Jack Devlin"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">

          <div className="grid gap-6 md:grid-cols-3 not-prose mb-12">
            <div className="rounded-lg border border-border bg-card p-6">
              <Briefcase className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">Experience</h3>
              <p className="text-sm text-muted-foreground">
                750+ tickets delivered across production Kubernetes platforms
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
                Pragmatic solutions that actually solve problems
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4">What I&apos;m Good At</h2>
          <p className="text-muted-foreground mb-6">
            I&apos;ve spent the last few years building and scaling platforms. Here&apos;s what I focus on:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-8">
            <li className="flex gap-3">
              <span className="text-primary">→</span>
              <span><strong className="text-foreground">Kubernetes Platform Engineering:</strong> EKS cluster design, upgrades, and optimisation</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">→</span>
              <span><strong className="text-foreground">Observability Stacks:</strong> Prometheus/Grafana/Loki/Tempo implementation</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">→</span>
              <span><strong className="text-foreground">GitOps & CI/CD:</strong> ArgoCD implementation and pipeline modernisation</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">→</span>
              <span><strong className="text-foreground">Security & Compliance:</strong> Runtime security and policy automation</span>
            </li>
          </ul>

          <h2 className="text-3xl font-bold mb-4">How I Work</h2>
          <p className="text-muted-foreground mb-6">
            I&apos;m not about buzzwords or over-engineering. Here&apos;s my approach:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-8">
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span><strong className="text-foreground">Pragmatic over perfect:</strong> I build what actually solves your problem, not what looks good in a Medium article</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span><strong className="text-foreground">Business impact first:</strong> Faster deploys and fewer incidents matter more than cool tech</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span><strong className="text-foreground">End-to-end ownership:</strong> I don&apos;t just consult and disappear—I stick around to make sure it works</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <span><strong className="text-foreground">GitOps everything:</strong> If it&apos;s not in Git, it doesn&apos;t exist</span>
            </li>
          </ul>

          <h2 className="text-3xl font-bold mb-4">What I&apos;m Up To Now</h2>
          <div className="not-prose mb-8">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <span className="text-2xl">🎓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Currently Studying</h3>
                  <p className="text-muted-foreground mb-3">
                    <strong className="text-foreground">MSc in Artificial Intelligence</strong> (Full-time)
                    <br />
                    Building on my <strong className="text-foreground">BSc in Computer Science</strong> to explore the intersection of AI and platform engineering.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Excited about applying ML/AI to infrastructure automation, anomaly detection in observability systems, and intelligent platform tooling.
                  </p>
                </div>
              </div>
            </div>
          </div>

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
          <h2 className="mb-4 text-2xl font-bold">Sound Like a Fit?</h2>
          <p className="mb-6 text-muted-foreground">
            If you&apos;re dealing with Kubernetes chaos, missing observability, or slow deployments—let&apos;s chat.
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
