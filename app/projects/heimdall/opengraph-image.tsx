import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { caseStories } from "@/lib/case-studies";

const story = caseStories["heimdall"];
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${story.title} · Jack Devlin`;
export default function Image() {
  return renderOgImage({ title: story.title, subtitle: story.headline, eyebrow: story.category });
}
