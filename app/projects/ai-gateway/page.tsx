"use client";

import {
  PHOSPHORS,
  CaseStudyLayout,
  EnhancedCodeBlock,
} from "@/components/case-study-layout";
import { TraceSection as CaseStudySection } from "@/components/case-section-variants";
import {
  IncidentHeader,
  IncidentAppendices,
  IncidentSignoff,
} from "@/components/ai-gateway-incident";
import { FadeUp } from "@/components/scroll-reveal";
import { GatewayTracer } from "@/components/gateway-tracer";

/* --------------------------------------------------------------------------
 * Action items. This project exists because of a problem that was about to
 * happen, and it contains a real postmortem, so the page ends the way an
 * incident review does: a list with statuses, including the ones still open.
 * ----------------------------------------------------------------------- */
type ItemStatus = "shipped" | "runbook" | "by design" | "open";

const STATUS_TONE: Record<ItemStatus, string> = {
  shipped: "text-primary border-primary/40",
  runbook: "text-muted-foreground border-border",
  "by design": "text-muted-foreground border-border",
  open: "text-warn border-warn/50",
};

const ACTION_ITEMS: { action: string; status: ItemStatus; detail: string }[] = [
  {
    action: "Get provider credentials out of service repos",
    status: "shipped",
    detail:
      "Services hold a virtual key with an explicit model list, not a provider key. The credential that actually costs money lives in one place.",
  },
  {
    action: "Make an unpermitted model fail closed",
    status: "shipped",
    detail:
      "A 401, never a silent substitution. A gateway that quietly picks something else makes cost and behaviour unpredictable at the same time.",
  },
  {
    action: "Collapse to one gateway, environment as a tag",
    status: "shipped",
    detail:
      "It started as a deployment per environment. One instance means fewer moving parts and spend I can compare across environments rather than sum across dashboards.",
  },
  {
    action: "Make spend attributable to the thing that caused it",
    status: "shipped",
    detail:
      "Tenant, environment and feature on every call. Chat, scheduled estate summaries and the nightly schema compile bill to one service but answer completely different questions about cost.",
  },
  {
    action: "Write down the two-step onboarding trap",
    status: "runbook",
    detail:
      "A model can be fully deployed and still 401 for everybody, because no key has been told it may use it. It caught me more than once before it was written down.",
  },
  {
    action: "Write no proxy",
    status: "by design",
    detail:
      "This is LiteLLM doing what it says on the tin, on Kubernetes, through GitOps like everything else. The engineering worth doing was the key and allowlist model, the attribution scheme and the runbook.",
  },
  {
    action: "Stop dashboard price constants from rotting",
    status: "open",
    detail:
      "The 4x bug was config drift, not a measurement error: the tokens were counted correctly and multiplied by a price a human had typed in. Closing this properly means something that compares those constants against what the provider actually charges.",
  },
];

