"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * My name as a cluster: each letter is a node, each square a pod, and
 * brightness is importance. Click a letter and that node fails. Its pods
 * queue, the surviving letters take the most important first, and what
 * won't fit waits in a pending strip until the node comes back.
 *
 * It's the dissertation's selection rule at the size of a heading. Nodes
 * start about 92% full so a failure always leaves something waiting.
 * Nothing here is measured data; the results live on /projects/ml-scheduler.
 *
 * Draws only when something moves. Reduced motion: moves are instant.
 */

// Canvas can't read CSS variables; these mirror the folio tokens.
const INK = [211, 233, 157]; // --color-primary
const FAIL = [234, 165, 151]; // --color-error
const LABEL = [168, 182, 187]; // --color-muted-foreground
const LINES = [["J", "A", "C", "K"], ["D", "E", "V", "L", "I", "N"]];
const FILL = 0.92;

interface Slot { x: number; y: number; node: number; pod: Pod | null }
interface Pod { id: number; g: number; slot: Slot | null; pending: boolean; x: number; y: number; sx: number; sy: number; tx: number; ty: number; t0: number; dur: number }
interface Node { ch: string; alive: boolean; slots: Slot[]; x0: number; x1: number; y0: number; y1: number; tone: number }

export function PodName() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const family = getComputedStyle(canvas).fontFamily;

    let W = 0, H = 0, pitch = 6, cell = 5, pendY = 0;
    let slots: Slot[] = [], pods: Pod[] = [], nodes: Node[] = [];
    let hovered = -1, running = false, raf = 0;
    const timers: number[] = [];

    let seed = 20260904;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    const grade = () => { const r = rnd(); return r < 0.22 ? 7 + Math.floor(rnd() * 3) : r < 0.52 ? 4 + Math.floor(rnd() * 3) : 1 + Math.floor(rnd() * 3); };
    const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    const resting = () => `${nodes.length} nodes, ${pods.length.toLocaleString("en-GB")} pods, each node about 90% full. Click a letter to fail that node.`;

    function build() {
      W = canvas!.clientWidth;
      if (W <= 0) return;
      pitch = W < 520 ? 5 : W < 1000 ? 6 : 7;
      cell = pitch - 1;
      const off = document.createElement("canvas");
      const o = off.getContext("2d", { willReadFrequently: true })!;
      const font = (s: number) => `800 ${s}px ${family}`;
      let fs = 100;
      o.font = font(fs);
      const lineW = (line: string[]) => line.reduce((a, ch) => a + o.measureText(ch).width + fs * 0.02, -fs * 0.02);
      fs = Math.floor((100 * W * 0.99) / Math.max(...LINES.map(lineW)));
      const cap = Math.ceil(fs * 0.74), lead = Math.ceil(fs * 0.1);
      const textH = cap * 2 + lead;
      H = textH + pitch * 9;
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
            if (data[(py * off.width + px) * 4 + 3] > 140) { const s = { x: xx, y: yy, node: li, pod: null }; slots.push(s); mine.push(s); }
          }
        nodes.push({ ch: b.ch, alive: true, slots: mine, x0: b.x0, x1: b.x1, y0: b.top, y1: b.base, tone: 0 });
      });
      pendY = textH + pitch * 5;
      seed = 20260904; pods = [];
      let id = 0;
      for (const n of nodes) for (const s of n.slots) if (rnd() < FILL) {
        const p: Pod = { id: id++, g: grade(), slot: s, pending: false, x: s.x, y: s.y, sx: s.x, sy: s.y, tx: s.x, ty: s.y, t0: 0, dur: 0 };
        s.pod = p; pods.push(p);
      }
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      setStatus(resting());
      draw(performance.now());
    }

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const move = (p: Pod, x: number, y: number, delay: number, dur: number, now: number) => { p.sx = p.x; p.sy = p.y; p.tx = x; p.ty = y; p.t0 = now + delay; p.dur = reduced ? 0 : dur; };
    const step = (p: Pod, now: number) => {
      if (!p.dur) { p.x = p.tx; p.y = p.ty; return; }
      const k = ease(Math.min(1, Math.max(0, (now - p.t0) / p.dur)));
      p.x = p.sx + (p.tx - p.sx) * k; p.y = p.sy + (p.ty - p.sy) * k;
    };
    const byImportance = (a: Pod, b: Pod) => b.g - a.g || a.id - b.id;
    const layoutPending = (now: number, base: number) => {
      const q = pods.filter((p) => p.pending).sort(byImportance);
      const perRow = Math.max(1, Math.floor(W / pitch));
      q.forEach((p, k) => move(p, (k % perRow) * pitch, pendY + Math.floor(k / perRow) * pitch, base + Math.min(k, 200) * 1.5, 700, now));
    };
    const seat = (now: number) => {
      const q = pods.filter((p) => p.pending).sort(byImportance);
      const free = slots.filter((s) => !s.pod && nodes[s.node].alive);
      let seated = 0;
      for (const p of q) {
        if (!free.length) break;
        let bi = 0, bd = Infinity;
        for (let i = 0; i < free.length; i++) { const d = Math.abs(free[i].x - p.x) + Math.abs(free[i].y - p.y) * 0.3; if (d < bd) { bd = d; bi = i; } }
        const s = free.splice(bi, 1)[0];
        s.pod = p; p.slot = s; p.pending = false;
        move(p, s.x, s.y, seated * 1.2, 900, now);
        seated++;
      }
      layoutPending(now, seated * 1.2);
      return seated;
    };

    function fail(ni: number) {
      const n = nodes[ni];
      if (!n || !n.alive) return;
      timers.forEach(clearTimeout); timers.length = 0;
      for (const o of nodes) if (!o.alive) o.alive = true;
      n.alive = false;
      let lost = 0;
      for (const s of n.slots) if (s.pod) { s.pod.pending = true; s.pod.slot = null; s.pod = null; lost++; }
      layoutPending(performance.now(), 0);
      setStatus(`Node ${n.ch} is down. ${lost} pods displaced. Scheduling the most important first…`);
      start();
      timers.push(window.setTimeout(() => {
        const seated = seat(performance.now());
        const waiting = pods.filter((p) => p.pending);
        const important = waiting.filter((p) => p.g >= 7).length;
        setStatus(`Node ${n.ch} is down. ${lost} pods displaced, ${seated} rescheduled brightest first, ${waiting.length} waiting for room${important ? `, ${important} of them important` : ", none of them important"}.`);
        start();
        timers.push(window.setTimeout(() => {
          n.alive = true;
          const back = seat(performance.now());
          setStatus(`Node ${n.ch} is back and took ${back} waiting pods. ${resting()}`);
          start();
        }, 4200));
      }, reduced ? 0 : 900));
    }

    function draw(now: number) {
      ctx!.clearRect(0, 0, W, H);
      for (const n of nodes) n.tone += ((n.alive ? 0 : 1) - n.tone) * (reduced ? 1 : 0.15);
      for (const s of slots) {
        if (s.pod) continue;
        const n = nodes[s.node];
        ctx!.fillStyle = n.tone > 0.5 ? rgba(FAIL, 0.45 * n.tone) : rgba(INK, hovered === s.node ? 0.25 : 0.08);
        ctx!.fillRect(s.x + cell / 2 - 1, s.y + cell / 2 - 1, 2, 2);
      }
      for (const p of pods) {
        step(p, now);
        let a = 0.14 + 0.86 * Math.pow((p.g - 1) / 8, 1.25);
        if (p.pending) a *= 0.55;
        if (hovered >= 0 && p.slot?.node === hovered) a = Math.min(1, a + 0.12);
        ctx!.fillStyle = rgba(INK, a);
        ctx!.fillRect(p.x, p.y, cell, cell);
      }
      if (pods.some((p) => p.pending)) {
        ctx!.fillStyle = rgba(LABEL, 0.8);
        ctx!.font = `500 11px ${family}`;
        ctx!.fillText("pending", 0, pendY - 8);
      }
    }
    const animating = (now: number) => pods.some((p) => p.dur && now < p.t0 + p.dur) || nodes.some((n) => Math.abs((n.alive ? 0 : 1) - n.tone) > 0.01);
    const loop = (now: number) => { draw(now); if (running && animating(now)) raf = requestAnimationFrame(loop); else running = false; };
    const start = () => { if (running) return; running = true; raf = requestAnimationFrame(loop); };

    const nodeAt = (ev: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = (ev.clientX - r.left) * (W / r.width), y = (ev.clientY - r.top) * (H / r.height);
      return nodes.findIndex((n) => x >= n.x0 - 2 && x <= n.x1 + 2 && y >= n.y0 - 4 && y <= n.y1 + 4);
    };
    const onMove = (e: PointerEvent) => { const n = nodeAt(e); if (n !== hovered) { hovered = n; canvas.style.cursor = n >= 0 ? "pointer" : "default"; draw(performance.now()); } };
    const onLeave = () => { hovered = -1; draw(performance.now()); };
    const onClick = (e: MouseEvent) => { const n = nodeAt(e); if (n >= 0) fail(n); };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("click", onClick);

    let rt = 0;
    const onResize = () => { clearTimeout(rt); rt = window.setTimeout(build, 200); };
    window.addEventListener("resize", onResize);
    document.fonts.ready.then(build);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      clearTimeout(rt);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div className="pod-name">
      <canvas
        ref={ref}
        className="block w-full font-sans"
        role="img"
        aria-label="The name Jack Devlin drawn as a cluster of pods. Each letter is a node; clicking one fails it and the most important pods reschedule first."
      />
      <p className="mt-6 min-h-[3.2em] max-w-2xl text-sm leading-relaxed text-muted-foreground" role="status">{status}</p>
      <p className="mt-4 flex flex-wrap justify-between gap-3 border-t border-border pt-4 font-mono text-xs text-muted-foreground">
        <span>Brighter means more important · an illustration, not live data</span>
        <Link href="/projects/ml-scheduler" className="border-b border-border hover:border-primary hover:text-primary">The research behind it →</Link>
      </p>
    </div>
  );
}
