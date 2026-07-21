"use client";

import { useReducedMotion } from "framer-motion";

// Every item here is substantiated elsewhere on the site.
const items = [
  "heimdall: 20+ engineers daily",
  "pipeline library: ~400 deploys/month across 20 services",
  "observability: ~£5k/yr where the quote said ~£100k",
  "50+ alerts — a runbook for every one",
  "promotion is a commit · rollback is a revert",
  "homelab: 0 ports exposed to the internet",
  "MSc AI · finishing August 2026",
  "available September 2026 · contract or full-time · remote-first",
];

/**
 * A status ticker between the hero and the pipeline story — reads like the
 * status bar of a monitoring console. Pauses on hover; static under reduced
 * motion.
 */
export function StatusTicker() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className="border-y border-border py-3 overflow-hidden">
        <div className="container font-mono text-xs text-muted-foreground truncate">
          {items.slice(0, 3).join("   ·   ")}
        </div>
      </div>
    );
  }

  const row = (
    <>
      {items.map((item) => (
        <span key={item} className="inline-flex items-center gap-3 mx-6">
          <span className="w-1 h-1 rounded-full bg-primary" aria-hidden />
          {item}
        </span>
      ))}
    </>
  );

  return (
    <div className="border-y border-border py-3 overflow-hidden" aria-hidden>
      <div className="ticker-track flex w-max whitespace-nowrap font-mono text-xs text-muted-foreground">
        {row}
        {row}
      </div>
    </div>
  );
}
