import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Clarity · Natural-Language Database Interface";

export default function Image() {
  return renderOgImage({
    eyebrow: "natural-language database interface",
    title: "Clarity",
    subtitle:
      "Text-to-SQL across 13 tenant databases. Compiled schema knowledge instead of a vector store, five classes of hallucination caught per turn.",
  });
}
