import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", background: "#141817", color: "#eeeee7", fontSize: 116, fontWeight: 700, letterSpacing: -13, paddingBottom: 15 }}>
      jd<span style={{ color: "#82c99b", letterSpacing: 0 }}>.</span>
    </div>, size,
  );
}
