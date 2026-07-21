import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pipeline Platform — Shared CI/CD Library",
  description:
    "One Bitbucket pipeline library imported by every Java and Node service. Twenty drifted pipelines became one semver-tagged library — ~400 deploys/month, one file to onboard.",
  openGraph: {
    title: "Pipeline Platform — Shared CI/CD Library",
    description:
      "Twenty drifted pipelines became one semver-tagged library, with ArgoCD Image Updater handling promotion. ~400 deploys/month across 20 services.",
    url: "https://devlinops.com/projects/pipeline-platform",
  },
};

export default function PipelinePlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
