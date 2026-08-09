"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TerminalWindow } from "@/components/terminal-window";

/** Where the backoff settles. Past this the counter would just be noise. */
const MAX_RESTARTS = 3;

export default function NotFound() {
  const pathname = usePathname();
  const [restarts, setRestarts] = useState(0);
  const [timeAgo, setTimeAgo] = useState("0s");

  useEffect(() => {
    // Restarts climb to the backoff threshold and stop. A tab left open all
    // afternoon shouldn't be reporting four hundred of them.
    const interval = setInterval(() => {
      setRestarts((r) => {
        if (r >= MAX_RESTARTS - 1) clearInterval(interval);
        return Math.min(MAX_RESTARTS, r + 1);
      });
    }, 3000);

    // Update time ago
    const startTime = Date.now();
    const timeInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      if (elapsed < 60) {
        setTimeAgo(`${elapsed}s`);
      } else {
        setTimeAgo(`${Math.floor(elapsed / 60)}m${elapsed % 60}s`);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  const podName = `page${pathname.replace(/\//g, "-")}-7f8d9-xk4m2`;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <h1 className="sr-only">404 · page not found</h1>

        {/* Alert Banner */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex items-center gap-3 rounded-lg border border-error/30 bg-error/10 px-4 py-3"
        >
          <div className="flex-shrink-0">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 rounded-full bg-error"
            />
          </div>
          <div className="font-mono text-sm">
            <span className="text-error">ALERT:</span>
            <span className="text-error/80 ml-2">PodCrashLoopBackOff</span>
          </div>
        </motion.div>

        {/* Main Terminal */}
        <TerminalWindow title="kubectl · namespace: production" className="shadow-2xl">
          <div className="p-6 font-mono text-sm space-y-4">
            {/* Command */}
            <div className="flex items-center gap-2">
              <span className="text-primary">❯</span>
              <span className="text-foreground/90">kubectl get pod {podName.substring(0, 30)}...</span>
            </div>

            {/* Pod Status Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-muted-foreground border-b border-border">
                    <th className="pb-2 pr-4">NAME</th>
                    <th className="pb-2 pr-4">READY</th>
                    <th className="pb-2 pr-4">STATUS</th>
                    <th className="pb-2 pr-4">RESTARTS</th>
                    <th className="pb-2">AGE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-foreground/90">
                    <td className="py-2 pr-4 text-primary">{podName.substring(0, 25)}...</td>
                    <td className="py-2 pr-4 text-error">0/1</td>
                    <td className="py-2 pr-4">
                      <span className="text-error">CrashLoopBackOff</span>
                    </td>
                    <td className="py-2 pr-4 text-warn">{restarts}</td>
                    <td className="py-2 text-muted-foreground">{timeAgo}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* What actually happened, in plain English */}
            <div className="text-xs text-muted-foreground pt-2">
              There is no page at <span className="text-foreground/90">{pathname}</span>.
              Either it moved or the link was wrong. The two below both work.
            </div>

            {/* Blinking cursor */}
            <div className="flex items-center gap-2 mt-4">
              <span className="text-primary">❯</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-primary"
              />
            </div>
          </div>
        </TerminalWindow>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-3 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
          >
            <span className="font-mono text-xs opacity-70">kubectl apply -f</span>
            <span className="font-semibold">homepage.yaml</span>
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-3 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground/90 transition-all hover:bg-card/70 hover:border-primary/50"
          >
            <span className="font-mono text-xs opacity-70">kubectl get</span>
            <span>projects</span>
          </Link>
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-muted-foreground mt-6 font-mono">
          Pod scheduled on node: devlinops-worker-1 • Cluster: production-eu-west-1
        </p>
      </motion.div>
    </div>
  );
}
