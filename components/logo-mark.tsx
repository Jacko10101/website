"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * The DevlinOps mark, redrawn.
 *
 * The original is a raster in blue, orange and navy — three hues that exist
 * nowhere else here, which is why it had never made it onto the site. The idea
 * underneath it is good: a D and an O sharing a hexagon, set side by side and
 * touching, not overlapping. This is that idea as geometry, in one colour,
 * inheriting `currentColor` so it takes the page's phosphor — including a case
 * study's own tube.
 *
 * It draws itself once: the hexagon closes, then the stem, then the bowl, then
 * the O lands. After that a slow highlight passes across it every few seconds
 * — a phosphor sweep, the one thing on the page still moving. Both are off for
 * reduced-motion visitors, and the draw is off for the small nav copy, which
 * would otherwise redraw on every navigation.
 */

const HEX =
  "M32 3.5 L56.7 17.75 L56.7 46.25 L32 60.5 L7.3 46.25 L7.3 17.75 Z";
// Stem, bar out to the shoulder, half-round bowl back to the foot. Bar length
// equals the bowl radius, so the D comes out 20 wide against the O's 20 — the
// pair reads as one word rather than a letter and a circle. The bowl closes at
// x=32, which is exactly where the O begins: they touch, they don't overlap.
const D_STEM = "M12 22 L12 42";
const D_BOWL = "M12 22 H22 A10 10 0 0 1 22 42 H12";
const O_CX = 42;
const O_R = 10;

export function LogoMark({
  className = "",
  animate = false,
  shimmer = false,
  strokeWidth = 2.5,
}: {
  className?: string;
  /** Draw-on. Off by default: the nav copy must not redraw on every route. */
  animate?: boolean;
  /** The slow highlight sweep. Reserved for the large copy. */
  shimmer?: boolean;
  strokeWidth?: number;
}) {
  const reduceMotion = useReducedMotion();
  const gradientId = useId();
  const draw = animate && !reduceMotion;
  const sweep = shimmer && !reduceMotion;

  // One shared clock. Each stroke starts as the one before it finishes, so it
  // reads as a single gesture rather than four separate reveals.
  const stroke = (delay: number, duration: number) =>
    draw
      ? {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: {
            pathLength: { duration, delay, ease: [0.22, 1, 0.36, 1] as const },
            opacity: { duration: 0.01, delay },
          },
        }
      : {};

  const strokePaint = sweep ? `url(#${gradientId})` : "currentColor";

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke={strokePaint}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role="img"
      aria-label="DevlinOps"
    >
      {sweep && (
        <defs>
          {/* userSpaceOnUse, so one band crosses the whole mark rather than
              each shape lighting up inside its own bounding box. The band is
              30 units wide and travels the 64-unit face with a long rest
              between passes — a sweep you notice once, not a pulse. */}
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1="-26"
            y1="0"
            x2="4"
            y2="0"
          >
            <stop offset="0" stopColor="currentColor" stopOpacity="0.7" />
            <stop offset="0.5" stopColor="currentColor" stopOpacity="1" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.7" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="0 0; 92 0; 92 0"
              keyTimes="0; 0.45; 1"
              dur="5.5s"
              begin="1.8s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
      )}

      <motion.path d={HEX} opacity={0.6} {...stroke(0, 0.62)} />
      <motion.path d={D_STEM} {...stroke(0.38, 0.24)} />
      <motion.path d={D_BOWL} {...stroke(0.54, 0.34)} />
      <motion.circle cx={O_CX} cy={32} r={O_R} {...stroke(0.72, 0.4)} />
    </svg>
  );
}
