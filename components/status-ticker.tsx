"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { profile } from "@/lib/profile";

// Every item here is substantiated elsewhere on the site.
// Deliberately none of the three figures in the hero proof strip — the ticker
// sitting directly beneath it repeating them read as padding.
const items = [
  "22 dashboards managed as code · 50+ alerts, a runbook for every one",
  "twenty services, one .ci/builds.yaml",
  "four environments, reconciled from git by ArgoCD",
  "one endpoint in front of every model call, with per-key model allowlists",
  "spend traced to the tenant and the feature that caused it",
  "every answer ships with the SQL that produced it",
  "an answer naming a site that isn't in the database gets refused, every turn",
  "five classes of hallucination caught on every turn",
  "0 vector stores · the database schema is compiled nightly instead",
  "homelab: 0 ports exposed to the internet",
  [profile.msc.label, profile.msc.result, profile.msc.status]
    .filter(Boolean)
    .join(" · "),
  profile.availability.short.toLowerCase(),
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
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-background/90 px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground hover:border-primary/50 active:bg-secondary"
      >
        {paused ? "▶" : "❚❚"}
      </button>
    </div>
  );
}
