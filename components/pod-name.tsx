"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The homepage hero: my name as a cluster. Each letter is a node, each
 * square a pod, and brightness is importance. Click a letter and that node
 * fails: its pods burst out into a pending strip, the surviving letters pull
 * the most important ones back in first, and whatever doesn't fit waits for
 * room until the node recovers. Up to three nodes can be down at once.
 *
 * It's the selection rule from my MSc research at the size of a heading.
 * Nothing here is measured data; the results live on /projects/ml-scheduler.
 *
 * The name renders as plain type until the canvas is ready, so first paint
 * is never an empty box. The loop runs only while the hero is on screen and
 * the tab is visible. Reduced motion: no ambient motion, moves are instant.
 * Keyboard: one button per letter, visible on focus.
 */

// Canvas can't read CSS variables; these mirror the folio tokens.
const SILVER = [233, 238, 233]; // --color-foreground
const ACCENT = [211, 233, 157]; // --color-primary
const FAIL = [234, 165, 151]; // --color-error
const LABEL = [168, 182, 187]; // --color-muted-foreground
// Importance runs from a quiet silver to the accent, in nine steps.
const mix = (t: number) => SILVER.map((c, i) => Math.round(c + (ACCENT[i] - c) * t));
const COLOURS: Record<string, number[]> = { silver: SILVER, accent: ACCENT, fail: FAIL };
for (let g = 1; g <= 9; g++) COLOURS[`g${g}`] = mix(Math.pow((g - 1) / 8, 1.4));
type Colour = string;
const STEPS = 14; // opacity buckets: one fill per colour per step
const LINES = [["J", "A", "C", "K"], ["D", "E", "V", "L", "I", "N"]];
const LETTERS = LINES.flat();
const FILL = 0.92;
const MAX_DOWN = 3;
const DOWN_FOR = 5200;

interface Slot { x: number; y: number; node: number; pod: Pod | null }
interface Pod {
  id: number; g: number; slot: Slot | null; pending: boolean;
  x: number; y: number; sx: number; sy: number; tx: number; ty: number;
  vx: number; vy: number; arc: number; burst: boolean;
  t0: number; dur: number; seating: boolean; landAt: number; blinkAt: number;
}
interface Node {
  ch: string; alive: boolean; slots: Slot[];
  x0: number; x1: number; y0: number; y1: number;
  tone: number; downAt: number; upAt: number;
}
interface Stats { down: string[]; displaced: number; rescheduled: number; waiting: number; total: number; free: number }

const REST: Stats = { down: [], displaced: 0, rescheduled: 0, waiting: 0, total: 0, free: 0 };

