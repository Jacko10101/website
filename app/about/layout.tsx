import type { Metadata } from "next";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "About",
  description: `Jack Devlin · Platform & AI infrastructure engineer. How I work, the systems I've built, and what I'm looking for. ${profile.availability.sentence}`,
  openGraph: {
    title: "About · Jack Devlin",
    description: `Platform & AI infrastructure engineer. How I work, the systems I've built, and what I'm looking for. ${profile.availability.sentence}`,
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
