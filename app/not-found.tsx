"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TerminalWindow } from "@/components/terminal-window";

export default function NotFound() {
  const pathname = usePathname();
  const [restarts, setRestarts] = useState(0);
  const [timeAgo, setTimeAgo] = useState("0s");

  useEffect(() => {
    // Simulate restart count increasing
    const interval = setInterval(() => {
      setRestarts((r) => r + 1);
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
        <h1 className="sr-only">404 — page not found</h1>

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
        <TerminalWindow title="kubectl — namespace: production" className="shadow-2xl">
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

            {/* Describe Command */}
            <div className="flex items-center gap-2 mt-6">
              <span className="text-primary">❯</span>
              <span className="text-foreground/90">kubectl describe pod {podName.substring(0, 20)}... | tail -20</span>
            </div>

            {/* Events */}
            <div className="bg-black/50 rounded-lg p-4 border border-border">
              <div className="text-muted-foreground text-xs mb-3">Events:</div>
              <div className="space-y-2 text-xs">
                <div className="flex gap-4">
                  <span className="text-muted-foreground w-16 flex-shrink-0">Warning</span>
                  <span className="text-warn w-24 flex-shrink-0">BackOff</span>
                  <span className="text-foreground/70">Back-off restarting failed container</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-muted-foreground w-16 flex-shrink-0">Warning</span>
                  <span className="text-error w-24 flex-shrink-0">Failed</span>
                  <span className="text-foreground/70">Error: Route "{pathname}" not found in cluster</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-muted-foreground w-16 flex-shrink-0">Normal</span>
                  <span className="text-primary w-24 flex-shrink-0">Pulled</span>
                  <span className="text-foreground/70">Container image "devlinops/404:latest" already present</span>
                </div>
              </div>
            </div>

            {/* Logs Command */}
            <div className="flex items-center gap-2 mt-6">
              <span className="text-primary">❯</span>
              <span className="text-foreground/90">kubectl logs {podName.substring(0, 20)}... --tail=5</span>
            </div>

            <div className="bg-black/50 rounded-lg p-4 border border-border text-xs space-y-1">
              <div><span className="text-muted-foreground">[ERROR]</span> <span className="text-error">404 - Page not found</span></div>
              <div><span className="text-muted-foreground">[INFO]</span> <span className="text-foreground/70">Requested path: {pathname}</span></div>
              <div><span className="text-muted-foreground">[INFO]</span> <span className="text-foreground/70">Searching for alternative routes...</span></div>
              <div><span className="text-muted-foreground">[WARN]</span> <span className="text-warn">No matching ingress rule found</span></div>
              <div><span className="text-muted-foreground">[INFO]</span> <span className="text-primary">Redirecting to healthy endpoints...</span></div>
            </div>

            {/* Suggested Fix */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="text-muted-foreground text-xs mb-3">Suggested remediation:</div>
              <div className="space-y-2 text-xs">
                <code className="block bg-card rounded px-3 py-2 text-primary">
                  kubectl port-forward svc/homepage 3000:3000
                </code>
              </div>
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
