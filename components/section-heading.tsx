/**
 * The site's one heading grammar: a solid white mono heading, optionally with
 * a green mono command line above it. The command eyebrow is reserved for the
 * set pieces (career query, pipeline story) — ordinary sections go without.
 * Headings render instantly; no entrance animation, no decode effect.
 */
export function SectionHeading({
  command,
  title,
  lede,
  align = "left",
  as: Tag = "h2",
  index,
}: {
  command?: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  index?: string;
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`relative max-w-3xl mb-14 ${alignment}`}>
      {index && (
        <span
          aria-hidden
          className="text-outline absolute -top-14 right-0 lg:-right-48 font-mono font-bold text-[9rem] sm:text-[12rem] leading-none pointer-events-none select-none"
        >
          {index}
        </span>
      )}
      {command && (
        <p className="font-mono text-sm text-primary mb-3" aria-hidden>
          <span className="text-muted-foreground">$</span> {command}
        </p>
      )}
      <Tag className="font-mono font-semibold tracking-tight text-4xl sm:text-5xl md:text-6xl text-foreground">
        {title}
      </Tag>
      {lede && (
        <p className={`mt-4 text-muted-foreground text-lg leading-relaxed ${align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl"}`}>
          {lede}
        </p>
      )}
    </div>
  );
}
