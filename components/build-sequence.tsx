"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BuildSequenceProps {
  onComplete: () => void;
}

type LogLine = {
  text: string;
  type: "command" | "output" | "success" | "info" | "warning" | "progress";
  delay: number;
};

const buildScript: LogLine[] = [
  { text: "$ git clone https://github.com/jacko10101/devlinops.git", type: "command", delay: 0 },
  { text: "Cloning into 'devlinops'...", type: "output", delay: 300 },
  { text: "remote: Enumerating objects: 247, done.", type: "output", delay: 200 },
  { text: "remote: Counting objects: 100% (247/247), done.", type: "output", delay: 150 },
  { text: "remote: Compressing objects: 100% (156/156), done.", type: "output", delay: 150 },
  { text: "Receiving objects: 100% (247/247), 2.14 MiB | 12.4 MiB/s, done.", type: "output", delay: 200 },
  { text: "Resolving deltas: 100% (89/89), done.", type: "output", delay: 100 },
  { text: "", type: "output", delay: 50 },
  { text: "$ cd devlinops && npm install", type: "command", delay: 250 },
  { text: "", type: "output", delay: 100 },
  { text: "added 184 packages in 1.8s", type: "success", delay: 400 },
  { text: "", type: "output", delay: 50 },
  { text: "$ npm run build", type: "command", delay: 300 },
  { text: "", type: "output", delay: 100 },
  { text: "▲ Next.js 16.1.0", type: "info", delay: 150 },
  { text: "", type: "output", delay: 50 },
  { text: "   Creating optimized production build...", type: "output", delay: 200 },
  { text: "   ✓ Compiled successfully in 2.3s", type: "success", delay: 350 },
  { text: "   ✓ Linting and type checking", type: "success", delay: 150 },
  { text: "   ✓ Collecting page data", type: "success", delay: 150 },
  { text: "   ✓ Generating static pages (11/11)", type: "success", delay: 200 },
  { text: "   ✓ Finalizing optimization", type: "success", delay: 150 },
  { text: "", type: "output", delay: 50 },
  { text: "$ npm run deploy", type: "command", delay: 300 },
  { text: "", type: "output", delay: 100 },
  { text: "▲ Deploying to Vercel...", type: "info", delay: 200 },
  { text: "PROGRESS_BAR", type: "progress", delay: 600 },
  { text: "", type: "output", delay: 50 },
  { text: "✓ Deployed to production", type: "success", delay: 150 },
  { text: "🚀 https://devlinops.com", type: "success", delay: 200 },
];

function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 500;
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + increment + Math.random() * 2, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const width = Math.round(progress);
  const filled = Math.floor(width / 5);
  const empty = 20 - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);

  return (
    <span className="text-green-400">
      {bar} {width}%
    </span>
  );
}

function Cursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.5, repeat: Infinity }}
      className="inline-block w-2 h-4 bg-green-400 ml-1 align-middle"
    />
  );
}

export function BuildSequence({ onComplete }: BuildSequenceProps) {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"building" | "revealing" | "done">("building");
  const [showCursor, setShowCursor] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex >= buildScript.length) {
      setShowCursor(false);
      // Start reveal phase after a moment to appreciate the completion
      setTimeout(() => {
        setPhase("revealing");
        // Notify parent so hero can start animating
        onComplete();
        // Keep terminal visible longer during exit
        setTimeout(() => {
          setPhase("done");
        }, 1200);
      }, 500);
      return;
    }

    const currentLine = buildScript[currentIndex];
    const timeout = setTimeout(() => {
      setLines((prev) => [...prev, currentLine]);
      setCurrentIndex((prev) => prev + 1);

      // Auto-scroll to bottom
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, currentLine.delay);

    return () => clearTimeout(timeout);
  }, [currentIndex, onComplete]);

  const getLineStyle = (type: LogLine["type"]) => {
    switch (type) {
      case "command":
        return "text-white font-semibold";
      case "success":
        return "text-green-400";
      case "info":
        return "text-cyan-400";
      case "warning":
        return "text-yellow-400";
      case "progress":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  if (phase === "done") return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{
        opacity: phase === "revealing" ? 0 : 1,
        y: phase === "revealing" ? -30 : 0,
      }}
      transition={{
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
    >
      {/* Background that fades separately - slower */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "revealing" ? 0 : 1 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="absolute inset-0 bg-black"
      />

      {/* Terminal container - graceful exit */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{
          opacity: phase === "revealing" ? 0 : 1,
          y: phase === "revealing" ? -60 : 0,
          scale: phase === "revealing" ? 0.95 : 1,
        }}
        transition={{
          duration: phase === "revealing" ? 1.0 : 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full max-w-3xl relative z-10"
      >
        {/* Terminal window */}
        <div className="rounded-lg border border-gray-800 bg-gray-950 shadow-2xl overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="ml-2 text-xs text-gray-500 font-mono">
              bash — devlinops
            </span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-gray-600 font-mono">zsh</span>
            </div>
          </div>

          {/* Terminal body */}
          <div
            ref={containerRef}
            className="p-4 font-mono text-sm h-[350px] overflow-y-auto"
          >
            {lines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1 }}
                className={`${getLineStyle(line.type)} leading-relaxed`}
              >
                {line.type === "progress" ? (
                  <ProgressBar />
                ) : (
                  line.text || "\u00A0"
                )}
              </motion.div>
            ))}
            {showCursor && (
              <div className="flex items-center">
                <span className="text-gray-500">$</span>
                <Cursor />
              </div>
            )}
          </div>
        </div>

        {/* Status text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "revealing" ? 0 : 1 }}
          transition={{ delay: 1, duration: 0.3 }}
          className="text-center text-xs text-gray-600 mt-4 font-mono"
        >
          {phase === "building" ? "building your experience..." : ""}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
