import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Observability Stack — Self-Hosted Monitoring";

export default function Image() {
  return renderOgImage({
    eyebrow: "self-hosted monitoring",
    title: "Observability Stack",
    subtitle:
      "Prometheus, Grafana and Loki for 20 services across four environments — ~£5k/yr versus ~£100k commercial quotes.",
      });
}
