"use client";

import { motion } from "framer-motion";
import { DecodeText } from "@/components/decode-text";

/**
 * The site's one heading grammar: a green mono command line above a solid
 * white mono heading. Replaces the gradient-clipped headings and the
 * `<expertise />` eyebrow pattern.
 */
export function SectionHeading({
  command,
  title,
  lede,
  align = "left",
  as: Tag = "h2",
  index,
}: {
  command: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  index?: string;
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`relative max-w-3xl mb-14 ${alignment}`}
    >
      {index && (
        <span
          aria-hidden
          className="text-outline absolute -top-14 right-0 sm:-right-24 lg:-right-48 font-mono font-bold text-[9rem] sm:text-[12rem] leading-none pointer-events-none select-none"
        >
          {index}
        </span>
      )}
      <p className="font-mono text-sm text-primary mb-3" aria-hidden>
        <span className="text-muted-foreground">$</span> {command}
      </p>
      <Tag className="font-mono font-semibold tracking-tight text-4xl sm:text-5xl md:text-6xl text-foreground">
        <DecodeText text={title} />
      </Tag>
      {lede && (
        <p className={`mt-4 text-muted-foreground text-lg leading-relaxed ${align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl"}`}>
          {lede}
        </p>
      )}
    </motion.div>
  );
}
