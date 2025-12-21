"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BuildSequence } from "./build-sequence";

// Cache indicator for return visitors
function CacheIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-900/90 border border-gray-800 backdrop-blur-sm font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-gray-400">
              Served from <span className="text-green-400">edge cache</span>
            </span>
            <span className="text-gray-600">• 23ms</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Magnetic button component for premium feel
function MagneticButton({
  children,
  href,
  variant = "primary",
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.15, y: y * 0.15 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variants = {
    primary: "bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold hover:shadow-[0_0_40px_rgba(34,197,94,0.4)]",
    secondary: "border-2 border-green-500/50 text-green-400 hover:bg-green-500/10 hover:border-green-400",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5",
  };

  const content = (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
      className={`relative px-8 py-4 rounded-xl transition-all duration-300 ${variants[variant]}`}
    >
      {variant === "primary" && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}

// Floating orb background element
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        initial={{ x: "-30%", y: "-20%" }}
        animate={{
          x: ["-30%", "-25%", "-30%"],
          y: ["-20%", "-25%", "-20%"],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
          filter: "blur(50px)",
          right: "-10%",
          bottom: "10%",
        }}
        animate={{
          x: ["0%", "5%", "0%"],
          y: ["0%", "-5%", "0%"],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
          right: "20%",
          top: "20%",
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// Animated grid background
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green-500/30 to-transparent"
        initial={{ top: "-10%" }}
        animate={{ top: "110%" }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_70%)]" />
    </div>
  );
}

// Main hero component
export function HeroJourney() {
  const [phase, setPhase] = useState<"loading" | "building" | "revealing" | "complete">("loading");
  const [showCacheIndicator, setShowCacheIndicator] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.95]);
  const springY = useSpring(y, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const seen = localStorage.getItem("build-seen");
    if (seen === "true") {
      setPhase("complete");
      setShowCacheIndicator(true);
    } else {
      setPhase("building");
    }
  }, []);

  const handleBuildComplete = () => {
    setPhase("revealing");
    localStorage.setItem("build-seen", "true");
    // Longer reveal time for smoother transition
    setTimeout(() => {
      setPhase("complete");
    }, 1500);
  };

  // Only animate hero content when revealing or complete
  const shouldAnimate = phase === "revealing" || phase === "complete";

  // Show nothing until we know what to display (prevents flash)
  if (phase === "loading") {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <>
      {/* Build sequence overlay */}
      {phase === "building" && <BuildSequence onComplete={handleBuildComplete} />}

      {/* Cache indicator for return visitors */}
      {showCacheIndicator && phase === "complete" && <CacheIndicator />}

      {/* Main hero content - always rendered but animated based on phase */}
      <motion.section
        ref={containerRef}
        style={{ opacity: phase === "complete" ? opacity : 1, scale: phase === "complete" ? scale : 1 }}
        className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden"
      >
        {/* Background layers */}
        <GridBackground />
        <FloatingOrbs />

        {/* Main content */}
        <motion.div
          style={{ y: phase === "complete" ? springY : 0 }}
          className="container px-4 relative z-10"
        >
          <div className="max-w-5xl mx-auto text-center">
            {/* Eyebrow text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-mono">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Available for new projects
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
            >
              <span className="text-foreground">Platform</span>
              <br />
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Engineer
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-xl sm:text-2xl text-muted-foreground mb-3 font-light"
            >
              Building platforms that let developers focus on what matters
            </motion.p>

            {/* Target audience */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-base text-muted-foreground/70 mb-8 font-light"
            >
              Helping early-stage and growth companies scale their infrastructure
            </motion.p>

            {/* Key focus areas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {["Kubernetes", "AWS", "GitOps", "Observability", "CI/CD"].map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={shouldAnimate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: 1.0 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="px-4 py-2 text-sm font-medium rounded-full bg-secondary text-secondary-foreground border border-border"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <MagneticButton href="/projects" variant="primary">
                View Case Studies
              </MagneticButton>

              <MagneticButton href="/contact" variant="secondary">
                Get in Touch
              </MagneticButton>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-gray-500"
          >
            <span className="text-xs font-mono">scroll</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.section>
    </>
  );
}
