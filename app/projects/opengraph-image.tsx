import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Projects — Jack Devlin";

export default function Image() {
  return renderOgImage({
    eyebrow: "<case-studies />",
    title: "Featured Work",
    subtitle:
      "Platform & MLOps case studies — Heimdall, a shared CI/CD pipeline platform, self-hosted observability, and a smart home on K3s.",
  });
}
