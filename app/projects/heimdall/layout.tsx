import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Heimdall — Deployment Intelligence Platform",
  description:
    "An internal SRE dashboard answering 'where is my ticket right now?' across a couple dozen services and four environments — built end-to-end, used daily by 20+ engineers.",
  openGraph: {
    title: "Heimdall — Deployment Intelligence Platform",
    description:
      "An internal SRE dashboard answering 'where is my ticket right now?' across a couple dozen services, used daily by a 20+ person engineering team.",
    url: "https://devlinops.com/projects/heimdall",
  },
};

export default function HeimdallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
