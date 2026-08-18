"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BUILD, formatBuildDate } from "@/lib/build-info";
import { profile } from "@/lib/profile";

function useLoadTime() {
  const [loadTime, setLoadTime] = useState<string | null>(null);

  useEffect(() => {
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

      measureLoadTime();
      const timeout = setTimeout(measureLoadTime, 100);
      return () => clearTimeout(timeout);
    }
  }, []);

  return loadTime;
}

export function Footer() {
  const loadTime = useLoadTime();
  const buildDate = formatBuildDate(BUILD.time);

  const links = [
    { name: "Projects", href: "/projects" },
    { name: "About", href: "/about" },
    { name: "How this site works", href: "/colophon" },
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
    <footer className="relative border-t border-border bg-background">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4 font-mono">
              <span className="text-muted-foreground">~/</span>
              <span className="text-xl font-semibold text-foreground">devlinops</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Jack Devlin. Platform engineering. Available from October 2026 —
              Dublin, London, Amsterdam or remote-first EU.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-mono text-sm text-primary mb-4">Navigate</h3>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-mono"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-mono text-sm text-primary mb-4">Contact</h3>
            <div className="flex gap-4">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={social.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="w-11 h-11 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/60 transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="mt-4 text-muted-foreground text-sm font-mono">
              jack@devlinops.com
            </p>
          </div>
        </div>

        {/* Statusline, tmux-style segments; every value is real or absent. */}
        <div className="mb-8 rounded-md border border-border bg-card/50 overflow-hidden font-mono text-[11px]">
          <div className="flex flex-wrap items-stretch">
            {BUILD.branch && BUILD.shortSha && (BUILD.commitUrl ? (
              <a
                href={BUILD.commitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-semibold [clip-path:polygon(0_0,calc(100%-9px)_0,100%_100%,0_100%)] pr-6 hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-background"
                title="The exact commit serving you this page"
              >
                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  <circle cx="8" cy="8" r="2.5" />
                  <path d="M8 1v4.5M8 10.5V15" />
                </svg>
                {BUILD.branch} @ {BUILD.shortSha}
              </a>
            ) : (
              <span
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-semibold [clip-path:polygon(0_0,calc(100%-9px)_0,100%_100%,0_100%)] pr-6 hover:bg-primary/90 transition-colors"
                title="The exact commit serving you this page"
              >
                <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  <circle cx="8" cy="8" r="2.5" />
                  <path d="M8 1v4.5M8 10.5V15" />
                </svg>
                {BUILD.branch} @ {BUILD.shortSha}
              </span>
            ))}
            {buildDate && (
              <span className="flex items-center px-4 py-2 -ml-2 bg-secondary text-muted-foreground [clip-path:polygon(9px_0,calc(100%-9px)_0,100%_100%,0_100%)] pl-6 pr-6">
                shipped {buildDate}
              </span>
            )}
            {loadTime && (
              <span className="flex items-center px-4 py-2 -ml-2 bg-card text-warn [clip-path:polygon(9px_0,calc(100%-9px)_0,100%_100%,0_100%)] pl-6 pr-6">
                this load {loadTime}
              </span>
            )}
            <span className="flex items-center px-4 py-2 -ml-2 bg-secondary text-muted-foreground [clip-path:polygon(9px_0,calc(100%-9px)_0,100%_100%,0_100%)] pl-6 pr-6">
              no cookies · page counts only
            </span>
            <Link
              href="/colophon"
              className="flex items-center px-4 py-2 -ml-2 bg-card text-primary [clip-path:polygon(9px_0,100%_0,100%_100%,0_100%)] pl-6 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            >
              how this site runs →
            </Link>
          </div>
          <div className="px-4 py-2 border-t border-border/60 text-center text-muted-foreground">
            press <kbd className="px-1.5 py-0.5 mx-1 rounded bg-secondary border border-border text-foreground/70 text-[10px]">/</kbd> for the terminal
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm font-mono">
            © {new Date().getFullYear()} Jack Devlin
          </p>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span className="w-2 h-2 rounded-full bg-primary" aria-hidden />
            <span>{profile.availability.short}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
