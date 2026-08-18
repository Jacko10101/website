"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * ONCALL — the easter egg. Not snake: an incident-response simulator.
 *
 * A shift is five pages, drawn from a deck without replacement, so nothing
 * repeats until the deck is exhausted. Difficulty ramps across the shift:
 * the first page is a gimme, the last one has a red herring in it. Investigate
 * before you act, keep the error budget alive, and you get a handover report
 * with a real MTTR per incident at the end.
 *
 * Every failure in here is one that actually happens.
 */

type Difficulty = "easy" | "medium" | "hard";

interface Clue {
  cmd: string;
  output: string[];
}

interface Fix {
  label: string;
  correct: boolean;
  reaction: string;
}

interface Scenario {
  id: string;
  difficulty: Difficulty;
  service: string;
  alert: string;
  clues: Clue[];
  fixes: Fix[];
  resolution: string;
  /** The bit worth taking away. Shown once the incident is closed. */
  lesson: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "oom",
    difficulty: "easy",
    service: "payments-api",
    alert: "PodCrashLooping — payments-api restarting every ~90s",
    clues: [
      {
        cmd: "kubectl logs payments-api-7d4f --previous | tail",
        output: [
          "java.lang.OutOfMemoryError: Java heap space",
          "  at com.acme.payments.BatchProcessor.load(...)",
        ],
      },
      {
        cmd: "kubectl describe pod payments-api-7d4f",
        output: ["Last State:  Terminated", "  Reason:    OOMKilled", "  Limits:    memory: 512Mi"],
      },
      {
        cmd: "kubectl top pod payments-api-7d4f",
        output: ["NAME                MEMORY", "payments-api-7d4f   511Mi / 512Mi"],
      },
    ],
    fixes: [
      { label: "Raise the memory limit and roll out", correct: true, reaction: "" },
      {
        label: "Roll back the last deploy",
        correct: false,
        reaction: "Rolled back. Still OOMKilled, and the last deploy was three days ago. Not the deploy.",
      },
      {
        label: "Delete the pod",
        correct: false,
        reaction: "New pod, same limit, same heap. Back in CrashLoopBackOff within two minutes.",
      },
      {
        label: "Silence the alert",
        correct: false,
        reaction: "The alert is quiet. Payments are still down. Bold strategy.",
      },
    ],
    resolution: "Limit raised to 1Gi, rollout complete. The batch job fits in heap. Runbook updated.",
    lesson: "OOMKilled is the kubelet, not the JVM. The exit reason tells you which one gave up first.",
  },
  {
    id: "baddeploy",
    difficulty: "easy",
    service: "checkout-api",
    alert: "HighErrorRate — 500s at 34% on checkout-api",
    clues: [
      {
        cmd: "kubectl logs checkout-api-59b1 | tail",
        output: [
          "NullPointerException: discountCode is null",
          "  at CheckoutController.applyDiscount(...)",
        ],
      },
      {
        cmd: "argocd app history checkout-api",
        output: [
          "ID  DATE              REVISION",
          "41  4 minutes ago     v2.14.0  ← current",
          "40  2 days ago        v2.13.2",
        ],
      },
      {
        cmd: "promql: rate(http_500s[5m])",
        output: ["flat … flat … flat … ▲ spike begins 4 minutes ago"],
      },
    ],
    fixes: [
      { label: "Roll back to the previous revision", correct: true, reaction: "" },
      {
        label: "Scale the deployment up",
        correct: false,
        reaction: "More replicas, more NullPointerExceptions per second. Throughput of failure: improved.",
      },
      {
        label: "Restart the pods",
        correct: false,
        reaction: "Fresh pods, same v2.14.0, same bug. The error rate doesn't blink.",
      },
      {
        label: "Raise the memory limit",
        correct: false,
        reaction: "Memory was never the problem. The 500s continue, now with more headroom.",
      },
    ],
    resolution: "Rolled back to v2.13.2. Error rate flat within a minute. The fix goes through review this time.",
    lesson: "When the spike starts at a deploy boundary, stop reading logs and start reading the deploy history.",
  },
  {
    id: "imagepull",
    difficulty: "easy",
    service: "notifications-worker",
    alert: "PodNotReady — notifications-worker stuck 0/1 for 12m",
    clues: [
      {
        cmd: "kubectl get pods -l app=notifications-worker",
        output: ["NAME                       READY   STATUS             AGE", "notifications-worker-0     0/1     ImagePullBackOff   12m"],
      },
      {
        cmd: "kubectl describe pod notifications-worker-0",
        output: [
          "Failed to pull image \"registry.internal/notifications:1.9.2\":",
          "  401 Unauthorized",
        ],
      },
      {
        cmd: "kubectl get secret regcred -o jsonpath='{.metadata.annotations}'",
        output: ["rotated-at: 41 minutes ago", "note: registry token rotated by the nightly job"],
      },
    ],
    fixes: [
      { label: "Refresh the pull secret and delete the pod", correct: true, reaction: "" },
      {
        label: "Roll back to the previous image tag",
        correct: false,
        reaction: "The old tag lives in the same registry behind the same dead credential. Still 401.",
      },
      {
        label: "Scale the deployment up",
        correct: false,
        reaction: "Now three pods are failing to pull instead of one. Kubernetes is nothing if not obedient.",
      },
      {
        label: "Cordon the node",
        correct: false,
        reaction: "It reschedules elsewhere and fails to pull there too. The node was never involved.",
      },
    ],
    resolution: "Pull secret refreshed, pod pulled 1.9.2 on the next attempt. The rotation job now patches the secret it invalidates.",
    lesson: "ImagePullBackOff is an auth problem far more often than it is a missing tag.",
  },
  {
    id: "diskfull",
    difficulty: "easy",
    service: "prometheus",
    alert: "PodCrashLooping — prometheus-0 down, dashboards dark",
    clues: [
      {
        cmd: "kubectl logs prometheus-0 | tail",
        output: ['opening storage failed: "no space left on device"'],
      },
      {
        cmd: "kubectl exec prometheus-0 -- df -h /data",
        output: ["Filesystem  Size  Used  Avail  Use%", "/data       100G  100G     0  100%"],
      },
      {
        cmd: "kubectl get events -n monitoring | tail",
        output: ["Warning  FailedWrite  prometheus-0  write /data/wal: ENOSPC"],
      },
    ],
    fixes: [
      { label: "Expand the PVC and restart", correct: true, reaction: "" },
      {
        label: "Delete the pod",
        correct: false,
        reaction: "It reschedules onto the same full volume. Kubernetes is consistent like that.",
      },
      {
        label: "Roll back Prometheus",
        correct: false,
        reaction: "The old version meets the same full disk. Storage doesn't care about your tags.",
      },
      {
        label: "Silence the alert",
        correct: false,
        reaction: "You've blinded the thing that watches everything else. The next incident arrives unobserved.",
      },
    ],
    resolution: "PVC expanded to 200Gi, WAL replayed, dashboards back. Retention gets a review tomorrow.",
    lesson: "Monitoring is a production system. When it dies you lose the incident and the ability to see it.",
  },
  {
    id: "cert",
    difficulty: "medium",
    service: "ingress",
    alert: "TLSHandshakeErrors — clients failing at the edge",
    clues: [
      {
        cmd: "curl -vI https://api.acme.dev 2>&1 | grep -i cert",
        output: ["* SSL: certificate has expired"],
      },
      {
        cmd: "kubectl describe certificate api-tls",
        output: ["Status:  False", "Reason:  Failed", "Message: renewal failed 3 times"],
      },
      {
        cmd: "kubectl logs cert-manager | tail",
        output: ["ACME error: rateLimited · too many certificates issued"],
      },
    ],
    fixes: [
      { label: "Issue from the backup ACME account and rotate", correct: true, reaction: "" },
      {
        label: "Restart the ingress controller",
        correct: false,
        reaction: "It reloads the same expired cert with great efficiency.",
      },
      {
        label: "Scale the ingress up",
        correct: false,
        reaction: "Now four replicas are refusing handshakes instead of two.",
      },
      {
        label: "Delete the certificate resource",
        correct: false,
        reaction: "cert-manager recreates it and hits the same rate limit. The clock keeps ticking.",
      },
    ],
    resolution: "Cert rotated from the secondary account. Handshakes green. Renewal alerting moved to 21 days out.",
    lesson: "Certificate expiry is the only outage you can put in the calendar a year early and still miss.",
  },
  {
    id: "node",
    difficulty: "medium",
    service: "cluster",
    alert: "KubeNodeNotReady — node-4 gone, workloads pending",
    clues: [
      {
        cmd: "kubectl get nodes",
        output: ["node-3   Ready      44d", "node-4   NotReady   44d"],
      },
      {
        cmd: "kubectl describe node node-4",
        output: ["Conditions: KubeletNotReady", "  PLEG is not healthy: pleg was last seen active 12m ago"],
      },
      {
        cmd: "kubectl get pods -o wide | grep node-4",
        output: ["payments-worker-2   Terminating   node-4", "batch-runner-0      Unknown       node-4"],
      },
    ],
    fixes: [
      { label: "Cordon, drain, and recycle the node", correct: true, reaction: "" },
      {
        label: "Restart the stuck pods",
        correct: false,
        reaction: "The kubelet isn't listening. Your deletes queue politely behind a dead process.",
      },
      {
        label: "Scale the deployments up",
        correct: false,
        reaction: "New pods schedule onto healthy nodes, but node-4's zombies still hold their PVCs.",
      },
      {
        label: "Wait and see",
        correct: false,
        reaction: "Ten more minutes of NotReady. The pending queue grows. The pager does not self-resolve.",
      },
    ],
    resolution: "Node cordoned, drained, recycled by the ASG. Workloads rescheduled. The PLEG saga went in the runbook.",
    lesson: "A pod stuck Terminating on a dead kubelet needs the node dealt with, not the pod.",
  },
  {
    id: "dns",
    difficulty: "medium",
    service: "orders-api",
    alert: "HighLatency — intermittent 5s timeouts on orders-api",
    clues: [
      {
        cmd: "kubectl logs orders-api-2c9d | grep -i error | tail",
        output: ["getaddrinfo EAI_AGAIN inventory-svc.internal", "upstream timeout after 5000ms"],
      },
      {
        cmd: "kubectl logs -n kube-system coredns | tail",
        output: ["[WARNING] overloaded, dropping queries", "throttling: CPU limit reached"],
      },
      {
        cmd: "kubectl top pod -n kube-system | grep coredns",
        output: ["coredns-1   199m / 200m CPU", "coredns-2   200m / 200m CPU"],
      },
    ],
    fixes: [
      { label: "Scale CoreDNS and raise its CPU limit", correct: true, reaction: "" },
      {
        label: "Roll back orders-api",
        correct: false,
        reaction: "The old version resolves DNS through the same drowning CoreDNS. Timeouts continue.",
      },
      {
        label: "Restart orders-api pods",
        correct: false,
        reaction: "Fresh pods issue fresh DNS queries into the same bottleneck. If anything, worse.",
      },
      {
        label: "Silence the alert",
        correct: false,
        reaction: "The timeouts are still there. Now they're a surprise for the morning shift.",
      },
    ],
    resolution: "CoreDNS scaled to 4 with headroom. Lookups instant, latency flat. NodeLocal DNSCache goes on the backlog.",
    lesson: "Latency that hits every service at once is rarely in any of them. Check the shared dependencies.",
  },
  {
    id: "connpool",
    difficulty: "medium",
    service: "reporting-api",
    alert: "HighErrorRate — reporting-api 503s, climbing since 04:40",
    clues: [
      {
        cmd: "kubectl logs reporting-api-8f2c | tail",
        output: [
          "HikariPool-1 - Connection is not available, request timed out after 30000ms",
          "  at ReportService.buildMonthly(...)",
        ],
      },
      {
        cmd: "psql -c 'select state, count(*) from pg_stat_activity group by 1'",
        output: ["state                 count", "idle in transaction     97", "active                   3"],
      },
      {
        cmd: "kubectl top pod reporting-api-8f2c",
        output: ["NAME                 CPU     MEMORY", "reporting-api-8f2c   40m     310Mi / 1Gi"],
      },
    ],
    fixes: [
      { label: "Restart the pods, then ship the missing transaction close", correct: true, reaction: "" },
      {
        label: "Raise the connection pool size",
        correct: false,
        reaction: "The leak fills a bigger pool slightly more slowly. You've bought fifteen minutes.",
      },
      {
        label: "Scale the deployment up",
        correct: false,
        reaction: "Every new replica opens its own pool and leaks it too. Postgres hits max_connections.",
      },
      {
        label: "Restart Postgres",
        correct: false,
        reaction: "Every service on the estate loses its connections to fix one that leaks. Escalating, correctly, to you.",
      },
    ],
    resolution: "Pods restarted to free the connections, leaked transaction closed in a hotfix. Pool saturation now alerts at 80%.",
    lesson: "'Idle in transaction' is a code bug wearing a database costume.",
  },
  {
    id: "secret",
    difficulty: "medium",
    service: "billing-sync",
    alert: "HighErrorRate — billing-sync 401s against the payment provider",
    clues: [
      {
        cmd: "kubectl logs billing-sync-4a1e | tail",
        output: ["provider responded 401 Unauthorized", "retrying in 30s (attempt 112)"],
      },
      {
        cmd: "kubectl get secret provider-api-key -o yaml | grep creationTimestamp",
        output: ["creationTimestamp: 2h ago  # rotated by the scheduled job"],
      },
      {
        cmd: "kubectl describe pod billing-sync-4a1e | grep Started",
        output: ["Started:  19 days ago"],
      },
    ],
    fixes: [
      { label: "Restart the deployment so it picks up the rotated secret", correct: true, reaction: "" },
      {
        label: "Roll the secret back to the old key",
        correct: false,
        reaction: "The provider revoked that one at rotation. Now nothing has a valid key.",
      },
      {
        label: "Roll back billing-sync",
        correct: false,
        reaction: "An older image holding the same stale key in memory. The 401s carry on.",
      },
      {
        label: "Raise the retry limit",
        correct: false,
        reaction: "More attempts at the same rejection. The provider starts rate-limiting you as well.",
      },
    ],
    resolution: "Deployment restarted, new key loaded, sync caught up in four minutes. Rotation now triggers a rollout.",
    lesson: "A secret mounted as an env var is read once at start-up. Rotating it changes nothing until something restarts.",
  },
  {
    id: "hpa",
    difficulty: "medium",
    service: "search-api",
    alert: "PodChurn — search-api scaled 4→22→4 twice in ten minutes",
    clues: [
      {
        cmd: "kubectl describe hpa search-api",
        output: [
          "Metrics: resource cpu on pods (as a percentage of request)",
          "  current: <unknown> / 70%",
          "Events: FailedGetResourceMetric — missing request for cpu",
        ],
      },
      {
        cmd: "kubectl get deploy search-api -o jsonpath='{..resources}'",
        output: ["{\"limits\":{\"cpu\":\"2\"}}   # no requests set"],
      },
      {
        cmd: "promql: rate(http_requests[5m])",
        output: ["steady ~1.2k rps all morning, no traffic spike"],
      },
    ],
    fixes: [
      { label: "Set CPU requests and let the HPA stabilise", correct: true, reaction: "" },
      {
        label: "Raise the HPA max replicas",
        correct: false,
        reaction: "It now thrashes between 4 and 40. The scheduler is having a worse morning than you.",
      },
      {
        label: "Delete the HPA",
        correct: false,
        reaction: "The churn stops and so does any ability to handle this evening's peak. Deferred, not fixed.",
      },
      {
        label: "Roll back search-api",
        correct: false,
        reaction: "The manifest without requests was rolled back to a manifest without requests.",
      },
    ],
    resolution: "CPU requests set to a measured baseline, HPA settled at 6 replicas. Autoscaling behaves.",
    lesson: "The HPA scales on a percentage of requests. With no request set, there's no denominator and no sanity.",
  },
  {
    id: "kafka",
    difficulty: "hard",
    service: "telemetry-consumer",
    alert: "ConsumerLag — telemetry-consumer 4.2M messages behind and growing",
    clues: [
      {
        cmd: "kubectl logs telemetry-consumer-1 | tail",
        output: [
          "SerializationException: unknown magic byte, partition 7 offset 88214113",
          "rebalancing… joined group (attempt 340)",
        ],
      },
      {
        cmd: "kafka-consumer-groups --describe --group telemetry",
        output: [
          "PARTITION  LAG        CONSUMER",
          "7          4,190,220  consumer-1  ← stuck",
          "0-6        ~0         healthy",
        ],
      },
      {
        cmd: "kubectl top pod telemetry-consumer-1",
        output: ["CPU 90m / 1000m   MEMORY 240Mi / 1Gi", "# plenty of headroom, it isn't resource-starved"],
      },
    ],
    fixes: [
      { label: "Route the poison message to the DLQ and resume", correct: true, reaction: "" },
      {
        label: "Scale the consumer group up",
        correct: false,
        reaction: "More consumers, another rebalance, and whoever takes partition 7 gets stuck on the same offset.",
      },
      {
        label: "Restart the consumers",
        correct: false,
        reaction: "It rejoins, seeks to the same offset, and fails on the same byte. The lag keeps climbing.",
      },
      {
        label: "Reset the offset to latest",
        correct: false,
        reaction: "The lag graph looks wonderful. You have just silently dropped four million telemetry records.",
      },
    ],
    resolution: "Poison record diverted to the DLQ, consumer resumed, lag drained in 20 minutes. Schema now validated at the producer.",
    lesson: "One bad message can stop a partition forever. A dead-letter path is a requirement, not a nicety.",
  },
  {
    id: "gateway",
    difficulty: "hard",
    service: "ai-gateway",
    alert: "HighErrorRate — 429s across every AI feature, all tenants",
    clues: [
      {
        cmd: "kubectl logs ai-gateway-6b8d | grep 429 | tail",
        output: [
          "upstream 429: quota exceeded for model gemini-1.5-pro",
          "virtual_key=tenant-14 feature=bulk-summariser",
        ],
      },
      {
        cmd: "promql: sum by (virtual_key) (rate(gateway_tokens[5m]))",
        output: [
          "tenant-14   1.9M tok/min  ← 96% of estate spend",
          "all others  ~80k tok/min combined",
        ],
      },
      {
        cmd: "kubectl get deploy ai-gateway -o wide",
        output: ["READY 3/3   IMAGE sha-9f31c2 (deployed 6 days ago)", "# unchanged since last week"],
      },
    ],
    fixes: [
      { label: "Throttle tenant-14's virtual key, then investigate the loop", correct: true, reaction: "" },
      {
        label: "Scale the gateway up",
        correct: false,
        reaction: "Replicas were never the constraint. The provider quota is, and you're still burning it.",
      },
      {
        label: "Raise the provider quota",
        correct: false,
        reaction: "A runaway loop now has a larger budget to run away with. Finance will ask about this.",
      },
      {
        label: "Roll back the gateway",
        correct: false,
        reaction: "Six days without a deploy. Whatever changed, it wasn't the gateway.",
      },
    ],
    resolution: "tenant-14's key throttled, the estate recovered in seconds. The bulk summariser had no loop guard; it has one now.",
    lesson: "Per-tenant attribution turns 'the AI is down' into one key and one feature in about thirty seconds.",
  },
  {
    id: "retrystorm",
    difficulty: "hard",
    service: "inventory-svc",
    alert: "HighLatency — p99 across six services, spreading",
    clues: [
      {
        cmd: "kubectl logs inventory-svc-3f7a | tail",
        output: ["upstream warehouse-svc timeout (2s)", "retry 1/5 … retry 2/5 … retry 3/5"],
      },
      {
        cmd: "promql: sum(rate(warehouse_requests[1m]))",
        output: ["baseline 900 rps → now 6,400 rps", "# inbound traffic from the internet is flat"],
      },
      {
        cmd: "kubectl logs warehouse-svc-9c2b | tail",
        output: ["GC pause 4.1s", "thread pool saturated, queue depth 2,400"],
      },
    ],
    fixes: [
      { label: "Shed load: open the circuit breaker to warehouse-svc", correct: true, reaction: "" },
      {
        label: "Scale warehouse-svc up",
        correct: false,
        reaction: "New replicas take a share of a 6,400 rps retry storm and saturate on arrival.",
      },
      {
        label: "Raise the timeout to 10s",
        correct: false,
        reaction: "Callers now hold threads for ten seconds each. The saturation spreads a layer outwards.",
      },
      {
        label: "Restart warehouse-svc",
        correct: false,
        reaction: "It comes up cold into the full retry storm and falls over before it finishes warming.",
      },
    ],
    resolution: "Breaker opened, retries stopped amplifying, warehouse-svc drained its queue and recovered. Retries now have jitter and a budget.",
    lesson: "Retries turn one slow service into an outage. The fix is less traffic, not more capacity.",
  },
  {
    id: "drift",
    difficulty: "hard",
    service: "orders-api",
    alert: "FlappingDeployment — orders-api replica count oscillating",
    clues: [
      {
        cmd: "argocd app get orders-api",
        output: [
          "Sync Status:  OutOfSync (self-heal enabled)",
          "  replicas: live 12, desired 4",
          "Last sync: 40 seconds ago (auto)",
        ],
      },
      {
        cmd: "kubectl get events | grep orders-api | tail",
        output: [
          "ScalingReplicaSet  4 → 12   (kubectl, user: contractor)",
          "ScalingReplicaSet  12 → 4   (argocd-application-controller)",
          "…repeating every ~90s",
        ],
      },
      {
        cmd: "kubectl logs orders-api-1 | tail",
        output: ["INFO started in 3.2s", "# the application itself is entirely fine"],
      },
    ],
    fixes: [
      {
        label: "Raise the replica count in git and let ArgoCD sync it",
        correct: true,
        reaction: "",
      },
      {
        label: "Disable ArgoCD self-heal",
        correct: false,
        reaction: "The manual scale sticks and git is now a lie. The next sync, whenever it comes, undoes it anyway.",
      },
      {
        label: "kubectl scale it to 12 again",
        correct: false,
        reaction: "You've joined the fight rather than ended it. ArgoCD has more patience than you do.",
      },
      {
        label: "Restart the ArgoCD controller",
        correct: false,
        reaction: "It comes back, reads git, and reconciles to 4 exactly as designed.",
      },
    ],
    resolution: "Replica count raised in git, synced once, flapping stopped. The scaling decision now has a reviewer and a diff.",
    lesson: "Fighting your own reconciler always loses. Change the desired state, not the live state.",
  },
];

