"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Chaos mode — triggered from the CLI (`chaos`, or trying `rm -rf /`).
 *
 * Each visible section of the page is treated as a pod. The chaos monkey kills
 * them one at a time — Terminating, Error, CrashLoopBackOff, restart counts
 * climbing — while a live `kubectl get pods -w` console tracks the damage.
 * Then ArgoCD notices the drift and reconciles everything back from git.
 *
 * The recovery time at the end is measured with performance.now(), not typed
 * in: same rule as the rest of the site.
 */

type PodPhase =
  | "Running"
  | "Terminating"
  | "Error"
  | "CrashLoopBackOff"
  | "Pending"
  | "ContainerCreating";

interface Pod {
  name: string;
  phase: PodPhase;
  restarts: number;
}

type Stage = "idle" | "chaos" | "reconciling" | "healthy";

const PHASE_TONE: Record<PodPhase, string> = {
  Running: "text-primary",
  Terminating: "text-warn",
  Error: "text-error",
  CrashLoopBackOff: "text-error",
  Pending: "text-warn",
  ContainerCreating: "text-warn",
};

/** Turn a section's heading into something that looks like a workload name. */
function podNameFor(section: HTMLElement, index: number): string {
  const heading = section.querySelector("h1, h2, h3")?.textContent ?? "";
  const slug = heading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join("-");
  const base = slug.length > 2 ? slug : `section-${index + 1}`;
  // A stable-looking replicaset suffix, derived from the name rather than random.
  const hash = Array.from(base).reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const suffix = hash.toString(36).slice(0, 5).padEnd(5, "x");
  return `${base.slice(0, 22)}-${suffix}`;
}

