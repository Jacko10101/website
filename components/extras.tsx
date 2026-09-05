"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * The things for people who go deep: the terminal behind the "/" key, the
 * incident simulator behind the Konami code and the `oncall` command, and
 * chaos mode. None of them has any server output, and together they were a fifth
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
    // "/" is advertised in the footer; if it is pressed before the terminal
    // has loaded, remember the request and load now.
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key !== "/" || t?.tagName === "INPUT" || t?.tagName === "TEXTAREA" || t?.isContentEditable) return;
      e.preventDefault();
      window.__cliRequested = true;
      setReady(true);
    };
    window.addEventListener("keydown", onKey);
    // Safari has no requestIdleCallback; a short timer stands in for it.
    const idle = typeof window.requestIdleCallback === "function";
    const id = idle
      ? window.requestIdleCallback(() => setReady(true), { timeout: 2500 })
      : window.setTimeout(() => setReady(true), 1200);
    const cancel = () => (idle ? window.cancelIdleCallback(id) : window.clearTimeout(id));
    return () => {
      window.removeEventListener("keydown", onKey);
      cancel();
    };
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