const SHIFT_LENGTH = 5;
/** Which difficulty each page of the shift draws from. */
const RAMP: Difficulty[] = ["easy", "easy", "medium", "medium", "hard"];

type Phase = "briefing" | "active" | "resolved" | "handover" | "gameover";

interface LogEntry {
  kind: "alert" | "cmd" | "output" | "bad" | "good" | "note";
  text: string;
}

interface IncidentRecord {
  service: string;
  alert: string;
  mttrMs: number;
  wrongMoves: number;
  cluesRead: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatDuration(ms: number): string {
  const total = Math.max(1, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m > 0 ? `${m}m ${String(s).padStart(2, "0")}s` : `${s}s`;
}

/** Pager clocks always read badly. Start at 03:12 and count the shift forward. */
function pagerClock(round: number): string {
  const start = 3 * 60 + 12;
  const t = (start + round * 37) % (24 * 60);
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

function grade(budget: number, wrongMoves: number): { mark: string; note: string } {
  if (wrongMoves === 0 && budget >= 80)
    return { mark: "A", note: "Five incidents, no wrong moves, budget barely dented. Suspiciously good." };
  if (wrongMoves <= 1 && budget >= 60)
    return { mark: "B", note: "Read the evidence, acted on it, held the budget. A normal good night." };
  if (budget >= 35)
    return { mark: "C", note: "You got there. The budget took the scenic route with you." };
  return { mark: "D", note: "Survived the shift with nothing left in the tank. The SLO noticed." };
}

export function OncallGame({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("briefing");
  const [budget, setBudget] = useState(100);
  const [round, setRound] = useState(0);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [fixes, setFixes] = useState<Fix[]>([]);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [tried, setTried] = useState<Set<string>>(new Set());
  const [log, setLog] = useState<LogEntry[]>([]);
  const [shift, setShift] = useState<IncidentRecord[]>([]);
  const [bestShift, setBestShift] = useState<number | null>(null);
  const [shiftsWorked, setShiftsWorked] = useState(0);

  const logRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  /** Ids not yet drawn. Drawn without replacement so nothing repeats. */
  const deckRef = useRef<string[]>(SCENARIOS.map((s) => s.id));
  /** Drawn during the current shift — never served twice in one night. */
  const usedThisShiftRef = useRef<Set<string>>(new Set());
  const incidentStartRef = useRef<number>(0);
  const wrongThisIncidentRef = useRef(0);

  useEffect(() => {
    const stored = Number(localStorage.getItem("oncall-best-budget"));
    if (stored > 0) setBestShift(stored);
    setShiftsWorked(Number(localStorage.getItem("oncall-shifts") || 0));

    // The deck survives closing the modal, so coming back tomorrow doesn't
    // deal the same five incidents again.
    try {
      const saved: unknown = JSON.parse(localStorage.getItem("oncall-deck") || "null");
      if (Array.isArray(saved)) {
        const valid = saved.filter((id) => SCENARIOS.some((s) => s.id === id));
        if (valid.length > 0) deckRef.current = valid as string[];
      }
    } catch {
      // A corrupt deck is not worth an error; start from a full one.
    }
  }, []);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [log]);

  /**
   * Draw the next incident: prefer the difficulty this page of the shift calls
   * for, fall back to anything left in the deck, and reshuffle only once the
   * whole deck has been used.
   */
  const draw = useCallback((forRound: number): Scenario => {
    if (deckRef.current.length === 0) {
      // Refill, but never with something already seen this shift — that was
      // the old bug: an exhausted deck could hand you the same page twice.
      const unseen = SCENARIOS.filter((s) => !usedThisShiftRef.current.has(s.id));
      deckRef.current = (unseen.length > 0 ? unseen : SCENARIOS).map((s) => s.id);
    }
    const want = RAMP[Math.min(forRound, RAMP.length - 1)];
    const remaining = deckRef.current
      .map((id) => SCENARIOS.find((s) => s.id === id))
      .filter((s): s is Scenario => Boolean(s));

    const tier = remaining.filter((s) => s.difficulty === want);
    const pool = tier.length > 0 ? tier : remaining;
    const picked = shuffle(pool)[0];
    deckRef.current = deckRef.current.filter((id) => id !== picked.id);
    usedThisShiftRef.current.add(picked.id);
    localStorage.setItem("oncall-deck", JSON.stringify(deckRef.current));
    return picked;
  }, []);

  const spawn = useCallback(
    (forRound: number) => {
      const next = draw(forRound);
      setScenario(next);
      setFixes(shuffle(next.fixes));
      setRevealed(new Set());
      setTried(new Set());
      wrongThisIncidentRef.current = 0;
      incidentStartRef.current = performance.now();
      setLog([
        { kind: "note", text: `${pagerClock(forRound)} · page ${forRound + 1} of ${SHIFT_LENGTH}` },
        { kind: "alert", text: `PAGE  ${next.alert}` },
      ]);
      setPhase("active");
    },
    [draw]
  );

  const startShift = useCallback(() => {
    setBudget(100);
    setRound(0);
    setShift([]);
    usedThisShiftRef.current = new Set();
    // The deck deliberately carries over between shifts: a second shift draws
    // incidents you haven't seen yet rather than starting from the same five.
    spawn(0);
  }, [spawn]);

  // Error budget drains while an incident is open, faster later in the shift.
  // It stops while the tab is hidden: coming back from a phone call to a
  // breached SLO you couldn't see happening isn't a game, it's an ambush.
  useEffect(() => {
    if (phase !== "active") return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (interval !== null) return;
      interval = setInterval(() => {
        setBudget((b) => b - (1 + round * 0.5));
      }, 2000);
    };
    const stop = () => {
      if (interval === null) return;
      clearInterval(interval);
      interval = null;
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [phase, round]);

  // Budget exhausted: the shift ends badly.
  useEffect(() => {
    if (budget <= 0 && (phase === "active" || phase === "resolved")) {
      setPhase("gameover");
    }
  }, [budget, phase]);

  const investigate = useCallback(
    (i: number) => {
      if (!scenario || phase !== "active" || revealed.has(i)) return;
      setRevealed((r) => new Set(r).add(i));
      setBudget((b) => b - 3);
      const clue = scenario.clues[i];
      setLog((l) => [
        ...l,
        { kind: "cmd", text: `$ ${clue.cmd}` },
        ...clue.output.map((o) => ({ kind: "output" as const, text: o })),
      ]);
    },
    [scenario, phase, revealed]
  );

  const attemptFix = useCallback(
    (fix: Fix) => {
      if (!scenario || phase !== "active" || tried.has(fix.label)) return;

      if (!fix.correct) {
        wrongThisIncidentRef.current += 1;
        setTried((t) => new Set(t).add(fix.label));
        setBudget((b) => b - 12);
        setLog((l) => [
          ...l,
          { kind: "cmd", text: `$ ${fix.label.toLowerCase()}` },
          { kind: "bad", text: fix.reaction },
        ]);
        return;
      }

      const mttrMs = performance.now() - incidentStartRef.current;
      setPhase("resolved");
      setBudget((b) => Math.min(100, b + 8));
      setShift((s) => [
        ...s,
        {
          service: scenario.service,
          alert: scenario.alert,
          mttrMs,
          wrongMoves: wrongThisIncidentRef.current,
          cluesRead: revealed.size,
        },
      ]);
      setLog((l) => [
        ...l,
        { kind: "cmd", text: `$ ${fix.label.toLowerCase()}` },
        { kind: "good", text: `RESOLVED  ${scenario.resolution}` },
        { kind: "note", text: `MTTR ${formatDuration(mttrMs)} · ${scenario.lesson}` },
      ]);
    },
    [scenario, phase, tried, revealed]
  );

  const advance = useCallback(() => {
    if (phase !== "resolved") return;
    const next = round + 1;
    if (next >= SHIFT_LENGTH) {
      // Side effects stay out of the state updaters — they run twice in dev.
      const total = shiftsWorked + 1;
      const best = Math.max(bestShift ?? 0, Math.round(budget));
      localStorage.setItem("oncall-shifts", String(total));
      localStorage.setItem("oncall-best-budget", String(best));
      setShiftsWorked(total);
      setBestShift(best);
      setPhase("handover");
      return;
    }
    setRound(next);
    spawn(next);
  }, [phase, round, budget, spawn, shiftsWorked, bestShift]);

  // Keyboard: escape closes, digits investigate, letters remediate, enter advances.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Never read keystrokes meant for a text field. Without this, typing in
      // any input on the page (the CLI's included) burns error budget.
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (phase === "resolved" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        advance();
        return;
      }
      if (phase !== "active" || !scenario) return;

      const digit = Number(e.key);
      if (digit >= 1 && digit <= scenario.clues.length) {
        investigate(digit - 1);
        return;
      }
      const letterIndex = "asdf".indexOf(e.key.toLowerCase());
      if (letterIndex >= 0 && letterIndex < fixes.length) {
        attemptFix(fixes[letterIndex]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, phase, scenario, fixes, investigate, attemptFix, advance]);

  const budgetPct = Math.max(0, Math.round(budget));
  const budgetTone = budgetPct > 50 ? "bg-primary" : budgetPct > 25 ? "bg-warn" : "bg-error";

  const logTone: Record<LogEntry["kind"], string> = {
    alert: "text-error font-semibold",
    cmd: "text-muted-foreground",
    output: "text-foreground/80",
    bad: "text-warn",
    good: "text-primary",
    note: "text-muted-foreground",
  };

  const totals = useMemo(() => {
    const wrongMoves = shift.reduce((n, i) => n + i.wrongMoves, 0);
    const mttr = shift.length
      ? shift.reduce((n, i) => n + i.mttrMs, 0) / shift.length
      : 0;
    return { wrongMoves, mttr };
  }, [shift]);

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="ONCALL · incident response game"
    >
      <div className="w-full max-w-4xl rounded-lg border border-border bg-background glow-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card/60 font-mono text-xs">
          <span className="text-primary font-semibold">
            ONCALL{" "}
            <span className="text-muted-foreground font-normal">you have the pager</span>
          </span>
          <div className="flex items-center gap-5">
            <span className="text-muted-foreground">
              {phase === "briefing" || phase === "handover" || phase === "gameover" ? (
                shiftsWorked > 0 ? (
                  <>
                    shifts <span className="text-primary">{shiftsWorked}</span>
                    {bestShift !== null && <span> · best budget {bestShift}%</span>}
                  </>
                ) : null
              ) : (
                <>
                  resolved <span className="text-primary">{shift.length}</span>/{SHIFT_LENGTH}
                </>
              )}
            </span>
            <button
              onClick={onClose}
              className="-my-2 -mr-2 inline-flex h-9 items-center rounded px-2 text-muted-foreground transition-colors duration-150 hover:text-foreground active:text-primary"
              aria-label="Close game"
            >
              esc ✕
            </button>
          </div>
        </div>

        {/* Error budget */}
        <div className="px-5 py-3 border-b border-border font-mono text-[11px]">
          <div className="flex justify-between text-muted-foreground mb-1.5">
            <span>error budget</span>
            <span className={budgetPct <= 25 ? "text-error" : ""}>{budgetPct}%</span>
          </div>
          <div className="h-1.5 rounded bg-secondary overflow-hidden">
            <div
              className={`h-full ${budgetTone} transition-all duration-500`}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
        </div>

        {phase === "briefing" && (
          <div className="p-10 text-center">
            <p className="font-mono text-sm text-muted-foreground mb-2">03:12, a Tuesday.</p>
            <h2 className="font-mono font-semibold text-2xl text-foreground mb-4 glow-soft">
              The pager goes off.
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm leading-relaxed">
              Five pages before handover, each one meaner than the last.
              Investigate before you act: commands cost a little budget, wrong
              fixes cost a lot. Every incident in here is one that actually
              happens.
            </p>
            <p className="font-mono text-[11px] text-muted-foreground mb-8">
              1 2 3 investigate · a s d f remediate · enter for the next page
            </p>
            <button
              onClick={startShift}
              className="px-7 py-3 rounded-md bg-primary text-primary-foreground font-mono font-semibold hover:bg-primary/90 transition-colors"
            >
              Take the pager
            </button>
          </div>
        )}

        {(phase === "handover" || phase === "gameover") && (
          <div className="p-8 md:p-10">
            <p
              className={`font-mono text-sm mb-2 ${
                phase === "gameover" ? "text-error" : "text-primary"
              }`}
            >
              {phase === "gameover" ? "SLO BREACHED" : "SHIFT COMPLETE"}
            </p>
            <h2 className="font-mono font-semibold text-2xl text-foreground mb-6">
              {phase === "gameover"
                ? "The error budget is gone."
                : "Handover, and the postmortem writes itself."}
            </h2>

            {shift.length > 0 ? (
              <div className="mb-6 rounded-md border border-border overflow-hidden">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2 bg-card/60 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  <span>incident</span>
                  <span className="text-right">mttr</span>
                  <span className="text-right">wrong moves</span>
                </div>
                {shift.map((i, idx) => (
                  <div
                    key={`${i.service}-${idx}`}
                    className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2 border-t border-border font-mono text-[11px]"
                  >
                    <span className="text-foreground/85 truncate">{i.service}</span>
                    <span className="text-right text-primary">{formatDuration(i.mttrMs)}</span>
                    <span
                      className={`text-right ${i.wrongMoves > 0 ? "text-warn" : "text-muted-foreground"}`}
                    >
                      {i.wrongMoves}
                    </span>
                  </div>
                ))}
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2 border-t border-border bg-card/40 font-mono text-[11px]">
                  <span className="text-muted-foreground">mean</span>
                  <span className="text-right text-primary">{formatDuration(totals.mttr)}</span>
                  <span className="text-right text-muted-foreground">{totals.wrongMoves}</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm mb-6">
                Not one incident closed. The budget went entirely on deliberation.
              </p>
            )}

            {phase === "handover" && (
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                <span className="font-mono text-primary">
                  Grade {grade(budgetPct, totals.wrongMoves).mark}
                </span>{" "}
                · {grade(budgetPct, totals.wrongMoves).note} Budget left: {budgetPct}%.
              </p>
            )}
            {phase === "gameover" && (
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                {shift.length} of {SHIFT_LENGTH} pages closed before the budget ran
                out. Blameless, obviously.
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={startShift}
                className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-mono font-semibold hover:bg-primary/90 transition-colors"
              >
                Next shift
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-md border border-border text-foreground font-mono hover:border-primary/60 transition-colors"
              >
                Hand back the pager
              </button>
            </div>
          </div>
        )}

        {(phase === "active" || phase === "resolved") && scenario && (
          <div data-lenis-prevent className="grid md:grid-cols-[1.2fr_1fr] max-h-[75vh] md:max-h-[60vh] overflow-y-auto md:overflow-visible">
            {/* Log feed */}
            <div
              ref={logRef}
              tabIndex={0}
              data-lenis-prevent
              className="p-5 font-mono text-[11px] leading-5 overflow-y-auto border-b md:border-b-0 md:border-r border-border min-h-[16rem]"
              aria-live="polite"
            >
              {log.map((entry, i) => (
                <div key={i} className={`${logTone[entry.kind]} whitespace-pre-wrap mb-0.5`}>
                  {entry.text}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="p-5">
              {phase === "resolved" ? (
                <div className="h-full flex flex-col justify-center items-start gap-4">
                  <p className="font-mono text-[11px] text-primary">
                    {scenario.service} · resolved
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {round + 1 >= SHIFT_LENGTH
                      ? "That's the shift. Time to write it up."
                      : "The pager is quiet for now. It won't last."}
                  </p>
                  <button
                    onClick={advance}
                    autoFocus
                    className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-mono text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {round + 1 >= SHIFT_LENGTH ? "Hand over ⏎" : "Next page ⏎"}
                  </button>
                </div>
              ) : (
                <>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                    investigate <span className="normal-case">(−3% each)</span>
                  </p>
                  <div className="space-y-1.5 mb-5">
                    {scenario.clues.map((clue, i) => (
                      <button
                        key={clue.cmd}
                        onClick={() => investigate(i)}
                        disabled={revealed.has(i)}
                        className={`w-full text-left px-3 py-2 rounded border font-mono text-[11px] transition-colors flex gap-2 ${
                          revealed.has(i)
                            ? "border-border/50 text-muted-foreground/50 cursor-default"
                            : "border-border text-foreground/90 hover:border-primary/60 hover:text-primary"
                        }`}
                      >
                        <span className="opacity-50 shrink-0">{i + 1}</span>
                        <span className="truncate">$ {clue.cmd}</span>
                      </button>
                    ))}
                  </div>

                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                    remediate <span className="normal-case">(wrong: −12%)</span>
                  </p>
                  <div className="space-y-1.5">
                    {fixes.map((fix, i) => (
                      <button
                        key={fix.label}
                        onClick={() => attemptFix(fix)}
                        disabled={tried.has(fix.label)}
                        className={`w-full text-left px-3 py-2 rounded border font-mono text-[11px] transition-colors flex gap-2 ${
                          tried.has(fix.label)
                            ? "border-error/30 text-error/50 line-through cursor-default"
                            : "border-border text-foreground/90 hover:border-warn/60 hover:text-warn"
                        }`}
                      >
                        <span className="opacity-50 shrink-0">{"asdf"[i]}</span>
                        <span>{fix.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
