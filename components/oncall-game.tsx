"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * ONCALL — the easter egg. Not snake: an incident-response simulator.
 * The pager goes off, you investigate with real ops commands, pick the right
 * remediation, and try to keep the error budget alive as the incidents get
 * meaner. Everything in here is the kind of failure that actually happens.
 */

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
  service: string;
  alert: string;
  clues: Clue[];
  fixes: Fix[];
  resolution: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "oom",
    service: "payments-api",
    alert: "PodCrashLooping — payments-api restarting every ~90s",
    clues: [
      {
        cmd: "kubectl logs payments-api-7d4f --previous | tail",
        output: ["java.lang.OutOfMemoryError: Java heap space", "  at com.acme.payments.BatchProcessor.load(...)"],
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
      { label: "Roll back the last deploy", correct: false, reaction: "Rolled back. Still OOMKilled — last deploy was three days ago. Not the deploy." },
      { label: "Delete the pod", correct: false, reaction: "New pod, same limit, same heap. It's back in CrashLoopBackOff within two minutes." },
      { label: "Silence the alert", correct: false, reaction: "The alert is quiet. Payments are still down. Bold strategy." },
    ],
    resolution: "Limit raised to 1Gi, rollout complete. Batch job fits in heap. Runbook updated.",
  },
  {
    id: "baddeploy",
    service: "checkout-api",
    alert: "HighErrorRate — 500s at 34% on checkout-api",
    clues: [
      {
        cmd: "kubectl logs checkout-api-59b1 | tail",
        output: ["NullPointerException: discountCode is null", "  at CheckoutController.applyDiscount(...)"],
      },
      {
        cmd: "argocd app history checkout-api",
        output: ["ID  DATE              REVISION", "41  4 minutes ago     v2.14.0  ← current", "40  2 days ago        v2.13.2"],
      },
      {
        cmd: "promql: rate(http_500s[5m])",
        output: ["flat … flat … flat … ▲ spike begins 4 minutes ago"],
      },
    ],
    fixes: [
      { label: "Roll back to the previous revision", correct: true, reaction: "" },
      { label: "Scale the deployment up", correct: false, reaction: "More replicas, more NullPointerExceptions per second. Throughput of failure: improved." },
      { label: "Restart the pods", correct: false, reaction: "Fresh pods, same v2.14.0, same bug. The error rate doesn't blink." },
      { label: "Raise the memory limit", correct: false, reaction: "Memory was never the problem. The 500s continue, now with more headroom." },
    ],
    resolution: "Rolled back to v2.13.2. Error rate flat within a minute. The fix goes through review this time.",
  },
  {
    id: "diskfull",
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
      { label: "Delete the pod", correct: false, reaction: "It reschedules onto the same full volume. Kubernetes is consistent like that." },
      { label: "Roll back Prometheus", correct: false, reaction: "The old version meets the same full disk. Storage doesn't care about your tags." },
      { label: "Silence the alert", correct: false, reaction: "You've blinded the thing that watches everything else. The next incident arrives unobserved." },
    ],
    resolution: "PVC expanded to 200Gi, WAL replayed, dashboards back. Retention policy gets a review tomorrow.",
  },
  {
    id: "cert",
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
        output: ["ACME error: rateLimited — too many certificates issued"],
      },
    ],
    fixes: [
      { label: "Issue from the backup ACME account and rotate", correct: true, reaction: "" },
      { label: "Restart the ingress controller", correct: false, reaction: "It reloads the same expired cert with great efficiency." },
      { label: "Scale the ingress up", correct: false, reaction: "Now four replicas are refusing handshakes instead of two." },
      { label: "Delete the certificate resource", correct: false, reaction: "cert-manager recreates it and hits the same rate limit. The clock keeps ticking." },
    ],
    resolution: "Cert rotated from the secondary account. Handshakes green. Renewal alerting moved to 21 days out.",
  },
  {
    id: "node",
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
      { label: "Restart the stuck pods", correct: false, reaction: "The kubelet isn't listening. Your deletes queue politely behind a dead process." },
      { label: "Scale the deployments up", correct: false, reaction: "New pods schedule onto healthy nodes — but node-4's zombies still hold their PVCs." },
      { label: "Wait and see", correct: false, reaction: "Ten more minutes of NotReady. The pending queue grows. The pager does not self-resolve." },
    ],
    resolution: "Node cordoned, drained, recycled by the ASG. Workloads rescheduled. PLEG saga added to the runbook.",
  },
  {
    id: "dns",
    service: "orders-api",
    alert: "HighLatency — intermittent 5s timeouts on orders-api",
    clues: [
      {
        cmd: "kubectl logs orders-api-2c9d | grep -i error | tail",
        output: ["getaddrinfo EAI_AGAIN inventory-svc.internal", "upstream timeout after 5000ms"],
      },
      {
        cmd: "kubectl logs -n kube-system coredns | tail",
        output: ["[WARNING] overloaded — dropping queries", "throttling: CPU limit reached"],
      },
      {
        cmd: "kubectl top pod -n kube-system | grep coredns",
        output: ["coredns-1   199m / 200m CPU", "coredns-2   200m / 200m CPU"],
      },
    ],
    fixes: [
      { label: "Scale CoreDNS and raise its CPU limit", correct: true, reaction: "" },
      { label: "Roll back orders-api", correct: false, reaction: "The old version resolves DNS through the same drowning CoreDNS. Timeouts continue." },
      { label: "Restart orders-api pods", correct: false, reaction: "Fresh pods issue fresh DNS queries into the same bottleneck. If anything, it's worse." },
      { label: "Silence the alert", correct: false, reaction: "The timeouts are still there. Now they're a surprise for the morning shift." },
    ],
    resolution: "CoreDNS scaled to 4 with headroom. Lookups instant, latency flat. NodeLocal DNSCache goes on the backlog.",
  },
];