export function ChaosMode() {
  const [pods, setPods] = useState<Pod[]>([]);
  const [stage, setStage] = useState<Stage>("idle");
  const [status, setStatus] = useState<{ text: string; tone: string } | null>(null);
  const [mttr, setMttr] = useState<number | null>(null);

  const running = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const touched = useRef<HTMLElement[]>([]);
  const badges = useRef<HTMLElement[]>([]);

  /** Put the page back exactly as it was, whatever stage we're in. */
  const restore = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    badges.current.forEach((b) => b.remove());
    badges.current = [];
    touched.current.forEach((s) => {
      s.classList.remove("chaos-crash", "chaos-heal");
      // Only the badge positioning needed inline position; put it back.
      if (s.dataset.chaosPosition !== undefined) {
        s.style.position = s.dataset.chaosPosition;
        delete s.dataset.chaosPosition;
      }
    });
    touched.current = [];
    running.current = false;
  }, []);

  const dismiss = useCallback(() => {
    restore();
    setStage("idle");
    setPods([]);
    setStatus(null);
    setMttr(null);
  }, [restore]);

  useEffect(() => {
    const at = (ms: number, fn: () => void) => {
      timers.current.push(setTimeout(fn, ms));
    };

    const setPod = (index: number, patch: Partial<Pod>) =>
      setPods((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));

    const run = () => {
      if (running.current) return;
      running.current = true;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const started = performance.now();

      const sections = Array.from(document.querySelectorAll<HTMLElement>("main section"))
        .filter((s) => {
          const r = s.getBoundingClientRect();
          return r.bottom > -400 && r.top < window.innerHeight + 400;
        })
        .slice(0, 5);

      if (sections.length === 0) {
        running.current = false;
        return;
      }

      touched.current = sections;
      setMttr(null);
      setStage("chaos");
      setPods(sections.map((s, i) => ({ name: podNameFor(s, i), phase: "Running", restarts: 0 })));
      setStatus({ text: "chaos-monkey: selecting targets…", tone: "text-muted-foreground" });

      const step = reduceMotion ? 160 : 300;

      // Kill phase — one pod at a time, so you can watch it happen.
      sections.forEach((section, i) => {
        const t = 500 + i * step;

        at(t, () => {
          setPod(i, { phase: "Terminating" });
          setStatus({ text: "chaos-monkey: injecting failure into production…", tone: "text-warn" });
        });

        at(t + step * 0.6, () => {
          setPod(i, { phase: "Error" });
          if (reduceMotion) return;
          section.classList.add("chaos-crash");
          section.dataset.chaosPosition = section.style.position;
          if (!section.style.position) section.style.position = "relative";
          const badge = document.createElement("div");
          badge.textContent = "CrashLoopBackOff";
          badge.setAttribute("aria-hidden", "true");
          badge.className =
            "absolute top-3 right-3 z-50 px-2 py-1 rounded border border-error/60 text-error bg-black/80 font-mono text-[10px]";
          section.appendChild(badge);
          badges.current.push(badge);
        });

        at(t + step * 1.2, () => setPod(i, { phase: "CrashLoopBackOff", restarts: 1 }));
        at(t + step * 2.4, () => setPod(i, { phase: "CrashLoopBackOff", restarts: 2 }));
      });

      const killedAt = 500 + sections.length * step + step * 2.4;

      // ArgoCD notices the drift.
      at(killedAt + 300, () => {
        setStage("reconciling");
        setStatus({ text: "argocd: devlinops.com OutOfSync · drift detected", tone: "text-warn" });
      });
      at(killedAt + 1100, () =>
        setStatus({ text: "argocd: reconciling from git @ HEAD…", tone: "text-muted-foreground" })
      );

      // Heal phase — same order, back through the real lifecycle.
      const healAt = killedAt + 1500;
      sections.forEach((section, i) => {
        const t = healAt + i * step;
        at(t, () => setPod(i, { phase: "Pending" }));
        at(t + step * 0.5, () => setPod(i, { phase: "ContainerCreating" }));
        at(t + step * 1.1, () => {
          setPod(i, { phase: "Running" });
          section.classList.remove("chaos-crash");
          badges.current[i]?.remove();
          if (reduceMotion) return;
          section.classList.add("chaos-heal");
          at(1200, () => section.classList.remove("chaos-heal"));
        });
      });

      const doneAt = healAt + sections.length * step + step * 1.1;

      at(doneAt, () => {
        setStage("healthy");
        setMttr(performance.now() - started);
        setStatus({ text: "argocd: Synced · Healthy · all resources restored", tone: "text-primary" });
      });

      at(doneAt + 4200, () => {
        dismiss();
      });
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && running.current) dismiss();
    };

    window.addEventListener("devlinops:chaos", run);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("devlinops:chaos", run);
      window.removeEventListener("keydown", onKey);
      restore();
    };
  }, [dismiss, restore]);

  if (stage === "idle") return null;

  const stageLabel =
    stage === "chaos" ? "INCIDENT" : stage === "reconciling" ? "RECONCILING" : "HEALTHY";
  const stageTone =
    stage === "chaos"
      ? "border-error/60 text-error"
      : stage === "reconciling"
        ? "border-warn/60 text-warn"
        : "border-primary/60 text-primary";

  return (
    <div
      className="fixed bottom-6 right-6 z-[90] w-[22rem] max-w-[calc(100vw-3rem)] rounded-lg border border-border bg-black/92 backdrop-blur-sm glow-border font-mono text-[11px] leading-5 overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-border bg-card/50">
        <span className="text-muted-foreground truncate">
          $ kubectl get pods -w
        </span>
        <span className={`shrink-0 px-1.5 py-0.5 rounded border text-[9px] tracking-wider ${stageTone}`}>
          {stageLabel}
        </span>
      </div>

      {/* The table churns several times a second — announcing it would be noise. */}
      <div className="px-3 py-2" aria-hidden>
        <div className="grid grid-cols-[1fr_auto_auto] gap-3 text-[9px] uppercase tracking-wider text-muted-foreground/60 mb-1">
          <span>name</span>
          <span className="text-right">status</span>
          <span className="text-right">restarts</span>
        </div>
        {pods.map((pod, i) => (
          <div key={`${pod.name}-${i}`} className="grid grid-cols-[1fr_auto_auto] gap-3">
            <span className="text-foreground/70 truncate">{pod.name}</span>
            <span className={`text-right ${PHASE_TONE[pod.phase]}`}>{pod.phase}</span>
            <span className={pod.restarts > 0 ? "text-warn text-right" : "text-muted-foreground/60 text-right"}>
              {pod.restarts}
            </span>
          </div>
        ))}
      </div>

      {status && (
        <div
          className={`px-3 py-2 border-t border-border ${status.tone}`}
          role="status"
          aria-live="polite"
        >
          {status.text}
        </div>
      )}

      {mttr !== null && (
        <div className="px-3 py-2 border-t border-border text-muted-foreground">
          <p className="text-primary">recovered in {(mttr / 1000).toFixed(1)}s, measured just now</p>
          <p className="mt-1">state lives in git. you can&apos;t break this site.</p>
        </div>
      )}

      <button
        onClick={dismiss}
        className="w-full px-3 py-1.5 border-t border-border text-[10px] text-muted-foreground/70 hover:text-foreground text-left transition-colors"
      >
        esc · dismiss
      </button>
    </div>
  );
}
