"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";

export function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-40 bg-background overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Gradient orbs */}
        <motion.div
          style={{ y }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-green-500/10 blur-[120px]"
        />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[80px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[80px]" />
      </div>

      <div className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-green-400 font-mono text-sm mb-6 tracking-wider">
              {"<contact />"}
            </span>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-foreground">Let&apos;s </span>
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                talk.
              </span>
            </h2>

            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12">
              About a role, a project, or anything in this orbit. I usually reply within a day.
            </p>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/contact"
              className="group relative px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-black font-semibold rounded-xl hover:shadow-[0_0_50px_rgba(34,197,94,0.4)] transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Say hello</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </Link>

            <a
              href="mailto:jack@devlinops.com"
              className="px-10 py-5 border-2 border-gray-700 text-gray-300 font-semibold rounded-xl hover:border-green-500/50 hover:text-green-400 hover:bg-green-500/5 transition-all duration-300"
            >
              jack@devlinops.com
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 flex justify-center gap-6"
          >
            <a
              href="https://github.com/Jacko10101"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-green-500/50 hover:bg-green-500/10 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 00-3.16 19.5c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34a2.65 2.65 0 00-1.1-1.46c-.91-.62.07-.6.07-.6a2.1 2.1 0 011.53 1.03 2.13 2.13 0 002.91.83 2.14 2.14 0 01.63-1.34c-2.22-.25-4.55-1.11-4.55-4.94a3.87 3.87 0 011.03-2.68 3.6 3.6 0 01.1-2.65s.84-.27 2.75 1.02a9.47 9.47 0 015 0c1.91-1.3 2.75-1.02 2.75-1.02a3.6 3.6 0 01.1 2.65 3.87 3.87 0 011.03 2.68c0 3.84-2.34 4.69-4.57 4.94a2.39 2.39 0 01.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0012 2z" />
              </svg>
            </a>
          </motion.div>

          {/* Availability indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12"
          >
            <span className="inline-flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Open to roles · summer 2026
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
