import Link from "next/link";

/**
 * The one contact CTA, used everywhere a page ends.
 *
 * No AsciiField here: the hero already runs one canvas per page and this sits
 * at the bottom of every page, so short viewports had two of them live at
 * once. No availability line either — the footer states it directly below.
 */
export function ContactCTA({
  title = "Hiring for a platform team?",
  lede = "I'm most useful to teams putting AI workloads on Kubernetes, or to platforms that need CI/CD and observability sorted properly. I usually reply within a day.",
}: {
  title?: string;
  lede?: string;
}) {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <p className="eyebrow mb-5">Contact</p>
            <h2 className="display text-3xl sm:text-4xl md:text-5xl text-foreground mb-6">
              {title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
              {lede}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="px-8 py-4 rounded-md bg-primary text-primary-foreground font-mono font-semibold hover:bg-primary/90 active:bg-primary/80 transition-colors"
              >
                Say hello
              </Link>
              <a
                href="mailto:jack@devlinops.com"
                className="px-8 py-4 rounded-md border border-border text-foreground font-mono hover:border-primary/60 hover:text-primary active:border-primary active:bg-primary/10 transition-colors"
              >
                jack@devlinops.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
