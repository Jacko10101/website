"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * A living field of terminal glyphs rendered to canvas — generative
 * topography drawn in text. Waves of brightness drift through a character
 * grid; the cursor is a local light source that excites nearby cells.
 * Deliberately NOT matrix rain: no falling streams, no random churn —
 * slow interference waves, like watching load move across a cluster.
 *
 * Cheap by construction: one canvas, one rAF loop, ~15fps redraw budget,
 * paused when offscreen, single static frame under reduced motion.
 */

const GLYPHS = "·:∙+×╱╲│─┼☰01".split("");
const CELL = 18;

export function AsciiField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let last = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    // Stable per-cell glyph choice so the field doesn't flicker.
    let cols = 0;
    let rows = 0;
    let cellGlyphs: string[] = [];
    let cellPhase: number[] = [];

    const seed = (x: number, y: number) => {
      const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return s - Math.floor(s);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
      cellGlyphs = new Array(cols * rows);
      cellPhase = new Array(cols * rows);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          cellGlyphs[i] = GLYPHS[Math.floor(seed(x, y) * GLYPHS.length)];
          cellPhase[i] = seed(x + 51, y + 17) * Math.PI * 2;
        }
      }
      ctx.font = `12px ${getComputedStyle(document.body).getPropertyValue("--font-jetbrains") || "monospace"}, monospace`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
    };

    const draw = (t: number) => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      const time = t / 1000;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const px = x * CELL;
          const py = y * CELL;

          // Two slow interference waves + per-cell phase.
          const wave =
            Math.sin(x * 0.18 + time * 0.55 + cellPhase[i]) *
              Math.cos(y * 0.16 - time * 0.4) +
            Math.sin((x + y) * 0.09 + time * 0.3);

          // Cursor excitation — a local phosphor hotspot.
          let boost = 0;
          if (mouse.active) {
            const dx = px - mouse.x;
            const dy = py - mouse.y;
            const d2 = dx * dx + dy * dy;
            boost = Math.max(0, 1 - d2 / (240 * 240)) * 1.4;
          }

          const intensity = Math.max(0, wave * 0.28 + 0.06 + boost);
          if (intensity < 0.05) continue;

          const alpha = Math.min(intensity, 1) * 0.55;
          ctx.fillStyle =
            boost > 0.25
              ? `oklch(0.8 0.21 150 / ${Math.min(alpha + 0.15, 0.9)})`
              : `oklch(0.72 0.17 150 / ${alpha})`;
          ctx.fillText(cellGlyphs[i], px, py);
        }
      }
    };

    const loop = (t: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (t - last < 66) return; // ~15fps is plenty for this
      last = t;
      draw(t);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      draw(0); // one static frame
    } else {
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else {
          running = false;
          cancelAnimationFrame(raf);
        }
      });
      io.observe(canvas);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);

      return () => {
        running = false;
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerleave", onLeave);
      };
    }

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
