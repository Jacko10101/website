import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jack Devlin · Platform & AI infrastructure engineer. How I work, the systems I've built, and what I'm looking for. Available from October 2026, permanent or contract, remote-first.",
  openGraph: {
    title: "About · Jack Devlin",
    description:
      "Platform & AI infrastructure engineer. How I work, the systems I've built, and what I'm looking for. Available from October 2026, permanent or contract, remote-first.",
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
