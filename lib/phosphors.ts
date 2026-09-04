/**
 * Per-page phosphor tints for the case studies. The name is the CRT
 * phosphor the colour is nearest to: P1 green for the site, P3 amber for
 * the gateway review, P4 white for the pipeline PR, P11 blue for Clarity,
 * P16 violet for the flat, P26 orange for the observability ADR. The
 * dissertation passes its cyan inline.
 *
 * This lives in lib/ rather than in the layout component so that server
 * components can import it without dragging the client module along; when
 * it sat in case-study-layout.tsx every page that read it had to be a
 * client component, and shipped its prose twice.
 */
export interface Phosphor {
  /** oklch hue angle for --color-primary */
  hue: number;
  /** oklch chroma; blues want less to avoid vibrating on black */
  chroma?: number;
  /** oklch lightness; P4 white sits higher */
  lightness?: number;
  /** e.g. "P3 · amber" — rendered as a chip in the hero */
  label: string;
}

export const PHOSPHORS: Record<string, Phosphor> = {
  green: { hue: 150, chroma: 0.19, label: "P1 · green" },
  amber: { hue: 85, lightness: 0.66, label: "P3 · amber" },
  white: { hue: 250, chroma: 0.02, lightness: 0.87, label: "P4 · white" },
  blue: { hue: 230, chroma: 0.15, label: "P11 · blue" },
  violet: { hue: 305, chroma: 0.16, label: "P16 · violet" },
  orange: { hue: 55, label: "P26 · orange" },
};
