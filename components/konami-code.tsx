"use client";

import { useEffect, useState } from "react";
import { OncallGame } from "@/components/oncall-game";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/**
 * The konami listener. What it unlocks is not snake — it's ONCALL,
 * an incident-response simulator. Also opens via the CLI `oncall` command
 * (a `devlinops:oncall` custom event).
 */
export function KonamiCode() {
  // Opens on mount if the page asked for it before this component loaded
  // (see oncall-invite.tsx); otherwise waits for the code or the event.
  const [open, setOpen] = useState(() => {
    const asked = window.__oncallRequested === true;
    window.__oncallRequested = false;
    return asked;
  });

  useEffect(() => {
    let progress = 0;
    const onKey = (e: KeyboardEvent) => {
      if (open) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[progress]) {
        progress += 1;
        if (progress === KONAMI.length) {
          progress = 0;
          setOpen(true);
        }
      } else {
        progress = key === KONAMI[0] ? 1 : 0;
      }
    };
    const onEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("devlinops:oncall", onEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("devlinops:oncall", onEvent);
    };
  }, [open]);

  if (!open) return null;
  return <OncallGame onClose={() => setOpen(false)} />;
}
