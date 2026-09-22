import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function renderOgImage({ title, subtitle, eyebrow }: {
  title: string; subtitle: string; eyebrow: string;
  accent?: string; theme?: "ink" | "folio";
}) {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "48px 64px", background: "#0c141b", color: "#e9eee9", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #3b524c", paddingBottom: 22 }}>
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700, letterSpacing: -2 }}>jd<span style={{ color: "#d3e99d" }}>.</span></div>
        <div style={{ fontSize: 18, color: "#acbdb7" }}>JACK DEVLIN / PLATFORM ENGINEER</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 18, color: "#d3e99d", marginBottom: 18, textTransform: "uppercase", letterSpacing: 2 }}>{eyebrow}</div>
        <div style={{ fontSize: title.length > 22 ? 76 : 92, lineHeight: 1.08, letterSpacing: -5, fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: 28, lineHeight: 1.4, color: "#acbdb7", maxWidth: 960, marginTop: 24 }}>{subtitle}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #3b524c", paddingTop: 22, fontSize: 18, color: "#acbdb7" }}><span>PLATFORMS, TOOLS & A FEW EXPERIMENTS</span><span>devlinops.com ↗</span></div>
    </div>, OG_SIZE,
  );
}
