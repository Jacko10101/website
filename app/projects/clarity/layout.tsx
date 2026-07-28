import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clarity · Natural-Language Database Interface",
  description:
    "Text-to-SQL across 13 tenant databases, built on Spring AI and Gemini. Compiled schema knowledge instead of a vector store, five classes of hallucination detected per turn, and evaluation that never asks a model to grade a model.",
  openGraph: {
    title: "Clarity · Natural-Language Database Interface",
    description:
      "Text-to-SQL across 13 tenant databases. Compiled schema knowledge instead of a vector store, and five classes of hallucination detected on every turn.",
    url: "https://devlinops.com/projects/clarity",
  },
};

export default function ClarityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
