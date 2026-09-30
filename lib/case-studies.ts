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
    headline: 'Engineering agents for tickets, reviews and incidents.',
    intro: 'Nightshift is the service I built for engineering agents at Loweconex. It picks up tagged Jira tickets and handles pull-request reviews, security automation and incident response, with each workflow running under its own access and budget.',
    role: 'Designed, built and run the service', context: 'Loweconex', status: 'Running',
    stack: ['Python', 'Kubernetes', 'Jira', 'Bitbucket', 'LiteLLM'],
    takeaway: 'A shared service for tagged Jira tickets, PR reviews, security automation and incident response. The delivery pilot produced a draft that passed independent Maven tests and CI.',
    sections: [
      { id: 'problem', title: 'Working with the tools we already use', paragraphs: [
        'I wanted a common way to run agents against our engineering tools. A Jira tag marks a ticket for Nightshift to pick up. Other workflows handle pull-request reviews, security work and incident response.',
        'For ticket delivery, the output fits our existing review process: a draft pull request, test results and a record of the run. That gives an engineer a change to assess in Bitbucket, linked back to the work in Jira.'
      ] },
      { id: 'result', title: 'The ticket-delivery pilot', paragraphs: [
        'For the supervised delivery pilot, I started with penetration-test tickets on a Java service. A ticket gives the agent a specific finding to work on and gives the reviewer something concrete to check. Nightshift prepared the workspace, worked on the implementation and submitted the proposed change for verification.',
        'The resulting draft passed Maven tests run independently of the agent, then branch and pull-request CI. An engineer reviewed the change before merge. This exercised the full route from a Jira ticket to a tested draft in Bitbucket.',
        'Those checks cover the build and test suite. Reviewing whether the implementation actually resolves the security finding remains part of the engineer’s job.'
      ] },
      { id: 'approach', title: 'How a run works', paragraphs: [
        'For a delivery run, the Python service selects an eligible tagged ticket, checks its scope and claims the work. It prepares an isolated workspace for the agent. Preparation, implementation, verification and publication are separate stages; repository credentials are kept out of the agent’s implementation stage.',
        'The verifier reconstructs the proposed change from a clean checkout and runs the configured checks. Failed checks prevent publication. A passing run can open a draft pull request, with the run record available to the reviewer.'
      ] },
      { id: 'decisions', title: 'Handling incomplete or changed work', paragraphs: [
        'I didn’t want an agent guessing its way through an incomplete ticket. It can ask for clarification on Jira instead. Before writing back, Nightshift checks whether the ticket or branch has changed during the run; an engineer’s edit can change what needs doing.',
        'Version updates use deterministic edits where the change is mechanical. Each workflow has its own access and budget, so adding a capability does not automatically give it the permissions of every other workflow.'
      ] },
    ], next: 'clarity',
  },
  clarity: {
    id: 'clarity', category: 'Applied AI', title: 'Clarity',
    headline: 'Customer data, queried in plain English.',
    intro: 'Clarity lets customers ask questions about their data and download CSV reports. I built on a colleague’s Java prototype, developed the query, reporting and access controls, and took the service into production.',
    role: 'Developed the service and took it to production', context: 'Loweconex', status: 'Production',
    stack: ['Java', 'Spring Boot', 'Spring AI', 'PostgreSQL', 'Kubernetes'],
    takeaway: 'Customers can ask for a report in plain English and inspect the SQL used to produce it.',
    sections: [
      { id: 'problem', title: 'Getting an answer from the database', paragraphs: [
        'Our customers operate sites such as supermarkets and warehouses, with sensors and HVAC equipment reporting into their databases. Getting a report meant knowing the schema or raising a ticket with someone who did.',
        'Clarity identifies the relevant tables, runs a query and returns the answer with its SQL. Users can inspect that query or download the results as a CSV.'
      ] },
      { id: 'approach', title: 'Schema context and query controls', paragraphs: [
        'A nightly job compiles a document describing each customer’s tables and relationships. The model uses that document as its starting point and can fall back to live schema discovery. This did not require a vector database.',
        'Generated SQL is lexed and validated before execution. Comments can disguise a table reference such as FROM/**/pg_tables, so a simple text match is insufficient. Queries run with a read-only role, row limits and timeouts. If the read-only connection is unavailable, the request fails.',
        'CSV reports stream to storage rather than being assembled in memory, allowing the service to handle larger exports.'
      ] },
      { id: 'decisions', title: 'Checking the response against the query', paragraphs: [
        '“Which sites are running hottest?” should have been a straightforward question. Clarity said no data was available, even though the database contained it. The request looked successful in the logs. The customer would still have received the wrong answer.',
        'I added checks that compare the final response with the tool results: whether the query succeeded, whether named items appear in the returned data, and whether a claimed action actually happened. The application also limits tool calls and request rates.'
      ] },
      { id: 'result', title: 'In production', paragraphs: [
        'Customers can now ask questions and export reports without writing SQL or waiting for a reporting ticket. The production service includes tracing and usage records by customer and feature, with checks in the dev and QA delivery path.'
      ] },
    ], next: 'heimdall',
  },
  heimdall: {
    id: 'heimdall', category: 'Developer tooling', title: 'Heimdall',
    headline: 'See where a change has reached.',
    intro: 'I built Heimdall so engineers could check whether their change had reached dev, QA, preprod or production. It connects Jira tickets, Bitbucket pull requests, ArgoCD deployments and test results across 25 services.',
    role: 'Designed, built and run the service', context: 'Loweconex', status: 'Production',
    stack: ['Python', 'Flask', 'TimescaleDB', 'ArgoCD', 'Prometheus', 'Thanos'],
    takeaway: 'Engineers and release managers use the same view of tickets, deployments, running revisions and tests.',
    sections: [
      { id: 'problem', title: 'Checking a release across several tools', paragraphs: [
        'To check whether a change had reached QA, an engineer needed the ticket in Jira, the pull request in Bitbucket, the intended revision in GitOps and the running revision from the cluster. We often ended up pasting kubectl output into Teams to compare what we were seeing.',
        'My first attempt was a Python service that exported DORA metrics to Prometheus. It produced the metrics, but the team did not use it. They needed to find a particular change, so I rebuilt the interface around that task.'
      ] },
      { id: 'approach', title: 'Following a ticket through the environments', paragraphs: [
        'The collector pulls from the upstream sources every ten minutes and keeps the history in TimescaleDB. The UI reads a shared snapshot, so opening the dashboard doesn’t send a fresh round of requests to Jira, Bitbucket and ArgoCD.',
        'You can follow a ticket to its pull request and check each stage of the release: merge, image update, running pods and test results. The dashboard also highlights stale work, blocked releases and differences between intended and running revisions.'
      ] },
      { id: 'decisions', title: 'Checking which revision is running', paragraphs: [
        'An ArgoCD application can appear healthy while old pods keep serving and the new revision is crashlooping. Heimdall also reads pod state through Prometheus and Thanos, so it can check whether the new revision is actually up.',
        'Unavailable signals are shown as missing. The dashboard does not count missing pod or test evidence as a successful deployment.'
      ] },
      { id: 'result', title: 'How the team uses it', paragraphs: [
        'Standup now runs from Heimdall and takes less time. Engineers can check a deployment there instead of asking someone to confirm it in Teams.',
        'Release managers use the same dashboard, so release discussions start from the same ticket, revision and test results. I continue to run the service.'
      ] },
    ], next: 'pipeline-platform',
  },
  'pipeline-platform': {
    id: 'pipeline-platform', category: 'Software delivery', title: 'Delivery platform',
    headline: 'A shared path from commit to deployment.',
    intro: 'I built the foundations of our shared Java and Node delivery pipelines and continued to own the platform as other engineers contributed. It now serves 25 services across four environments, handling roughly 400 deployments a month.',
    role: 'Built the shared pipelines and own the integrations', context: 'Loweconex', status: 'Production',
    stack: ['Bitbucket Pipelines', 'ArgoCD', 'Kubernetes', 'Bash', 'Java', 'Node.js'],
    takeaway: 'All 25 services use versioned shared pipelines, with post-deploy tests controlling promotion from dev to QA.',
    sections: [
      { id: 'problem', title: 'Maintaining a pipeline in every repository', paragraphs: [
        'Each service had its own bitbucket-pipelines.yml, with hundreds of lines of copied shell and YAML. The copies drifted apart, and a shared improvement needed a separate pull request in every repository.'
      ] },
      { id: 'approach', title: 'Versioned Java and Node libraries', paragraphs: [
        'I moved the common logic into java-shared-pipeline and node-shared-pipeline. Each service pins a library version and keeps its own settings in .ci/builds.yaml. The shared pipeline builds, tests, scans and publishes the image. It also writes a build.json containing the commit, image digest and tags used by Heimdall and the test dashboard.',
        'Veracode, SourceClear and Jira fix-version gates can be enabled per service. For dev deployments, Image Updater records the new image in GitOps and ArgoCD rolls it out. A Git revert restores the previous desired image.'
      ] },
      { id: 'decisions', title: 'Test what was deployed', paragraphs: [
        'Some of our “flaky” tests were simply too early: the pod had started, but it wasn’t ready to serve requests. I integrated our test framework as an ArgoCD PostSync hook in dev and QA, with results in an internal dashboard called Sentry.',
        'Promotion from dev to QA checks that the tested image is still running. Missing results, all-skipped suites and ambiguous failures stop promotion. Preprod and production remain human decisions.'
      ] },
      { id: 'result', title: 'Where it is now', paragraphs: [
        'All 25 services build through the shared libraries. Pipeline fixes are released as a library version that services can adopt, reducing the amount of duplicated configuration to maintain.',
        'Other engineers have added to the platform as the team has grown. It now also turns security findings into deduplicated Jira tickets and runs advisory automated code review alongside the build.'
      ] },
    ], next: 'observability',
  },
  observability: {
    id: 'observability', category: 'Platform operations', title: 'Observability',
    headline: 'Metrics, logs and traces across four environments.',
    intro: 'I built and run our Kubernetes monitoring stack so engineers can investigate failures across services. It connects metrics, logs and traces, with 72 alerts linked to runbooks.',
    role: 'Built and operate the monitoring platform', context: 'Loweconex', status: 'Production',
    stack: ['Kubernetes', 'Prometheus', 'Thanos', 'Loki', 'Tempo', 'Grafana'],
    takeaway: 'Engineers can follow a request from a metric to its trace and logs, and open a runbook from an alert.',
    sections: [
      { id: 'problem', title: 'A shared view of service failures', paragraphs: [
        'Services ran across four environments, but we had no shared way to investigate what they were doing. Too often, a problem was reported from outside the engineering team before we saw it ourselves.',
        'I deployed Prometheus and Thanos for metrics, Loki for logs, Tempo for traces and Grafana to explore them. We used existing cluster capacity and kept the configuration in Git. Self-hosting kept costs down, with the operational work staying with us.'
      ] },
      { id: 'approach', title: 'Connecting metrics, traces and logs', paragraphs: [
        'A metric exemplar opens the matching trace, and the trace links to the relevant service logs. Log lines include a trace ID to navigate back to the request. I wrote the shared structured logging configuration and OpenTelemetry conventions for our Java services to make those links work.',
        'Each environment has its own stack, and a federated query layer joins them across AWS accounts. Older data moves to object storage, with retention set per signal.'
      ] },
      { id: 'decisions', title: 'Alert thresholds, routing and runbooks', paragraphs: [
        'I checked the alert rules against the available metrics and linked 72 alerts to runbooks. Thresholds for the monitoring pipeline came from its recorded history.',
        'Production alerts page on-call at any hour. QA alerts go to Teams, and dev notifications wait for business hours. Inhibition rules suppress related alerts when a broader failure already explains them.'
      ] },
      { id: 'result', title: 'Using and maintaining the stack', paragraphs: [
        'Incident discussions now usually start with a Grafana link. Engineers can follow requests across services and use the linked runbooks to investigate alerts.',
        'I also maintain retention policies, upgrades and capacity, and investigate failures in the monitoring system itself.'
      ] },
    ], next: 'ai-gateway',
  },
  'ai-gateway': {
    id: 'ai-gateway', category: 'AI infrastructure', title: 'AI gateway',
    headline: 'Shared model access with usage tracked per consumer.',
    intro: 'I took a colleague’s LiteLLM setup in dev and made it a shared gateway for our AI features and engineering tools. I deployed it on a dedicated platform cluster, migrated the consumers and added scoped access and usage tracking.',
    role: 'Deployed the gateway and integrated its consumers', context: 'Loweconex', status: 'Production',
    stack: ['LiteLLM', 'Kubernetes', 'AWS', 'Grafana', 'ArgoCD'],
    takeaway: 'Clarity, Nightshift and automated PR review share model access, with separate identities and usage records.',
    sections: [
      { id: 'problem', title: 'Managing access across several AI features', paragraphs: [
        'Our early AI features kept provider keys in their own configuration. As more services and tools needed models, we needed a common way to manage access, select models and attribute usage.'
      ] },
      { id: 'approach', title: 'Keys, model aliases and usage records', paragraphs: [
        'Each workload calls the shared endpoint with a scoped virtual key and a model alias. The gateway holds the model catalogue. Clarity tags usage by customer, environment and feature; Nightshift adds its workflow and run ID.',
        'LiteLLM provides the proxy. My work covered deployment, consumer migration, access configuration and the records needed to trace a model call back to its source.'
      ] },
      { id: 'decisions', title: 'Access and budget limits', paragraphs: [
        'A key can only use its permitted models. A request for an unapproved model returns an error, even if that model is deployed at the gateway.',
        'The gateway enforces budgets and rate limits alongside each application’s own controls. Concurrent requests and delayed usage records can overshoot a budget threshold, so application limits remain necessary.'
      ] },
      { id: 'result', title: 'The services using it', paragraphs: [
        'Clarity, Nightshift and automated pull-request review use the gateway. I also integrated the reviewer into the shared delivery pipeline. Its feedback is advisory; an unavailable reviewer does not block a build.',
        'Our spend dashboard once made the gateway look more expensive than it was. The token counts were fine; the price variables referred to a different model. That is one of the less glamorous parts of running the gateway: checking that the cost figures match what we are actually calling.'
      ] },
    ], next: 'nightshift',
  },
  'smart-home': {
    id: 'smart-home', category: 'Personal project', title: 'The homelab',
    headline: 'Home Assistant on a Raspberry Pi Kubernetes cluster.',
    intro: 'I run Home Assistant on K3s to control the lights, plugs and sensors in my flat. It also gives me a small cluster for trying ideas outside work, with deployments managed through Git.',
    role: 'Built and maintain the homelab', context: 'Home', status: 'Running at home',
    stack: ['K3s', 'Home Assistant', 'Zigbee', 'MQTT', 'ArgoCD', 'Prometheus', 'Grafana', 'Tailscale'],
    takeaway: 'Local device control keeps working when the internet is unavailable.',
    sections: [
      { id: 'problem', title: 'Keeping device control local', paragraphs: [
        'I wanted the lights and sensors to work without relying on an internet connection. Home Assistant handles the automations, Zigbee connects the devices locally and MQTT carries messages.',
        'There are more than twenty devices, including Hue bulbs, Innr plugs, motion and contact sensors, and a solar-powered camera. The kitchen heater and hallway lamp are part of it too: ordinary things I use every day, running on the little cluster.'
      ] },
      { id: 'approach', title: 'The hardware and cluster', paragraphs: [
        'The cluster runs on a Raspberry Pi 5 with a 1TB NVMe drive and a UPS. ArgoCD reconciles deployments from Git, and Prometheus and Grafana provide monitoring.',
        'Tailscale provides remote access without opening inbound ports to the internet. The IoT devices have their own VLAN.'
      ] },
      { id: 'decisions', title: 'Trying a local language model', paragraphs: [
        'I’m experimenting with a local language model for issuing commands. It is an additional interface; the existing controls and automations work independently of it.'
      ] },
      { id: 'next', title: 'What’s next', paragraphs: [
        'I want to add smart radiator valves and improve presence detection. A motion sensor can tell me someone passed through the hallway, but detecting whether anyone is still home needs more information.'
      ] },
    ], next: 'ml-scheduler',
  },
  'ml-scheduler': {
    id: 'ml-scheduler', category: 'MSc research', title: 'Kubernetes recovery',
    headline: 'Recovering workloads when the remaining nodes are full.',
    intro: 'For my MSc at Queen’s University Belfast, I studied which workloads Kubernetes should recover after a node failure when there is too little capacity for everything. My dissertation, “Evict the Guilty, Not the Innocent”, was supervised by Prof. Javid Taheri. I completed the MSc with Distinction.',
    role: 'Designed, implemented and evaluated the scheduler', context: 'Queen’s University Belfast', status: 'Completed · Distinction',
    stack: ['Python', 'Kubernetes', 'Amazon EKS', 'Terraform', 'Optimisation'],
    takeaway: 'The main comparison recovered 84.9% of importance-weighted work, versus 79.1% for the stock scheduler, without evicting healthy pods.',
    sections: [
      { id: 'problem', title: 'Choosing what to recover', paragraphs: [
        'After a node failure, the surviving nodes may not have room for every displaced workload. Recovering in priority order can leave a less valuable set running than choosing the combination that best uses the available capacity.',
        'I built a scheduler that treats this as a knapsack problem: choose the set of workloads with the highest total importance that fits. I also built a model using kubelet signals to estimate whether a workload is serving, so the scheduler can consider more than its assigned importance label.'
      ] },
      { id: 'approach', title: 'Testing on Amazon EKS', paragraphs: [
        'I deliberately failed nodes on Amazon EKS and compared the scheduler with the stock scheduler and PriorityClass preemption. Workloads came from the Alibaba 2018 cluster trace, with nine importance grades. I committed the analysis plan before collecting the confirmatory data and recorded 199 runs.',
        'The results describe controlled research workloads on a small cluster. They do not establish performance on a production workload.'
      ] },
      { id: 'result', title: 'The results', paragraphs: [
        'In the main comparison, the knapsack scheduler kept 84.9% of importance-weighted work running, compared with 79.1% for the stock scheduler. It did so without evicting healthy pods. PriorityClass recovered more work, but evicted healthy workloads to make room.',
        'A separate experiment included services labelled important that were not serving. Using measured behaviour to guide the choice improved the result by 12.9 percentage points; my written prediction was 12.7. The five recorded pairs below are from that experiment. Some follow-up comparisons are descriptive rather than confirmatory.'
      ] },
    ], next: 'heimdall',
  },
};
