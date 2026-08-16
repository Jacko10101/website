import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

/**
 * The homepage card. This is the first thing anyone sees when the link is
 * pasted into Slack, LinkedIn or an email, so it says who Jack is rather than
 * showing a logo. Every other page already generated one of these; the root
 * was falling back to /og-image.png, which is a wordmark on a light ground.
 */
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Jack Devlin · Platform & AI Infrastructure Engineer";

export default function Image() {
  return renderOgImage({
    eyebrow: "whoami",
    title: "Jack Devlin",
    subtitle:
      "Platform engineer. Kubernetes, CI/CD and observability underneath; an LLM gateway and guardrails on top. Available from October 2026 — Dublin, London, Amsterdam or remote EU.",
  });
}
