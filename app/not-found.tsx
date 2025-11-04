"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function NotFound() {
  const pathname = usePathname();
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    // Simple typo detection for common routes
    const routes = [
      "/about",
      "/services",
      "/projects",
      "/contact",
      "/projects/cicd-gitops",
      "/projects/dora-devex",
      "/projects/observability",
    ];

    // Find closest match (simple Levenshtein distance would be better)
    const closest = routes.find((route) => {
      const path = pathname.toLowerCase();
      return (
        route.includes(path.substring(0, 5)) ||
        path.includes(route.substring(0, 5))
      );
    });

    setSuggestion(closest || "/");
  }, [pathname]);

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Terminal Window */}
        <div className="rounded-lg border border-border bg-card shadow-2xl overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-3">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <span className="ml-2 text-xs text-muted-foreground font-mono">
              bash - 404: command not found
            </span>
          </div>

          {/* Terminal Body */}
          <div className="bg-card p-8 font-mono text-sm space-y-4">
            <div className="flex items-start gap-2">
              <span className="text-primary">$</span>
              <div className="flex-1">
                <span className="text-foreground">cd {pathname}</span>
              </div>
            </div>

            <div className="ml-4 space-y-2 text-red-400">
              <p>bash: cd: {pathname}: No such file or directory</p>
            </div>

            {suggestion && (
              <div className="ml-4 space-y-2 text-yellow-400">
                <p>Did you mean: <Link href={suggestion} className="text-primary hover:underline">{suggestion}</Link>?</p>
              </div>
            )}

            <div className="flex items-start gap-2 mt-6">
              <span className="text-primary">$</span>
              <div className="flex-1">
                <span className="text-foreground">ls ~/devlinops</span>
              </div>
            </div>

            <div className="ml-4 grid grid-cols-2 gap-2 text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">
                home/
              </Link>
              <Link href="/about" className="hover:text-primary transition-colors">
                about/
              </Link>
              <Link href="/services" className="hover:text-primary transition-colors">
                services/
              </Link>
              <Link href="/projects" className="hover:text-primary transition-colors">
                projects/
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors">
                contact/
              </Link>
            </div>

            <div className="flex items-start gap-2 mt-6">
              <span className="text-primary">$</span>
              <div className="flex-1">
                <span className="text-foreground">echo $HELP</span>
              </div>
            </div>

            <div className="ml-4 text-muted-foreground space-y-2">
              <p>Looks like you've hit a 404. Here are some commands to get you back on track:</p>
              <div className="mt-4 space-y-2 text-xs">
                <div>
                  <span className="text-primary">cd /</span>
                  <span className="ml-8 text-muted-foreground/70">Return to homepage</span>
                </div>
                <div>
                  <span className="text-primary">cd /projects</span>
                  <span className="ml-2 text-muted-foreground/70">View case studies</span>
                </div>
                <div>
                  <span className="text-primary">cd /contact</span>
                  <span className="ml-3 text-muted-foreground/70">Get in touch</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 mt-6">
              <span className="text-primary">$</span>
              <div className="flex-1">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  className="inline-block w-2 h-4 bg-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
          >
            <span className="font-mono">cd /</span>
            <span>Go Home</span>
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground hover:scale-105"
          >
            <span className="font-mono">ls projects/</span>
            <span>View Projects</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
