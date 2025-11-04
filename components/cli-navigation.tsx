"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export function CliNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ command: string; output: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Routes
  const routes: Record<string, { path: string; description: string }> = {
    "/": { path: "/", description: "Homepage with hero and services" },
    "/about": { path: "/about", description: "About Jack Devlin" },
    "/services": { path: "/services", description: "Platform engineering services" },
    "/projects": { path: "/projects", description: "Case studies and portfolio" },
    "/projects/cicd-gitops": { path: "/projects/cicd-gitops", description: "CI/CD & GitOps case study" },
    "/projects/dora-devex": { path: "/projects/dora-devex", description: "DORA Metrics & DevEx case study" },
    "/projects/observability": { path: "/projects/observability", description: "Observability Stack case study" },
    "/contact": { path: "/contact", description: "Get in touch" },
  };

  // Easter eggs
  const secrets = [
    "🎯 Favorite tech: Kubernetes, ArgoCD, Prometheus",
    "☕ Coffee consumption: ~4 cups/day (monitoring not included)",
    "🐛 Bugs fixed: Too many to count (see 750+ tickets)",
    "🚀 Deployment velocity: 400+ deploys/month",
    "💰 Cost savings: $750K+ through platform optimization",
    "🎓 Currently: MSc AI in progress",
    "🔥 Hidden talent: Bash scripting wizard (1000+ line scripts)",
  ];

  // Vim mode state
  const [vimMode, setVimMode] = useState(false);
  const [vimContent, setVimContent] = useState(`// Welcome to vim! (readonly mode)
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
      <h1>Platform Engineering Excellence</h1>
      <p>Building infrastructure that just works.</p>
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
  ls [path]              List available routes
  cd <path>              Navigate to path
  cat <path>             Navigate to path
  cat .secrets           Show easter eggs
  pwd                    Show current path
  clear                  Clear terminal
  kubectl <args>         Kubernetes commands (try: get pods, get nodes)
  docker <args>          Docker commands (try: ps, images)
  terraform <args>       Terraform commands (try: plan, apply)
  argocd <args>          ArgoCD commands (try: app list)
  vim [file]             Open vim editor (just for fun)
  whoami                 Display user info
  history                Show command history
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
          output = `NAME                                   READY   STATUS      RESTARTS   AGE
devlinops-frontend-7d9f8b-xkcd2        1/1     Running     0          42d
prometheus-server-5f7b8d-h4x0r         1/1     Running     0          100d
argocd-application-ctrl-chaos          1/1     Running     1337       69d
platform-engineer-sleeping             0/1     CrashLoop   3          4h
coffee-deployment-critical             2/2     Running     0          5m
k8s-api-probably-fine                  1/1     Running     0          999d
prod-db-definitely-not-staging         1/1     Running     0          1d
helm-upgrade-yolo-69420                1/1     Running     0          10m`;
        } else if (arg === "get nodes" || arg === "get node" || arg === "get no") {
          output = `NAME                          STATUS   ROLES           AGE     VERSION
node-caffeinated-1            Ready    control-plane   365d    v1.30.0
node-works-on-my-machine-2    Ready    <none>          200d    v1.30.0
node-friday-deploy-survivor   Ready    <none>          100d    v1.30.0
node-probably-aws-1           Ready    <none>          50d     v1.30.0`;
        } else if (arg === "get deployments" || arg === "get deploy") {
          output = `NAME                    READY   UP-TO-DATE   AVAILABLE   AGE
frontend                3/3     3            3           42d
backend-api             5/5     5            5           100d
microservice-madness    8/8     8            8           200d`;
        } else {
          output = `Error: unknown kubectl command: ${arg}\nTry: get pods, get nodes, get deployments`;
        }
        break;

      case "docker":
        if (!arg) {
          output = "Error: docker requires a command";
        } else if (arg === "ps" || arg === "ps -a") {
          output = `CONTAINER ID   IMAGE                      STATUS         PORTS                     NAMES
a1b2c3d4e5f6   devlinops/frontend:v1      Up 42 days     0.0.0.0:3000->3000/tcp   probably_works
f6e5d4c3b2a1   prometheus:latest          Up 100 days    0.0.0.0:9090->9090/tcp   definitely_working
1234567890ab   grafana:latest             Up 100 days    0.0.0.0:3001->3000/tcp   dashboard_addiction
deadbeef1337   postgres:15                Up 200 days    5432/tcp                  db_or_not_db
cafecafe0042   redis:alpine               Up 50 days     6379/tcp                  cache_me_outside`;
        } else if (arg === "images" || arg === "image ls") {
          output = `REPOSITORY              TAG            IMAGE ID       CREATED        SIZE
devlinops/frontend      latest         abc123def456   2 days ago     420MB
devlinops/frontend      works-on-prod  def456abc123   1 week ago     419MB
prometheus              latest         789abc012def   3 weeks ago    200MB
grafana                 latest         012def789abc   1 month ago    350MB
postgres                15-alpine      456789abcdef   2 months ago   180MB
node                    20-slim        fedcba987654   3 days ago     250MB`;
        } else {
          output = `Error: unknown docker command: ${arg}\nTry: ps, images`;
        }
        break;

      case "terraform":
        if (!arg || arg === "plan") {
          output = `Terraform will perform the following actions:

  # aws_instance.coffee_machine will be created
  + resource "aws_instance" "coffee_machine" {
      + ami                    = "ami-c0ff33-420"
      + instance_type          = "c6.xlarge"  # for maximum caffeine
      + tags                   = {
          + "Purpose"   = "Keeping DevOps engineers alive"
          + "CostCenter" = "Critical Infrastructure"
        }
    }

  # aws_s3_bucket.prod_backups will be created
  + resource "aws_s3_bucket" "prod_backups" {
      + bucket         = "definitely-not-production-data"
      + acl            = "private"
      + versioning     = true  # because Friday deploys
    }

Plan: 2 to add, 0 to change, 0 to destroy.
Cost estimate: 1 coffee/hour + your sanity`;
        } else if (arg === "apply") {
          output = `Applying infrastructure changes...

aws_instance.coffee_machine: Creating...
aws_instance.coffee_machine: Still creating... [10s elapsed]
aws_instance.coffee_machine: Creation complete after 30s
aws_s3_bucket.prod_backups: Creating...
aws_s3_bucket.prod_backups: Creation complete after 5s

Apply complete! Resources: 2 added, 0 changed, 0 destroyed.

Outputs:
  coffee_status = "brewing"
  deployment_confidence = "it works on my machine"`;
        } else {
          output = `Error: unknown terraform command: ${arg}\nTry: plan, apply`;
        }
        break;

      case "argocd":
        if (arg === "app list" || arg === "app ls") {
          output = `NAME                    SYNC STATUS   HEALTH STATUS
platform-frontend       Synced        Healthy
platform-backend        Synced        Healthy
prometheus-stack        Synced        Healthy
definitely-in-sync      OutOfSync     Degraded
friday-afternoon-deploy Syncing       Progressing
hotfix-that-worked      Synced        Healthy`;
        } else if (arg === "app get platform-frontend") {
          output = `Name:               platform-frontend
Project:            default
Server:             https://kubernetes.default.svc
Namespace:          production
URL:                https://devlinops.com
Repo:               https://github.com/devlinops/platform
Target:             main
Path:               k8s/frontend
SyncWindow:         Sync Allowed
Sync Policy:        Automated
Sync Status:        Synced to main (abc1234)
Health Status:      Healthy`;
        } else {
          output = `Error: unknown argocd command: ${arg}\nTry: app list, app get <name>`;
        }
        break;

      case "vim":
        setVimMode(true);
        output = "Opening vim...";
        setTimeout(() => setInput(""), 100);
        break;

      case "whoami":
        output = `jack@devlinops
├─ Platform Engineer
├─ Kubernetes Enthusiast
├─ Coffee-Driven Developer
├─ GitOps Advocate
├─ MSc AI Student
└─ "It works on my machine" Survivor

Current status: Probably debugging something
Location: ~/projects/make-it-work
Shell: bash (with way too many aliases)`;
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
          <div className="border-b border-green-500/30 pb-2 font-mono text-sm text-green-500">
            <div className="flex items-center justify-between">
              <span>devlinops.tsx [readonly]</span>
              <span>-- NORMAL --</span>
            </div>
          </div>

          {/* Vim content */}
          <div className="flex-1 overflow-auto py-4 font-mono text-sm text-green-400">
            <pre className="whitespace-pre-wrap">{vimContent}</pre>
          </div>

          {/* Vim command line */}
          <div className="border-t border-green-500/30 pt-2 font-mono text-sm">
            <div className="text-green-500">
              <span className="text-green-400">:</span>
              <span className="text-green-300">
                {" "}
                Type :q to quit, :wq to save & quit
              </span>
            </div>
            <div className="mt-2 text-xs text-green-600">
              <p>💡 Pro tip: In real vim, you&apos;d be stuck here forever</p>
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
              className="w-full border-none bg-transparent font-mono text-sm text-green-400 outline-none placeholder:text-green-700"
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
        <div className="w-full max-w-4xl rounded-lg border border-green-500/50 bg-black p-6 shadow-2xl">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between border-b border-green-500/30 pb-2">
            <div className="flex items-center gap-2 font-mono text-sm text-green-500">
              <span className="text-green-400">jack@devlinops</span>
              <span className="text-green-600">~</span>
              <span className="text-green-300">$</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-green-600">Press ESC to close</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-green-500 hover:text-green-300"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Terminal output */}
          <div className="mb-4 max-h-96 overflow-y-auto font-mono text-sm">
            {history.length === 0 && (
              <div className="mb-4 text-green-400">
                <p>DevlinOps Terminal - Interactive Navigation</p>
                <p className="mt-1 text-xs text-green-600">
                  Type 'help' for available commands or 'ls' to see routes
                </p>
              </div>
            )}

            {history.map((item, index) => (
              <div key={index} className="mb-3">
                <div className="text-green-500">
                  <span className="text-green-400">jack@devlinops</span>
                  <span className="text-green-600"> ~ </span>
                  <span className="text-green-300">$ </span>
                  <span>{item.command}</span>
                </div>
                <pre className="mt-1 whitespace-pre-wrap text-green-300/90">
                  {item.output}
                </pre>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="font-mono text-sm text-green-500">
              <span className="text-green-400">jack@devlinops</span>
              <span className="text-green-600"> ~ </span>
              <span className="text-green-300">$ </span>
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border-none bg-transparent font-mono text-sm text-green-400 outline-none placeholder:text-green-700"
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
