"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Chaos mode — triggered from the CLI (`chaos`, or trying `rm -rf /`).
 * Visible sections of the page "crash" (glitch, dim, CrashLoopBackOff badges),
 * then ArgoCD reconciles them back from git one by one. A live demonstration
 * of the site's own thesis: state lives in git; you can't break this.
 */

interface ToastLine {
  text: string;
  tone: "cmd" | "warn" | "ok";
}

export function ChaosMode() {
  const [toast, setToast] = useState<ToastLine[]>([]);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const schedule = (fn: () => void, ms: number) => {
      timers.current.push(setTimeout(fn, ms));
    };

    const addToast = (line: ToastLine) => setToast((t) => [...t, line]);

    const run = () => {
      if (running) return;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setRunning(true);
      setToast([]);

      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("main section")
      ).filter((s) => {
        const r = s.getBoundingClientRect();
        return r.bottom > -400 && r.top < window.innerHeight + 400;
      }).slice(0, 5);

      const badges: HTMLElement[] = [];

      addToast({ text: "$ chaos-monkey --unleash", tone: "cmd" });
      addToast({ text: "injecting failures into production…", tone: "warn" });

      if (!reduceMotion) {
        sections.forEach((section, i) => {
          schedule(() => {
            section.classList.add("chaos-crash");
            section.style.position = "relative";
            const badge = document.createElement("div");
            badge.textContent = "CrashLoopBackOff";
            badge.setAttribute("aria-hidden", "true");
            badge.className =
              "absolute top-3 right-3 z-50 px-2 py-1 rounded border border-error/60 text-error bg-black/80 font-mono text-[10px]";
            section.appendChild(badge);
            badges.push(badge);
          }, 500 + i * 350);
        });
      }

      schedule(() => {
        addToast({ text: "argocd: devlinops.com OutOfSync — drift detected", tone: "warn" });
        addToast({ text: "argocd: reconciling from git @ HEAD…", tone: "cmd" });
      }, 2800);

      sections.forEach((section, i) => {
        schedule(() => {
          section.classList.remove("chaos-crash");
          section.classList.add("chaos-heal");
          badges[i]?.remove();
          schedule(() => section.classList.remove("chaos-heal"), 1200);
        }, 4200 + i * 450);
      });

      schedule(() => {
        addToast({ text: "argocd: Synced · Healthy — all resources restored", tone: "ok" });
        addToast({ text: "state lives in git. you can't break this site.", tone: "ok" });
      }, 4600 + sections.length * 450);

      schedule(() => {
        setToast([]);
        setRunning(false);
      }, 9500 + sections.length * 450);
    };

    window.addEventListener("devlinops:chaos", run);
    const currentTimers = timers.current;
    return () => {
      window.removeEventListener("devlinops:chaos", run);
      currentTimers.forEach(clearTimeout);
    };
  }, [running]);

  if (toast.length === 0) return null;

  const tones = {
    cmd: "text-muted-foreground",
    warn: "text-warn",
    ok: "text-primary",
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] w-80 rounded-lg border border-border bg-black/90 backdrop-blur-sm glow-border p-4 font-mono text-[11px] leading-5">
      {toast.map((line, i) => (
        <div key={i} className={tones[line.tone]}>
          {line.text}
        </div>
      ))}
    </div>
  );
}
