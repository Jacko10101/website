"use client";

import { MotionConfig } from "framer-motion";
import { ReactNode } from "react";

/**
 * Makes every framer-motion animation on the site honour the user's
 * `prefers-reduced-motion` setting. framer animates via JS/WAAPI, so the CSS
 * `@media (prefers-reduced-motion)` block in globals.css can't reach it —
 * `reducedMotion="user"` does, disabling transform/layout animations (the
 * drifting orbs, scanline, rotating decorations) for those users while leaving
 * everyone else's experience untouched.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
