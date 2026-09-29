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
    intro: 'Nightshift picks up well-scoped engineering tickets, version bumps and security fixes, and turns each one into a tested draft pull request. I built the service and ran its first pilot against real Jira tickets.',
    role: 'Service design, implementation and pilot', context: 'Loweconex', status: 'Working supervised pilot',
    stack: ['Python', 'Kubernetes', 'Jira', 'Bitbucket', 'LiteLLM'],
    takeaway: 'The model writes the change. The harness decides whether it’s allowed to leave the workspace.',
    sections: [
      { id: 'problem', title: 'Small tickets that never reach the top', paragraphs: [
        'Every team has a queue of useful, small work: a dependency bump, a pen-test finding, a ticket someone described well and nobody had time for. It sits behind bigger priorities.',
        'I wanted something that could pick that work up and leave a change ready for review. Generating a patch was the easy part. The hard part was the handover: the right repository, a clear scope, a check anyone can rerun, and a record a reviewer can follow.'
      ] },
      { id: 'approach', title: 'A harness around the model', paragraphs: [
        'A Python harness picks eligible tickets, checks their scope, claims them and prepares an isolated workspace. The model only works inside that workspace. Verifying and publishing are separate steps the harness controls, and the repository credentials never reach the model’s stage.',
        'Version bumps use deterministic edits, because a model has nothing to add there. If a ticket is too vague to act on, Nightshift asks a question on the ticket instead of guessing. Each capability has its own access and budget, and every run leaves a record.'
      ] },
      { id: 'decisions', title: 'Passing tests isn’t the same as done', paragraphs: [
        'The verifier rebuilds the change from a clean checkout and runs the configured checks. If they fail, nothing is published. If they pass, Nightshift opens a draft pull request and an engineer decides whether to merge it.',
        'A green run is good evidence, but it doesn’t prove every acceptance criterion, or that a security finding is really fixed. And if someone edits the ticket or pushes to the branch mid-run, earlier decisions may no longer hold, so the harness checks the state again before it writes anything.'
      ] },
      { id: 'result', title: 'The pilot', paragraphs: [
        'The first pilot took pen-test tickets on a Java service. The draft it produced passed Maven tests run independently of the agent, then branch and pull-request CI. A person reviewed it before anything merged.',
        'It also hit edge cases the first version missed. Those turned into review and regression work, and they shaped where the verification and handover boundaries sit now. Version maintenance and review-feedback workflows run on the same platform. Incident response is designed for, but not built yet.'
      ] },
    ], next: 'clarity',
  },
  clarity: {
    id: 'clarity', category: 'Applied AI', title: 'Clarity',
    headline: 'Ask a question. Get an answer from your data.',
    intro: 'Clarity lets our customers ask questions of their own data in plain English, and get back an answer, the SQL behind it, or a CSV report. A colleague built the first Java prototype. I took it to production and built the query, reporting and access controls around it.',
    role: 'Service development and production rollout', context: 'Loweconex', status: 'Production',
    stack: ['Java', 'Spring Boot', 'Spring AI', 'PostgreSQL', 'Kubernetes'],
    takeaway: 'A wrong “no data” never gets escalated. People just stop using the tool.',
    sections: [
      { id: 'problem', title: 'A number used to mean a ticket', paragraphs: [
        'Our customers run sites like supermarkets and warehouses, full of sensors and HVAC kit. The data about all of it was already in their databases. Getting a number out meant knowing the schema, or raising a ticket and waiting for someone who did.',
        'Clarity lets them ask in English. It works out which tables matter, runs a query and returns the answer with the SQL attached. These users can read SQL, so they can check the working instead of taking the tool’s word for it.'
      ] },
      { id: 'approach', title: 'Know the schema, guard the query', paragraphs: [
        'A nightly job compiles a knowledge document for each customer’s schema, so the model starts with an accurate picture of the tables and how they join. It can fall back to live discovery. We didn’t need a vector database for any of this.',
        'Generated SQL is lexed and validated before it runs. A check that only pattern-matched would let FROM/**/pg_tables straight past. Queries run under a read-only role with row limits and timeouts. If that role can’t connect, the request fails; there is no code path that falls back to the admin connection.',
        'Reports stream to storage instead of being built in memory, because a useful answer is often an export rather than ten rows.'
      ] },
      { id: 'decisions', title: 'The failure that looked like success', paragraphs: [
        'Someone asked which sites were running hottest. Clarity said there was no data. There was loads of data. That kind of wrong answer is worse than an error, because nobody reports it.',
        'So I added checks between the tool results and the final response. An answer can’t claim a result from a query that failed, name something that isn’t in the data, or say it did something it didn’t. Tool calls and request rates are limited in the application code, where a prompt can’t talk its way around them.'
      ] },
      { id: 'result', title: 'In production', paragraphs: [
        'Clarity is live with natural-language questions and CSV exports, with tracing, usage attributed per customer and feature, and checks in the dev and QA delivery path. A customer can get a report without writing SQL or waiting on a ticket.'
      ] },
    ], next: 'heimdall',
  },
  heimdall: {
    id: 'heimdall', category: 'Developer tooling', title: 'Heimdall',
    headline: 'Where is that change, actually?',
    intro: 'Heimdall answers the question engineers kept asking in Teams: has my change reached the environment I’m looking at? It joins Jira, Bitbucket, ArgoCD and test results on one page. I built it and I run it.',
    role: 'Service design, implementation and operation', context: 'Loweconex', status: 'Production',
    stack: ['Python', 'Flask', 'TimescaleDB', 'ArgoCD', 'Prometheus', 'Thanos'],
    takeaway: 'ArgoCD will report a service healthy while its new pods crashloop behind it.',
    sections: [
      { id: 'problem', title: 'Four tools, one question', paragraphs: [
        'Jira knew about the ticket. Bitbucket knew about the pull request. The GitOps repo said what should be deployed, and Prometheus said what was running. To find out whether a change had reached QA, you opened all four, or you pasted kubectl output into Teams and asked.',
        'My first attempt didn’t fix that. It was a small Python service that pushed the four DORA metrics into Prometheus. The numbers were correct, and nobody ever opened it.'
      ] },
      { id: 'approach', title: 'Collect in the background, answer from one page', paragraphs: [
        'The collector pulls from the upstream sources every ten minutes and keeps the history in TimescaleDB. The UI reads a shared snapshot, so opening the dashboard doesn’t send a fresh round of requests to Jira, Bitbucket and ArgoCD.',
        'From there you can follow a ticket to its pull request and on through each environment: PR merged, tag updated, pods healthy, tests passed. The same page shows stale work, blocked releases, and any environment where the running revision isn’t the one GitOps asked for.'
      ] },
      { id: 'decisions', title: 'One green tick isn’t enough', paragraphs: [
        'ArgoCD reports on the application, and the old pods keep serving while the new ones fail. So Heimdall reads pod state through Prometheus and Thanos as well, and a deploy only counts once the new revision is up.',
        'When a signal is missing, the page says so. A gap in the data shouldn’t turn into a reassuring green.'
      ] },
      { id: 'result', title: 'What changed', paragraphs: [
        'The team stopped pasting kubectl output into Teams to ask whether a deploy had worked. Standup runs off Heimdall now, and it got shorter.',
        'Release management started using the same view as the engineers, so both sides of a release conversation are looking at the same evidence.'
      ] },
    ], next: 'pipeline-platform',
  },
  'pipeline-platform': {
    id: 'pipeline-platform', category: 'Software delivery', title: 'Delivery platform',
    headline: 'A shared path from commit to deployment.',
    intro: 'When I started, every service carried its own pipeline and they had drifted apart. I built the foundations of our shared pipeline library and CI/CD, and others added to it as the team grew. It now builds, checks and deploys 25 Java and Node services across four environments.',
    role: 'Built the foundations; owner as the team grew', context: 'Loweconex', status: 'Production',
    stack: ['Bitbucket Pipelines', 'ArgoCD', 'Kubernetes', 'Bash', 'Java', 'Node.js'],
    takeaway: 'Most of the failures we’d been calling flaky were tests hitting a pod that had started but wasn’t serving yet.',
    sections: [
      { id: 'problem', title: 'Every change, in every repo', paragraphs: [
        'Each service had its own bitbucket-pipelines.yml: hundreds of lines of shell and YAML, copied from the last service and edited. A change to the build pattern meant a pull request to every repository, so in practice it didn’t get made.',
        'Stage notifications came from a bash reporter baked into the base image. It worked, and nobody wanted to touch it.'
      ] },
      { id: 'approach', title: 'One import per service', paragraphs: [
        'I split the shared logic into two versioned libraries, java-shared-pipeline and node-shared-pipeline. A service imports a pinned version and keeps only its own build settings in .ci/builds.yaml. The shared path runs the build, tests and security checks, publishes an image, and writes a build.json with the commit, image digest and tags that Heimdall and Sentry read downstream.',
        'Extra gates like Veracode, SourceClear and Jira fix-version checks are switched on per service with an environment variable. For dev, Image Updater writes the new image to the GitOps repo and ArgoCD rolls it out. Rolling back is a git revert. I’ve done one at 2am and gone back to sleep.'
      ] },
      { id: 'decisions', title: 'Test what was deployed', paragraphs: [
        'I moved our test framework into an ArgoCD PostSync hook for dev and QA, so the suites run against the service that is live. Results land in Sentry, the dashboard I built for them. I called it Sentry, which was a mistake given the error-tracking product, but it’s what everyone calls it now.',
        'Most of the failures we’d been calling flaky were tests hitting a pod that had started but wasn’t serving yet. Automatic promotion from dev to QA checks that the tested image is still the one running. Missing results, all-skipped suites and ambiguous failures stop promotion instead of passing quietly. Preprod and production are still a person’s decision.'
      ] },
      { id: 'result', title: 'Where it is now', paragraphs: [
        'All 25 services build through the shared libraries, and a fix to the pipeline ships once, as a new version, instead of as 25 pull requests.',
        'As the team grew, other engineers added to it. The path now also turns security findings into deduplicated Jira tickets and runs automated code review beside the build.',
        'Adoption was the real work. Any team could veto the migration by simply not moving, so the shared path had to be less effort than their own. I’d do it the same way again.'
      ] },
    ], next: 'observability',
  },
  observability: {
    id: 'observability', category: 'Platform operations', title: 'Observability',
    headline: 'Follow a problem from the symptom to the service.',
    intro: 'Too often, the first sign something was wrong came from outside the team. I built and run the metrics, logs and tracing platform for our Kubernetes environments, self-hosted on capacity we already had.',
    role: 'Platform implementation and operation', context: 'Loweconex', status: 'Production',
    stack: ['Kubernetes', 'Prometheus', 'Thanos', 'Loki', 'Tempo', 'Grafana'],
    takeaway: 'Now an incident usually starts with someone pasting a Grafana link.',
    sections: [
      { id: 'problem', title: 'Finding out from someone else', paragraphs: [
        'We had services across four environments and no shared way to see what they were doing.',
        'A commercial platform was the obvious fix. We self-hosted instead: Prometheus and Thanos for metrics, Loki for logs, Tempo for traces and Grafana to explore them, on cluster capacity we already had, with the config in Git. That keeps it very cheap. It also means it’s mine to fix whatever the hour, because there’s no support contract behind it. At a three-person startup I’d make the opposite call.'
      ] },
      { id: 'approach', title: 'From a spike to the line that caused it', paragraphs: [
        'Metric exemplars open the matching trace, the trace links to the service’s logs, and a log line with a trace ID leads back to the request. That only works if the services log the same way, so I wrote the structured logging config and the OpenTelemetry conventions the Java services share.',
        'Each environment has its own stack, and a federated query layer joins them across AWS accounts. Older data moves to object storage, with retention set per signal.'
      ] },
      { id: 'decisions', title: 'Alerts people won’t learn to ignore', paragraphs: [
        'I went through every alert rule against the metrics we had, and 72 alerts now link to a runbook. Thresholds for the monitoring pipeline came from its own history rather than round numbers.',
        'Routing depends on the environment: production pages on-call at any hour, QA goes to Teams, and dev waits for business hours. Inhibition rules stop one failure setting off a cascade of alerts. Without them, the first real incident would have taught everyone to ignore the pager.'
      ] },
      { id: 'result', title: 'Now', paragraphs: [
        'An incident usually starts with someone pasting a Grafana link. Engineers can follow a request across services and open the runbook straight from the alert.',
        'Self-hosting also means I own retention, upgrades, capacity and the monitoring system’s own failure modes. That’s part of the job, and it was from the start.'
      ] },
    ], next: 'ai-gateway',
  },
  'ai-gateway': {
    id: 'ai-gateway', category: 'AI infrastructure', title: 'AI gateway',
    headline: 'One place to connect, control and understand AI usage.',
    intro: 'Our first AI feature shipped with a provider key in its config. By the third, it was clear where that was heading. A colleague had stood up LiteLLM in dev. I moved it onto a dedicated platform cluster, made it the one way our services and tooling reach a model, and migrated the consumers.',
    role: 'Platform rollout, integrations and operation', context: 'Loweconex', status: 'Production',
    stack: ['LiteLLM', 'Kubernetes', 'AWS', 'Grafana', 'ArgoCD'],
    takeaway: 'Tokens are measured. Prices are config, and config rots.',
    sections: [
      { id: 'problem', title: 'A key per feature', paragraphs: [
        'A provider key in each service works until there are several. Then nobody can say who is using which model or what it costs, and switching model means editing every app.'
      ] },
      { id: 'approach', title: 'Every consumer gets its own identity', paragraphs: [
        'Each workload calls one endpoint with its own scoped virtual key and asks for a model alias. The model catalogue lives at the gateway. Clarity tags its usage by customer, environment and feature, and engineering agents like Nightshift carry their capability and run ID, so every model call traces back to the work that caused it.',
        'I didn’t write a proxy. I ran an existing one, and put the effort into onboarding, identity, deployment and usage records.'
      ] },
      { id: 'decisions', title: 'Fail loudly', paragraphs: [
        'Ask for a model that isn’t on your key’s list and you get a 401. I once lost an afternoon to that with a model that was clearly deployed, and I still wouldn’t change it. A gateway that quietly substitutes another model is worse than one that breaks.',
        'Budgets, rate limits and model access are enforced at the gateway and in each application, because concurrent requests and delayed usage records can overshoot a budget before the gateway notices.'
      ] },
      { id: 'result', title: 'Dull, on purpose', paragraphs: [
        'Customer features, automated PR review and Nightshift all go through the same gateway. I built the PR review into the shared pipeline too. It’s advisory, so if the reviewer is down, the build carries on.',
        'Our spend dashboard once read high for a while because its price variables were set for a different model. Nobody questioned it, because the number was on a dashboard. Tokens are measured. Prices are config, and config rots.',
        'It’s dull infrastructure now, which is what I wanted.'
      ] },
    ], next: 'nightshift',
  },
  'smart-home': {
    id: 'smart-home', category: 'Personal project', title: 'The homelab',
    headline: 'A small platform, close to home.',
    intro: 'My flat runs on a K3s cluster on a Raspberry Pi. It’s where I try ideas on hardware I can reach, with the same GitOps habits I use at work.',
    role: 'Personal design, build and operation', context: 'Home', status: 'Running at home',
    stack: ['K3s', 'Home Assistant', 'Zigbee', 'MQTT', 'ArgoCD', 'Prometheus', 'Grafana', 'Tailscale'],
    takeaway: 'The test is whether the lights still work when the internet doesn’t.',
    sections: [
      { id: 'problem', title: 'Local first', paragraphs: [
        'I didn’t want my motion sensor reporting to a server in another country. Home Assistant runs the devices, a Zigbee mesh talks to them locally, and MQTT carries the messages. There are twenty-plus devices: Hue bulbs, Innr plugs on the kitchen heater and the hallway lamp, motion and contact sensors, and a solar-powered camera.'
      ] },
      { id: 'approach', title: 'Work habits, smaller scale', paragraphs: [
        'It runs on a Raspberry Pi 5 with a 1TB NVMe drive and a UPS, because Home Assistant restarting at 3am after a tripped fuse isn’t something I wanted twice. ArgoCD reconciles the config from Git, mostly because I already know how to debug it. Prometheus and Grafana watch it, Tailscale means no ports are open to the internet, and the IoT devices sit on their own VLAN.'
      ] },
      { id: 'decisions', title: 'Where AI fits', paragraphs: [
        'I’m experimenting with a local language model as another way to give commands. It’s a work in progress, and it’s an extra way in. Nothing depends on it, least of all the light switches.'
      ] },
      { id: 'next', title: 'What’s next', paragraphs: [
        'Smart radiator valves, then presence detection. Motion sensors are fine for “is someone in the hallway” and useless for “is anyone home”, so that one needs a different approach.'
      ] },
    ], next: 'ml-scheduler',
  },
  'ml-scheduler': {
    id: 'ml-scheduler', category: 'MSc research', title: 'Kubernetes recovery',
    headline: 'When everything cannot fit, what should recover first?',
    intro: 'My MSc dissertation at Queen’s, “Evict the Guilty, Not the Innocent”, supervised by Prof. Javid Taheri. When a Kubernetes node dies and the survivors can’t hold everything, what should come back first, and what should you never evict to make room? Awarded with Distinction.',
    role: 'Dissertation design, implementation and evaluation', context: 'Queen’s University Belfast', status: 'Completed · Distinction',
    stack: ['Python', 'Kubernetes', 'Amazon EKS', 'Terraform', 'Optimisation'],
    takeaway: 'Priority is useful evidence. Measured serving behaviour can change what that priority is worth.',
    sections: [
      { id: 'problem', title: 'A node fails and the rest can’t hold everything', paragraphs: [
        'Once the surviving nodes can’t fit every workload, recovery becomes a choice. Kubernetes recovers in priority order, which isn’t the same as recovering the most valuable set that fits.',
        'I built a scheduler that treats it as a knapsack problem, plus a model that estimates from signals the kubelet already reports whether a workload is serving, so an importance label isn’t the only thing it trusts.'
      ] },
      { id: 'approach', title: 'Real clusters, plan written first', paragraphs: [
        'I ran it on Amazon EKS with node failures induced on purpose, against the stock scheduler and PriorityClass preemption. Workloads came from the Alibaba 2018 cluster trace, with nine importance grades. I committed the analysis plan before collecting the confirmatory data, and recorded 199 runs.',
        'These are controlled research workloads on a small cluster. They aren’t production performance claims.'
      ] },
      { id: 'result', title: 'What it found', paragraphs: [
        'In the main comparison, the knapsack scheduler kept 84.9% of importance-weighted work running, against the stock scheduler’s 79.1%, without evicting a single healthy pod. PriorityClass recovered more, by evicting healthy workloads to do it.',
        'A second experiment used services labelled important that weren’t serving. Choosing on measured behaviour instead of labels gained 12.9 points. My written prediction, made weeks before the run, was 12.7. The recorded pairs below come from that experiment, and some of the follow-up comparisons are descriptive rather than confirmatory.'
      ] },
    ], next: 'heimdall',
  },
};
