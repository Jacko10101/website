import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "About — Jack Devlin";

export default function Image() {
  return renderOgImage({
    eyebrow: "<about />",
    title: "About Jack Devlin",
    subtitle:
      "Platform & MLOps engineer. How I work, the systems I've built, and what I'm looking for. Remote B2B contracts from September 2026.",
  });
}
