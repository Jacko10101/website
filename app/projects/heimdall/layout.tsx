import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Heimdall · Where Every Ticket and Service Actually Is",
  description:
    "An internal dashboard answering 'where is my ticket right now?' across 20 services and four environments. Built and run by Jack Devlin at Loweconex, opened daily by more than 20 engineers.",
  openGraph: {
    title: "Heimdall · Where Every Ticket and Service Actually Is",
    description:
      "An internal dashboard answering 'where is my ticket right now?' across 20 services, opened every day by more than 20 engineers.",
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
