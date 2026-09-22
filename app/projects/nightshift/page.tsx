import type { Metadata } from "next";
import { WorkCaseStudy } from "@/components/work-case-study";
import { caseStories } from "@/lib/case-studies";
import { PlatformPlayground } from "@/components/platform-playground";

const story = caseStories["nightshift"];
export const metadata: Metadata = {
  title: story.title, description: story.intro,
  alternates: { canonical: "/projects/nightshift" },
  openGraph: { title: `${story.title} · Jack Devlin`, description: story.headline, url: "/projects/nightshift" },
};

export default function Page() {
  return (
    <WorkCaseStudy id="nightshift" titleStyle={{ viewTransitionName: "title-nightshift" }}>
      <PlatformPlayground initialMode="nightshift" compact />
    </WorkCaseStudy>
  );
}
