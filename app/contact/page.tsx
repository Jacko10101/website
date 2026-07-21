import { Mail, Github, Linkedin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { profile } from "@/lib/profile";

export const metadata = {
  title: "Contact",
  description:
    "Drop Jack Devlin a note. Platform engineer — available from September 2026 for contract or full-time work, remote-first.",
};

export default function ContactPage() {
  return (
    <div className="container px-4 pt-32 pb-16 md:px-6 md:pb-20">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-sm text-primary mb-3" aria-hidden>
          <span className="text-muted-foreground">$</span> mail jack@devlinops.com
        </p>
        <h1 className="mb-6 font-mono font-semibold tracking-tight text-4xl sm:text-5xl md:text-6xl">
          Want to chat?
        </h1>
        <p className="mb-4 text-lg text-muted-foreground leading-relaxed">
          The fastest way to reach me is the form below or just an email.
          Available from September 2026. Contracting (Outside IR35 or
          international equivalent) suits best, but I&apos;m open to full-time
          roles — and to relocating for the right one. Remote-first either way.
        </p>
        <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
          Best fit: teams running AI workloads on Kubernetes, platforms that
          need observability or GitOps brought up to a real standard, or
          anywhere the gap between data science and production is causing pain.
          Always happy to talk shop.
        </p>

        {profile.visaNote && (
          <p className="mb-12 -mt-6 font-mono text-sm text-muted-foreground border-l-2 border-primary/50 pl-4">
            {profile.visaNote}
          </p>
        )}

        <div className="mb-16 rounded-lg border border-border bg-card p-6 md:p-8">
          <h2 className="mb-6 font-mono font-semibold tracking-tight text-2xl">Send a message</h2>
          <ContactForm />
        </div>

        <h2 className="mb-6 font-mono font-semibold tracking-tight text-2xl">Or find me elsewhere</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="mailto:jack@devlinops.com"
            className="group block rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="flex flex-col gap-4">
              <div className="rounded-lg bg-primary/10 p-3 w-fit">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 text-xl font-semibold group-hover:text-primary transition-colors">
                  Email
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Best for anything substantial.
                </p>
                <p className="text-sm font-medium text-primary">
                  jack@devlinops.com
                </p>
              </div>
            </div>
          </a>

          <a
            href="https://github.com/Jacko10101"
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="flex flex-col gap-4">
              <div className="rounded-lg bg-primary/10 p-3 w-fit">
                <Github className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 text-xl font-semibold group-hover:text-primary transition-colors">
                  GitHub
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  The occasional side project and dotfile.
                </p>
                <p className="text-sm font-medium text-primary">@Jacko10101</p>
              </div>
            </div>
          </a>

          <a
            href="https://linkedin.com/in/jack-devlin-5a0902148"
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="flex flex-col gap-4">
              <div className="rounded-lg bg-primary/10 p-3 w-fit">
                <Linkedin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 text-xl font-semibold group-hover:text-primary transition-colors">
                  LinkedIn
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  The formal version, kept current.
                </p>
                <p className="text-sm font-medium text-primary">jack-devlin</p>
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
