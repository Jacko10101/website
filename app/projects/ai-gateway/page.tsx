"use client";

import { ReactNode } from "react";
import {
  PHOSPHORS,
  CaseStudyLayout,
  EnhancedCodeBlock,
} from "@/components/case-study-layout";
import {
  IncidentHeader,
  IncidentAppendices,
  IncidentSignoff,
  ReportSection,
} from "@/components/ai-gateway-incident";
import { GatewayTracer } from "@/components/gateway-tracer";

/* --------------------------------------------------------------------------
 * Action items. This project exists because of a problem that was about to
 * happen, and it contains a real postmortem, so the page ends the way an
 * incident review does: a tracked table with statuses, including the one
 * still open.
 * ----------------------------------------------------------------------- */
type ItemStatus = "shipped" | "runbook" | "open";

const STATUS_TONE: Record<ItemStatus, string> = {
  shipped: "text-primary border-primary/40",
  runbook: "text-muted-foreground border-border",
  open: "text-warn border-warn/50 bg-warn/10",
};

const ACTION_ITEMS: { action: string; status: ItemStatus; detail: string }[] = [
  {
    action: "Collapse to one gateway, environment as a tag",
    status: "shipped",
    detail:
      "It started as a deployment per environment. One instance means fewer moving parts, and spend I can compare across environments rather than sum across dashboards.",
  },
  {
    action: "Write down the two-step onboarding trap",
    status: "runbook",
    detail:
      "The first time it caught me I lost an afternoon to a model that was demonstrably deployed.",
  },
  {
    action: "Stop dashboard price constants from rotting",
    status: "open",
    detail:
      "Closing this properly means something that compares those constants against what the provider actually charges, on a schedule.",
  },
];

function StatusChip({ status }: { status: ItemStatus }) {
  return (
    <span
      className={`inline-flex w-[5.75rem] items-center justify-center gap-1.5 rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider whitespace-nowrap ${STATUS_TONE[status]}`}
    >
      {status === "open" && (
        <span className="w-1.5 h-1.5 rounded-full bg-warn animate-pulse" aria-hidden />
      )}
      {status}
    </span>
  );
}

/* The tracked table an action-item list becomes once the review is filed:
   id column, action with its note, status chips aligned in a column. */
