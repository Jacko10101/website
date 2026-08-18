"use client";

import { useId } from "react";

/**
 * The DevlinOps mark.
 *
 * Drawn, not traced. The trace off the 256px raster carried every wobble in
 * the source — fine at 24px in the nav, visibly hand-drawn at 350px in the
 * hero. With the original's orange ribbon gone the mark is just a D and an O
 * meeting in the middle, and those are two arcs and two circles, so they are
 * constructed here instead: exact curves, even weight, crisp at any size.
 *
 * The ribbon is not drawn because as a static shape in one colour it read as a
 * frozen highlight lying across the letters. The light that travels through
 * the mark takes its place — a repeating gradient translated by exactly one
 * wavelength, so it loops seamlessly and never stops. A CSS transform drives
 * it; SMIL on a gradient would not start reliably.
 *
 * The hexagon is flatter than the original's. At the source's proportions the
 * letters sat in a band across the middle with dead space above and below
 * them; bringing the points in makes the frame hug the letters.
 *
 * Everything is `currentColor`, so the mark takes the page's phosphor.
 */

/** D: stem plus a half-round bowl, with its counter cut out. */
const LETTER_D =
  "M10 20 H24 A12 12 0 0 1 24 44 H10 Z M16 26 H24 A6 6 0 0 1 24 38 H16 Z";

/** O: a ring, overlapping the D's bowl so the two merge as they do in the
 *  original. Its own path, so the overlap unions instead of cancelling out
 *  under the even-odd rule. */
const LETTER_O =
  "M30 32 A12 12 0 1 0 54 32 A12 12 0 1 0 30 32 Z M36 32 A6 6 0 1 0 48 32 A6 6 0 1 0 36 32 Z";

/** Flattened hexagon, sized to sit close around the letters. */
const HEX = "M32 8 L58.3 20 L58.3 44 L32 56 L5.7 44 L5.7 20 Z";

/** One wavelength of the sweep. The band travels exactly this far per cycle,
 *  which is what lets a repeating gradient loop without a seam. */
const WAVE = { x: 34, y: 18 };

export function LogoMark({
  className = "",
  shimmer = false,
  hexWidth = 2.4,
}: {
  className?: string;
  /** The light travelling through the whole mark. */
  shimmer?: boolean;
  /** Weight of the hexagon outline, in viewBox units. */
  hexWidth?: number;
}) {
  const uid = useId();
  const maskId = `mark-${uid}`;
  const gradId = `sweep-${uid}`;

  // Eased in off the frame a little: drawn at full size the D's stem sits ~3
  // units off the hexagon's inner edge, which reads as a collision.
  const letters = (fill: string) => (
    <g transform="translate(32 32) scale(0.93) translate(-32 -32)">
      <path d={LETTER_D} fill={fill} fillRule="evenodd" />
      <path d={LETTER_O} fill={fill} fillRule="evenodd" />
    </g>
  );

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="DevlinOps"
    >
      <defs>
        {shimmer && (
          <>
            {/* A mask rather than a clip path: the hexagon is a stroke, and
                clip paths only take fills — the light has to travel through the
                frame as well as the letters. */}
            <mask
              id={maskId}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="64"
              height="64"
            >
              <path
                d={HEX}
                fill="none"
                stroke="#fff"
                strokeWidth={hexWidth}
                strokeLinejoin="round"
              />
              {letters("#fff")}
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
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.6" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </>
        )}
      </defs>

      <path
        d={HEX}
        fill="none"
        stroke="currentColor"
        strokeWidth={hexWidth}
        strokeLinejoin="round"
      />
      {letters("currentColor")}

      {shimmer && (
        <g mask={`url(#${maskId})`}>
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
