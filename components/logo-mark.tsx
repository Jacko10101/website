"use client";

import { useId } from "react";

/**
 * The DevlinOps mark, traced from the original artwork.
 *
 * There is no vector source for the logo — only a 256px raster in blue, orange
 * and navy, three hues that exist nowhere else on this site. Redrawing the
 * intertwine by eye kept missing it, because it is not two outlines crossing:
 * it is one ribbon that loops and hands over from one colour to the other at
 * the crossover.
 *
 * So these two paths are the real thing, traced from `public/logo.png` by
 * marching squares over a 6x supersample, Douglas-Peucker simplified and
 * Chaikin smoothed. `STRUCTURE` is everything that was navy — the hexagon, the
 * D, and the far side of the O. `RIBBON` is the orange sweep that crosses the
 * D and closes the O. Both take site colours, so the mark finally meshes with
 * the page it is on, including each case study's own phosphor.
 *
 * The glint sits on the crossover, because the crossover is the whole idea.
 */

const STRUCTURE =
  "M32.32 1.21L34.37 1.62L39.51 4.52L53.65 12.89L56.68 14.82L58.95 16.67L59.7 17.87L60.13 19.13L60.39 35.2L60.31 39.94L59.91 45.48L59.22 47.01L58.24 48.24L53.03 51.69L36.69 61.36L33.94 62.74L31.61 63.25L29.72 62.74L26.97 61.36L14.67 54.14L7.67 49.74L5.87 48.44L4.64 47.06L3.68 45.18L3.53 43.2L3.38 29L3.68 18.9L4.16 17.65L5.44 15.92L9.63 13L25.23 3.87L29.35 1.78L31.9 1.18ZM31.05 5.28L29.04 6.25L16.93 13.3L12.9 15.77L8.48 18.83L8.09 19.42L7.65 24.73L7.66 35.57L7.82 40.27L8.1 43.56L8.49 45.44L13.62 48.85L23.08 54.44L30.16 58.3L31.9 59.04L32.44 58.98L37 56.61L50.15 48.84L54.57 46.09L55.7 44.94L56.11 44.04L56.24 42.25L56.24 24.45L55.9 19.4L51.8 16.63L38.49 8.56L33.63 5.82L31.73 5.1L31.36 5.19ZM43.61 19.18L45.26 19.29L46.98 19.73L49.55 21.05L52.31 23.78L53.68 26.29L54.12 27.64L54.37 29.64L54.27 34.91L53.41 37.87L52.76 39.05L51.48 40.41L48.35 42.71L46.47 43.6L43.91 44.03L42.09 44.03L40.11 43.61L37.92 42.7L35.86 41.19L34.02 39.05L33.1 38.44L32.16 38.35L31.18 38.8L28.17 41.38L25.09 42.96L21.43 43.8L15.77 44.1L12.21 43.78L11.8 42.23L11.52 39.25L11.34 29.03L11.42 21.62L11.69 19.84L13.35 19.58L18.54 19.5L21.36 19.66L23.56 20.08L25.81 21.05L27.99 22.52L29.75 24.4L30.47 25.49L31.12 26.13L31.72 26.3L32.25 26.03L33.25 24.57L35.19 22.44L37.23 20.83L39.36 19.86L42.99 19.17ZM39.96 20.1L37.38 21.23L36.27 21.94L34.4 23.65L33.37 25.21L29.36 33.82L28.3 36.56L27.49 39.69L28.08 40.28L29.09 40.1L30.41 39.25L31.75 37.99L34.21 34.36L37.73 27.87L39.66 25.4L41.95 24.25L44.05 24.14L45.46 24.54L46.86 25.36L48.09 26.67L49.07 28.53L49.49 31.07L49.33 34L49.02 35.3L47.52 38.6L47.35 39.52L47.72 41.13L48.55 41.88L49.08 41.88L50.32 41.16L51.72 39.62L53.09 37.55L53.88 35.81L54.22 31.84L54.04 29.17L53.61 27.04L52.86 25.31L51.68 23.53L50.19 21.87L48.83 20.76L47.41 20.12L45.32 19.68L42.02 19.33L40.97 19.71ZM16.35 24.18L16.16 24.28L16.03 25.26L15.89 29.85L15.95 36.2L16.25 39.08L17.72 39.3L19.94 39.18L21.98 38.82L23.44 38.19L25.23 36.15L26.44 33.17L26.59 30.45L26.32 28.9L25.77 27.55L24.21 25.71L22.51 24.57L20.51 24.16L16.5 24.1ZM41.39 24.56L40.28 25.09L39.06 26.11L37.87 27.5L37.1 28.82L36.53 31.6L36.79 34.05L37.39 35.76L38.24 37.19L39.86 38.62L40.96 39.15L42.11 39.38L44.26 39.3L45.55 39.02L46.9 38.32L47.63 37.63L48.85 35.47L49.28 33.86L49.41 31.8L49.02 28.62L47.95 26.62L45.99 25.08L43.9 24.33L41.81 24.41Z";

const RIBBON =
  "M43.06 19.36L45.31 19.48L46.75 19.83L49.55 21.28L50.85 22.44L52.05 23.94L53.04 25.76L53.79 27.91L54.22 30.13L54.31 32.32L54.18 34.24L53.65 36.55L52.62 38.72L51.72 39.97L49.77 41.68L48.48 42.18L48.12 42.09L47.75 41.48L47.31 40.26L47.3 39.47L47.5 38.58L49.02 35.3L49.33 34L49.49 31.07L49.07 28.53L48.09 26.67L46.86 25.36L45.46 24.54L44.05 24.14L41.95 24.25L39.66 25.4L37.73 27.87L34.21 34.36L31.75 37.99L30.41 39.25L29.09 40.1L28.08 40.28L27.49 39.69L28.3 36.56L30.85 30.29L33.37 25.21L34.4 23.65L37.58 20.87L39.56 19.99L42.49 19.38Z";

/** Where the ribbon crosses the D — the point the whole mark turns on. */
const CROSSOVER = { x: 33, y: 33, r: 13 };

export function LogoMark({
  className = "",
  shimmer = false,
}: {
  className?: string;
  /** The glint on the crossover. Reserved for the large copy. */
  shimmer?: boolean;
}) {
  const uid = useId();
  const glintMask = `glint-${uid}`;

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="DevlinOps"
    >
      {shimmer && (
        <defs>
          <mask id={glintMask} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
            <radialGradient
              id={`${glintMask}-grad`}
              gradientUnits="userSpaceOnUse"
              cx={CROSSOVER.x}
              cy={CROSSOVER.y}
              r={CROSSOVER.r}
            >
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.45" stopColor="#fff" stopOpacity="0.65" />
              <stop offset="1" stopColor="#000" />
            </radialGradient>
            <rect x="0" y="0" width="64" height="64" fill={`url(#${glintMask}-grad)`} />
          </mask>
        </defs>
      )}

      {/* Hexagon, D, and the far side of the O. */}
      <path d={STRUCTURE} fill="currentColor" fillRule="evenodd" />
      {/* The sweep that crosses the D and closes the O. */}
      <path d={RIBBON} fill="var(--color-foreground)" fillRule="evenodd" />

      {shimmer && (
        <g className="logo-glint" mask={`url(#${glintMask})`}>
          <path d={STRUCTURE} fill="var(--color-foreground)" fillRule="evenodd" />
          <path d={RIBBON} fill="#ffffff" fillRule="evenodd" />
        </g>
      )}
    </svg>
  );
}
