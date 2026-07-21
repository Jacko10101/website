"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export function CliNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ command: string; output: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Routes
  const routes: Record<string, { path: string; description: string }> = {
    "/": { path: "/", description: "Homepage" },
    "/about": { path: "/about", description: "About Jack Devlin" },
    "/projects": { path: "/projects", description: "Case studies and portfolio" },
    "/projects/heimdall": { path: "/projects/heimdall", description: "Heimdall — deployment intelligence" },
    "/projects/pipeline-platform": { path: "/projects/pipeline-platform", description: "Pipeline platform — shared CI/CD" },
    "/projects/observability": { path: "/projects/observability", description: "Self-hosted observability stack" },
    "/projects/smart-home": { path: "/projects/smart-home", description: "Smart home on K3s" },
    "/contact": { path: "/contact", description: "Get in touch" },
  };

  // Easter eggs — every number here is measured elsewhere on the site.
  const secrets = [
    "preferred_stack: Kubernetes, ArgoCD, Prometheus",
    "observability_savings: ~£95k/yr — measured, not projected",
    "deploy_rate: ~400/month across the platform",
    "heimdall_daily_users: 20+",
    "msc_ai: in progress",
    "longest_bash_script: longer than it should have been",
  ];

  // Vim mode state
  const [vimMode, setVimMode] = useState(false);
  const [vimContent] = useState(`// Welcome to vim (readonly mode)
// This is a simplified vim simulator
// Commands: :q to quit, :wq to "save" and quit
// Press i for INSERT mode, ESC for NORMAL mode

export function DevlinOps() {
  const stack = [
    "Kubernetes", "ArgoCD", "Prometheus",
    "Grafana", "Terraform", "AWS CDK"
  ];

  return (
    <div>
      <h1>Platform Engineering</h1>
      <p>Internal tools, from scratch.</p>
    </div>
  );
}`);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with /
      if (e.key === "/" && !isOpen && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setIsOpen(true);
      }

      // Close with Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setInput("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const parts = trimmed.split(" ");
    const command = parts[0];
    const arg = parts.slice(1).join(" ");

    let output = "";

    switch (command) {
      case "help":
        output = `Available commands:

  Navigation:
    ls [path]              List available routes
    cd <path>              Navigate to path
    pwd                    Show current path

  DevOps Tools:
    kubectl <args>         Kubernetes commands (try: get pods, get nodes)
    docker <args>          Docker commands (try: ps, images)
    terraform <args>       Terraform commands (try: plan, apply)
    argocd <args>          ArgoCD commands (try: app list)
    git <args>             Git commands (try: status, log)

  Diversions:
    oncall                 Take the pager. Good luck
    chaos                  Unleash the chaos monkey on this page
    neofetch               Display system info
    vim                    Open vim (good luck exiting)
    cowsay <msg>           Make a cow say something
    cat .secrets           Show easter eggs

  Other:
    whoami                 Display user info
    hire                   Get in touch
    sudo <cmd>             If you must
    rm -rf /               Best not
    clear                  Clear terminal
    exit                   Close terminal
    help                   Show this help message`;
        break;

      case "ls":
        const listPath = arg || "/";
        if (listPath === "/" || listPath === "") {
          output = Object.keys(routes)
            .map((r) => `  ${r}  →  ${routes[r].description}`)
            .join("\n");
        } else if (routes[listPath]) {
          output = `  ${listPath}  →  ${routes[listPath].description}`;
        } else {
          output = `ls: cannot access '${listPath}': No such file or directory`;
        }
        break;

      case "cd":
      case "cat":
        if (!arg) {
          output = `${command}: missing operand`;
          break;
        }

        if (arg === ".secrets") {
          output = secrets.join("\n");
          break;
        }

        const targetPath = arg.startsWith("/") ? arg : `/${arg}`;

        if (routes[targetPath]) {
          router.push(routes[targetPath].path);
          output = `Navigating to ${targetPath}...`;
          setTimeout(() => setIsOpen(false), 500);
        } else {
          output = `${command}: ${arg}: No such file or directory`;
        }
        break;

      case "pwd":
        output = window.location.pathname;
        break;

      case "kubectl":
        if (!arg) {
          output = "Error: kubectl requires a subcommand";
        } else if (arg === "get pods" || arg === "get pod" || arg === "get po") {
          output = `NAME                                READY   STATUS    RESTARTS   AGE
devlinops-site-7d9f8b-x2c4k         1/1     Running   0          42d
prometheus-server-5f7b8d-q9r7t      1/1     Running   0          100d
argocd-application-controller-0     1/1     Running   0          69d
grafana-6c4f9d-w1n2r                1/1     Running   0          100d
staging-definitely-isnt-prod-0      1/1     Running   0          3d
backlog-processor-0                 0/1     Pending   0          999d`;
        } else if (arg === "get nodes" || arg === "get node" || arg === "get no") {
          output = `NAME              STATUS   ROLES           AGE    VERSION
node-1            Ready    control-plane   365d   v1.30.0
node-2            Ready    <none>          200d   v1.30.0
node-3            Ready    <none>          100d   v1.30.0
node-under-desk   Ready    <none>          50d    v1.30.0`;
        } else if (arg === "get deployments" || arg === "get deploy") {
          output = `NAME               READY   UP-TO-DATE   AVAILABLE   AGE
devlinops-site     2/2     2            2           42d
prometheus-stack   1/1     1            1           100d
heimdall           1/1     1            1           200d
loki               1/1     1            1           100d`;
        } else {
          output = `Error: unknown kubectl command: ${arg}\nTry: get pods, get nodes, get deployments`;
        }
        break;

      case "docker":
        if (!arg) {
          output = "Error: docker requires a command";
        } else if (arg === "ps" || arg === "ps -a") {
          output = `CONTAINER ID   IMAGE             STATUS        PORTS                    NAMES
a1b2c3d4e5f6   devlinops/site    Up 42 days    0.0.0.0:3000->3000/tcp   site
f6e5d4c3b2a1   prom/prometheus   Up 100 days   0.0.0.0:9090->9090/tcp   prometheus
1234567890ab   grafana/grafana   Up 100 days   0.0.0.0:3001->3000/tcp   yet_another_dashboard
deadbeef1337   postgres:15       Up 200 days   5432/tcp                 postgres
cafecafe0042   redis:alpine      Up 50 days    6379/tcp                 redis`;
        } else if (arg === "images" || arg === "image ls") {
          output = `REPOSITORY        TAG           IMAGE ID       CREATED        SIZE
devlinops/site    sha-abc1234   abc123def456   2 days ago     420MB
devlinops/site    sha-def5678   def456abc123   1 week ago     419MB
prom/prometheus   latest        789abc012def   3 weeks ago    200MB
grafana/grafana   latest        012def789abc   1 month ago    350MB
postgres          15-alpine     456789abcdef   2 months ago   180MB
node              20-slim       fedcba987654   3 days ago     250MB`;
        } else {
          output = `Error: unknown docker command: ${arg}\nTry: ps, images`;
        }
        break;

      case "terraform":
        if (!arg || arg === "plan") {
          output = `Terraform will perform the following actions:

  # aws_s3_bucket.terraform_state will be created
  + resource "aws_s3_bucket" "terraform_state" {
      + bucket     = "devlinops-tfstate"
      + versioning = true  # state surgery is not a hobby
    }

  # aws_budgets_budget.guardrail will be created
  + resource "aws_budgets_budget" "guardrail" {
      + limit_unit   = "GBP"
      + limit_amount = "modest"
    }

Plan: 2 to add, 0 to change, 0 to destroy.

Note: nothing on this site provisions real infrastructure.
This plan is theatre. Convincing theatre, but theatre.`;
        } else if (arg === "apply") {
          output = `Error: no saved plan to apply.

This terminal is a prop — it doesn't get apply access to anything.
Run 'terraform plan' if you'd like the full performance.`;
        } else {
          output = `Error: unknown terraform command: ${arg}\nTry: plan, apply`;
        }
        break;

      case "argocd":
        if (arg === "app list" || arg === "app ls") {
          output = `NAME                 SYNC STATUS   HEALTH STATUS
devlinops-site       Synced        Healthy
prometheus-stack     Synced        Healthy
heimdall             Synced        Healthy
loki                 Synced        Healthy
definitely-in-sync   OutOfSync     Progressing`;
        } else if (arg === "app get devlinops-site") {
          output = `Name:               devlinops-site
Project:            default
Server:             https://kubernetes.default.svc
Namespace:          production
URL:                https://devlinops.com
Target:             main
Sync Policy:        Automated
Sync Status:        Synced to main (abc1234)
Health Status:      Healthy`;
        } else {
          output = `Error: unknown argocd command: ${arg}\nTry: app list, app get devlinops-site`;
        }
        break;

      case "vim":
        setVimMode(true);
        output = "Opening vim...";
        setTimeout(() => setInput(""), 100);
        break;

      case "whoami":
        output = `jack@devlinops
├─ Platform & MLOps engineer
├─ Kubernetes, ArgoCD, Prometheus — by choice
├─ MSc AI, finishing Aug 2026
└─ Available for fully remote B2B contracts from September 2026

Location: UK (remote)
Shell: bash, with more aliases than is strictly dignified`;
        break;

      case "history":
        if (history.length === 0) {
          output = "No command history yet.";
        } else {
          output = history
            .map((item, idx) => `  ${idx + 1}  ${item.command}`)
            .join("\n");
        }
        break;

      case "clear":
        setHistory([]);
        setInput("");
        return;

      case "exit":
      case "quit":
        setIsOpen(false);
        setInput("");
        return;

      case "snake":
      case "play":
      case "oncall":
        output = `Paging the on-call engineer… that's you.`;
        setTimeout(() => {
          setIsOpen(false);
          window.dispatchEvent(new Event("devlinops:oncall"));
        }, 900);
        break;

      case "chaos":
      case "chaos-monkey":
        output = `chaos-monkey: targeting devlinops.com…
(watch the page behind this terminal)`;
        setTimeout(() => {
          setIsOpen(false);
          window.dispatchEvent(new Event("devlinops:chaos"));
        }, 900);
        break;

      case "neofetch":
        output = `
       ████████████████████        jack@devlinops
    ████████████████████████████   ──────────────────
  ██████████████████████████████   OS: devlinops.com — versioned by commit, not by marketing
 █████████     ████     █████████  Host: Vercel
████████  ████  ███  ███  ████████ Kernel: Next.js 16.1.0
████████  ████  ███  ███  ████████ Uptime: since Oct 2025
████████  ████  ███  ███  ████████ Packages: 63 (npm, lockfile-pinned)
████████  ████  ███  ███  ████████ Shell: bash 5.2
████████  ████  ███  ███  ████████ Terminal: cli-navigation.tsx
 █████████     ████     █████████  Day job: ~400 deploys/month, ~£95k/yr saved on observability
  ██████████████████████████████   Stack: K8s, ArgoCD, AWS, PyTorch, Terraform
    ████████████████████████████   Status: available for B2B contracts, Sept 2026
       ████████████████████`;
        break;

      case "git":
        if (!arg || arg === "status") {
          output = `On branch main
Your branch is up to date with 'origin/main'.

Changes staged for commit:
  modified:   infrastructure/terraform/main.tf
  modified:   k8s/deployments/frontend.yaml

Changes not staged:
  modified:   README.md (now matches actual behaviour)

Untracked files:
  .env.local.backup.old.dontdelete
  TODO-fix-later.md`;
        } else if (arg === "log" || arg === "log --oneline") {
          output = `a1b2c3d fix: handle the case the previous fix introduced
f4e5d6c feat: the feature as actually requested, third attempt
7890abc refactor: remove an abstraction added in a moment of optimism
bcd1234 revert: revert "quick win"
e5f6789 docs: update README to match reality
abc7890 fix: same bug, correct fix this time`;
        } else if (arg === "blame") {
          output = `It was me. It's my website — it's always me.`;
        } else {
          output = `git: '${arg}' is not a git command.\nTry: status, log, blame`;
        }
        break;

      case "sudo":
        if (arg === "rm -rf /" || arg === "rm -rf /*") {
          output = `[sudo] password for jack: ********
Fine. Have it your way.`;
          setTimeout(() => {
            setIsOpen(false);
            window.dispatchEvent(new Event("devlinops:chaos"));
          }, 900);
        } else if (arg) {
          output = `[sudo] password for jack: ********
sudo: superfluous. You're already root here — although it's my
website, so the privileges are decorative.`;
        } else {
          output = `usage: sudo <command>`;
        }
        break;

      case "rm":
        if (arg === "-rf /" || arg === "-rf /*" || arg === "-rf /home") {
          output = `rm: proceeding against advice…`;
          setTimeout(() => {
            setIsOpen(false);
            window.dispatchEvent(new Event("devlinops:chaos"));
          }, 900);
        } else {
          output = `rm: missing operand\nTry 'rm --help' for more information.`;
        }
        break;

      case "hire":
      case "contact":
        router.push("/contact");
        output = `Redirecting to /contact...
The form does actually send, and I read everything that comes through it.`;
        setTimeout(() => setIsOpen(false), 1000);
        break;

      case "cowsay":
        const message = arg || "moo";
        output = ` ${"_".repeat(message.length + 2)}
< ${message} >
 ${"-".repeat(message.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
        break;

      case "ping":
        output = `PING devlinops.com (76.76.21.21): 56 data bytes
64 bytes from 76.76.21.21: icmp_seq=0 ttl=64 time=0.042 ms
64 bytes from 76.76.21.21: icmp_seq=1 ttl=64 time=0.037 ms
64 bytes from 76.76.21.21: icmp_seq=2 ttl=64 time=0.035 ms
--- devlinops.com ping statistics ---
3 packets transmitted, 3 received, 0% packet loss
round-trip min/avg/max/stddev = 0.035/0.038/0.042/0.003 ms`;
        break;

      case "curl":
        if (arg?.includes("devlinops") || !arg) {
          output = `HTTP/2 200 OK
server: Vercel
content-type: text/html
x-powered-by: Next.js
x-available-from: 2026-09
x-easter-egg: you found one

<!DOCTYPE html>...`;
        } else {
          output = `curl: try 'curl devlinops.com'`;
        }
        break;

      case "npm":
        if (arg === "run dev") {
          output = `> devlinops@1.0.0 dev
> next dev

  ▲ Next.js 16.1.0
  - Local:        http://localhost:3000
  - Ready in 1.2s`;
        } else if (arg === "install" || arg === "i") {
          output = `added 63 packages in 1.4s

found 0 vulnerabilities`;
        } else {
          output = `npm: try 'npm run dev' or 'npm install'`;
        }
        break;

      case "":
        return;

      default:
        output = `bash: ${command}: command not found\nType 'help' for available commands`;
    }

    setHistory((prev) => [...prev, { command: cmd, output }]);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
    }
  };

  if (!isOpen && !vimMode) return null;

  // Vim modal
  if (vimMode) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div className="container mx-auto flex h-full flex-col p-4">
          {/* Vim status bar */}
          <div className="border-b border-border pb-2 font-mono text-sm text-primary">
            <div className="flex items-center justify-between">
              <span>devlinops.tsx [readonly]</span>
              <span>-- NORMAL --</span>
            </div>
          </div>

          {/* Vim content */}
          <div className="flex-1 overflow-auto py-4 font-mono text-sm text-foreground/90">
            <pre className="whitespace-pre-wrap">{vimContent}</pre>
          </div>

          {/* Vim command line */}
          <div className="border-t border-border pt-2 font-mono text-sm">
            <div className="text-primary">
              <span>:</span>
              <span className="text-muted-foreground">
                {" "}
                Type :q to quit, :wq to save & quit
              </span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <p>In real vim you would still be here. This one lets you leave.</p>
              <p className="mt-1">Press ESC or type :q to exit</p>
            </div>
          </div>

          {/* Vim key handler */}
          <div className="mt-4">
            <input
              type="text"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setVimMode(false);
                }
              }}
              onChange={(e) => {
                const val = e.target.value.toLowerCase();
                if (val === ":q" || val === ":wq" || val === ":q!") {
                  setVimMode(false);
                  e.target.value = "";
                }
              }}
              className="w-full border-none bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground"
              placeholder=":q to quit"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-full items-center justify-center px-4">
        <div className="w-full max-w-4xl rounded-lg border border-border bg-black p-6 shadow-2xl">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="text-primary">jack@devlinops</span>
              <span className="text-muted-foreground">~</span>
              <span className="text-muted-foreground">$</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-muted-foreground">Press ESC to close</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Terminal output */}
          <div ref={outputRef} className="mb-4 max-h-96 overflow-y-auto font-mono text-sm">
            {history.length === 0 && (
              <div className="mb-4 text-foreground/90">
                <p>devlinops.com — interactive shell</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Type 'help' for available commands or 'ls' to see routes
                </p>
              </div>
            )}

            {history.map((item, index) => (
              <div key={index} className="mb-3">
                <div>
                  <span className="text-primary">jack@devlinops</span>
                  <span className="text-muted-foreground"> ~ </span>
                  <span className="text-muted-foreground">$ </span>
                  <span className="text-foreground">{item.command}</span>
                </div>
                <pre className="mt-1 whitespace-pre-wrap text-foreground/80">
                  {item.output}
                </pre>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="font-mono text-sm">
              <span className="text-primary">jack@devlinops</span>
              <span className="text-muted-foreground"> ~ </span>
              <span className="text-muted-foreground">$ </span>
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border-none bg-transparent font-mono text-sm text-foreground caret-primary outline-none placeholder:text-muted-foreground"
              placeholder="type a command... (try 'help')"
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
