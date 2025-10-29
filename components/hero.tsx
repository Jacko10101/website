"use client";

import Link from "next/link";
import { ArrowRight, Terminal as TerminalIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Terminal } from "./terminal";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="grid-background absolute inset-0 opacity-50" />

      <div className="container relative px-4 py-20 md:px-6 md:py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-5xl text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm"
          >
            <TerminalIcon className="h-4 w-4 text-primary" />
            <span className="font-mono text-muted-foreground">
              Platform Engineering Excellence
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            I Help Teams{" "}
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Scale Their Infrastructure
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 text-lg text-muted-foreground sm:text-xl md:text-2xl"
          >
            From setting up Kubernetes clusters to building full observability stacks,
            <br className="hidden sm:block" />
            I&apos;ve been there and know what actually works in production.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/contact"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:gap-3"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-all" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              View Case Studies
            </Link>
          </motion.div>

          {/* Terminal Demo */}
          <Terminal />

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8"
          >
            <div>
              <div className="text-3xl font-bold text-primary">7500+</div>
              <div className="text-sm text-muted-foreground">Tickets Delivered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">AWS + K8s</div>
              <div className="text-sm text-muted-foreground">Cloud Native</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">GitOps</div>
              <div className="text-sm text-muted-foreground">ArgoCD Expert</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Observability</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
