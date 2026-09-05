"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { profile } from "@/lib/profile";
import { BUILD, formatBuildDate } from "@/lib/build-info";

type CommandGroup = "Navigation" | "Cluster theatre" | "Diversions" | "Session";

interface CommandSpec {
  /** The canonical name, and the thing `help` lists. */
  name: string;
  /** Spellings that also work. Tab completes them; help doesn't repeat them. */
  aliases?: string[];
  /** How it reads in help, including any argument. */
  usage: string;
  blurb: string;
  group: CommandGroup;
}

/**
 * One table drives tab completion and `help`, so the two can't drift apart.
 * Adding a command here is the only step.
 */
const COMMAND_TABLE: CommandSpec[] = [
  { name: "ls", usage: "ls [path]", blurb: "List the routes on this site", group: "Navigation" },
  { name: "cd", usage: "cd <path>", blurb: "Go to a route", group: "Navigation" },
  { name: "cat", usage: "cat <path>", blurb: "Same as cd. Try 'cat .secrets'", group: "Navigation" },
  { name: "pwd", usage: "pwd", blurb: "Print the page you're on", group: "Navigation" },
  { name: "projects", aliases: ["about", "home"], usage: "projects · about · home", blurb: "Go straight there. The first thing everyone types", group: "Navigation" },

  { name: "kubectl", usage: "kubectl <args>", blurb: "get pods, get nodes, get deployments", group: "Cluster theatre" },
  { name: "argocd", usage: "argocd <args>", blurb: "app list, app get devlinops-site", group: "Cluster theatre" },
  { name: "terraform", usage: "terraform <args>", blurb: "plan, apply", group: "Cluster theatre" },
  { name: "docker", usage: "docker ps", blurb: "Containers, allegedly", group: "Cluster theatre" },
  { name: "git", usage: "git <args>", blurb: "status, log, blame", group: "Cluster theatre" },

  {
    name: "oncall",
    aliases: ["snake", "play"],
    usage: "oncall",
    blurb: "Take the pager. Five incidents, one shift",
    group: "Diversions",
  },
  {
    name: "chaos",
    aliases: ["chaos-monkey"],
    usage: "chaos",
    blurb: "Turn the chaos monkey loose on this page",
    group: "Diversions",
  },
  { name: "neofetch", usage: "neofetch", blurb: "The build that's serving you this page", group: "Diversions" },
  { name: "sudo", usage: "sudo <cmd>", blurb: "If you must", group: "Diversions" },
  { name: "rm", usage: "rm -rf /", blurb: "Best not", group: "Diversions" },

  { name: "whoami", usage: "whoami", blurb: "Who you're talking to", group: "Session" },
  { name: "cv", aliases: ["resume"], usage: "cv", blurb: "Open cv.pdf", group: "Session" },
  { name: "hire", aliases: ["contact"], usage: "hire", blurb: "Go to /contact", group: "Session" },
  { name: "history", usage: "history", blurb: "Commands you've run", group: "Session" },
  { name: "clear", usage: "clear", blurb: "Clear the terminal", group: "Session" },
  { name: "exit", aliases: ["quit"], usage: "exit", blurb: "Close the terminal", group: "Session" },
  { name: "help", usage: "help", blurb: "This", group: "Session" },
];

/** Everything tab completion will offer, aliases included. */
const COMMANDS = COMMAND_TABLE.flatMap((c) => [c.name, ...(c.aliases ?? [])]);

const GROUP_ORDER: CommandGroup[] = ["Navigation", "Cluster theatre", "Diversions", "Session"];

/** `help` is generated, never hand-written, so it can't omit a working command. */
const HELP_TEXT = (() => {
  const width = Math.max(...COMMAND_TABLE.map((c) => c.usage.length));
  const blocks = GROUP_ORDER.map((group) => {
    const rows = COMMAND_TABLE.filter((c) => c.group === group)
      .map((c) => `    ${c.usage.padEnd(width)}   ${c.blurb}`)
      .join("\n");
    return `  ${group}:\n${rows}`;
  });
  return [
    "Available commands:",
    "",
    blocks.join("\n\n"),
    "",
    "  Tab completes commands and paths. Up and down walk your history.",
  ].join("\n");
})();

