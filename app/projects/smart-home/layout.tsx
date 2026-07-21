import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Home on K3s — Self-Hosted Home Automation",
  description:
    "A single-node K3s cluster on a Raspberry Pi 5 running Home Assistant, ArgoCD, Prometheus and Grafana. Same GitOps discipline as the platform at work, sized to a flat — zero ports exposed.",
  openGraph: {
    title: "Smart Home on K3s — Self-Hosted Home Automation",
    description:
      "A single-node K3s cluster on a Raspberry Pi 5 running Home Assistant, ArgoCD and Prometheus. Every config change goes through git; zero ports exposed to the internet.",
    url: "https://devlinops.com/projects/smart-home",
  },
};

export default function SmartHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
