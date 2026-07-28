import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AI Gateway · One Endpoint for Every Model";

export default function Image() {
  return renderOgImage({
    eyebrow: "llm platform",
    title: "AI Gateway",
    subtitle:
      "Virtual keys with per-key model allowlists, fail-closed on unpermitted models, and LLM spend attributable per tenant and feature.",
  });
}
