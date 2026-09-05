"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/**
 * The hero's one moving object: a three-node cluster, drawn in the accent.
 *
 * Every ten seconds or so a node fails. Its pods drop into a pending strip,
 * and the survivors seat them the way the dissertation's scheduler does:
 * most importance first, whatever fits, the rest left waiting. Brightness is
 * importance. Hover a node to mark it, click to fail it yourself.
 *
 * It replaced the logo mark, which held forty percent of the first screen
 * and carried no information. This carries one idea and links to the paper.
 *
 * Nothing here is measured data; it is the mechanism, not a result. The
 * results live on /projects/ml-scheduler with their receipts.
 *
 * Reduced motion: one still frame with a node down and the important pods
 * already re-seated. Animates only while on screen and the tab is visible.
 */

const W = 480;
const H = 324;

// The site's tokens, hand-copied because canvas cannot read CSS variables:
// --color-primary, --color-error, --color-muted-foreground for labels, and a
// stroke a step darker than --color-border. Keep in step with globals.css.
const primary = (a: number) => `oklch(0.75 0.19 150 / ${a})`;
const error = (a: number) => `oklch(0.66 0.20 25 / ${a})`;
const frame = (a: number) => `oklch(0.55 0.014 150 / ${a})`;
const label = (a: number) => `oklch(0.70 0.015 150 / ${a})`;

const COLS = 5;
const ROWS = 8;
const CELL = 17;
const GAP = 3;
const PAD = 9;
const NODE_W = COLS * CELL + (COLS - 1) * GAP + PAD * 2;
const NODE_H = ROWS * CELL + (ROWS - 1) * GAP + PAD * 2;
const NODE_GAP = 22;
const CLUSTER_W = 3 * NODE_W + 2 * NODE_GAP;
const X0 = Math.round((W - CLUSTER_W) / 2);
const Y0 = 22;
const QUEUE_Y = Y0 + NODE_H + 48;

/** How long each phase holds, so the loop is slow enough to read. */
const PAUSE = { idle: 2600, dead: 900, seated: 3600, revived: 3200 } as const;

interface Node {
  i: number;
  x: number;
  y: number;
  alive: boolean;
  /** 0 alive, 1 dead; eased so the frame colour crosses rather than snaps. */
  tone: number;
  cells: (number | null)[];
}

interface Pod {
  id: number;
  w: number;
  h: number;
  /** Importance grade 1–9, as in the paper. */
  grade: number;
  node: number | null;
  pending: boolean;
  x: number;
  y: number;
  tx: number;
  ty: number;
  sx: number;
  sy: number;
  t0: number;
  dur: number;
}

type Phase = "idle" | "dead" | "seated" | "revived";

