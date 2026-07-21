import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Branded, on-theme Open Graph card rendered at build time.
 * Satori (the engine behind ImageResponse) only supports flexbox + inline
 * styles, so everything here is explicit and flat on purpose.
 */
export function renderOgImage({
  title,
  subtitle,
  eyebrow,
  accent = "#3ddc84",
}: {
  title: string;
  subtitle: string;
  eyebrow: string;
  accent?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0f0c",
          padding: "72px",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* top accent rule */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: accent,
          }}
        />

        {/* top row — wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#6b7a70" }}>
            ~/
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: -0.5,
            }}
          >
            devlinops
          </div>
          <div
            style={{
              width: 16,
              height: 32,
              marginLeft: 8,
              background: accent,
            }}
          />
        </div>

        {/* main block */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: accent,
              marginBottom: 20,
              letterSpacing: 1,
            }}
          >
            <span style={{ color: "#6b7a70", marginRight: 12 }}>$</span>
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: 74,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.08,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 32,
              fontFamily: "sans-serif",
              color: "#9caaa0",
              marginTop: 24,
              maxWidth: 940,
              lineHeight: 1.35,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #223028",
            paddingTop: 28,
          }}
        >
          <div style={{ fontSize: 26, color: "#e4ece7", fontWeight: 600 }}>
            Jack Devlin — Platform Engineer
          </div>
          <div style={{ fontSize: 24, color: "#6b7a70" }}>
            devlinops.com
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
