import { profile } from "@/lib/profile";
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "About · Jack Devlin";

export default function Image() {
  return renderOgImage({
    eyebrow: "<about />",
    title: "About Jack Devlin",
    subtitle:
      `Platform engineer. How I work, the systems I've built, and what I'm looking for. ${profile.availability.short}.`,
  });
}
