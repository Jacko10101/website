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
  theme = "ink",
}: {
  title: string;
  subtitle: string;
  eyebrow: string;
  accent?: string;
  theme?: "ink" | "folio";
}) {
  if (theme === "folio") {
    return new ImageResponse(
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "60px 70px", background: "#141817", color: "#eeeee7", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #39433c", paddingBottom: 24 }}>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 700, letterSpacing: -3 }}>jd<span style={{ color: "#82c99b" }}>.</span></div>
          <div style={{ fontSize: 18, color: "#a4afa7" }}>JACK DEVLIN / DEVLINOPS</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 20, color: "#82c99b", marginBottom: 20 }}>{eyebrow}</div>
          <div style={{ fontSize: 98, lineHeight: 1, letterSpacing: -6, fontWeight: 500 }}>{title}</div>
          <div style={{ fontSize: 29, lineHeight: 1.4, color: "#a4afa7", maxWidth: 920, marginTop: 26 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #39433c", paddingTop: 24, fontSize: 18, color: "#a4afa7" }}><span>PLATFORM ENGINEERING / NORTHERN IRELAND</span><span>devlinops.com</span></div>
      </div>, OG_SIZE,
    );
  }
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
            Jack Devlin · Platform & AI Infrastructure
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
