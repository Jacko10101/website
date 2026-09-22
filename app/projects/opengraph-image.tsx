import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Projects · Jack Devlin";

export default function Image() {
  return renderOgImage({
    theme: "folio",
    eyebrow: "SELECTED WORK",
    title: "Built. And operated.",
    subtitle:
      "Platforms, developer tools, AI services—and the decisions behind them.",
  });
}