type Phase = "briefing" | "active" | "resolved" | "gameover";

interface LogEntry {
  kind: "alert" | "cmd" | "output" | "bad" | "good";
  text: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function OncallGame({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("briefing");
  const [budget, setBudget] = useState(100);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [fixes, setFixes] = useState<Fix[]>([]);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [tried, setTried] = useState<Set<string>>(new Set());
  const [log, setLog] = useState<LogEntry[]>([]);
  const [highScore, setHighScore] = useState(0);
  const logRef = useRef<HTMLDivElement>(null);
  const lastScenarioRef = useRef<string | null>(null);

  useEffect(() => {
    setHighScore(Number(localStorage.getItem("oncall-highscore") || 0));
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [log]);

  const spawn = useCallback(() => {
    const pool = SCENARIOS.filter((s) => s.id !== lastScenarioRef.current);
    const next = pool[Math.floor(Math.random() * pool.length)];
    lastScenarioRef.current = next.id;
    setScenario(next);
    setFixes(shuffle(next.fixes));
    setRevealed(new Set());
    setTried(new Set());
    setLog([{ kind: "alert", text: `PAGE  ${next.alert}` }]);
    setPhase("active");
  }, []);

  // Budget drain while an incident is live — faster every round.
  useEffect(() => {
    if (phase !== "active") return;
    const interval = setInterval(() => {
      setBudget((b) => b - (1 + round * 0.5));
    }, 2000);
    return () => clearInterval(interval);
  }, [phase, round]);

  // Game over check + high score.
  useEffect(() => {
    if (budget <= 0 && phase !== "gameover") {
      setPhase("gameover");
      setHighScore((h) => {
        const best = Math.max(h, score);
        localStorage.setItem("oncall-highscore", String(best));
        return best;
      });
    }
  }, [budget, phase, score]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const investigate = (i: number) => {
    if (!scenario || phase !== "active" || revealed.has(i)) return;
    setRevealed(new Set(revealed).add(i));
    setBudget((b) => b - 3);
    const clue = scenario.clues[i];
    setLog((l) => [
      ...l,
      { kind: "cmd", text: `$ ${clue.cmd}` },
      ...clue.output.map((o) => ({ kind: "output" as const, text: o })),
    ]);
  };

  const attemptFix = (fix: Fix) => {
    if (!scenario || phase !== "active" || tried.has(fix.label)) return;
    if (fix.correct) {
      setPhase("resolved");
      setScore((s) => s + 1);
      setBudget((b) => Math.min(100, b + 8));
      setLog((l) => [
        ...l,
        { kind: "cmd", text: `$ ${fix.label.toLowerCase()}` },
        { kind: "good", text: `RESOLVED  ${scenario.resolution}` },
      ]);
      setTimeout(() => {
        setRound((r) => r + 1);
        spawn();
      }, 2600);
    } else {
      setTried(new Set(tried).add(fix.label));
      setBudget((b) => b - 12);
      setLog((l) => [
        ...l,
        { kind: "cmd", text: `$ ${fix.label.toLowerCase()}` },
        { kind: "bad", text: fix.reaction },
      ]);
    }
  };

  const budgetPct = Math.max(0, Math.round(budget));
  const budgetTone =
    budgetPct > 50 ? "bg-primary" : budgetPct > 25 ? "bg-warn" : "bg-error";

  const logTone: Record<LogEntry["kind"], string> = {
    alert: "text-error font-semibold",
    cmd: "text-muted-foreground",
    output: "text-foreground/80",
    bad: "text-warn",
    good: "text-primary",
  };

  const slo = useMemo(
    () => (99 + budgetPct / 111).toFixed(2),
    [budgetPct]
  );

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="ONCALL — incident response game"
    >
      <div className="w-full max-w-4xl rounded-lg border border-border bg-background glow-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card/60 font-mono text-xs">
          <span className="text-primary font-semibold">
            ONCALL <span className="text-muted-foreground font-normal">— you have the pager</span>
          </span>
          <div className="flex items-center gap-5">
            <span className="text-muted-foreground">
              resolved <span className="text-primary">{score}</span>
              {highScore > 0 && <span> · best {Math.max(highScore, score)}</span>}
            </span>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close game"
            >
              esc ✕
            </button>
          </div>
        </div>

        {/* Error budget */}
        <div className="px-5 py-3 border-b border-border font-mono text-[11px]">
          <div className="flex justify-between text-muted-foreground mb-1.5">
            <span>error budget — SLO {slo}%</span>
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
            <p className="text-muted-foreground max-w-md mx-auto mb-8 text-sm leading-relaxed">
              Investigate before you act — commands cost a little budget, wrong
              fixes cost a lot. Resolve incidents to claw budget back. When the
              error budget hits zero, the SLO is breached and the postmortem is
              yours to write.
            </p>
            <button
              onClick={spawn}
              className="px-7 py-3 rounded-md bg-primary text-primary-foreground font-mono font-semibold hover:bg-primary/90 transition-colors"
            >
              Take the pager
            </button>
          </div>
        )}

        {phase === "gameover" && (
          <div className="p-10 text-center">
            <p className="font-mono text-sm text-error mb-2">SLO BREACHED</p>
            <h2 className="font-mono font-semibold text-2xl text-foreground mb-4">
              The error budget is gone.
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-2 text-sm">
              Incidents resolved: <span className="text-primary font-mono">{score}</span>
              {score >= highScore && score > 0 && " — a new personal best."}
            </p>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 text-sm">
              The postmortem writes itself. Blameless, obviously.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setBudget(100);
                  setScore(0);
                  setRound(0);
                  spawn();
                }}
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
          <div className="grid md:grid-cols-[1.2fr_1fr] max-h-[60vh]">
            {/* Log feed */}
            <div
              ref={logRef}
              className="p-5 font-mono text-[11px] leading-5 overflow-y-auto border-b md:border-b-0 md:border-r border-border min-h-[16rem]"
              aria-live="polite"
            >
              {log.map((entry, i) => (
                <div key={i} className={`${logTone[entry.kind]} whitespace-pre-wrap mb-0.5`}>
                  {entry.text}
                </div>
              ))}
              {phase === "resolved" && (
                <div className="text-muted-foreground mt-2">next page incoming…</div>
              )}
            </div>

            {/* Actions */}
            <div className="p-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                investigate <span className="normal-case">(−3% each)</span>
              </p>
              <div className="space-y-1.5 mb-5">
                {scenario.clues.map((clue, i) => (
                  <button
                    key={clue.cmd}
                    onClick={() => investigate(i)}
                    disabled={revealed.has(i) || phase !== "active"}
                    className={`w-full text-left px-3 py-2 rounded border font-mono text-[11px] transition-colors ${
                      revealed.has(i)
                        ? "border-border/50 text-muted-foreground/50 cursor-default"
                        : "border-border text-foreground/90 hover:border-primary/60 hover:text-primary"
                    }`}
                  >
                    $ {clue.cmd}
                  </button>
                ))}
              </div>

              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                remediate <span className="normal-case">(wrong: −12%)</span>
              </p>
              <div className="space-y-1.5">
                {fixes.map((fix) => (
                  <button
                    key={fix.label}
                    onClick={() => attemptFix(fix)}
                    disabled={tried.has(fix.label) || phase !== "active"}
                    className={`w-full text-left px-3 py-2 rounded border font-mono text-[11px] transition-colors ${
                      tried.has(fix.label)
                        ? "border-error/30 text-error/50 line-through cursor-default"
                        : "border-border text-foreground/90 hover:border-warn/60 hover:text-warn"
                    }`}
                  >
                    {fix.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
