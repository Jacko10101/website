import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Platform & MLOps case studies — Heimdall deployment intelligence, a shared CI/CD pipeline platform, self-hosted observability, and a smart home on K3s.",
  openGraph: {
    title: "Projects — Jack Devlin",
    description:
      "Platform & MLOps case studies: Heimdall, a shared CI/CD pipeline platform, self-hosted observability, and a smart home on K3s.",
    url: "https://devlinops.com/projects",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
