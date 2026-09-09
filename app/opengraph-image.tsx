import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { profile } from "@/lib/profile";

/**
 * The homepage card. This is the first thing anyone sees when the link is
 * pasted into Slack, LinkedIn or an email, so it says who Jack is rather than
 * showing a logo. Every other page already generated one of these; the root
 * was falling back to /og-image.png, which is a wordmark on a light ground.
 */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Jack Devlin · Platform Engineer";

export default function Image() {
  return renderOgImage({
    theme: "folio",
    eyebrow: "INDEPENDENT PLATFORM ENGINEER",
    title: "Jack Devlin.",
    subtitle: `I build the systems behind the product. Kubernetes, delivery pipelines, and AI infrastructure. ${profile.availability.sentence}`,
  });
}
