import { Mail, Github } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Contact",
  description:
    "Drop Jack Devlin a note. Platform engineer, open to roles for summer 2026.",
};

export default function ContactPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Want to chat?
        </h1>
        <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
          The fastest way to reach me is the form below or just an email. Open
          to platform / SRE / DevOps roles starting summer 2026, and always
          happy to talk shop about anything in this area.
        </p>

        <div className="mb-16 rounded-lg border border-border bg-card p-6 md:p-8">
          <h2 className="mb-6 text-2xl font-bold">Send a message</h2>
          <ContactForm />
        </div>

        <h2 className="mb-6 text-2xl font-bold">Or find me elsewhere</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <a
            href="mailto:jack@devlinops.com"
            className="group block rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="flex flex-col gap-4">
              <div className="rounded-lg bg-primary/10 p-3 w-fit">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="mb-1 text-xl font-semibold group-hover:text-primary transition-colors">
                  Email
                </h2>
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
                <h2 className="mb-1 text-xl font-semibold group-hover:text-primary transition-colors">
                  GitHub
                </h2>
                <p className="text-sm text-muted-foreground mb-2">
                  Side projects and the occasional dotfile.
                </p>
                <p className="text-sm font-medium text-primary">@Jacko10101</p>
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
