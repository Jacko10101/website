"use client";

import { useEffect, useRef, type ReactNode, type PointerEvent } from "react";

/** Move the product image as a physical object; the link keeps native behavior. */
export function WorkPreview({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function reset() {
    cancelAnimationFrame(frame.current);
    root.current?.removeAttribute("data-tracking");
    root.current?.style.removeProperty("--preview-x");
    root.current?.style.removeProperty("--preview-y");
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      element.dataset.tracking = "true";
      element.style.setProperty("--preview-x", `${(x - .5) * 4}deg`);
      element.style.setProperty("--preview-y", `${(.5 - y) * 4}deg`);
      element.style.setProperty("--shine-x", `${x * 100}%`);
      element.style.setProperty("--shine-y", `${y * 100}%`);
    });
  }

  return <div ref={root} className="work-preview" onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>{children}</div>;
}
