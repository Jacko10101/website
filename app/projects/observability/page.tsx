import type { Metadata } from "next";
import { WorkCaseStudy } from "@/components/work-case-study";
import { caseStories } from "@/lib/case-studies";


const story = caseStories["observability"];
export const metadata: Metadata = {
  title: story.title, description: story.intro,
  alternates: { canonical: "/projects/observability" },
  openGraph: { title: `${story.title} · Jack Devlin`, description: story.headline, url: "/projects/observability" },
};

export default function Page() {
  return (
    <WorkCaseStudy id="observability" titleStyle={{ viewTransitionName: "title-observability" }}>

    </WorkCaseStudy>
  );
}
