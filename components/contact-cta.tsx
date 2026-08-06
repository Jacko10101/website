"use client";

import Link from "next/link";
import { AsciiField } from "@/components/ascii-field";
import { profile } from "@/lib/profile";

/**
 * The one contact CTA, used everywhere a page ends. Previously four
 * near-identical copies with gradient buttons and glow shadows.
 */
export function ContactCTA({
  command = "say-hello",
  title = "Want to chat?",
  lede = "For teams putting AI workloads on Kubernetes, or platforms that need CI/CD and observability sorted by someone who has run them in production. Permanent or contract, remote-first, and I'll relocate for the right role. I usually reply within a day.",
}: {
  command?: string;
  title?: string;
  lede?: string;
}) {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <AsciiField className="opacity-50 [mask-image:radial-gradient(ellipse_65%_80%_at_50%_50%,black_0%,transparent_75%)]" />
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <p className="font-mono text-sm text-primary mb-4" aria-hidden>
              <span className="text-muted-foreground">$</span> {command}
            </p>
            <h2 className="font-mono font-semibold tracking-tight text-3xl sm:text-4xl md:text-5xl text-foreground mb-6">
              {title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
              {lede}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="px-8 py-4 rounded-md bg-primary text-primary-foreground font-mono font-semibold hover:bg-primary/90 transition-colors"
              >
                Say hello
              </Link>
              <a
                href="mailto:jack@devlinops.com"
                className="px-8 py-4 rounded-md border border-border text-foreground font-mono hover:border-primary/60 hover:text-primary transition-colors"
              >
                jack@devlinops.com
              </a>
            </div>

            <p className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground font-mono">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-hidden />
              {profile.availability.short}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
