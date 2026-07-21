import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Observability Stack — Self-Hosted Monitoring",
  description:
    "Prometheus, Grafana and Loki for 20 services across four environments. ~25 dashboards and 50+ alerts, each with a runbook — ~£5k/yr versus ~£100k commercial quotes.",
  openGraph: {
    title: "Observability Stack — Self-Hosted Monitoring",
    description:
      "Self-hosted metrics, logs and alerts for 20 services across four environments — ~£5k/yr versus ~£100k commercial quotes.",
    url: "https://devlinops.com/projects/observability",
  },
};

export default function ObservabilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