export function RecoveryField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // A seeded generator, so the cluster looks the same on every load.
    let seed = 20260904;
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    // Tiers as the paper assigns them: a quarter critical, a third standard.
    const gradeFor = () => {
      const r = rnd();
      if (r < 0.25) return 7 + Math.floor(rnd() * 3);
      if (r < 0.55) return 4 + Math.floor(rnd() * 3);
      return 1 + Math.floor(rnd() * 3);
    };
    const sizeFor = (): [number, number] => {
      const r = rnd();
      if (r < 0.58) return [1, 1];
      if (r < 0.82) return [2, 1];
      return [2, 2];
    };

    const nodes: Node[] = [0, 1, 2].map((i) => ({
      i,
      x: X0 + i * (NODE_W + NODE_GAP),
      y: Y0,
      alive: true,
      tone: 0,
      cells: new Array<number | null>(COLS * ROWS).fill(null),
    }));
    const pods: Pod[] = [];
    let seq = 0;

    const fits = (n: Node, c: number, r: number, w: number, h: number) => {
      if (c + w > COLS || r + h > ROWS) return false;
      for (let dr = 0; dr < h; dr++)
        for (let dc = 0; dc < w; dc++) if (n.cells[(r + dr) * COLS + c + dc]) return false;
      return true;
    };
    const occupy = (n: Node, p: Pod, c: number, r: number) => {
      for (let dr = 0; dr < p.h; dr++)
        for (let dc = 0; dc < p.w; dc++) n.cells[(r + dr) * COLS + c + dc] = p.id;
    };
    const cellXY = (n: Node, c: number, r: number): [number, number] => [
      n.x + PAD + c * (CELL + GAP),
      n.y + PAD + r * (CELL + GAP),
    ];
    // First fit, top-left down. The paper's solver is exact; this is the
    // drawing, and first-fit reads the same at this size.
    const place = (n: Node, p: Pod) => {
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
          if (fits(n, c, r, p.w, p.h)) {
            occupy(n, p, c, r);
            p.node = n.i;
            [p.tx, p.ty] = cellXY(n, c, r);
            return true;
          }
      return false;
    };
    const free = (n: Node) => n.cells.filter((v) => !v).length;

    // Fill every node to about 85%, so losing one leaves the survivors short.
    for (const n of nodes) {
      let guard = 0;
      while (free(n) > COLS * ROWS * 0.15 && guard++ < 200) {
        const [w, h] = sizeFor();
        const p: Pod = {
          id: ++seq, w, h, grade: gradeFor(), node: null, pending: false,
          x: 0, y: 0, tx: 0, ty: 0, sx: 0, sy: 0, t0: 0, dur: 0,
        };
        if (place(n, p)) {
          p.x = p.tx;
          p.y = p.ty;
          pods.push(p);
        }
      }
    }

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const moveTo = (p: Pod, x: number, y: number, delay: number, dur: number, now: number) => {
      p.sx = p.x; p.sy = p.y; p.tx = x; p.ty = y;
      p.t0 = now + delay;
      p.dur = reduced ? 0 : dur;
    };
    const step = (p: Pod, now: number) => {
      if (p.dur === 0) { p.x = p.tx; p.y = p.ty; return; }
      const t = Math.min(1, Math.max(0, (now - p.t0) / p.dur));
      const k = ease(t);
      p.x = p.sx + (p.tx - p.sx) * k;
      p.y = p.sy + (p.ty - p.sy) * k;
    };

    // The pending strip lays pods out left to right at their real sizes.
    const layoutQueue = (now: number, base: number) => {
      let x = X0, y = QUEUE_Y, rowH = 0, k = 0;
      for (const p of pods) {
        if (!p.pending) continue;
        const w = p.w * CELL + (p.w - 1) * GAP;
        const h = p.h * CELL + (p.h - 1) * GAP;
        if (x + w > X0 + CLUSTER_W) { x = X0; y += rowH + GAP; rowH = 0; }
        if (p.tx !== x || p.ty !== y) moveTo(p, x, y, base + k * 22, 620, now);
        x += w + GAP;
        rowH = Math.max(rowH, h);
        k++;
      }
    };
    // Selection: the most important pending pods that fit, in that order.
    const seat = (now: number, base: number) => {
      const queue = pods.filter((p) => p.pending).sort((a, b) => b.grade - a.grade || a.id - b.id);
      let k = 0;
      for (const p of queue)
        for (const n of nodes) {
          if (!n.alive) continue;
          if (place(n, p)) {
            p.pending = false;
            moveTo(p, p.tx, p.ty, base + k * 45, 680, now);
            k++;
            break;
          }
        }
      layoutQueue(now, base + k * 45);
    };
    const kill = (n: Node, now: number) => {
      if (!n.alive) return;
      n.alive = false;
      n.cells.fill(null);
      for (const p of pods) if (p.node === n.i) { p.node = null; p.pending = true; }
      layoutQueue(now, 180);
    };

    let phase: Phase = "idle";
    let phaseAt = 0;
    let victim = 0;
    let hovered = -1;
    let lastKilled = -1;
    const setPhase = (p: Phase, now: number) => { phase = p; phaseAt = now; };

    const tick = (now: number) => {
      if (reduced) return;
      const dt = now - phaseAt;
      if (phase === "idle" && dt > PAUSE.idle) {
        const n = nodes[victim % 3];
        victim++;
        lastKilled = n.i;
        kill(n, now);
        setPhase("dead", now);
      } else if (phase === "dead" && dt > PAUSE.dead) {
        seat(now, 0);
        setPhase("seated", now);
      } else if (phase === "seated" && dt > PAUSE.seated) {
        nodes[lastKilled].alive = true;
        seat(now, 120);
        setPhase("revived", now);
      } else if (phase === "revived" && dt > PAUSE.revived) {
        setPhase("idle", now);
      }
      for (const n of nodes) n.tone += ((n.alive ? 0 : 1) - n.tone) * 0.12;
    };

    const rr = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.font = '10.5px "JetBrains Mono", ui-monospace, monospace';
      ctx.textBaseline = "top";
      for (const n of nodes) {
        const hot = hovered === n.i && n.alive;
        ctx.lineWidth = 1;
        ctx.strokeStyle = n.tone > 0.5
          ? error(0.5 * n.tone)
          : hot ? primary(0.9) : frame(0.55 - n.tone * 0.15);
        rr(n.x + 0.5, n.y + 0.5, NODE_W - 1, NODE_H - 1, 6);
        ctx.stroke();
        // A faint lattice on living nodes, so free capacity is visible.
        if (n.tone < 0.98) {
          ctx.fillStyle = frame(0.16 * (1 - n.tone));
          for (let r = 0; r < ROWS; r++)
            for (let c = 0; c < COLS; c++) {
              const [x, y] = cellXY(n, c, r);
              rr(x, y, CELL, CELL, 2);
              ctx.fill();
            }
        }
        ctx.fillStyle = n.tone > 0.5 ? error(0.9) : label(0.9);
        ctx.fillText(n.tone > 0.5 ? `node-${n.i + 1}  NotReady` : `node-${n.i + 1}`, n.x, n.y + NODE_H + 8);
      }
      // The pending slot is drawn even when empty, so the band under the
      // nodes reads as a place rather than as space left over.
      const pending = pods.filter((p) => p.pending).length;
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = frame(0.35);
      ctx.lineWidth = 1;
      rr(X0 + 0.5, QUEUE_Y - 6.5, CLUSTER_W - 1, 2 * (2 * CELL + GAP) + 13, 6);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = label(0.9);
      ctx.fillText(pending ? `pending  ${pending}` : "pending", X0, QUEUE_Y - 20);
      for (const p of pods) {
        step(p, now);
        const w = p.w * CELL + (p.w - 1) * GAP;
        const h = p.h * CELL + (p.h - 1) * GAP;
        const a = 0.16 + 0.84 * Math.pow((p.grade - 1) / 8, 1.15);
        ctx.fillStyle = primary(p.pending ? a * 0.45 : a);
        rr(p.x, p.y, w, h, 3);
        ctx.fill();
        if (p.pending) {
          ctx.strokeStyle = primary(0.35);
          ctx.lineWidth = 1;
          rr(p.x + 0.5, p.y + 0.5, w - 1, h - 1, 3);
          ctx.stroke();
        }
      }
    };

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const nodeAt = (ev: PointerEvent | MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (ev.clientX - rect.left) * (W / rect.width);
      const y = (ev.clientY - rect.top) * (H / rect.height);
      return nodes.find((n) => x >= n.x && x <= n.x + NODE_W && y >= n.y && y <= n.y + NODE_H) ?? null;
    };
    const onMove = (ev: PointerEvent) => {
      const n = nodeAt(ev);
      hovered = n ? n.i : -1;
      canvas.style.cursor = n && n.alive ? "pointer" : "default";
    };
    const onLeave = () => { hovered = -1; };
    const onClick = (ev: MouseEvent) => {
      const n = nodeAt(ev);
      if (!n || !n.alive) return;
      const now = performance.now();
      // Bring any node still down back first, so the picture stays readable.
      for (const o of nodes) if (!o.alive) o.alive = true;
      lastKilled = n.i;
      kill(n, now);
      setPhase("dead", now);
      if (reduced) {
        // No tick() runs to ease the frame colours, so set them outright.
        for (const o of nodes) o.tone = o.alive ? 0 : 1;
        seat(now, 0);
        draw(now);
      }
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("click", onClick);

    let running = false;
    let raf = 0;
    const loop = (now: number) => {
      tick(now);
      draw(now);
      if (running) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      phaseAt = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    // Animate only while on screen AND the tab is visible; each signal alone
    // would restart the loop for a canvas nobody can see.
    let onScreen = false;
    const settle = () => { onScreen && !document.hidden ? start() : stop(); };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) onScreen = e.isIntersecting;
      settle();
    });
    io.observe(canvas);
    const onVisibility = settle;
    document.addEventListener("visibilitychange", onVisibility);

    if (reduced) {
      // One informative still: a node down, the important pods re-seated.
      lastKilled = 1;
      kill(nodes[1], 0);
      seat(0, 0);
      nodes[1].tone = 1;
      for (const p of pods) step(p, 0);
      draw(0);
    } else {
      draw(performance.now());
    }

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div className={className}>
      <canvas
        ref={ref}
        width={W}
        height={H}
        className="block h-[324px] w-[480px]"
        role="img"
        aria-label="A three-node cluster. One node fails, its pods queue, and the survivors seat the most important ones first."
      />
      <p className="mt-3.5 flex items-baseline justify-between gap-3 font-mono text-xs text-muted-foreground/80">
        <span>Click a node to fail it. Its pods queue and come back most important first.</span>
        <Link
          href="/projects/ml-scheduler"
          className="whitespace-nowrap border-b border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          the scheduler, from the paper →
        </Link>
      </p>
    </div>
  );
}
