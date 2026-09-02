import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Evict the Guilty, Not the Innocent · MSc dissertation";

export default function Image() {
  return renderOgImage({
    eyebrow: "msc dissertation · paper",
    title: "Evict the guilty, not the innocent",
    subtitle:
      "Recovery scheduling under real node failure in Kubernetes. Four schedulers, two failure modes, 199 recorded runs on Amazon EKS.",
    accent: "#4fd1c5",
  });
}
