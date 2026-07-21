"use client";

import { useRef, ReactNode } from "react";
import { motion, useInView, Variants } from "framer-motion";

// Fade up animation - the most common reveal
export function FadeUp({
  children,
  delay = 0,
  duration = 0.6,
  className = "",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger children - for lists and grids
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
  initialDelay = 0,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger item - use inside StaggerContainer
export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

// Animated grid background
export function GridPattern({ opacity = 0.02 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(color-mix(in oklab, var(--color-primary) 30%, transparent) 1px, transparent 1px),
          linear-gradient(90deg, color-mix(in oklab, var(--color-primary) 30%, transparent) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        opacity,
      }}
    />
  );
}

// Glass card component
export function GlassCard({
  children,
  className = "",
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`
        relative rounded-2xl border border-border
        bg-card/50 backdrop-blur-sm
        ${hover ? "transition-colors duration-200 hover:border-primary/30" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
