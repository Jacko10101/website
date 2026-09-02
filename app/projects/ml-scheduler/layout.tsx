import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evict the Guilty, Not the Innocent · MSc dissertation",
  description:
    "Recovery scheduling under real node failure in Kubernetes. Four schedulers, two failure modes, 199 recorded runs on Amazon EKS, under an analysis plan fixed before the data. Jack Devlin's MSc AI dissertation, Queen's University Belfast.",
  openGraph: {
    title: "Evict the Guilty, Not the Innocent · MSc dissertation",
    description:
      "Recovery scheduling under real node failure in Kubernetes: four schedulers, two failure modes, 199 recorded runs on Amazon EKS.",
    url: "https://devlinops.com/projects/ml-scheduler",
  },
};

export default function MlSchedulerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
