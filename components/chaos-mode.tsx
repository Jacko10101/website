"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Chaos mode — triggered from the CLI (`chaos`, or trying `rm -rf /`).
 *
 * Every section of the page is treated as a workload, and the whole thing runs
 * a real pod lifecycle against them: Running → Terminating → Error →
 * CrashLoopBackOff, then Pending → ContainerCreating → Running on the way back.
 *
 * Three layers run at once, which is what makes it read as an outage rather
 * than as an effect:
 *
 *   1. TEXT. At trigger time every text node is snapshotted. That snapshot is
 *      git — the desired state, written down. Characters then diverge from it
 *      and are reconciled back against it, and the drift counter in the console
 *      is a real count of diverged characters recomputed every frame.
 *   2. STRUCTURE. A dying section shears, desaturates and then goes dark, and
 *      is replaced by a CrashLoopBackOff card over its own footprint. Content
 *      genuinely disappears, because that is what a crashlooping pod does.
 *      All of it is transform and opacity, so nothing reflows and the page
 *      never jumps under the reader.
 *   3. CONTROL PLANE. The nav and footer never break. The platform stays up
 *      and the workloads on it fail, which is the correct shape of the story.
 *
 * Recovery time is measured with performance.now(). Same rule as everywhere
 * else on the site: no number here is typed in.
 *
 * React safety: we mutate `nodeValue` on existing text nodes and inline styles
 * on existing sections, and restore both exactly. Nothing is inserted into or
 * removed from DOM that React owns — every overlay is a React element in a
 * fixed layer of our own.
 */

type Phase =
  | "Running"
  | "Terminating"
  | "Error"
  | "CrashLoopBackOff"
  | "Pending"
  | "ContainerCreating";

type Stage = "idle" | "selecting" | "killing" | "down" | "reconciling" | "healthy";

const GARBAGE = "▓▒░█▄▀■□◆◇╳╱╲┃━┏┓┗┛!<>-_\\/[]{}=+*^?#%&@$~01";

const MIN_LEN = 2;
const MAX_NODES = 900;

/* Beats. Deliberately unhurried — the previous version was over in six
   seconds and people missed it entirely. */
const SELECT_MS = 900;
const KILL_STEP = 780;
const DOWN_MS = 1600;
const HEAL_STEP = 760;

interface Snap {
  node: Text;
  original: string;
  /** Index of the workload this text belongs to. */
  pod: number;
  order: number[];
}

interface Pod {
  name: string;
  el: HTMLElement;
  phase: Phase;
  restarts: number;
  /** Inline style to put back on restore. */
  style: string;
}

interface Box {
  pod: number;
  top: number;
  left: number;
  width: number;
  height: number;
}

const PHASE_TONE: Record<Phase, string> = {
  Running: "text-primary",
  Terminating: "text-warn",
  Error: "text-error",
  CrashLoopBackOff: "text-error",
  Pending: "text-warn",
  ContainerCreating: "text-warn",
};

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

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
  const hash = Array.from(base).reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  return `${base.slice(0, 20)}-${hash.toString(36).slice(0, 5).padEnd(5, "x")}`;
}

