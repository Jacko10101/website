import type { Metadata } from "next";
import { WorkCaseStudy } from "@/components/work-case-study";
import { caseStories } from "@/lib/case-studies";
import { HeimdallDemo } from "@/components/heimdall-demo";

const story = caseStories["heimdall"];
export const metadata: Metadata = {
  title: story.title, description: story.intro,
  alternates: { canonical: "/projects/heimdall" },
  openGraph: { title: `${story.title} · Jack Devlin`, description: story.headline, url: "/projects/heimdall" },
};

export default function Page() {
  return (
    <WorkCaseStudy id="heimdall" titleStyle={{ viewTransitionName: "title-heimdall" }} figures={[{ src: "/heimdall/environments-2026.png", width: 1400, height: 838, alt: "Heimdall’s environments page: a build matrix of every service across dev, QA, preprod and prod", caption: "The environments page: every service’s build in every environment, with drift flagged. Service names and hashes are samples." }]}>
      <HeimdallDemo />
    </WorkCaseStudy>
  );
}
