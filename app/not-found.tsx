"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
        {/* Alert Banner */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3"
        >
          <div className="flex-shrink-0">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 rounded-full bg-red-500"
            />
          </div>
          <div className="font-mono text-sm">
            <span className="text-red-400">ALERT:</span>
            <span className="text-red-300 ml-2">PodCrashLoopBackOff</span>
          </div>
        </motion.div>

        {/* Main Terminal */}
        <div className="rounded-lg border border-gray-800 bg-gray-950 shadow-2xl overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-2">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-gray-500 font-mono">
                kubectl — bash
              </span>
            </div>
            <span className="text-xs text-gray-600 font-mono">
              namespace: production
            </span>
          </div>

          {/* Terminal Body */}
          <div className="p-6 font-mono text-sm space-y-4">
            {/* Command */}
            <div className="flex items-center gap-2">
              <span className="text-green-500">❯</span>
              <span className="text-gray-300">kubectl get pod {podName.substring(0, 30)}...</span>
            </div>

            {/* Pod Status Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-800">
                    <th className="pb-2 pr-4">NAME</th>
                    <th className="pb-2 pr-4">READY</th>
                    <th className="pb-2 pr-4">STATUS</th>
                    <th className="pb-2 pr-4">RESTARTS</th>
                    <th className="pb-2">AGE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-gray-300">
                    <td className="py-2 pr-4 text-cyan-400">{podName.substring(0, 25)}...</td>
                    <td className="py-2 pr-4 text-red-400">0/1</td>
                    <td className="py-2 pr-4">
                      <span className="text-red-400">CrashLoopBackOff</span>
                    </td>
                    <td className="py-2 pr-4 text-yellow-400">{restarts}</td>
                    <td className="py-2 text-gray-500">{timeAgo}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Describe Command */}
            <div className="flex items-center gap-2 mt-6">
              <span className="text-green-500">❯</span>
              <span className="text-gray-300">kubectl describe pod {podName.substring(0, 20)}... | tail -20</span>
            </div>

            {/* Events */}
            <div className="bg-black/50 rounded-lg p-4 border border-gray-800">
              <div className="text-gray-500 text-xs mb-3">Events:</div>
              <div className="space-y-2 text-xs">
                <div className="flex gap-4">
                  <span className="text-gray-600 w-16 flex-shrink-0">Warning</span>
                  <span className="text-yellow-500 w-24 flex-shrink-0">BackOff</span>
                  <span className="text-gray-400">Back-off restarting failed container</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600 w-16 flex-shrink-0">Warning</span>
                  <span className="text-red-500 w-24 flex-shrink-0">Failed</span>
                  <span className="text-gray-400">Error: Route "{pathname}" not found in cluster</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600 w-16 flex-shrink-0">Normal</span>
                  <span className="text-blue-500 w-24 flex-shrink-0">Pulled</span>
                  <span className="text-gray-400">Container image "devlinops/404:latest" already present</span>
                </div>
              </div>
            </div>

            {/* Logs Command */}
            <div className="flex items-center gap-2 mt-6">
              <span className="text-green-500">❯</span>
              <span className="text-gray-300">kubectl logs {podName.substring(0, 20)}... --tail=5</span>
            </div>

            <div className="bg-black/50 rounded-lg p-4 border border-gray-800 text-xs space-y-1">
              <div><span className="text-gray-600">[ERROR]</span> <span className="text-red-400">404 - Page not found</span></div>
              <div><span className="text-gray-600">[INFO]</span> <span className="text-gray-400">Requested path: {pathname}</span></div>
              <div><span className="text-gray-600">[INFO]</span> <span className="text-gray-400">Searching for alternative routes...</span></div>
              <div><span className="text-gray-600">[WARN]</span> <span className="text-yellow-400">No matching ingress rule found</span></div>
              <div><span className="text-gray-600">[INFO]</span> <span className="text-green-400">Redirecting to healthy endpoints...</span></div>
            </div>

            {/* Suggested Fix */}
            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="text-gray-500 text-xs mb-3">Suggested remediation:</div>
              <div className="space-y-2 text-xs text-gray-400">
                <code className="block bg-gray-900 rounded px-3 py-2 text-green-400">
                  kubectl port-forward svc/homepage 3000:3000
                </code>
              </div>
            </div>

            {/* Blinking cursor */}
            <div className="flex items-center gap-2 mt-4">
              <span className="text-green-500">❯</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-green-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-3 rounded-lg bg-green-500 px-6 py-3 text-sm font-medium text-black transition-all hover:bg-green-400"
          >
            <span className="font-mono text-xs opacity-70">kubectl apply -f</span>
            <span className="font-semibold">homepage.yaml</span>
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-3 rounded-lg border border-gray-700 bg-gray-900 px-6 py-3 text-sm font-medium text-gray-300 transition-all hover:bg-gray-800 hover:border-gray-600"
          >
            <span className="font-mono text-xs opacity-70">kubectl get</span>
            <span>projects</span>
          </Link>
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-gray-600 mt-6 font-mono">
          Pod scheduled on node: devlinops-worker-1 • Cluster: production-eu-west-1
        </p>
      </motion.div>
    </div>
  );
}
