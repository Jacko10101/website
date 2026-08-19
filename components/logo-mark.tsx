"use client";

import { useId } from "react";

/**
 * The DevlinOps mark.
 *
 * The original's whole idea is that the D and the O are intertwined — they
 * overlap, and the orange ribbon is what tells you which strand passes in
 * front at each crossing. Drop the second colour and the weave has to come from
 * the geometry instead: the strand going *under* is broken where the other
 * crosses it, which is how a monoline knot has always been drawn.
 *
 * The bowl is a semicircle of r=13 centred at (17.5, 32) and the O is r=13 at
 * (38.5, 32). Centres 21 apart puts the crossings at exactly (28, 24.34) and
 * (28, 39.67) — the breaks sit on those points, computed rather than nudged
 * into place. The O passes over the D at the top, the D over the O at the
 * foot, so it reads as a link rather than as two shapes sharing a box.
 *
 * Monoline throughout: one weight for the frame and both letters, nothing
 * filled. The solid version was faithful to the raster and read as a chunky
 * green blob at hero size.
 *
 * The light travelling through the mark is what the orange ribbon used to be:
 * a repeating gradient translated by exactly one wavelength, so it loops
 * seamlessly and never stops. A CSS transform drives it; SMIL on a gradient
 * would not start reliably.
 *
 * Everything is `currentColor`, so the mark takes the page's phosphor.
 */

const D_STEM = "M12.5 19 L12.5 45";
/** Stem, shoulder, half-round bowl, foot. */
const D_BOWL = "M12.5 19 H17.5 A13 13 0 0 1 17.5 45 H12.5";
const O = { cx: 38.5, cy: 32, r: 13 };
/** Where the bowl and the O actually cross. */
const CROSS_TOP = { x: 28, y: 24.34 };
const CROSS_FOOT = { x: 28, y: 39.67 };
/** Frame, sized to sit close around the letters. */
const HEX = "M32 6 L58.3 18 L58.3 46 L32 58 L5.7 46 L5.7 18 Z";

/** One wavelength of the sweep. The band travels exactly this far per cycle,
 *  which is what lets a repeating gradient loop without a seam. */
const WAVE = { x: 34, y: 18 };

export function LogoMark({
  className = "",
  shimmer = false,
  strokeWidth = 2.2,
}: {
  className?: string;
  /** The light travelling through the whole mark. */
  shimmer?: boolean;
  /** The one weight, in viewBox units. */
  strokeWidth?: number;
}) {
  const uid = useId();
  const bowlBreak = `bowl-${uid}`;
  const ringBreak = `ring-${uid}`;
  const inkMask = `ink-${uid}`;
  const gradId = `sweep-${uid}`;
  // The hole has to clear the crossing strand's full width, or a hairline of
  // it survives and the break reads as a printing fault.
  const gap = strokeWidth * 1.55;

  const breakMask = (id: string, at: { x: number; y: number }) => (
    <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
      <rect x="0" y="0" width="64" height="64" fill="#fff" />
      <circle cx={at.x} cy={at.y} r={gap} fill="#000" />
    </mask>
  );

  const shapes = (
    <>
      <path d={HEX} />
      <path d={D_STEM} />
      {/* Broken at the top crossing: the O goes over here. */}
      <path d={D_BOWL} mask={`url(#${bowlBreak})`} />
      {/* Broken at the foot: the D goes over there. */}
      <circle cx={O.cx} cy={O.cy} r={O.r} mask={`url(#${ringBreak})`} />
    </>
  );

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      role="img"
      aria-label="DevlinOps"
    >
      <defs>
        {breakMask(bowlBreak, CROSS_TOP)}
        {breakMask(ringBreak, CROSS_FOOT)}
        {shimmer && (
          <>
            {/* A mask, not a clip path: everything here is a stroke, and clip
                paths only take fills. */}
            <mask id={inkMask} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
              <g
                stroke="#fff"
                fill="none"
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                {shapes}
              </g>
            </mask>
            <linearGradient
              id={gradId}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2={WAVE.x}
              y2={WAVE.y}
              spreadMethod="repeat"
            >
              {/* Both ends transparent, so each repeat meets the next cleanly. */}
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.75" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </>
        )}
      </defs>

      {shapes}

      {shimmer && (
        <g mask={`url(#${inkMask})`} stroke="none">
          <rect
            className="logo-sweep"
            x="-120"
            y="-80"
            width="320"
            height="240"
            fill={`url(#${gradId})`}
          />
        </g>
      )}
    </svg>
  );
}
