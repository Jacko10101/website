import type { Metadata } from "next";
import { Mail, Github, Download } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact",
  description:
    "Drop Jack Devlin a note. Platform engineer, available now for permanent or contract work, remote-first and open to relocating.",
  openGraph: {
    title: "Contact · Jack Devlin",
    description:
      "Drop Jack Devlin a note. Platform engineer, available now for permanent or contract work, remote-first and open to relocating.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="container pt-28 md:pt-36 pb-16 md:pb-20">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow mb-4">Contact</p>
        <h1 className="display mb-6 text-4xl text-foreground sm:text-5xl md:text-6xl">
          How to reach me
        </h1>
        <p className="mb-4 text-lg text-muted-foreground leading-relaxed">
          The form below or an email, whichever suits. I&apos;m available now,
          for permanent roles or contracts. I work remote-first and I&apos;m open
          to relocating.
        </p>
        <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
          Best fit: teams putting AI workloads on Kubernetes, or platforms that
          need observability and GitOps brought up to a real standard.
        </p>

        {profile.visaNote && (
          <p className="mb-12 font-mono text-sm text-muted-foreground border-l-2 border-primary/50 pl-4">
            {profile.visaNote}
          </p>
        )}

        <div className="mb-16 rounded-lg border border-border bg-card p-6 md:p-8">
          <h2 className="display mb-6 text-2xl text-foreground">Send a message</h2>
          <ContactForm />
        </div>

        <h2 className="display mb-6 text-2xl text-foreground">Or find me elsewhere</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="mailto:jack@devlinops.com"
            className="group block rounded-lg border border-border bg-card p-6 transition-[border-color,box-shadow] duration-300 hover:border-primary hover:shadow-[0_12px_48px_oklch(0.72_0.19_150_/_0.12)] active:border-primary/70"
          >
            <div className="flex flex-col gap-4">
              <div className="rounded-lg bg-primary/10 p-3 w-fit">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-mono font-semibold tracking-tight text-xl group-hover:text-primary transition-colors">
                  Email
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Best for anything substantial.
                </p>
                <p className="text-sm font-mono text-primary">
                  jack@devlinops.com
                </p>
              </div>
            </div>
          </a>

          <a
            href="https://github.com/Jacko10101"
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-lg border border-border bg-card p-6 transition-[border-color,box-shadow] duration-300 hover:border-primary hover:shadow-[0_12px_48px_oklch(0.72_0.19_150_/_0.12)] active:border-primary/70"
          >
            <div className="flex flex-col gap-4">
              <div className="rounded-lg bg-primary/10 p-3 w-fit">
                <Github className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-mono font-semibold tracking-tight text-xl group-hover:text-primary transition-colors">
                  GitHub
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Config for the homelab, and the scripts that run it.
                </p>
                <p className="text-sm font-mono text-primary">@Jacko10101</p>
              </div>
            </div>
          </a>

          <a
            href="/cv.pdf"
            download="jack-devlin-cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-lg border border-border bg-card p-6 transition-[border-color,box-shadow] duration-300 hover:border-primary hover:shadow-[0_12px_48px_oklch(0.72_0.19_150_/_0.12)] active:border-primary/70"
          >
            <div className="flex flex-col gap-4">
              <div className="rounded-lg bg-primary/10 p-3 w-fit">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-mono font-semibold tracking-tight text-xl group-hover:text-primary transition-colors">
                  CV
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Employers, dates and titles, on one page.
                </p>
                <p className="text-sm font-mono text-primary">
                  PDF · updated August 2026
                </p>
              </div>
            </div>
          </a>
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          I usually reply within a day.
        </p>
      </div>
    </div>
  );
}
