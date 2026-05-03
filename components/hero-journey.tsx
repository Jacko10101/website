"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BuildSequence } from "./build-sequence";

function CacheIndicator() {
  const [visible, setVisible] = useState(true);
  const [ttfb, setTtfb] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.performance) {
      const nav = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming | undefined;
      if (nav) {
        const t = Math.round(nav.responseStart - nav.startTime);
        if (t > 0 && t < 5000) setTtfb(`${t}ms`);
      }
    }
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
            {ttfb && <span className="text-gray-600">• {ttfb}</span>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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

export function HeroJourney() {
  const [showBuildSequence, setShowBuildSequence] = useState(false);
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
      setShowCacheIndicator(true);
    } else {
      setShowBuildSequence(true);
    }
  }, []);

  const handleBuildComplete = () => {
    localStorage.setItem("build-seen", "true");
    setShowBuildSequence(false);
  };

  return (
    <>
      {showBuildSequence && <BuildSequence onComplete={handleBuildComplete} />}

      {showCacheIndicator && <CacheIndicator />}

      <motion.section
        ref={containerRef}
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden"
      >
        <GridBackground />
        <FloatingOrbs />

        <motion.div
          style={{ y: springY }}
          className="container px-4 relative z-10"
        >
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
              <span className="text-foreground">Platform &amp; MLOps</span>
              <br />
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Engineer
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground mb-3 font-light">
              I get models off laptops and onto clusters that don&apos;t fall over.
            </p>

            <p className="text-base text-muted-foreground/70 mb-8 font-light max-w-2xl mx-auto">
              Production infrastructure for AI workloads and distributed systems — Kubernetes, GPU scheduling, GitOps, observability. MSc AI finishing August 2026.
              <span className="text-green-400/80 block mt-2">Available for fully remote B2B contracts starting September 2026.</span>
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {["Kubernetes", "MLOps", "AWS", "GitOps", "Observability", "PyTorch"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 text-sm font-medium rounded-full bg-secondary text-secondary-foreground border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <MagneticButton href="/projects/heimdall" variant="primary">
                See Heimdall
              </MagneticButton>

              <MagneticButton href="/contact" variant="secondary">
                Say hello
              </MagneticButton>

              <a
                href="/cv.pdf"
                className="inline-flex items-center gap-2 px-6 py-4 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download CV
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
