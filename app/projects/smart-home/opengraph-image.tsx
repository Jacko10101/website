import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Smart Home on K3s — Self-Hosted Home Automation";

export default function Image() {
  return renderOgImage({
    eyebrow: "home automation on k3s",
    title: "Smart Home on K3s",
    subtitle:
      "A single-node cluster on a Raspberry Pi 5 — Home Assistant, ArgoCD and Prometheus. GitOps discipline, zero ports exposed.",
      });
}
