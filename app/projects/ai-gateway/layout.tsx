import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Gateway · One Endpoint for Every Model",
  description:
    "A self-hosted LiteLLM gateway fronting every AI workload in the estate. Virtual keys with per-key model allowlists, fail-closed on unpermitted models, and spend attributable to the tenant and feature that caused it.",
  openGraph: {
    title: "AI Gateway · One Endpoint for Every Model",
    description:
      "Virtual keys with per-key model allowlists, fail-closed on unpermitted models, and LLM spend attributable per tenant and per feature.",
    url: "https://devlinops.com/projects/ai-gateway",
  },
};

export default function AIGatewayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
