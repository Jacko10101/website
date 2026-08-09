"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";

// Every item here is substantiated elsewhere on the site.
// Deliberately none of the three figures in the hero proof strip — the ticker
// sitting directly beneath it repeating them read as padding.
const items = [
  "every answer ships with the SQL that produced it",
  "an answer naming a site that isn't in the database gets refused, every turn",
  "0 vector stores · the database schema is compiled nightly instead",
  "50+ alerts, a runbook for every one",
  "one endpoint in front of every model call",
  "homelab: 0 ports exposed to the internet",
  "MSc AI · Distinction · September 2026",
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
