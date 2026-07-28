"use client";

import {
  CaseStudyLayout,
  CaseStudyHero,
  CaseStudySection,
  StatsGrid,
  TechSidebar,
  CaseStudyCTA,
  EnhancedCodeBlock,
} from "@/components/case-study-layout";
import { GlassCard, FadeUp } from "@/components/scroll-reveal";
import { GatewayTracer } from "@/components/gateway-tracer";

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
    <CaseStudyLayout schema={articleSchema}>
      <CaseStudyHero
        title="AI Gateway"
        subtitle="One endpoint for every model"
        description="A self-hosted LLM gateway in front of every AI workload. Services hold a virtual key with an allowlist, not a provider key, and spend lands against the tenant that caused it."
        date="2026"
        metrics="every AI workload, one endpoint"
        command="cat case-studies/ai-gateway.md"
      />

      <div className="container px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <div className="mb-5">
              <span className="font-mono text-sm text-primary">// try it</span>
              <h2 className="mt-2 font-mono font-semibold tracking-tight text-2xl sm:text-3xl text-foreground">
                Two different ways to get a 401
              </h2>
              <p className="mt-2 text-muted-foreground max-w-2xl">
                Pick a consumer and a model. A model can be fully deployed and
                still refused, because existing and being permitted are separate
                facts. That catches people constantly, including me.
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
              eyebrow="// the problem"
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
              eyebrow="// the gateway"
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

            <CaseStudySection eyebrow="// attribution" title="Whose spend is it?">
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
              <p className="text-muted-foreground leading-relaxed">
                One warning, learned the hard way. The cost dashboard
                multiplies tokens by per-million prices held as dashboard
                variables, and ours were set to a different model&apos;s pricing
                than the one deployed. Spend read about fourfold high for weeks
                and nobody questioned it, because the number was in a dashboard
                and dashboards look authoritative. Tokens are measured. Prices
                are config, and config rots.
              </p>
            </CaseStudySection>

            <CaseStudySection eyebrow="// on top" title="What it made cheap">
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

            <CaseStudySection eyebrow="// design" title="Why it's shaped like this">
              <div className="space-y-5">
                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    Fail closed, and loudly
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    An unpermitted model is a 401, never a silent substitution.
                    A gateway that picks something else for you makes cost and
                    behaviour unpredictable at the same time, and you find out
                    from the bill.
                  </p>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    One gateway, not one per environment
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    It started as a deployment per environment and consolidated
                    down to a single instance with environment as a tag. Fewer
                    moving parts, and spend I can compare across environments
                    instead of summing across dashboards.
                  </p>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="font-mono font-semibold tracking-tight text-foreground mb-2">
                    Buy the boring middle
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This is LiteLLM doing what it says on the tin, on Kubernetes,
                    managed through GitOps like everything else. The engineering
                    worth doing was the key and allowlist model, the attribution
                    scheme, and the runbook. Nobody needed me to write a proxy.
                  </p>
                </GlassCard>
              </div>
            </CaseStudySection>

            <CaseStudySection eyebrow="// impact" title="Where it stands">
              <StatsGrid
                stats={[
                  { value: "1", label: "endpoint for every AI workload" },
                  { value: "Per-key", label: "model allowlists, fail closed" },
                  { value: "3", label: "tags: tenant, environment, feature" },
                  { value: "~4x", label: "spend overstatement the pricing bug hid" },
                ]}
              />

              <p className="text-muted-foreground mt-6 leading-relaxed">
                It&apos;s an unglamorous piece of infrastructure and that&apos;s
                roughly the recommendation. Built before the sprawl rather than
                after it, which is the only reason adding an AI feature here is
                now a config change instead of a procurement conversation.
              </p>
            </CaseStudySection>
          </div>

          <TechSidebar
            technologies={[
              "LiteLLM",
              "Kubernetes",
              "ArgoCD",
              "Kustomize",
              "Gemini",
              "Prometheus",
              "Grafana",
              "AWS Secrets Manager",
              "Istio",
            ]}
            skills={[
              "LLM platform design",
              "Cost attribution for AI workloads",
              "Credential and access boundaries",
              "GitOps-managed shared services",
              "Writing the runbook people actually need",
            ]}
            metrics={[
              { label: "Consumers", value: "Every AI workload in the estate" },
              { label: "Access model", value: "Virtual key + allowlist" },
              { label: "Attribution", value: "Tenant, environment, feature" },
              { label: "Model upgrades", value: "Config, not code" },
            ]}
            relatedProjects={[
              { title: "Clarity · natural-language database interface", href: "/projects/clarity" },
              { title: "Pipeline Platform · shared CI/CD", href: "/projects/pipeline-platform" },
            ]}
          />
        </div>
      </div>

      <CaseStudyCTA />
    </CaseStudyLayout>
  );
}
