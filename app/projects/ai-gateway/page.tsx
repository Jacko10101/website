import type { Metadata } from "next";
import { WorkCaseStudy } from "@/components/work-case-study";
import { caseStories } from "@/lib/case-studies";
import { GatewayTracer } from "@/components/gateway-tracer";

const story = caseStories["ai-gateway"];
export const metadata: Metadata = {
  title: story.title, description: story.intro,
  alternates: { canonical: "/projects/ai-gateway" },
  openGraph: { title: `${story.title} · Jack Devlin`, description: story.headline, url: "/projects/ai-gateway" },
};

export default function Page() {
  return (
    <WorkCaseStudy id="ai-gateway" titleStyle={{ viewTransitionName: "title-ai-gateway" }}>
      <GatewayTracer />
    </WorkCaseStudy>
  );
}
