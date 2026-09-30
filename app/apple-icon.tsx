import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", background: "#f5f3eb", color: "#26352b", fontSize: 116, fontWeight: 700, letterSpacing: -13, paddingBottom: 15 }}>
      jd<span style={{ color: "#bd492b", letterSpacing: 0 }}>.</span>
    </div>, size,
  );
}
