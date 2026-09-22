export interface CaseSection {
  id: string;
  title: string;
  paragraphs: string[];
}
export interface CaseStory {
  id: string;
  category: string;
  title: string;
  headline: string;
  intro: string;
  role: string;
  context: string;
  status: string;
  stack: string[];
  takeaway: string;
  sections: CaseSection[];
  next: string;
}

export const caseStories: Record<string, CaseStory> = {
  nightshift: {
    id: 'nightshift', category: 'Engineering automation', title: 'Nightshift',
    headline: 'A ticket goes in. A reviewable change comes out.',
    intro: 'Nightshift picks up engineering tickets, version updates and security fixes, then prepares a tested change for review. I built the service and ran its first Jira delivery pilot.',
    role: 'Service design, implementation and pilot', context: 'Loweconex', status: 'Working supervised pilot',
    stack: ['Python', 'Kubernetes', 'Jira', 'Bitbucket', 'LiteLLM'],
    takeaway: 'The model proposes the change. The service checks whether it is allowed to leave the workspace.',
    sections: [
      { id: 'problem', title: 'Useful work, waiting in a queue', paragraphs: [
        'A version update or a well-described engineering ticket can sit behind larger priorities. I wanted a way to pick up that work, produce a small change and leave it ready for an engineer to review.',
        'The difficult part was the handover. A generated patch needs the right repository, a clear scope, a reproducible check and somewhere for the reviewer to understand what happened. That is the service I set out to build.'
      ] },
      { id: 'approach', title: 'Give the model a bounded job', paragraphs: [
        'A Python harness selects eligible work, checks the scope, claims the ticket and prepares a workspace. The model works on the implementation. Verification and publishing remain separate steps controlled by the harness.',
        'Version updates use deterministic edits where generation adds no value. Ticket delivery can ask for clarification when the request is incomplete. Each capability has its own access and budget, and each run leaves a record.',
        'The execution design separates preparation, implementation, verification and publication. Repository credentials belong to the trusted stages. The verifier reconstructs the proposed change from a clean baseline before running the configured checks.'
      ] },
      { id: 'decisions', title: 'A green test run is a handover point', paragraphs: [
        'Nightshift opens draft pull requests. An engineer still reviews the implementation and decides whether to merge. Passing the configured tests is useful evidence, but it does not settle every acceptance criterion or prove that a security finding is resolved.',
        'Failed checks prevent publication. Unclear requests should produce questions. A human edit or a changed ticket can invalidate an earlier decision, so the service checks the state again before writing.'
      ] },
      { id: 'result', title: 'From a harness to a working pilot', paragraphs: [
        'The Jira delivery pilot produced changes for pen-test tickets on a Java service. The recorded draft passed independently run Maven tests and branch and pull-request CI. Human review remained the acceptance step.',
        'The pilot also exposed edge cases that the first implementation missed. Those cases became further review and regression work. They helped shape the verification and handover boundaries, rather than becoming a reason to trust the next generated change automatically.',
        'The platform also supports version maintenance and review-feedback workflows. The reusable workflow is also designed to support incident response, with that capability still to develop beyond the delivery pilot.'
      ] },
      { id: 'lesson', title: 'What I would carry into the next agent', paragraphs: [
        'Make the permitted work explicit. Keep verification independent. Leave enough evidence for the next person to make a decision. Those choices have mattered more than making the agent sound confident.'
      ] },
    ], next: 'clarity',
  },
  clarity: {
    id: 'clarity', category: 'Applied AI', title: 'Clarity',
    headline: 'Ask a question. Get an answer from your data.',
    intro: 'Clarity lets customers ask questions of their databases and download reports. I took the service from an early Java prototype into production, building the query, reporting and access controls around it.',
    role: 'Service development and production rollout', context: 'Loweconex', status: 'Production',
    stack: ['Java', 'Spring Boot', 'Spring AI', 'PostgreSQL', 'Kubernetes'],
    takeaway: 'An answer needs a real query behind it, and that query needs to stay inside the customer’s data.',
    sections: [
      { id: 'problem', title: 'A question should not require a SQL request', paragraphs: [
        'The data was already there: operational records in customer databases and telemetry in a shared store. Getting an answer often meant knowing the schema or asking someone who did.',
        'Clarity lets a user ask in plain English. It explores the relevant schema, runs a query and returns an answer or a downloadable report. My work built on a colleague’s prototype and covered much of the service implementation and its rollout.'
      ] },
      { id: 'approach', title: 'Start with the database that actually exists', paragraphs: [
        'A compiled schema document gives the model context about the customer’s tables and relationships. The service refreshes that context and can fall back to live discovery. It does not need a vector database to understand this schema.',
        'Generated SQL passes through validation before execution. Tenant checks, a read-only database role, row limits and timeouts constrain the query. On the shared telemetry store, tenant isolation also depends on application-side checks.',
        'Reports stream to storage instead of being assembled entirely in memory. That matters when a question produces a useful export rather than a handful of rows.'
      ] },
      { id: 'decisions', title: 'Check the answer before showing it', paragraphs: [
        'A plausible answer can still refer to a query that failed or a report that was never created. I added checks around the tool results and the final response so those failures could be handled before the answer reached the user.',
        'The service also limits tool calls and request rates. These are controls in the application. A prompt asking the model to be careful would not provide the same boundary.'
      ] },
      { id: 'result', title: 'From prototype to a service people can use', paragraphs: [
        'Clarity reached production with natural-language queries and CSV exports, supported by deployment configuration, tracing, usage attribution and checks in the dev and QA delivery path.',
        'The useful outcome is straightforward: a customer can ask a question and obtain a report without writing SQL. The engineering underneath makes that simple interaction possible across separate customer databases.'
      ] },
      { id: 'lesson', title: 'The interface is only the beginning', paragraphs: [
        'The chat box is the easy part to demonstrate. Schema knowledge, constrained data access, report lifecycle and failure handling are the parts that make the service worth operating.'
      ] },
    ], next: 'heimdall',
  },
  heimdall: {
    id: 'heimdall', category: 'Developer tooling', title: 'Heimdall',
    headline: 'Where is that change, actually?',
    intro: 'Heimdall brings tickets, code changes, deployments and test results into one view. I built it so engineers can follow a change from a ticket to the environment where it is running.',
    role: 'Service design, implementation and operation', context: 'Loweconex', status: 'Production',
    stack: ['Python', 'Flask', 'TimescaleDB', 'ArgoCD', 'Prometheus'],
    takeaway: 'A useful release view connects the ticket someone recognises to the revision that is actually running.',
    sections: [
      { id: 'problem', title: 'The answer was spread across several tools', paragraphs: [
        'Jira knew about the work. Bitbucket knew about the pull request. GitOps described the intended deployment, while runtime metrics and test results said something about what happened next.',
        'Engineers needed to join those pieces themselves to answer a simple question: is this change in the environment I am looking at? Heimdall brings those pieces together.'
      ] },
      { id: 'approach', title: 'Collect once, make the result easy to read', paragraphs: [
        'The Python service collects release evidence across the configured service repositories and environments. It keeps event history in TimescaleDB and serves a shared snapshot to the UI, so opening the dashboard does not trigger a fresh round of upstream requests.',
        'Tickets can be followed through pull requests and deployments. The same view highlights stale work, blocked releases and differences between the intended and running revisions.'
      ] },
      { id: 'decisions', title: 'Be specific about what “healthy” means', paragraphs: [
        'ArgoCD health is one input. Pod evidence can reveal that a new revision is failing while older pods keep the application looking healthy. Heimdall reads the ArgoCD and pod metrics through Prometheus and Thanos, and combines that evidence rather than treating one green status as the whole answer.',
        'When evidence is missing, the UI needs to say so. An unavailable signal should not become a reassuring green state or a made-up deployment verdict.'
      ] },
      { id: 'result', title: 'A common place to look', paragraphs: [
        'Heimdall gives the team one place to see where a change has reached, inspect the supporting evidence and investigate stalled work. It is a tool for both the person shipping a change and the person trying to understand a release.',
        'Moving collection out of the request path and making the UI useful were as important as integrating the data sources. A correct answer still needs to be easy to find.'
      ] },
      { id: 'lesson', title: 'Treat the interface as part of the platform', paragraphs: [
        'This project changed how I think about internal tooling. The collector, data model and UI all contribute to the result. Platform work succeeds when the next person can use it without needing the author beside them.'
      ] },
    ], next: 'pipeline-platform',
  },
  'pipeline-platform': {
    id: 'pipeline-platform', category: 'Software delivery', title: 'Delivery platform',
    headline: 'A shared path from commit to deployment.',
    intro: 'Our services had accumulated their own pipeline logic. I helped replace that duplication with shared delivery tooling, and owned the integrations that connected builds, GitOps, security checks and post-deploy verification.',
    role: 'Shared platform contributor and integration owner', context: 'Loweconex', status: 'Production',
    stack: ['Bitbucket Pipelines', 'ArgoCD', 'Kubernetes', 'Bash', 'Java', 'Node.js'],
    takeaway: 'Builds produce an image. Deployment and verification each have their own responsibility.',
    sections: [
      { id: 'problem', title: 'The same change, in another pipeline', paragraphs: [
        'Each service carried its own build, scan and deployment configuration. Improvements were difficult to roll out consistently, and familiar pieces of shell and YAML drifted between repositories.',
        'The shared pipeline library was a team effort. My ownership included GitOps integration, the Jira gate, security-finding automation, AI review, post-deploy verification and the rollout across services.'
      ] },
      { id: 'approach', title: 'Keep the service configuration small', paragraphs: [
        'Java and Node services import versioned shared pipelines and supply their own build configuration. The common path runs the build, tests and security checks, then publishes an image.',
        'For dev deployment, Image Updater records the image in GitOps and ArgoCD reconciles the change. Other environment promotions keep their own reviewed path. Separating these responsibilities made the build pipeline easier to reason about.'
      ] },
      { id: 'decisions', title: 'Verify the thing that was deployed', paragraphs: [
        'I integrated our in-house test framework as an ArgoCD PostSync hook in dev and QA. It checks the deployed service, runs its configured suites and publishes the result.',
        'Automatic dev-to-QA promotion checks that the tested image is still the one running. Missing results, all-skipped suites and ambiguous failures must stop promotion rather than produce a misleading pass. Preprod and production promotion remain human decisions.'
      ] },
      { id: 'result', title: 'Shared improvements, explicit ownership', paragraphs: [
        'The shared platform supports the Java and Node service estate across four environments. Teams adopt versioned improvements instead of maintaining every integration independently.',
        'Security findings can become deduplicated Jira tickets, and automated code review sits beside the usual build checks. Each integration has a specific place in the delivery path, rather than becoming another step that no one knows how to interpret.'
      ] },
      { id: 'lesson', title: 'A gate needs to earn its place', paragraphs: [
        'A flaky gate makes engineers work around it. Tightening the verification rules and making failure states understandable was a large part of the work. The purpose of the platform is to help people release with confidence.'
      ] },
    ], next: 'observability',
  },
  observability: {
    id: 'observability', category: 'Platform operations', title: 'Observability',
    headline: 'Follow a problem from the symptom to the service.',
    intro: 'I built and operated the metrics, logs and tracing platform for our Kubernetes environments. The goal was to give engineers a practical way to investigate problems, with alerts they could follow through to an action.',
    role: 'Platform implementation and operation', context: 'Loweconex', status: 'Production',
    stack: ['Kubernetes', 'Prometheus', 'Thanos', 'Loki', 'Tempo', 'Grafana'],
    takeaway: 'The useful part is the connection: a metric leads to a trace, and the trace leads to the relevant logs.',
    sections: [
      { id: 'problem', title: 'Bring the signals into the same investigation', paragraphs: [
        'A microservices estate produces plenty of telemetry. Engineers need a way to follow it across services and environments without starting again in each tool.',
        'I built the self-hosted stack on Kubernetes: Prometheus and Thanos for metrics, Loki for logs, Tempo for traces, and Grafana as the place to explore them. Infrastructure and configuration live in version control.'
      ] },
      { id: 'approach', title: 'Connect the views people already need', paragraphs: [
        'Metric exemplars open the related trace. Trace details link to the service logs, and a log with a trace ID can lead back to the request. I also wrote the structured logging configuration that makes those connections possible across the Java services.',
        'Each environment has its own telemetry stack. A federated query layer brings the exposed environments together across AWS accounts. Historical data moves to object storage, with retention set deliberately for each signal.'
      ] },
      { id: 'decisions', title: 'An alert should come with a next step', paragraphs: [
        'I audited alert rules against the metrics we actually had and linked actionable alerts to runbooks. For the monitoring pipeline, I checked thresholds against historical behaviour rather than selecting values in isolation.',
        'Shared rules reduce duplication, while environment-specific thresholds and notification routing keep a development issue from pretending to be a production incident. The alerting configuration needs to be understandable to the person on call.'
      ] },
      { id: 'result', title: 'A platform the team can investigate through', paragraphs: [
        'The service environments have a common set of metrics, logs and tracing tools. Engineers can follow requests through the stack and use runbooks to investigate alerts.',
        'Self-hosting also means owning retention, upgrades, capacity and the monitoring system’s own failure modes. Those operational responsibilities are part of the project, not an afterthought to installing Grafana.'
      ] },
      { id: 'lesson', title: 'Make uncertainty visible', paragraphs: [
        'A missing signal and a healthy service are different states. I want the monitoring to make that distinction clear, and the runbook to give the next engineer enough context to investigate it.'
      ] },
    ], next: 'ai-gateway',
  },
  'ai-gateway': {
    id: 'ai-gateway', category: 'AI infrastructure', title: 'AI gateway',
    headline: 'One place to connect, control and understand AI usage.',
    intro: 'As AI features and engineering agents appeared, each needed model access and a way to account for usage. I took an existing LiteLLM proof of concept and made it a shared service for the product and delivery tooling.',
    role: 'Platform rollout, integrations and operation', context: 'Loweconex', status: 'Production',
    stack: ['LiteLLM', 'Kubernetes', 'AWS', 'Grafana', 'ArgoCD'],
    takeaway: 'Access and usage belong to the workload that caused them.',
    sections: [
      { id: 'problem', title: 'A provider key is a poor platform interface', paragraphs: [
        'A feature can start with a model key in its configuration. As more features arrive, access, model selection and usage become harder to follow.',
        'A colleague had stood up the initial gateway in dev. I moved it onto a dedicated platform cluster, made it reachable by the services and delivery tooling, and migrated the consumers.'
      ] },
      { id: 'approach', title: 'Give each consumer its own identity', paragraphs: [
        'Workloads use a shared endpoint with their own scoped virtual key. The model catalogue lives at the gateway, and services ask for the configured model alias.',
        'Clarity tags usage by tenant and feature. Engineering agents carry their capability and run identity. That makes a model call something we can attribute to a particular piece of work.'
      ] },
      { id: 'decisions', title: 'Make limits an operational control', paragraphs: [
        'Budgets, request limits and model access are enforced at the gateway. They complement the application’s own tool-call and rate limits.',
        'Concurrent requests and delayed usage records can overshoot a budget threshold. I pair gateway controls with application limits and keep usage records available for investigation.'
      ] },
      { id: 'result', title: 'A common foundation for different kinds of AI work', paragraphs: [
        'Customer-facing features, automated review and Nightshift use the same access point. Each consumer has a clearer boundary, and model configuration no longer needs to be scattered across every application.',
        'I also built automated pull-request review into the shared delivery tooling. Its feedback is advisory: an unavailable reviewer should not block the service’s normal build.'
      ] },
      { id: 'lesson', title: 'The integration is the product', paragraphs: [
        'Running a proxy is only one piece. The useful platform includes consumer onboarding, identity, deployment, usage records and failure behaviour that another engineer can understand.'
      ] },
    ], next: 'nightshift',
  },
  'smart-home': {
    id: 'smart-home', category: 'Personal project', title: 'The homelab',
    headline: 'A small platform, close to home.',
    intro: 'My home automation setup is where I try ideas on hardware I can reach. It brings together Kubernetes, local device control and the same GitOps habits I use at work.',
    role: 'Personal design, build and operation', context: 'Home', status: 'Personal project',
    stack: ['K3s', 'Home Assistant', 'Zigbee', 'MQTT', 'ArgoCD', 'Prometheus', 'Grafana'],
    takeaway: 'The useful test is whether the ordinary things still work when the internet does not.',
    sections: [
      { id: 'problem', title: 'Keep everyday control local', paragraphs: ['I wanted home automation that I could understand and operate myself. Home Assistant connects the devices, a Zigbee mesh handles local communication, and MQTT carries messages between parts of the setup.'] },
      { id: 'approach', title: 'Use the same habits on a smaller system', paragraphs: ['The services run on a bare-metal K3s cluster, with configuration reconciled through ArgoCD. Prometheus and Grafana provide a view of the system. Keeping the configuration in Git makes experiments easier to undo and changes easier to explain.'] },
      { id: 'decisions', title: 'Try AI without making it a dependency', paragraphs: ['A local language model provides another way to issue commands. It is an additional interface to a working system, rather than a requirement for every light switch. Keeping that distinction makes the experiment useful without making basic control fragile.'] },
      { id: 'lesson', title: 'A place to learn by operating', paragraphs: ['The homelab gives me a place to test deployment changes and explore unfamiliar components. It also provides a quick reminder that a system needs to be usable by someone who did not build it.'] },
    ], next: 'ml-scheduler',
  },
  'ml-scheduler': {
    id: 'ml-scheduler', category: 'MSc research', title: 'Kubernetes recovery',
    headline: 'When everything cannot fit, what should recover first?',
    intro: 'For my MSc in Artificial Intelligence, awarded with Distinction, I studied recovery after Kubernetes node failure. The work asks how to use limited surviving capacity while avoiding unnecessary disruption to healthy services.',
    role: 'Dissertation design, implementation and evaluation', context: 'Queen’s University Belfast', status: 'Completed · Distinction',
    stack: ['Python', 'Kubernetes', 'Amazon EKS', 'Terraform', 'Optimisation'],
    takeaway: 'Priority is useful evidence. Measured serving behaviour can change what that priority is worth.',
    sections: [
      { id: 'problem', title: 'A node fails. The remaining capacity is not enough.', paragraphs: ['Recovery becomes a selection problem when the surviving nodes cannot hold every workload. Choosing an order is not necessarily the same as choosing the most valuable set that fits.', 'I built a scheduler that treats that choice as a capacity-constrained optimisation problem. A further model estimates whether a workload is likely to serve, so an important label is not the only signal.'] },
      { id: 'approach', title: 'Measure the behaviour on real clusters', paragraphs: ['The evaluation used Amazon EKS with induced node failure, alongside a stock Kubernetes scheduler and PriorityClass preemption. The analysis plan was committed before the confirmatory data was collected.', 'The campaign recorded 199 runs across the experimental conditions and instrument checks. The comparisons account for both recovered work and disruption to healthy pods. These are research workloads, not production performance claims.'] },
      { id: 'result', title: 'Recovery has more than one cost', paragraphs: ['In the main capacity-constrained comparison, the knapsack scheduler kept 84.9% of importance-weighted work running against the stock scheduler’s 79.1%, without evicting healthy pods. PriorityClass recovered more, but did so by evicting healthy workloads.', 'A separate experiment examined services whose importance labels did not match their serving behaviour. The recorded pairs below show what changed when selection used measured behaviour. The result is specific to that experiment and its workload.'] },
      { id: 'lesson', title: 'A result worth explaining with its limits', paragraphs: ['The live cluster was small, the workloads were controlled and some follow-up comparisons were descriptive. Those limits are part of the result.', 'What I would take into a production design is the discipline: measure whether work is serving, make the capacity trade-off explicit, and evaluate the disruption caused by recovery as well as the work it brings back.'] },
    ], next: 'heimdall',
  },
};
