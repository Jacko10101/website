"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";

// Every item here is substantiated elsewhere on the site.
const items = [
  "heimdall: 20+ engineers daily",
  "pipeline library: ~400 deploys/month across 20 services",
  "clarity: ~30 tenants ask their databases questions in English",
  "50+ alerts, a runbook for every one",
  "promotion is a commit · rollback is a revert",
  "homelab: 0 ports exposed to the internet",
  "MSc AI · finishing September 2026",
  "available October 2026 · permanent or contract · remote-first",
];

/**
 * A status ticker between the hero and the pipeline story — reads like the
 * status bar of a monitoring console. Pauses on hover; static under reduced
 * motion.
 */
export function StatusTicker() {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

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
    <div className="relative border-y border-border py-3 overflow-hidden">
      <div
        aria-hidden
        className="ticker-track flex w-max whitespace-nowrap font-mono text-xs text-muted-foreground"
        style={paused ? { animationPlayState: "paused" } : undefined}
      >
        {row}
        {row}
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Resume ticker" : "Pause ticker"}
        aria-pressed={paused}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-background/90 px-2 py-0.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {paused ? "▶" : "❚❚"}
      </button>
    </div>
  );
}
