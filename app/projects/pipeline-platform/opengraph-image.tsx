import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Pipeline Platform — Shared CI/CD Library";

export default function Image() {
  return renderOgImage({
    eyebrow: "shared ci/cd",
    title: "Pipeline Platform",
    subtitle:
      "Twenty drifted pipelines became one semver-tagged library. ~400 deploys/month across 20 services, one file to onboard.",
      });
}
