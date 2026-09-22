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
    <WorkCaseStudy id="heimdall" titleStyle={{ viewTransitionName: "title-heimdall" }}>
      <HeimdallDemo />
    </WorkCaseStudy>
  );
}
