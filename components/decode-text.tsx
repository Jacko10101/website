"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const SCRAMBLE = "!<>-_\\/[]{}—=+*^?#________";

/**
 * Terminal decode effect: text resolves from scramble glyphs to its final
 * form, left to right, when it enters the viewport. Static under reduced
 * motion. Screen readers always get the real text.
 */
export function DecodeText({
  text,
  className = "",
  duration = 700,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  // Starts on the real text so the server-rendered HTML is readable and the
  // page is correct without JS. `armed` flips on mount, before paint, so the
  // effect never scrambles text the visitor has already read.
  const [display, setDisplay] = useState(text);
  const [done, setDone] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => setArmed(true), []);

  useEffect(() => {
    if (!armed) return;
    if (!inView || reduceMotion) {
      setDisplay(text);
      setDone(true);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const resolved = Math.floor(progress * text.length);
      let out = text.slice(0, resolved);
      for (let i = resolved; i < text.length; i++) {
        out += text[i] === " "
          ? " "
          : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
      }
      setDisplay(out);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [armed, inView, reduceMotion, text, duration]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{done ? text : display}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
