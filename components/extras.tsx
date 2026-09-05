"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * The things for people who go deep: the terminal on `/`, the incident
 * simulator behind the Konami code and the `oncall` command, and chaos
 * mode. None of them has any server output, and together they were a fifth
 * of the JavaScript on every route, including ones with nothing to do.
 *
 * They load after the page is idle, off the critical path, except on
 * /oncall, where the simulator is the point and loads straight away.
 */
const KonamiCode = dynamic(() => import("@/components/konami-code").then((m) => m.KonamiCode), { ssr: false });
const ChaosMode = dynamic(() => import("@/components/chaos-mode").then((m) => m.ChaosMode), { ssr: false });
const CliNavigation = dynamic(() => import("@/components/cli-navigation").then((m) => m.CliNavigation), { ssr: false });

export function Extras() {
  const pathname = usePathname();
  const [ready, setReady] = useState(() => pathname === "/oncall");

  useEffect(() => {
    if (ready) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(id);
  }, [ready]);

  if (!ready) return null;
  return (
    <>
      <KonamiCode />
      <ChaosMode />
      <CliNavigation />
    </>
  );
}
