import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Heimdall — Deployment Intelligence Platform";

export default function Image() {
  return renderOgImage({
    eyebrow: "deployment intelligence",
    title: "Heimdall",
    subtitle:
      "Where is my ticket right now? Answered across a couple dozen services and four environments. Used daily by 20+ engineers.",
      });
}
