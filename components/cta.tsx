"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-lg border border-border bg-gradient-to-br from-primary/10 via-background to-background p-8 md:p-12 lg:p-16"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Let&apos;s Work Together
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Whether you need help with Kubernetes, want to build out observability,
              or just want to chat about platform engineering—I&apos;m here to help.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:gap-3 hover:scale-105"
              >
                Get in Touch
                <ArrowRight className="h-4 w-4 transition-all" />
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background px-8 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground hover:scale-105"
              >
                Learn More About Me
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