function ActionItems() {
  return (
    <ul className="space-y-px">
      {ACTION_ITEMS.map((item) => (
        <li
          key={item.action}
          className="bg-card/30 border border-border rounded-md p-5"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 mb-2">
            <h3 className="font-mono font-semibold tracking-tight text-foreground">
              {item.action}
            </h3>
            <span
              className={`shrink-0 font-mono text-[10px] uppercase tracking-wider border rounded px-2 py-0.5 ${STATUS_TONE[item.status]}`}
            >
              {item.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {item.detail}
          </p>
        </li>
      ))}
    </ul>
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
      <IncidentHeader phosphor={PHOSPHORS.amber.label} />

      <div className="container px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="mb-5">
              <span className="font-mono text-sm text-primary">// try it</span>
              <h2 className="mt-2 font-mono font-semibold tracking-tight text-2xl sm:text-3xl text-foreground">
                Two different ways to get a 401
              </h2>
              <p className="mt-2 text-muted-foreground max-w-2xl">
                Pick a consumer and a model. Some combinations come back 401
                even though the model is fully deployed, and the trace shows
                exactly where the refusal happens. That catches people
                constantly, including me.
              </p>
            </div>
            <GatewayTracer />
          </FadeUp>
        </div>
      </div>

      <div className="container px-4">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr] max-w-7xl mx-auto">
          <div className="space-y-12">
            <CaseStudySection
              eyebrow="// before: no gateway"
              title="The third API key is the one that hurts"
            >
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our first AI feature shipped with a provider key in a secret
                and nobody minded. By the third I could see where it was
                heading: keys scattering across repos, and nobody able to say
                what any of it cost.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                None of that is an AI problem. It&apos;s unmanaged database
                credentials wearing a hat, and it has the same fix. I built this
                while we had two consumers, which is the only reason it was a
                small job.
              </p>
            </CaseStudySection>

            <CaseStudySection
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
            </CaseStudySection>

            <CaseStudySection eyebrow="// request · spend tags" title="Whose spend is it?">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every call carries its tenant, plus tags for environment and
                feature. Chat, scheduled estate summaries and the nightly schema
                compile all bill to one service but answer completely different
                questions about cost.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                So &quot;what is the AI costing us&quot; became answerable per
                tenant and per feature, which matters the first time somebody
                asks about cost to serve.
              </p>
              <div className="rounded-lg border border-warn/40 bg-warn/5 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-warn/30 font-mono text-xs">
                  <span className="w-2 h-2 rounded-full bg-warn" aria-hidden />
                  <span className="text-warn font-semibold">postmortem</span>
                  <span className="text-muted-foreground">
                    · the 4x pricing bug · severity: embarrassing
                  </span>
                </div>
                <dl className="px-5 py-4 space-y-3 text-sm leading-relaxed">
                  <div className="grid sm:grid-cols-[7rem_1fr] gap-1">
                    <dt className="font-mono text-xs text-warn/90 pt-0.5">symptom</dt>
                    <dd className="text-muted-foreground">
                      Spend read about fourfold high. For weeks.
                    </dd>
                  </div>
                  <div className="grid sm:grid-cols-[7rem_1fr] gap-1">
                    <dt className="font-mono text-xs text-warn/90 pt-0.5">cause</dt>
                    <dd className="text-muted-foreground">
                      The cost dashboard multiplies tokens by per-million prices
                      held as dashboard variables, and ours were set to a
                      different model&apos;s pricing than the one deployed.
                    </dd>
                  </div>
                  <div className="grid sm:grid-cols-[7rem_1fr] gap-1">
                    <dt className="font-mono text-xs text-warn/90 pt-0.5">why it lived</dt>
                    <dd className="text-muted-foreground">
                      Nobody questioned it, because the number was in a
                      dashboard and dashboards look authoritative.
                    </dd>
                  </div>
                  <div className="grid sm:grid-cols-[7rem_1fr] gap-1">
                    <dt className="font-mono text-xs text-warn/90 pt-0.5">lesson</dt>
                    <dd className="text-foreground/90">
                      Tokens are measured. Prices are config, and config rots.
                    </dd>
                  </div>
                </dl>
              </div>
            </CaseStudySection>

            <CaseStudySection eyebrow="// after: what got cheap" title="What it made cheap">
              <p className="text-muted-foreground leading-relaxed mb-4">
                The point of a seam is what gets easy afterwards. There&apos;s
                an automated pull request review agent running on PRs across
                eight production services now, and building it needed no
                provider credentials, no billing conversation, no new secret.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Model upgrades became config too. Moving a consumer between
                versions is an allowlist entry and an env var, which is how the
                estate followed three generations of the same model family
                without anyone rewriting a consumer.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// review: action items" title="What changed as a result">
              <p className="text-muted-foreground leading-relaxed mb-6">
                This project&apos;s history reads as a list of things that were
                about to hurt and what got done about each one. The last item
                is still open.
              </p>

              <ActionItems />
            </CaseStudySection>

            <CaseStudySection eyebrow="// 200 OK · resolved, monitoring" title="Where it stands">
              <p className="text-muted-foreground leading-relaxed">
                It&apos;s an unglamorous piece of infrastructure and that&apos;s
                roughly the recommendation. Built before the sprawl rather than
                after it, which is the only reason adding an AI feature here is
                now a config change instead of a procurement conversation. The
                version of this page I&apos;d have had to write two years later
                is the interesting one, and I&apos;d rather not find out what it
                says.
              </p>
            </CaseStudySection>
          </div>

          <IncidentAppendices />
        </div>
      </div>

      <IncidentSignoff />
    </CaseStudyLayout>
  );
}