function ActionItems() {
  const open = ACTION_ITEMS.filter((item) => item.status === "open").length;
  return (
    <div className="rounded-md border border-border overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-2.5 border-b border-border font-mono text-xs">
        <span className="text-primary font-semibold">action items</span>
        <span className="text-muted-foreground">
          {ACTION_ITEMS.length} on file · {open} open
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <th scope="col" className="hidden sm:table-cell w-12 pl-5 pr-4 py-2 font-medium">
                id
              </th>
              <th scope="col" className="px-4 sm:px-0 py-2 font-medium">
                action
              </th>
              <th scope="col" className="w-28 px-4 sm:pr-5 py-2 font-medium">
                status
              </th>
            </tr>
          </thead>
          <tbody>
            {ACTION_ITEMS.map((item, i) => (
              <tr
                key={item.action}
                className="border-b border-border/60 last:border-b-0 align-top"
              >
                <td className="hidden sm:table-cell pl-5 pr-4 py-4 font-mono text-xs text-muted-foreground/70 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </td>
                <td className="px-4 sm:px-0 py-4">
                  <p className="font-mono text-sm font-semibold tracking-tight text-foreground">
                    {item.action}
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-prose">
                    {item.detail}
                  </p>
                </td>
                <td className="px-4 sm:pr-5 py-4">
                  <StatusChip status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* One row of the embedded postmortem's field table — the warn-toned cousin
   of the report fields in the front matter. */
function PostmortemField({
  label,
  children,
  strong = false,
}: {
  label: string;
  children: ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="grid sm:grid-cols-[7rem_1fr] gap-x-4 gap-y-1 px-5 py-3 border-b border-warn/20 last:border-b-0 text-sm leading-relaxed">
      <dt className="font-mono text-[11px] uppercase tracking-wider text-warn/90 pt-0.5">
        {label}
      </dt>
      <dd className={strong ? "text-foreground/90" : "text-muted-foreground"}>
        {children}
      </dd>
    </div>
  );
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "AI Gateway · one endpoint for every model",
  description:
    "A self-hosted LLM gateway in front of every AI workload. Virtual keys instead of provider keys, per-key model allowlists that fail closed, and spend you can attribute to the tenant that caused it.",
  author: {
    "@type": "Person",
    name: "Jack Devlin",
    url: "https://devlinops.com",
  },
  publisher: {
    "@type": "Organization",
    name: "DevlinOps",
    url: "https://devlinops.com",
  },
  datePublished: "2026-02-01",
  dateModified: "2026-07-28",
  proficiencyLevel: "Expert",
  keywords: [
    "LLM gateway",
    "LiteLLM",
    "AI infrastructure",
    "FinOps",
    "Kubernetes",
    "Gemini",
  ],
};

export default function AIGatewayPage() {
  return (
    <CaseStudyLayout schema={articleSchema} phosphor={PHOSPHORS.amber}>
      <IncidentHeader />

      {/* The instrument — the review's interactive exhibit */}
      <div className="container px-4 pt-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <figure>
            <div className="mb-4">
              <p className="font-mono text-xs tracking-wider">
                <span className="text-primary font-semibold uppercase">
                  exhibit
                </span>
                <span className="mx-2 text-muted-foreground/50" aria-hidden>
                  ·
                </span>
                <span className="text-muted-foreground">try it</span>
              </p>
              <h2 className="mt-2 font-mono font-semibold tracking-tight text-2xl sm:text-3xl text-foreground">
                Two different ways to get a 401
              </h2>
            </div>
            <GatewayTracer />
            <figcaption className="mt-3 text-sm text-muted-foreground text-center max-w-2xl mx-auto">
              It opens on the trap: a key that was issued and never given an
              allowlist. Pick a different consumer or model and the trace shows
              exactly where the refusal happens, including the combinations that
              401 for a model which is fully deployed.
            </figcaption>
          </figure>
        </div>
      </div>

      <div className="container px-4">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
          <div className="space-y-12">
            <ReportSection
              finding={1}
              eyebrow="// before: no gateway"
              title="The third API key is the one that hurts"
            >
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our first AI feature shipped with a provider key in a secret
                and nobody minded. By the third I could see where it was
                heading: keys scattering across repos, and nobody able to say
                what any of it cost.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                None of that is an AI problem. It&apos;s the same problem as
                unmanaged database credentials, and the fix is the same one:
                put the credential somewhere central and hand out scoped access
                instead.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                LiteLLM is an open-source LLM proxy. I didn&apos;t write a
                proxy, I ran that one on Kubernetes through GitOps like
                everything else we deploy. The work worth describing is the key
                and allowlist model, the attribution scheme, and the runbook.
              </p>
            </ReportSection>

            <ReportSection
              finding={2}
              eyebrow="// request · auth + allowlist"
              title="Virtual keys, and a model list you can't talk your way past"
            >
              <p className="text-muted-foreground leading-relaxed mb-4">
                Services don&apos;t hold provider credentials any more. They
                hold a virtual key with an explicit list of models it may call.
                Ask for anything else and you get a 401.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A gateway that helpfully substitutes another model gives you
                something that works and behaves differently from the thing
                you tested. I&apos;d rather it broke.
              </p>

              <EnhancedCodeBlock
                title="onboarding a model, both halves required"
                language="bash"
                code={`# 1. the gateway has to know the model exists
#    (model_list entry in the gateway config, shipped via GitOps)

# 2. every key that should reach it has to be told, separately
curl -X POST "$GATEWAY/key/update" \\
  -H "Authorization: Bearer $MASTER_KEY" \\
  -d '{"key": "sk-…", "models": ["gemini-2.5-flash", "gemini-3.6-flash"]}'

# skip step 2 and consumers get 401 for a model that
# demonstrably exists. what can this key actually reach?
curl -H "Authorization: Bearer $VIRTUAL_KEY" "$GATEWAY/v1/models"`}
              />

              <p className="text-muted-foreground mt-6 leading-relaxed">
                Those two halves being separate is the sharp edge, and
                it&apos;s caught me more than once. A model can be fully deployed
                and still 401 for everybody, because existing and being permitted
                are different facts. It&apos;s written down now.
              </p>
            </ReportSection>

            <ReportSection
              finding={3}
              eyebrow="// request · spend tags"
              title="Whose spend is it?"
            >
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every call carries its tenant, plus tags for environment and
                feature. Chat, scheduled estate summaries and the nightly schema
                compile all bill to one service but answer completely different
                questions about cost.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                So &quot;what is the AI costing us&quot; became answerable per
                tenant and per feature, which matters the first time somebody
                asks about cost to serve.
              </p>
            </ReportSection>

            <ReportSection
              finding={4}
              eyebrow="// postmortem · attached"
              title="The 4x pricing bug"
            >
              <p className="text-muted-foreground leading-relaxed mb-6">
                Attribution being right is not the same as the number being
                right. This one is the reason the last action item is still
                open.
                {/* TODO(jack): rough order of magnitude for monthly gateway spend,
                    so "fourfold high" means something concrete to a reader */}
              </p>
              <div className="rounded-md border border-warn/40 bg-warn/5 overflow-hidden">
                <div className="flex flex-wrap items-center gap-2 px-5 py-2.5 border-b border-warn/30 font-mono text-xs">
                  <span className="w-2 h-2 rounded-full bg-warn" aria-hidden />
                  <span className="text-warn font-semibold">postmortem</span>
                  <span className="text-muted-foreground">
                    · severity: low, caught internally
                  </span>
                </div>
                <dl>
                  <PostmortemField label="symptom">
                    Spend read about fourfold high. For weeks.
                  </PostmortemField>
                  <PostmortemField label="cause">
                    The cost dashboard multiplies tokens by per-million prices
                    held as dashboard variables, and ours were set to a
                    different model&apos;s pricing than the one deployed.
                  </PostmortemField>
                  <PostmortemField label="why it lived">
                    Nobody questioned it, because the number was in a
                    dashboard and dashboards look authoritative.
                  </PostmortemField>
                  <PostmortemField label="lesson" strong>
                    Tokens are measured. Prices are config, and config rots.
                  </PostmortemField>
                </dl>
              </div>
            </ReportSection>

            <ReportSection
              finding={5}
              eyebrow="// after: what got cheap"
              title="What it made cheap"
            >
              <p className="text-muted-foreground leading-relaxed mb-4">
                There&apos;s an automated pull request review agent running on
                PRs across eight production services now, and building it needed
                no provider credentials, no billing conversation, no new secret.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Model upgrades became config too. Moving a consumer between
                versions is an allowlist entry and an env var, which is how
                every consumer followed three generations of the same model
                family without anyone rewriting one.
              </p>

              <p className="text-muted-foreground leading-relaxed mb-6">
                What the review tracked, and the one item still open:
              </p>

              <ActionItems />
            </ReportSection>

            <ReportSection
              marker="resolution"
              eyebrow="// 200 OK · monitoring"
              title="Where it stands"
            >
              <p className="text-muted-foreground leading-relaxed">
                It&apos;s dull infrastructure, which is the recommendation. I
                built it while there were two consumers rather than twelve, so
                adding an AI feature is now a config change. Doing it later
                would have meant unpicking a dozen scattered provider keys
                first.
              </p>
            </ReportSection>
          </div>

          <IncidentAppendices />
        </div>
      </div>

      <IncidentSignoff />
    </CaseStudyLayout>
  );
}