function corruptibleOrder(text: string): number[] {
  const idx: number[] = [];
  for (let i = 0; i < text.length; i++) if (!/\s/.test(text[i])) idx.push(i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

export function ChaosMode() {
  const [stage, setStage] = useState<Stage>("idle");
  const [pods, setPods] = useState<Pod[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [drift, setDrift] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [mttr, setMttr] = useState<number | null>(null);
  const [log, setLog] = useState<{ t: string; text: string; tone: string }[]>([]);

  const snaps = useRef<Snap[]>([]);
  const podsRef = useRef<Pod[]>([]);
  const raf = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const running = useRef(false);

  const restore = useCallback(() => {
    cancelAnimationFrame(raf.current);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    for (const s of snaps.current) {
      if (s.node.isConnected && s.node.nodeValue !== s.original) {
        s.node.nodeValue = s.original;
      }
    }
    for (const p of podsRef.current) {
      if (p.el.isConnected) p.el.setAttribute("style", p.style);
    }
    snaps.current = [];
    podsRef.current = [];
    running.current = false;
  }, []);

  const dismiss = useCallback(() => {
    restore();
    setStage("idle");
    setPods([]);
    setBoxes([]);
    setDrift(0);
    setMttr(null);
    setLog([]);
  }, [restore]);

  /* Overlay cards track their section's real rect, through scroll and resize. */
  useEffect(() => {
    if (stage === "idle") return;
    const measure = () => {
      setBoxes(
        podsRef.current.flatMap((p, i) => {
          if (!p.el.isConnected) return [];
          if (p.phase === "Running") return [];
          const r = p.el.getBoundingClientRect();
          if (r.bottom < -200 || r.top > window.innerHeight + 200) return [];
          return [{ pod: i, top: r.top, left: r.left, width: r.width, height: r.height }];
        })
      );
    };
    measure();
    const id = setInterval(measure, 120);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      clearInterval(id);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [stage]);

  useEffect(() => {
    const say = (text: string, tone: string) =>
      setLog((prev) => [...prev.slice(-6), { t: stamp(), text, tone }]);

    const at = (ms: number, fn: () => void) => {
      timers.current.push(setTimeout(fn, ms));
    };

    const setPhase = (i: number, phase: Phase, restarts?: number) => {
      const p = podsRef.current[i];
      if (!p) return;
      p.phase = phase;
      if (restarts !== undefined) p.restarts = restarts;
      setPods([...podsRef.current]);
    };

    /** Visual state of a dying or recovering workload. Transform only. */
    const paintPod = (i: number, kind: "shear" | "dead" | "booting" | "alive") => {
      const p = podsRef.current[i];
      if (!p || !p.el.isConnected) return;
      const el = p.el;
      if (kind === "shear") {
        el.style.transition = "transform 180ms steps(3), filter 180ms linear, opacity 180ms linear";
        el.style.transform = "translateX(-5px) skewX(-1.1deg)";
        el.style.filter = "saturate(2.2) contrast(1.35) hue-rotate(-14deg)";
        el.style.opacity = "0.85";
      } else if (kind === "dead") {
        el.style.transition = "transform 420ms cubic-bezier(.4,0,.2,1), opacity 420ms linear, filter 420ms linear";
        el.style.transform = "translateY(6px) scaleY(0.985)";
        el.style.filter = "saturate(0) brightness(0.25)";
        el.style.opacity = "0.1";
      } else if (kind === "booting") {
        el.style.transition = "transform 420ms cubic-bezier(.4,0,.2,1), opacity 420ms linear, filter 420ms linear";
        el.style.transform = "none";
        el.style.filter = "saturate(0.6) brightness(0.75)";
        el.style.opacity = "0.55";
      } else {
        el.style.transition = "opacity 420ms linear, filter 420ms linear";
        el.style.transform = "none";
        el.style.filter = "none";
        el.style.opacity = "1";
        // Hand the element back to the stylesheet once the transition has
        // played. Leaving inline styles on would outlive the easter egg.
        at(460, () => {
          if (p.el.isConnected) p.el.setAttribute("style", p.style);
        });
      }
    };

    const run = () => {
      if (running.current) return;
      running.current = true;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("main section")
      ).filter((s) => s.getBoundingClientRect().height > 80);

      if (sections.length === 0) {
        running.current = false;
        return;
      }

      podsRef.current = sections.map((el, i) => ({
        name: podNameFor(el, i),
        el,
        phase: "Running" as Phase,
        restarts: 0,
        style: el.getAttribute("style") ?? "",
      }));
      setPods([...podsRef.current]);

      /* Snapshot the desired state, tagged with the workload it belongs to. */
      const collected: Snap[] = [];
      sections.forEach((section, podIndex) => {
        const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT, {
          acceptNode(node) {
            const text = node.nodeValue ?? "";
            if (text.trim().length < MIN_LEN) return NodeFilter.FILTER_REJECT;
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            if (parent.closest("[data-chaos-ui]")) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName;
            if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        });
        let node: Node | null;
        while ((node = walker.nextNode()) && collected.length < MAX_NODES) {
          const text = node as Text;
          const original = text.nodeValue ?? "";
          const order = corruptibleOrder(original);
          if (order.length === 0) continue;
          collected.push({ node: text, original, pod: podIndex, order });
        }
      });

      snaps.current = collected;
      const chars = collected.reduce((n, s) => n + s.order.length, 0);
      setTotalChars(chars);

      const started = performance.now();
      setMttr(null);
      setDrift(0);
      setLog([]);
      setStage("selecting");
      say(`chaos-monkey: ${sections.length} workloads in scope`, "text-muted-foreground");
      say(`chaos-monkey: snapshot taken, ${chars.toLocaleString()} chars`, "text-muted-foreground");

      if (reduceMotion) {
        setStage("healthy");
        setMttr(performance.now() - started);
        say("argocd: Synced · Healthy · reconciled from git", "text-primary");
        return;
      }

      /* Per-pod corruption progress, driven by the frame loop. */
      const corrupt = new Array(sections.length).fill(0) as number[];

      const frame = () => {
        let live = 0;
        for (const s of snaps.current) {
          const p = corrupt[s.pod] ?? 0;
          const n = Math.floor(clamp01(p) * s.order.length);
          live += n;
          if (n > 0 || s.node.nodeValue !== s.original) paintText(s, n);
        }
        setDrift(live);
        raf.current = requestAnimationFrame(frame);
      };
      raf.current = requestAnimationFrame(frame);

      const ramp = (i: number, from: number, to: number, ms: number) => {
        const t0 = performance.now();
        const tick = () => {
          const p = clamp01((performance.now() - t0) / ms);
          corrupt[i] = from + (to - from) * p;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };

      at(SELECT_MS - 300, () => {
        setStage("killing");
        say("chaos-monkey: injecting failure into production…", "text-warn");
      });

      /* Kill phase — one workload at a time, with a real lifecycle. */
      sections.forEach((_, i) => {
        const t = SELECT_MS + i * KILL_STEP;
        at(t, () => {
          setPhase(i, "Terminating");
          ramp(i, 0, 1, KILL_STEP * 0.55);
          paintPod(i, "shear");
        });
        at(t + KILL_STEP * 0.45, () => setPhase(i, "Error"));
        at(t + KILL_STEP * 0.7, () => {
          setPhase(i, "CrashLoopBackOff", 1);
          paintPod(i, "dead");
        });
        at(t + KILL_STEP * 1.5, () => setPhase(i, "CrashLoopBackOff", 2));
        at(t + KILL_STEP * 2.3, () => setPhase(i, "CrashLoopBackOff", 3));
      });

      const downAt = SELECT_MS + sections.length * KILL_STEP;

      at(downAt, () => {
        setStage("down");
        say("argocd: devlinops.com OutOfSync · drift detected", "text-error");
      });
      at(downAt + 700, () =>
        say(`argocd: ${chars.toLocaleString()} chars diverged from HEAD`, "text-error")
      );

      /* Reconcile — same order, back through the lifecycle, from git. */
      const healAt = downAt + DOWN_MS;
      at(healAt - 250, () => {
        setStage("reconciling");
        say("argocd: reconciling from git @ HEAD…", "text-muted-foreground");
      });

      sections.forEach((_, i) => {
        const t = healAt + i * HEAL_STEP;
        at(t, () => {
          setPhase(i, "Pending");
          paintPod(i, "booting");
        });
        at(t + HEAL_STEP * 0.35, () => setPhase(i, "ContainerCreating"));
        at(t + HEAL_STEP * 0.55, () => ramp(i, 1, 0, HEAL_STEP * 0.6));
        at(t + HEAL_STEP * 1.15, () => {
          setPhase(i, "Running", 0);
          paintPod(i, "alive");
        });
      });

      const doneAt = healAt + sections.length * HEAL_STEP + HEAL_STEP * 1.2;
      at(doneAt, () => {
        cancelAnimationFrame(raf.current);
        for (const s of snaps.current) {
          if (s.node.isConnected) s.node.nodeValue = s.original;
        }
        setDrift(0);
        setStage("healthy");
        setMttr(performance.now() - started);
        say("argocd: Synced · Healthy · all resources restored", "text-primary");
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

  const healthy = stage === "healthy";
  const barTone = healthy
    ? "bg-primary"
    : stage === "reconciling"
      ? "bg-warn"
      : stage === "selecting"
        ? "bg-warn"
        : "bg-error";
  const chipTone = healthy
    ? "border-primary/60 text-primary"
    : stage === "reconciling" || stage === "selecting"
      ? "border-warn/60 text-warn"
      : "border-error/60 text-error";
  const label =
    stage === "selecting"
      ? "SELECTING"
      : stage === "killing"
        ? "DEGRADING"
        : stage === "down"
          ? "OUTOFSYNC"
          : stage === "reconciling"
            ? "RECONCILING"
            : "HEALTHY";

  const pct = totalChars ? Math.round((drift / totalChars) * 100) : 0;
  const downCount = pods.filter((p) => p.phase !== "Running").length;

  return (
    <div data-chaos-ui>
      <div
        className={`fixed top-0 left-0 right-0 z-[95] h-0.5 ${barTone}`}
        style={{ boxShadow: "0 0 24px currentColor" }}
        aria-hidden
      />

      {/* One card per downed workload, over its own footprint. */}
      <div className="pointer-events-none fixed inset-0 z-[94]" aria-hidden>
        {boxes.map((b) => {
          const pod = pods[b.pod];
          if (!pod) return null;
          const recovering = pod.phase === "Pending" || pod.phase === "ContainerCreating";
          return (
            <div
              key={b.pod}
              className={`absolute border ${
                recovering ? "border-warn/50" : "border-error/50"
              }`}
              style={{
                top: b.top,
                left: b.left,
                width: b.width,
                height: b.height,
                background: recovering
                  ? "repeating-linear-gradient(135deg, transparent 0 10px, color-mix(in oklab, var(--color-warn) 7%, transparent) 10px 20px)"
                  : "color-mix(in oklab, var(--color-error) 4%, transparent)",
              }}
            >
              <div
                className="absolute left-0 right-0 flex items-center justify-center"
                style={{
                  top: Math.max(0, -b.top + 24),
                  height: Math.min(
                    b.height,
                    Math.max(0, Math.min(b.top + b.height, window.innerHeight) - Math.max(b.top, 0))
                  ),
                }}
              >
                <div
                  className={`rounded-md border bg-black/90 px-4 py-3 font-mono text-xs ${
                    recovering ? "border-warn/60" : "border-error/60"
                  }`}
                >
                  <p className={PHASE_TONE[pod.phase]}>{pod.phase}</p>
                  <p className="text-muted-foreground mt-1">{pod.name}</p>
                  {pod.restarts > 0 && (
                    <p className="text-warn mt-1">restarts: {pod.restarts}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-6 right-6 z-[96] w-[25rem] max-w-[calc(100vw-3rem)] rounded-lg border border-border bg-black/95 backdrop-blur-sm glow-border font-mono text-xs leading-5 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-border bg-card/60">
          <span className="text-muted-foreground truncate">$ kubectl get pods -w</span>
          <span className={`shrink-0 px-1.5 py-0.5 rounded border text-[11px] tracking-wider ${chipTone}`}>
            {label}
          </span>
        </div>

        <div className="px-3 py-2 border-b border-border" aria-hidden>
          <div className="grid grid-cols-[1fr_auto_auto] gap-3 text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
            <span>name</span>
            <span className="text-right">status</span>
            <span className="text-right">restarts</span>
          </div>
          {pods.map((pod, i) => (
            <div key={`${pod.name}-${i}`} className="grid grid-cols-[1fr_auto_auto] gap-3">
              <span className="text-foreground/70 truncate">{pod.name}</span>
              <span className={`text-right ${PHASE_TONE[pod.phase]}`}>{pod.phase}</span>
              <span className={`text-right ${pod.restarts > 0 ? "text-warn" : "text-muted-foreground"}`}>
                {pod.restarts}
              </span>
            </div>
          ))}
          <p className="mt-1.5 text-[11px] text-muted-foreground/70">
            {downCount} of {pods.length} workloads down
          </p>
        </div>

        {/* Counted off the live DOM every frame, not scripted. */}
        <div className="px-3 py-2 border-b border-border" aria-hidden>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-muted-foreground">chars diverged from HEAD</span>
            <span className={healthy ? "text-primary" : "text-error"}>
              {drift.toLocaleString()}
            </span>
          </div>
          <div className="h-1 rounded-full bg-secondary overflow-hidden">
            <div className={`h-full ${barTone}`} style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="px-3 py-2 space-y-0.5" role="status" aria-live="polite">
          {log.map((line, i) => (
            <p key={i} className={line.tone}>
              <span className="text-muted-foreground/50">{line.t}</span> {line.text}
            </p>
          ))}
        </div>

        {mttr !== null && (
          <div className="px-3 py-2 border-t border-border text-muted-foreground">
            <p className="text-primary">
              recovered in {(mttr / 1000).toFixed(1)}s, measured just now
            </p>
            <p className="mt-1">the snapshot was git. you can&apos;t break this site.</p>
          </div>
        )}

        <button
          onClick={dismiss}
          className="w-full px-3 py-1.5 border-t border-border text-[11px] text-muted-foreground hover:text-foreground text-left transition-colors"
        >
          esc · dismiss
        </button>
      </div>
    </div>
  );
}

function paintText(s: Snap, n: number) {
  if (!s.node.isConnected) return;
  if (n === 0) {
    if (s.node.nodeValue !== s.original) s.node.nodeValue = s.original;
    return;
  }
  const chars = s.original.split("");
  for (let i = 0; i < n; i++) {
    chars[s.order[i]] = GARBAGE[(Math.random() * GARBAGE.length) | 0];
  }
  const next = chars.join("");
  if (s.node.nodeValue !== next) s.node.nodeValue = next;
}

function stamp(): string {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}
