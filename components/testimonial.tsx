"use client";

import { motion } from "framer-motion";
import { profile } from "@/lib/profile";

/**
 * Renders only when profile.testimonial is filled in — until then this
 * component outputs nothing at all.
 */
export function TestimonialBlock() {
  const testimonial = profile.testimonial;
  if (!testimonial) return null;

  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <motion.figure
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto border-l-2 border-primary pl-8 py-2"
        >
          <blockquote className="text-xl sm:text-2xl text-foreground/90 leading-relaxed mb-4">
            “{testimonial.quote}”
          </blockquote>
          <figcaption className="font-mono text-sm text-muted-foreground">
            <span className="text-primary">—</span> {testimonial.attribution}
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
