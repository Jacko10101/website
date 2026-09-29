import type { Metadata } from "next";
import { WorkCaseStudy } from "@/components/work-case-study";
import { caseStories } from "@/lib/case-studies";

const story = caseStories["pipeline-platform"];
export const metadata: Metadata = {
  title: story.title, description: story.intro,
  alternates: { canonical: "/projects/pipeline-platform" },
  openGraph: { title: `${story.title} · Jack Devlin`, description: story.headline, url: "/projects/pipeline-platform" },
};

export default function Page() {
  return (
    <WorkCaseStudy id="pipeline-platform" figures={[{ src: "/sentry/fleet-2026.png", width: 1456, height: 770, alt: "Sentry’s fleet dashboard: post-deploy test gates for each service", caption: "Sentry, the post-deploy test dashboard. Each card is a service’s latest PostSync run. Names are samples." }]} titleStyle={{ viewTransitionName: "title-pipeline-platform" }} />
  );
}
