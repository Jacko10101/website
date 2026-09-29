import type { Metadata } from "next";
import { WorkCaseStudy } from "@/components/work-case-study";
import { caseStories } from "@/lib/case-studies";
import Link from "next/link";
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
      <p className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
        Want to see the selection rule move? <Link href="/lab#break" className="text-primary underline underline-offset-4">Break my name in the lab →</Link>
      </p>
    </WorkCaseStudy>
  );
}
