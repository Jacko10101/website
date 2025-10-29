import { Mail, Github, Linkedin } from "lucide-react";

export const metadata = {
  title: "Contact | DevlinOps",
  description: "Get in touch with DevlinOps for DevOps and Platform Engineering consulting.",
};

export default function ContactPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Get in Touch
        </h1>
        <p className="mb-12 text-lg text-muted-foreground">
          Interested in working together? I'd love to hear about your infrastructure challenges and goals.
        </p>

        <div className="space-y-8">
          {/* Email */}
          <a
            href="mailto:jack@devlinops.com"
            className="group block rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="mb-1 text-xl font-semibold group-hover:text-primary transition-colors">
                  Email
                </h2>
                <p className="text-sm text-muted-foreground mb-2">
                  Best for project inquiries and consultations
                </p>
                <p className="text-sm font-medium text-primary">
                  jack@devlinops.com
                </p>
              </div>
            </div>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/Jacko10101"
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Github className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="mb-1 text-xl font-semibold group-hover:text-primary transition-colors">
                  GitHub
                </h2>
                <p className="text-sm text-muted-foreground mb-2">
                  View my open source contributions and projects
                </p>
                <p className="text-sm font-medium text-primary">
                  @Jacko10101
                </p>
              </div>
            </div>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/jack-devlin"
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Linkedin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="mb-1 text-xl font-semibold group-hover:text-primary transition-colors">
                  LinkedIn
                </h2>
                <p className="text-sm text-muted-foreground mb-2">
                  Connect with me professionally
                </p>
                <p className="text-sm font-medium text-primary">
                  Jack Devlin
                </p>
              </div>
            </div>
          </a>
        </div>

        <div className="mt-12 rounded-lg border border-border bg-muted p-6">
          <h2 className="mb-4 text-lg font-semibold">What to Include in Your Message</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="text-primary">→</span>
              <span>Brief description of your current infrastructure</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">→</span>
              <span>Challenges you're facing or goals you want to achieve</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">→</span>
              <span>Timeline and team size</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">→</span>
              <span>Preferred engagement model (contract, consulting, advisory)</span>
            </li>
          </ul>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Typically respond within 24 hours
        </p>
      </div>
    </div>
  );
}
