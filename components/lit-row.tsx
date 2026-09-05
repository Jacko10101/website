"use client";

import Link from "next/link";
import type { ComponentProps, PointerEvent } from "react";

/**
 * A row that lights where the pointer is. The highlight is a soft radial
 * behind the row, positioned by two CSS variables this handler keeps
 * current, drawn by `.lit-row::before` in globals.css. No shadow, no glow
 * outside the row, nothing on touch devices, nothing at rest.
 */
export function LitRow({ className = "", onPointerMove, ...rest }: ComponentProps<typeof Link>) {
  const track = (e: PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
    onPointerMove?.(e);
  };
  return <Link {...rest} onPointerMove={track} className={`lit-row ${className}`} />;
}