export function PodName({ children }: { children?: ReactNode }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ fail: (i: number) => void } | null>(null);
  const [ready, setReady] = useState(false);
  const [stats, setStats] = useState<Stats>(REST);

  useEffect(() => {
    const canvas = ref.current;
    const stage = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !stage || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const family = getComputedStyle(canvas).fontFamily;

    let W = 0, H = 0, pitch = 6, pendY = 0;
    let slots: Slot[] = [], pods: Pod[] = [], nodes: Node[] = [];
    let hovered = -1, pointer: { x: number; y: number } | null = null;
    let running = false, raf = 0, visible = false, interacted = false;
    let displaced = 0, rescheduled = 0, lastStats = 0, statsKey = "";
    const timers: number[] = [];

    let seed = 20260904;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    const field = (x: number, y: number) =>
      0.5 + 0.26 * Math.sin(x * 0.0105 + 1.3) * Math.cos(y * 0.016 - 0.4) + 0.2 * Math.sin((x + y * 0.6) * 0.0058 + 2.1);
    const grade = (x: number, y: number) => {
      const v = Math.min(1, Math.max(0, field(x, y) * 0.82 + rnd() * 0.26 - 0.06));
      return 1 + Math.round(8 * Math.pow(v, 1.15));
    };
    const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)); };

    function build() {
      W = stage!.clientWidth;
      H = stage!.clientHeight;
      if (W <= 0 || H <= 0) return;
      pitch = W < 520 ? 4 : W < 1000 ? 6 : 7;
      const off = document.createElement("canvas");
      const o = off.getContext("2d", { willReadFrequently: true })!;
      const font = (s: number) => `800 ${s}px ${family}`;
      o.font = font(100);
      const lineW = (line: string[]) => line.reduce((a, ch) => a + o.measureText(ch).width + 2, -2);
      // Fit the widest line to the width, and both lines plus the pending strip to the height.
      const byWidth = (100 * W * 0.995) / Math.max(...LINES.map(lineW));
      const byHeight = (H - pitch * 8) / 1.6;
      const fs = Math.max(24, Math.floor(Math.min(byWidth, byHeight)));
      const cap = Math.ceil(fs * 0.74), lead = Math.ceil(fs * 0.1);
      const textH = cap * 2 + lead;
      off.width = Math.ceil(W);
      off.height = textH + 4;
      o.font = font(fs); // resizing a canvas resets its context state
      const boxes: { ch: string; x0: number; x1: number; top: number; base: number }[] = [];
      LINES.forEach((line, row) => {
        let x = 0;
        for (const ch of line) {
          const w = o.measureText(ch).width;
          boxes.push({ ch, x0: x, x1: x + w, top: row * (cap + lead), base: row * (cap + lead) + cap });
          x += w + fs * 0.02;
        }
      });
      slots = []; nodes = [];
      boxes.forEach((b, li) => {
        o.clearRect(0, 0, off.width, off.height);
        o.fillStyle = "#fff";
        o.fillText(b.ch, b.x0, b.base);
        const data = o.getImageData(0, 0, off.width, off.height).data;
        const mine: Slot[] = [];
        for (let yy = Math.floor(b.top / pitch) * pitch; yy < b.base + pitch; yy += pitch)
          for (let xx = Math.floor(b.x0 / pitch) * pitch; xx < b.x1 + pitch; xx += pitch) {
            const px = Math.min(off.width - 1, Math.round(xx + pitch / 2)), py = Math.round(yy + pitch / 2);
            if (py >= off.height) continue;
            if (data[(py * off.width + px) * 4 + 3] > 140) { const s: Slot = { x: xx, y: yy, node: li, pod: null }; slots.push(s); mine.push(s); }
          }
        nodes.push({ ch: b.ch, alive: true, slots: mine, x0: b.x0, x1: b.x1, y0: b.top, y1: b.base, tone: 0, downAt: 0, upAt: 0 });
      });
      pendY = textH + pitch * 4;
      seed = 20260904; pods = [];
      let id = 0;
      for (const n of nodes) for (const s of n.slots) if (rnd() < FILL) {
        const p: Pod = { id: id++, g: grade(s.x, s.y), slot: s, pending: false, x: s.x, y: s.y, sx: s.x, sy: s.y, tx: s.x, ty: s.y, vx: 0, vy: 0, arc: 0, burst: false, t0: 0, dur: 0, seating: false, landAt: 0, blinkAt: 0 };
        s.pod = p; pods.push(p);
      }
      timers.forEach(clearTimeout); timers.length = 0;
      displaced = 0; rescheduled = 0; statsKey = "";
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      publish(performance.now(), true);
      draw(performance.now());
      setReady(true);
    }

    // ---- motion ----------------------------------------------------------
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    function move(p: Pod, x: number, y: number, delay: number, dur: number, now: number, kind: "plain" | "burst" | "arc" = "plain") {
      p.sx = p.x; p.sy = p.y; p.tx = x; p.ty = y;
      p.t0 = now + delay; p.dur = reduced ? 0 : dur;
      p.burst = kind === "burst"; p.arc = 0;
      if (kind === "burst") {
        // Out of the failed letter first, a little up and away, then down to the queue.
        const a = rnd() * Math.PI * 2, d = 8 + rnd() * 24;
        p.vx = p.x + Math.cos(a) * d; p.vy = p.y + Math.sin(a) * d * 0.6 - 8;
      } else if (kind === "arc") {
        p.arc = Math.min(110, 24 + Math.hypot(x - p.x, y - p.y) * 0.22);
      }
    }
    function step(p: Pod, now: number) {
      if (!p.dur) { p.x = p.tx; p.y = p.ty; }
      else {
        const t = Math.min(1, Math.max(0, (now - p.t0) / p.dur));
        if (p.burst) {
          if (t < 0.3) { const k = easeOut(t / 0.3); p.x = p.sx + (p.vx - p.sx) * k; p.y = p.sy + (p.vy - p.sy) * k; }
          else { const k = easeInOut((t - 0.3) / 0.7); p.x = p.vx + (p.tx - p.vx) * k; p.y = p.vy + (p.ty - p.vy) * k; }
        } else if (p.arc) {
          const k = easeInOut(t), cx = (p.sx + p.tx) / 2, cy = Math.min(p.sy, p.ty) - p.arc, u = 1 - k;
          p.x = u * u * p.sx + 2 * u * k * cx + k * k * p.tx;
          p.y = u * u * p.sy + 2 * u * k * cy + k * k * p.ty;
        } else {
          const k = easeOut(t); p.x = p.sx + (p.tx - p.sx) * k; p.y = p.sy + (p.ty - p.sy) * k;
        }
        if (t < 1) return;
        p.x = p.tx; p.y = p.ty; p.dur = 0; p.burst = false; p.arc = 0;
      }
      if (p.seating) { p.seating = false; if (!reduced) p.landAt = now; rescheduled++; }
    }

    // ---- scheduling ------------------------------------------------------
    const byImportance = (a: Pod, b: Pod) => b.g - a.g || a.id - b.id;
    function layoutPending(now: number, burst: Set<Pod>) {
      const q = pods.filter((p) => p.pending).sort(byImportance);
      const perRow = Math.max(1, Math.floor(W / pitch));
      const rows = Math.max(1, Math.floor((H - pendY) / pitch));
      q.forEach((p, k) => {
        const row = Math.min(rows - 1, Math.floor(k / perRow));
        const x = (k % perRow) * pitch, y = pendY + row * pitch;
        if (p.tx === x && p.ty === y && !burst.has(p)) return;
        move(p, x, y, burst.has(p) ? rnd() * 90 : Math.min(k, 300) * 0.8, burst.has(p) ? 900 : 500, now, burst.has(p) ? "burst" : "plain");
      });
    }
    function seat(now: number) {
      const q = pods.filter((p) => p.pending).sort(byImportance);
      const free = slots.filter((s) => !s.pod && nodes[s.node].alive);
      let k = 0;
      for (const p of q) {
        if (!free.length) break;
        let bi = 0, bd = Infinity;
        for (let i = 0; i < free.length; i++) { const d = Math.abs(free[i].x - p.x) + Math.abs(free[i].y - p.y) * 0.3; if (d < bd) { bd = d; bi = i; } }
        const s = free.splice(bi, 1)[0];
        s.pod = p; p.slot = s; p.pending = false; p.seating = true;
        move(p, s.x, s.y, k * 2.2, 820 + rnd() * 260, now, "arc");
        k++;
      }
      layoutPending(now, new Set());
      return k;
    }
    function fail(ni: number) {
      const n = nodes[ni];
      if (!n || !n.alive) return;
      if (nodes.filter((o) => !o.alive).length >= MAX_DOWN) return;
      const now = performance.now();
      if (nodes.every((o) => o.alive) && !pods.some((p) => p.pending)) { displaced = 0; rescheduled = 0; }
      n.alive = false; n.downAt = now;
      const burst = new Set<Pod>();
      for (const s of n.slots) if (s.pod) { s.pod.pending = true; s.pod.slot = null; s.pod.seating = false; burst.add(s.pod); s.pod = null; }
      displaced += burst.size;
      layoutPending(now, burst);
      start();
      later(() => { seat(performance.now()); start(); }, reduced ? 0 : 950);
      later(() => {
        n.alive = true; n.upAt = performance.now();
        later(() => { seat(performance.now()); start(); }, reduced ? 0 : 380);
        start();
      }, DOWN_FOR);
    }
    api.current = { fail: (i) => { interacted = true; fail(i); } };

    // ---- readout ---------------------------------------------------------
    function publish(now: number, force = false) {
      if (!force && now - lastStats < 90) return;
      lastStats = now;
      const down = nodes.filter((n) => !n.alive).map((n) => n.ch);
      const waiting = pods.reduce((a, p) => a + (p.pending ? 1 : 0), 0);
      const key = `${down.join("")}|${displaced}|${rescheduled}|${waiting}|${pods.length}`;
      if (key === statsKey) return;
      statsKey = key;
      setStats({ down, displaced, rescheduled, waiting, total: pods.length, free: slots.length - pods.length });
    }

    // ---- drawing ---------------------------------------------------------
    // Round dots, sized and lit by importance, like a halftone. Dots of the
    // same colour and opacity step share one path, so a frame is a few dozen
    // fills rather than thousands.
    const paths = new Map<string, Path2D>();
    const dot = (colour: Colour, alpha: number, cx: number, cy: number, r: number) => {
      if (alpha <= 0.01 || r <= 0.2) return;
      const step = Math.min(STEPS - 1, Math.floor(Math.min(1, alpha) * STEPS));
      const key = `${colour}|${step}`;
      let path = paths.get(key);
      if (!path) { path = new Path2D(); paths.set(key, path); }
      path.moveTo(cx + r, cy);
      path.arc(cx, cy, r, 0, Math.PI * 2);
    };
    function draw(now: number) {
      ctx!.clearRect(0, 0, W, H);
      paths.clear();
      const R = 110, half = pitch / 2, rMax = pitch * 0.42;
      for (const n of nodes) n.tone += ((n.alive ? 0 : 1) - n.tone) * (reduced ? 1 : 0.18);
      // Free capacity: pinpricks, a touch brighter under the pointer, coral where a node is down.
      for (const s of slots) {
        if (s.pod) continue;
        const n = nodes[s.node];
        const cx = s.x + half, cy = s.y + half;
        if (n.tone > 0.5) {
          const flash = reduced ? 0 : Math.max(0, 1 - (now - n.downAt) / 420);
          dot("fail", 0.5 * n.tone + 0.4 * flash, cx, cy, rMax * (0.42 + 0.4 * flash));
          continue;
        }
        let a = hovered === s.node ? 0.16 : 0.06, r = rMax * 0.28, colour: Colour = "silver";
        if (pointer) { const d = Math.hypot(cx - pointer.x, cy - pointer.y); if (d < R) a += 0.22 * (1 - d / R); }
        // Recovery sweep: the letter lights top to bottom as the node comes back.
        if (n.upAt && !reduced) {
          const since = now - n.upAt, rowT = ((s.y - n.y0) / Math.max(1, n.y1 - n.y0)) * 320;
          if (since > rowT && since < rowT + 300) { const k = 1 - (since - rowT) / 300; a += 0.55 * k; r = rMax * (0.3 + 0.4 * k); colour = "accent"; }
        }
        dot(colour, a, cx, cy, r);
      }
      for (const p of pods) {
        step(p, now);
        const gn = (p.g - 1) / 8;
        let colour: Colour = `g${p.g}`;
        let a = 0.3 + 0.62 * gn;
        let r = rMax * (0.64 + 0.36 * gn);
        if (p.pending) { a *= 0.6; r *= 0.8; }
        if (hovered >= 0 && p.slot?.node === hovered) a += 0.12;
        if (pointer) {
          const d = Math.hypot(p.x + half - pointer.x, p.y + half - pointer.y);
          if (d < R) { const k = Math.pow(1 - d / R, 2); a += 0.35 * k; r *= 1 + 0.3 * k; }
        }
        if (p.blinkAt) { const b = (now - p.blinkAt) / 560; if (b < 1) a *= 0.3 + 0.7 * Math.abs(b * 2 - 1); else p.blinkAt = 0; }
        // Landing: a brief swell in the accent, then back to its own colour.
        if (p.landAt) {
          const f = 1 - (now - p.landAt) / 520;
          if (f > 0) { colour = "accent"; a = Math.max(a, 0.5 + 0.45 * f); r *= 1 + 0.55 * f; } else p.landAt = 0;
        }
        dot(colour, a, p.x + half, p.y + half, r);
      }
      for (const [key, path] of paths) {
        const [colour, step] = key.split("|");
        ctx!.fillStyle = rgba(COLOURS[colour as Colour], (Number(step) + 0.5) / STEPS);
        ctx!.fill(path);
      }
      if (pods.some((p) => p.pending)) {
        ctx!.fillStyle = rgba(LABEL, 0.8);
        ctx!.font = `500 11px ${family}`;
        ctx!.fillText("pending", 0, pendY - 7);
      }
      // A tag on the hovered letter.
      if (pointer && hovered >= 0) {
        const n = nodes[hovered];
        const count = n.slots.reduce((acc, s) => acc + (s.pod ? 1 : 0), 0);
        const text = n.alive ? `node ${n.ch} · ${count} pods · click to fail` : `node ${n.ch} · down`;
        ctx!.font = `500 12px ${family}`;
        const tw = ctx!.measureText(text).width;
        const x = Math.min(W - tw - 22, pointer.x + 16), y = Math.max(4, pointer.y - 36);
        ctx!.beginPath();
        ctx!.roundRect(x, y, tw + 18, 26, 13);
        ctx!.fillStyle = "rgba(12,20,27,0.9)";
        ctx!.fill();
        ctx!.strokeStyle = n.alive ? rgba(SILVER, 0.18) : rgba(FAIL, 0.45);
        ctx!.stroke();
        ctx!.fillStyle = n.alive ? rgba(SILVER, 0.92) : rgba(FAIL, 1);
        ctx!.fillText(text, x + 9, y + 17);
      }
    }

    // ---- loop ------------------------------------------------------------
    const loop = (now: number) => {
      // Now and then a pod restarts: a quick blink, so the name never looks frozen.
      if (!reduced && pods.length && rnd() < 0.06) { const p = pods[Math.floor(rnd() * pods.length)]; if (!p.pending && !p.dur) p.blinkAt = now; }
      draw(now);
      publish(now);
      if (running) raf = requestAnimationFrame(loop);
    };
    function start() {
      if (reduced) { const now = performance.now(); draw(now); publish(now, true); return; }
      if (running || !visible || document.hidden) return;
      running = true; raf = requestAnimationFrame(loop);
    }
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    // ---- input -----------------------------------------------------------
    const toLocal = (ev: PointerEvent | MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: (ev.clientX - r.left) * (W / r.width), y: (ev.clientY - r.top) * (H / r.height) };
    };
    const nodeAt = (x: number, y: number) => nodes.findIndex((n) => x >= n.x0 - 2 && x <= n.x1 + 2 && y >= n.y0 - 4 && y <= n.y1 + 4);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer = toLocal(e);
      hovered = nodeAt(pointer.x, pointer.y);
      canvas.style.cursor = hovered >= 0 && nodes[hovered].alive ? "pointer" : "default";
      if (reduced) draw(performance.now());
    };
    const onLeave = () => { pointer = null; hovered = -1; if (reduced) draw(performance.now()); };
    const onClick = (e: MouseEvent) => { interacted = true; const p = toLocal(e); const n = nodeAt(p.x, p.y); if (n >= 0) fail(n); };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("click", onClick);

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); });
    io.observe(stage);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    let rt = 0;
    const onResize = () => { clearTimeout(rt); rt = window.setTimeout(build, 200); };
    window.addEventListener("resize", onResize);

    document.fonts.ready.then(() => {
      build();
      start();
      // One unprompted failure shows what the name does. Never again once someone has clicked.
      if (!reduced) later(() => { if (!interacted && visible) fail(5); }, 2600);
    });

    return () => {
      stop();
      timers.forEach(clearTimeout);
      clearTimeout(rt);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick);
      api.current = null;
    };
  }, []);

  const incident = stats.down.length > 0 || stats.waiting > 0;
  const n = (v: number) => v.toLocaleString("en-GB");
  const figures = incident
    ? [["displaced", stats.displaced, "is-down"], ["rescheduled", stats.rescheduled, ""], ["waiting", stats.waiting, "is-waiting"]] as const
    : [["pods", stats.total, ""], ["nodes", 10, ""], ["free slots", stats.free, ""]] as const;
  return (
    <div className="pod-hero-body" data-ready={ready}>
      <div className="pod-top">
        <div className="pod-stage">
          <p className="pod-fallback" aria-hidden="true">JACK<br />DEVLIN</p>
          <canvas
            ref={ref}
            className="pod-canvas font-sans"
            role="img"
            aria-label="The name Jack Devlin drawn as a cluster: each letter is a node and each square a pod. Failing a letter sends its pods to a queue, and the other letters take the most important ones first."
          />
        </div>
        <div className="pod-readout">
          <p className="pod-readout-line" aria-live="polite">
            {incident
              ? <>{stats.down.length ? <>Node{stats.down.length > 1 ? "s" : ""} <b className="is-down">{stats.down.join(", ")}</b> down.</> : <>All nodes back.</>} The most important pods go back first; the rest wait for room.</>
              : <>Every letter is a node, every square a pod. Click a letter to take it down.</>}
          </p>
          <dl className="pod-figures">
            {figures.map(([label, value, cls]) => <div key={label}><dt>{label}</dt><dd className={cls}>{stats.total ? n(value) : "–"}</dd></div>)}
          </dl>
          <p className="pod-fine">An illustration, not live data.<Link href="/projects/ml-scheduler">How the scheduler decides →</Link></p>
        </div>
      </div>
      <div className="pod-keys" role="group" aria-label="Fail a node">
        {LETTERS.map((ch, i) => <button key={i} type="button" onClick={() => api.current?.fail(i)}>Fail node {ch}</button>)}
      </div>
      <div className="pod-copy">{children}</div>
    </div>
  );
}