/** The logo, one row per line, padded so facts line up beside it. */
const NEOFETCH_ART = [
  "       ████████████████████        ",
  "    ████████████████████████████   ",
  "  ██████████████████████████████   ",
  " █████████     ████     █████████  ",
  "████████  ████  ███  ███  ████████ ",
  "████████  ████  ███  ███  ████████ ",
  "████████  ████  ███  ███  ████████ ",
  "████████  ████  ███  ███  ████████ ",
  "████████  ████  ███  ███  ████████ ",
  " █████████     ████     █████████  ",
  "  ██████████████████████████████   ",
  "    ████████████████████████████   ",
  "       ████████████████████",
];

export function CliNavigation() {
  // Opens on mount if the header's terminal button was pressed before this
  // component had loaded (it arrives after the page is idle).
  const [isOpen, setIsOpen] = useState(() => {
    const asked = window.__cliRequested === true;
    window.__cliRequested = false;
    return asked;
  });
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ command: string; output: string }[]>([]);
  /**
   * Tab-completion candidates live outside `history` on purpose: a half-typed
   * fragment isn't a command you ran, so it shouldn't come back on ArrowUp.
   */
  const [completions, setCompletions] = useState<string | null>(null);
  /** Position when walking back through history with the arrow keys. */
  const [recallIndex, setRecallIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Routes
  const routes: Record<string, { path: string; description: string }> = {
    "/": { path: "/", description: "Homepage" },
    "/about": { path: "/about", description: "About Jack Devlin" },
    "/projects": { path: "/projects", description: "Case studies and portfolio" },
    "/projects/clarity": { path: "/projects/clarity", description: "Clarity · natural-language database interface" },
    "/projects/ai-gateway": { path: "/projects/ai-gateway", description: "AI gateway · one endpoint for every model" },
    "/projects/heimdall": { path: "/projects/heimdall", description: "Heimdall · deployment intelligence" },
    "/projects/pipeline-platform": { path: "/projects/pipeline-platform", description: "Pipeline platform · shared CI/CD" },
    "/projects/observability": { path: "/projects/observability", description: "Self-hosted observability stack" },
    "/projects/smart-home": { path: "/projects/smart-home", description: "Smart home on K3s" },
    "/lab": { path: "/lab", description: "Take the pager, query the database" },
    "/contact": { path: "/contact", description: "Email, or the form" },
  };

  // Easter eggs — every number here is measured elsewhere on the site.
  const secrets = [
    "preferred_stack: Kubernetes, ArgoCD, Prometheus",
    "clarity_tenants: ~30, a database each",
    "deploy_rate: ~400/month across the platform",
    "heimdall_daily_users: 20+",
    `msc_ai: ${profile.msc.result ?? "submitted"}, ${profile.msc.status}`,
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with /
      const active = document.activeElement as HTMLElement | null;
      // A modal already on screen owns the keyboard. Opening the terminal
      // behind the on-call game used to steal focus and eat its shortcuts.
      const modalOpen = document.querySelector('[role="dialog"]') !== null;
      if (
        e.key === "/" &&
        !isOpen &&
        !modalOpen &&
        active?.tagName !== "INPUT" &&
        active?.tagName !== "TEXTAREA" &&
        !active?.isContentEditable
      ) {
        e.preventDefault();
        setIsOpen(true);
      }

      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setInput("");
        setCompletions(null);
      }
    };

    const handleOpen = () => setIsOpen(true);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("devlinops:cli", handleOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("devlinops:cli", handleOpen);
    };
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
  }, [history, completions]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  /**
   * Take the page behind the terminal out of the tab order entirely, so
   * Shift+Tab reaches the close button instead of disappearing into a page
   * the user can't see.
   */
  useEffect(() => {
    if (!isOpen) return;
    const overlay = overlayRef.current;
    const returnFocusTo = document.activeElement as HTMLElement | null;
    const madeInert: HTMLElement[] = [];

    Array.from(document.body.children).forEach((child) => {
      if (!(child instanceof HTMLElement)) return;
      if (overlay && (child === overlay || child.contains(overlay))) return;
      if (child.hasAttribute("inert")) return;
      child.setAttribute("inert", "");
      madeInert.push(child);
    });

    return () => {
      madeInert.forEach((el) => el.removeAttribute("inert"));
      returnFocusTo?.focus?.();
    };
  }, [isOpen]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const parts = trimmed.split(" ");
    const command = parts[0];
    const arg = parts.slice(1).join(" ");

    setCompletions(null);

    let output = "";

    switch (command) {
      case "help":
        output = HELP_TEXT;
        break;

      case "ls": {
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
      }

      case "cd":
      case "cat": {
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
      }

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
        if (!arg || arg === "ps" || arg === "ps -a") {
          output = `CONTAINER ID   IMAGE             STATUS        PORTS                    NAMES
a1b2c3d4e5f6   devlinops/site    Up 42 days    0.0.0.0:3000->3000/tcp   site
f6e5d4c3b2a1   prom/prometheus   Up 100 days   0.0.0.0:9090->9090/tcp   prometheus
1234567890ab   grafana/grafana   Up 100 days   0.0.0.0:3001->3000/tcp   yet_another_dashboard
deadbeef1337   postgres:15       Up 200 days   5432/tcp                 postgres
cafecafe0042   redis:alpine      Up 50 days    6379/tcp                 redis`;
        } else {
          output = `Error: unknown docker command: ${arg}\nTry: ps`;
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

This terminal is a prop. It doesn't get apply access to anything.
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
Sync Status:        Synced to main (${BUILD.shortSha ?? "unknown"})
Health Status:      Healthy`;
        } else {
          output = `Error: unknown argocd command: ${arg}\nTry: app list, app get devlinops-site`;
        }
        break;

      case "whoami":
        output = `jack@devlinops
├─ Platform engineer
├─ Kubernetes, ArgoCD, LiteLLM · by choice
├─ ${profile.msc.label}${profile.msc.result ? `, ${profile.msc.result}` : ""}, ${profile.msc.status}
└─ ${profile.availability.short}

Location: Northern Ireland · ${profile.lookingFor.locations.toLowerCase()}
Citizenship: Irish + British — no sponsorship needed in the EU or UK
Shell: bash, with more aliases than is strictly dignified`;
        break;

      case "cv":
      case "resume":
        window.open("/cv.pdf", "_blank", "noopener,noreferrer");
        output = `opening cv.pdf …
One page. Every claim on it has a case study behind it at /projects.`;
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
Every section of this page is a pod. Watch them die, then watch
ArgoCD put them back from git. Esc stops it early.`;
        setTimeout(() => {
          setIsOpen(false);
          window.dispatchEvent(new Event("devlinops:chaos"));
        }, 900);
        break;

      case "neofetch": {
        // Every line on the right comes from lib/build-info.ts, which is
        // populated by git at build time. No invented package counts.
        const facts = [
          "jack@devlinops",
          "──────────────────",
          "OS: devlinops.com · versioned by commit, not by marketing",
          `Commit: ${BUILD.shortSha ?? "unknown"}`,
          `Branch: ${BUILD.branch ?? "unknown"}`,
          `Shipped: ${formatBuildDate(BUILD.time) ?? "unknown"}`,
          `Source: ${BUILD.repoUrl?.replace("https://", "") ?? "unknown"}`,
          "Terminal: cli-navigation.tsx",
          "Day job: ~400 deploys/month, ~30 AI tenants in prod",
          "Stack: K8s, ArgoCD, AWS, LiteLLM, Spring AI",
          `Status: ${profile.availability.short}`,
        ];
        output =
          "\n" +
          NEOFETCH_ART.map((row, i) => `${row}${facts[i] ?? ""}`).join("\n");
        break;
      }

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
          output = `It was me. It's my website. It's always me.`;
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
sudo: superfluous. You're already root here, although it's my
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

      case "home":
      case "projects":
      case "about": {
        const path = command === "home" ? "/" : `/${command}`;
        router.push(path);
        output = `Navigating to ${path}...`;
        setTimeout(() => setIsOpen(false), 500);
        break;
      }

      case "hire":
      case "contact":
        router.push("/contact");
        output = `Redirecting to /contact...
The form does actually send, and I read everything that comes through it.`;
        setTimeout(() => setIsOpen(false), 1000);
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
      setRecallIndex(null);
      executeCommand(input);
    }
  };

  /** Longest shared prefix, so tab behaves like a real shell on ambiguity. */
  const commonPrefix = (options: string[]) =>
    options.reduce((prefix, option) => {
      let i = 0;
      while (i < prefix.length && i < option.length && prefix[i] === option[i]) i++;
      return prefix.slice(0, i);
    }, options[0] ?? "");

  const handleTab = () => {
    const parts = input.split(" ");
    const word = parts[parts.length - 1];
    const takesPath = ["cd", "ls", "cat"].includes(parts[0]) && parts.length > 1;

    const candidates = (takesPath ? Object.keys(routes) : COMMANDS).filter((c) =>
      c.startsWith(word)
    );
    if (candidates.length === 0) return;

    const completion =
      candidates.length === 1 ? candidates[0] : commonPrefix(candidates);
    if (completion.length > word.length || candidates.length === 1) {
      parts[parts.length - 1] = completion;
      setInput(parts.join(" ") + (candidates.length === 1 ? " " : ""));
      setCompletions(null);
      return;
    }
    // Ambiguous and nothing more to share — print the options, like bash does.
    setCompletions(candidates.join("  "));
  };

  /** Walk back and forth through previously run commands. */
  const recall = (direction: -1 | 1) => {
    if (history.length === 0) return;
    const next =
      recallIndex === null
        ? history.length - 1
        : Math.min(history.length - 1, Math.max(0, recallIndex + direction));

    if (recallIndex !== null && direction === 1 && recallIndex === history.length - 1) {
      setRecallIndex(null);
      setInput("");
      return;
    }
    setRecallIndex(next);
    setInput(history[next].command);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Tab completes. Shift+Tab is left alone so the close button stays
    // reachable from the keyboard.
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      handleTab();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      recall(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      recall(1);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Command line navigation"
      onClick={(e) => {
        // A click on the backdrop closes it; a click inside the terminal does not.
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <div
        className="container mx-auto flex h-full items-center justify-center px-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsOpen(false);
        }}
      >
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
                className="-m-2 flex h-10 w-10 items-center justify-center rounded text-muted-foreground transition-colors duration-150 hover:text-foreground active:text-primary"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Terminal output */}
          <div ref={outputRef} tabIndex={0} role="log" aria-live="polite" className="mb-4 max-h-96 overflow-y-auto font-mono text-sm">
            {history.length === 0 && (
              <div className="mb-4 text-foreground/90">
                <p>devlinops.com · interactive shell</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Type &apos;help&apos; for available commands or &apos;ls&apos; to see routes
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

            {completions && (
              <pre className="mb-3 whitespace-pre-wrap text-foreground/60">
                {completions}
              </pre>
            )}
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
              onKeyDown={handleKeyDown}
              className="flex-1 border-none bg-transparent font-mono text-sm text-foreground caret-primary outline-none placeholder:text-muted-foreground"
              placeholder="type a command... (try 'help', tab completes)"
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
