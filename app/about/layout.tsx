import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jack Devlin — Platform & MLOps engineer. How I work, the systems I've built, and what I'm looking for. Available from September 2026 — contract or full-time, remote-first.",
  openGraph: {
    title: "About — Jack Devlin",
    description:
      "Platform & MLOps engineer. How I work, the systems I've built, and what I'm looking for. Available from September 2026 — contract or full-time, remote-first.",
    url: "https://devlinops.com/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
