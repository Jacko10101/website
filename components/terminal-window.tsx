"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import type { TerminalLine } from "@/lib/projects";

const toneClasses: Record<TerminalLine["tone"], string> = {
  cmd: "text-muted-foreground",
  ok: "text-primary",
  info: "text-foreground/80",
  warn: "text-warn",
};

/**
 * Shared terminal chrome. The traffic lights were previously re-implemented
 * inline in seven components.
 */
export function TerminalWindow({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-border bg-black/60 overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/60 bg-card/50">
        <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-error/60" />
        <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-warn/60" />
        <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-primary/60" />
        <span className="ml-2 text-xs text-muted-foreground font-mono">{title}</span>
      </div>
      {children}
    </div>
  );
}

/**
 * Terminal lines that type themselves when scrolled into view, line by line.
 * Reduced-motion users (and completed runs) see the full static output.
 */
export function TypedLines({
  lines,
  charDelay = 14,
  lineDelay = 180,
  className = "",
}: {
  lines: TerminalLine[];
  charDelay?: number;
  lineDelay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState({ line: 0, char: 0 });

  const done =
    reduceMotion ||
    progress.line >= lines.length;

  useEffect(() => {
    if (!inView || reduceMotion || progress.line >= lines.length) return;
    const current = lines[progress.line];
    const timer = setTimeout(
      () => {
        if (progress.char < current.text.length) {
          setProgress({ line: progress.line, char: progress.char + 1 });
        } else {
          setProgress({ line: progress.line + 1, char: 0 });
        }
      },
      progress.char === 0 ? lineDelay : charDelay
    );
    return () => clearTimeout(timer);
  }, [inView, reduceMotion, progress, lines, charDelay, lineDelay]);

  return (
    <div ref={ref} className={`font-mono text-xs space-y-1 ${className}`}>
      {lines.map((line, i) => {
        const visible = done || i < progress.line;
        const typing = !done && i === progress.line;
        if (!visible && !typing) {
          // Reserve the height so the card doesn't grow while typing.
          return (
            <div key={i} className="whitespace-pre-wrap opacity-0" aria-hidden>
              {line.text}
            </div>
          );
        }
        return (
          <div key={i} className={`whitespace-pre-wrap ${toneClasses[line.tone]}`}>
            {typing ? line.text.slice(0, progress.char) : line.text}
            {typing && <span className="cursor-blink !h-[0.9em] !w-[0.5em]" aria-hidden />}
          </div>
        );
      })}
    </div>
  );
}
