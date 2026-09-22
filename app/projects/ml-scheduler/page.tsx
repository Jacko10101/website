import type { Metadata } from "next";
import { WorkCaseStudy } from "@/components/work-case-study";
import { caseStories } from "@/lib/case-studies";
import { RecoveryEvidence } from "@/components/recovery-evidence";

const story = caseStories["ml-scheduler"];
export const metadata: Metadata = {
  title: story.title, description: story.intro,
  alternates: { canonical: "/projects/ml-scheduler" },
  openGraph: { title: `${story.title} · Jack Devlin`, description: story.headline, url: "/projects/ml-scheduler" },
};

export default function Page() {
  return (
    <WorkCaseStudy id="ml-scheduler" titleStyle={{ viewTransitionName: "title-ml-scheduler" }}>
      <RecoveryEvidence />
    </WorkCaseStudy>
  );
}
