import type { Metadata } from "next";
import { ClarityWorkbench } from "@/components/clarity-workbench";
import { WorkCaseStudy } from "@/components/work-case-study";
import { caseStories } from "@/lib/case-studies";

const story = caseStories["clarity"];
export const metadata: Metadata = {
  title: story.title, description: story.intro,
  alternates: { canonical: "/projects/clarity" },
  openGraph: { title: `${story.title} · Jack Devlin`, description: story.headline, url: "/projects/clarity" },
};

export default function Page() {
  return (
    <WorkCaseStudy id="clarity" titleStyle={{ viewTransitionName: "title-clarity" }}>
      <ClarityWorkbench />
    </WorkCaseStudy>
  );
}
