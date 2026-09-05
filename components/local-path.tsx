"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  "No cloud round-trip" is the claim the whole build rests on, so it gets to */
/*  be the thing you can see. Same request, two topologies.                    */
/* -------------------------------------------------------------------------- */

type Hop = { label: string; sub: string; offsite?: boolean };

const LOCAL: Hop[] = [
  { label: "wall switch", sub: "Zigbee press" },
  { label: "coordinator", sub: "SONOFF USB dongle" },
  { label: "Zigbee2MQTT", sub: "pod on the Pi" },
  { label: "Home Assistant", sub: "automation fires" },
  { label: "bulb", sub: "on" },
];

const CLOUD: Hop[] = [
  { label: "wall switch", sub: "vendor app" },
  { label: "vendor cloud", sub: "somewhere else", offsite: true },
  { label: "vendor account", sub: "auth + telemetry", offsite: true },
  { label: "vendor cloud", sub: "command back", offsite: true },
  { label: "bulb", sub: "on, eventually" },
];

export function LocalPath() {
  const [cloud, setCloud] = useState(false);
  const hops = cloud ? CLOUD : LOCAL;

  return (
    <div className="rounded-xl border border-border bg-card/40 overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-card/60 px-4 py-3">
        <button
          type="button"
          onClick={() => setCloud(false)}
          className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
            !cloud
              ? "border-primary/60 bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          this house
        </button>
        <button
          type="button"
          onClick={() => setCloud(true)}
          className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
            cloud
              ? "border-amber-500/60 bg-amber-500/10 text-amber-500"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          the usual way
        </button>
        <span className="ml-auto font-mono text-[11px] text-muted-foreground">
          {cloud ? "3 hops leave the building" : "nothing leaves the building"}
        </span>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-stretch gap-2">
          {/* initial={false}: the first render is visible as served; only a
              toggle animates. Shipping these at opacity 0 meant the cards were
              invisible until hydration. */}
          <AnimatePresence initial={false}>
          {hops.map((h, i) => (
            <motion.div
              key={`${cloud}-${h.label}-${i}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: i * 0.06 }}
              className="flex-1 min-w-0"
            >
              <div
                className={`h-full rounded-md border px-3 py-2.5 ${
                  h.offsite
                    ? "border-amber-500/40 bg-amber-500/5"
                    : "border-primary/30 bg-primary/5"
                }`}
              >
                <div
                  className={`font-mono text-xs font-semibold truncate ${
                    h.offsite ? "text-amber-500" : "text-primary"
                  }`}
                >
                  {h.label}
                </div>
                <div className="font-mono text-[11px] text-muted-foreground truncate">
                  {h.sub}
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>

        <AnimatePresence initial={false}>
        <motion.p
          key={cloud ? "c" : "l"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="mt-5 text-sm text-muted-foreground leading-relaxed"
        >
          {cloud ? (
            <>
              Three hops leave the building, and the lights stop working when
              somebody else&apos;s service has an outage or gets sunset. The
              amber boxes are the ones you don&apos;t control and can&apos;t
              debug.
            </>
          ) : (
            <>
              Every hop is on hardware in the flat. The internet connection can
              drop and the lights still work, because nothing on this path
              needed it. Remote access is a separate concern, handled by
              Tailscale rather than by opening a port.
            </>
          )}
        </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
