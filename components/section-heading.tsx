/**
 * The site's one heading grammar: a small mono label in the accent, then the
 * heading in the display face.
 *
 * The 192px outline numeral that used to sit behind this is gone. It was pure
 * decoration, it was the thing pushing the page sideways on tablets, and the
 * index it carried says more as four characters in the label than as a
 * watermark. Headings render instantly; no entrance animation.
 */
export function SectionHeading({
  label,
  title,
  lede,
  align = "left",
  as: Tag = "h2",
  index,
}: {
  /** Small caps label above the heading, e.g. "case studies". */
  label?: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  /** Section number, rendered as part of the label rather than behind it. */
  index?: string;
}) {
  const centered = align === "center";
  const eyebrow = [index, label].filter(Boolean).join(" · ");

  return (
    <div className={`mb-14 max-w-4xl ${centered ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}

      <Tag className="display text-4xl text-foreground sm:text-5xl md:text-6xl">
        {title}
      </Tag>

      {lede && (
        <p
          className={`mt-6 text-lg leading-relaxed text-muted-foreground ${
            centered ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
