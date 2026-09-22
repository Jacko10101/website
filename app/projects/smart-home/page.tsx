import type { Metadata } from "next";
import { WorkCaseStudy } from "@/components/work-case-study";
import { caseStories } from "@/lib/case-studies";


const story = caseStories["smart-home"];
export const metadata: Metadata = {
  title: story.title, description: story.intro,
  alternates: { canonical: "/projects/smart-home" },
  openGraph: { title: `${story.title} · Jack Devlin`, description: story.headline, url: "/projects/smart-home" },
};

export default function Page() {
  return (
    <WorkCaseStudy id="smart-home" titleStyle={{ viewTransitionName: "title-smart-home" }}>

    </WorkCaseStudy>
  );
}
