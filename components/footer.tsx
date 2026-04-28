"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Build info - these would ideally come from environment variables set at build time
const BUILD_INFO = {
  commit: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || "dev",
  branch: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || "local",
  deployedAt: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_DATE || null,
};

function useLoadTime() {
  const [loadTime, setLoadTime] = useState<string | null>(null);

  useEffect(() => {
    // Wait for page to fully load
    if (typeof window !== "undefined" && window.performance) {
      const measureLoadTime = () => {
        const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
        if (navigation) {
          const time = navigation.loadEventEnd - navigation.startTime;
          if (time > 0) {
            setLoadTime(time < 1000 ? `${Math.round(time)}ms` : `${(time / 1000).toFixed(2)}s`);
          }
        }
      };

      // Try immediately, then after a short delay
      measureLoadTime();
      const timeout = setTimeout(measureLoadTime, 100);
      return () => clearTimeout(timeout);
    }
  }, []);

  return loadTime;
}

function useUptime() {
  const [uptime, setUptime] = useState<string>("0d 0h");

  useEffect(() => {
    // Site launched approximately Oct 30, 2025
    const launchDate = new Date("2025-10-30T00:00:00Z");

    const updateUptime = () => {
      const now = new Date();
      const diff = now.getTime() - launchDate.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      setUptime(`${days}d ${hours}h`);
    };

    updateUptime();
    const interval = setInterval(updateUptime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return uptime;
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const loadTime = useLoadTime();
  const uptime = useUptime();

  const links = [
    { name: "Projects", href: "/projects" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const socials = [
    {
      name: "GitHub",
      href: "https://github.com/Jacko10101",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 00-3.16 19.5c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34a2.65 2.65 0 00-1.1-1.46c-.91-.62.07-.6.07-.6a2.1 2.1 0 011.53 1.03 2.13 2.13 0 002.91.83 2.14 2.14 0 01.63-1.34c-2.22-.25-4.55-1.11-4.55-4.94a3.87 3.87 0 011.03-2.68 3.6 3.6 0 01.1-2.65s.84-.27 2.75 1.02a9.47 9.47 0 015 0c1.91-1.3 2.75-1.02 2.75-1.02a3.6 3.6 0 01.1 2.65 3.87 3.87 0 011.03 2.68c0 3.84-2.34 4.69-4.57 4.94a2.39 2.39 0 01.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0012 2z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/jack-devlin-5a0902148",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
    },
    {
      name: "Email",
      href: "mailto:jack@devlinops.com",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative bg-black border-t border-gray-800">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black to-gray-900/50 pointer-events-none" />

      <div className="container px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-white">DevlinOps</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Jack Devlin&apos;s portfolio. Platform engineering, write-ups, and the things I build.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigate
            </h3>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Connect
            </h3>
            <div className="flex gap-4">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={social.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="w-10 h-10 rounded-lg bg-gray-800/50 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-green-400 hover:border-green-500/50 hover:bg-green-500/10 transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="mt-4 text-gray-500 text-sm">
              jack@devlinops.com
            </p>
          </div>
        </div>

        {/* Build Info Bar */}
        <div className="mb-8 p-4 rounded-lg bg-gray-900/50 border border-gray-800 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">build:</span>
              <span className="text-cyan-400">{BUILD_INFO.commit}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">branch:</span>
              <span className="text-green-400">{BUILD_INFO.branch}</span>
            </div>
            {loadTime && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">load:</span>
                <span className="text-yellow-400">{loadTime}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-gray-600">uptime:</span>
              <span className="text-purple-400">{uptime}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400">all systems operational</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} DevlinOps. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Open to roles · summer 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
