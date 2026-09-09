"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { profile } from "@/lib/profile";
import { BUILD, formatBuildDate } from "@/lib/build-info";
import { inReadingOrder } from "@/lib/projects";
import { useModalFocus } from "@/components/use-modal-focus";

const projects = inReadingOrder();
const paths = ["/", "/about", "/projects", ...projects.map(p => p.href), "/lab", "/contact"];
const commands = ["help", "ls", "inspect", "compare", "cd", "cat", "pwd", "home", "projects", "about", "oncall", "sql", "chaos", "neofetch", "git", "whoami", "cv", "contact", "history", "clear", "exit"];
const help = `EXPLORE
  inspect <project>  The decision, outcome and evidence
  compare            The platform's projects, side by side
  ls                 Every route, including the research
  cd <path>          Open a page

USE THE TOOLS
  oncall             Take the pager
  sql                Query the portfolio database
  chaos              Watch this page recover from failure

ABOUT THIS SESSION
  whoami             Jack's background and availability
  neofetch           The actual build serving this page
  git status         Build provenance
  cv · contact       Get in touch
  history · clear · exit

Tab completes commands, project names and paths.
↑ ↓ recalls commands. Escape closes the workbench.`;

type Entry = { command: string; output: string; href?: string };

export function CliNavigation() {
  const [open,setOpen] = useState(() => { const asked = window.__cliRequested === true; window.__cliRequested = false; return asked; });
  const [input,setInput] = useState("");
  const [history,setHistory] = useState<Entry[]>([]);
  const [completion,setCompletion] = useState("");
  const [recall,setRecall] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const output = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useModalFocus(open,root,inputRef);

  useEffect(() => {
    const launch = () => { window.__cliRequested = false; if (!document.querySelector('[role="dialog"]')) setOpen(true); };
    const key = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === "Escape" && open) { setOpen(false); setInput(""); setCompletion(""); }
      if (event.key === "/" && !open && !event.metaKey && !event.ctrlKey && !target.closest('input, textarea, select, [contenteditable="true"]') && !document.querySelector('[role="dialog"]')) { event.preventDefault(); launch(); }
    };
    window.addEventListener("devlinops:cli",launch);
    window.addEventListener("keydown",key);
    return () => { window.removeEventListener("devlinops:cli",launch); window.removeEventListener("keydown",key); };
  },[open]);
  useEffect(() => { output.current?.scrollTo({top:output.current.scrollHeight}); },[history,completion]);

  function navigate(path: string) { setOpen(false); router.push(path); }
  function handoff(event: "devlinops:oncall" | "devlinops:chaos") {
    setOpen(false);
    // Let the terminal release its modal focus before the next surface opens.
    window.setTimeout(() => { if (event === "devlinops:oncall") window.__oncallRequested = true; window.dispatchEvent(new Event(event)); },0);
  }
  function execute(raw: string) {
    const text = raw.trim();
    if (!text) return;
    const [command,...rest] = text.toLowerCase().split(/\s+/);
    const arg = rest.join(" ");
    let result = "";
    let href: string | undefined;
    setInput(""); setCompletion(""); setRecall(null);
    switch (command) {
      case "help": result = help; break;
      case "ls": result = paths.join("\n"); break;
      case "pwd": result = window.location.pathname; break;
      case "inspect": {
        const project = projects.find(p => p.id === arg || p.title.toLowerCase() === arg);
        if (!project) { result = `Choose a project:\n${projects.map(p => `  inspect ${p.id}`).join("\n")}`; break; }
        result = `${project.title}\n${project.subtitle}\n\n${project.context ?? ""}\n\n${project.outcome ?? project.description}\n\n${project.stats.map(s => `${s.value} · ${s.label}`).join("\n")}\n\n${project.tags.join(" / ")}`;
        href = project.href;
        break;
      }
      case "compare": result = projects.map(p => `${p.title}\n  ${p.stats[0].value} · ${p.stats[0].label}\n  ${p.href}`).join("\n\n"); break;
      case "cd": case "cat": {
        const path = arg === "~" || arg === ".." ? "/" : arg.startsWith("/") ? arg : `/${arg}`;
        if (!arg) result = `${command} <path> · use ls to list routes`;
        else if (paths.includes(path)) navigate(path);
        else result = `No route at ${path}.\nUse ls to see what's here.`;
        break;
      }
      case "home": navigate("/"); break;
      case "projects": case "about": case "contact": navigate(`/${command}`); break;
      case "hire": navigate("/contact"); break;
      case "oncall": case "play": case "snake": handoff("devlinops:oncall"); break;
      case "sql": navigate("/lab#query"); break;
      case "chaos": case "chaos-monkey": handoff("devlinops:chaos"); break;
      case "whoami": result = `Jack Devlin\nPlatform engineer · Northern Ireland\n\n${profile.msc.label}\n${profile.msc.result ?? ""} · ${profile.msc.status}\n\n${profile.availability.short}\nIrish + British citizenship\n${profile.lookingFor.locations}\n\njack@devlinops.com`; href = "/about"; break;
      case "neofetch": case "git": result = `DEVLINOPS / BUILD RECORD\n\ncommit   ${BUILD.shortSha ?? "unavailable"}\nbranch   ${BUILD.branch ?? "unavailable"}\nbuilt    ${formatBuildDate(BUILD.time) ?? "unavailable"}\nsource   ${BUILD.repoUrl ?? "unavailable"}\nroute    ${window.location.pathname}\n\nThis identifies the build; it does not inspect a working checkout.`; break;
      case "cv": case "resume": window.open("/cv.pdf","_blank","noopener,noreferrer"); result = "Opened Jack's CV."; break;
      case "history": result = history.map((entry,index) => `${index+1}  ${entry.command}`).join("\n") || "No commands yet."; break;
      case "clear": setHistory([]); return;
      case "exit": case "quit": setOpen(false); return;
      case "kubectl": case "argocd": case "terraform": case "docker": result = `This workbench explores the work behind those tools.\n\nTry inspect pipeline-platform, inspect heimdall, or oncall.`; break;
      case "sudo": case "rm": result = "No destructive shell here. Try chaos to watch the page recover."; break;
      default: result = `Unknown command: ${command}\nTry help, or choose a project on the left.`;
    }
    if (result) setHistory(entries => [...entries.slice(-49),{command:text,output:result,href}]);
    inputRef.current?.focus();
  }
  function key(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Tab" && !event.shiftKey) {
      const words = input.split(" ");
      const fragment = words[words.length-1];
      const choices = words.length === 1 ? commands : words[0] === "inspect" ? projects.map(p => p.id) : paths;
      const matches = choices.filter(value => value.startsWith(fragment));
      if (!matches.length) return;
      event.preventDefault();
      if (matches.length === 1) { words[words.length-1] = matches[0]; setInput(words.join(" ") + (words.length === 1 ? " " : "")); setCompletion(""); }
      else setCompletion(matches.join("   "));
    } else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      if (!history.length) return;
      event.preventDefault();
      const index = event.key === "ArrowUp" ? Math.max(0,(recall ?? history.length)-1) : Math.min(history.length,(recall ?? history.length)+1);
      setRecall(index === history.length ? null : index); setInput(history[index]?.command ?? "");
    } else if (event.key === "l" && event.ctrlKey) { event.preventDefault(); setHistory([]); }
  }
  if (!open) return null;
  return createPortal(<div ref={root} tabIndex={-1} className="surface-overlay" role="dialog" aria-modal="true" aria-label="Command line navigation" onClick={event => {if(event.target === event.currentTarget) setOpen(false);}}>
    <div className="workbench-shell">
      <header className="surface-titlebar"><div><span className="surface-index">01</span><strong>Workbench</strong><span className="surface-subtitle">devlinops / explore the work</span></div><button type="button" onClick={() => setOpen(false)} aria-label="Close terminal">Esc <span aria-hidden>×</span></button></header>
      <div className="workbench-body"><aside className="workbench-index"><p className="folio-label">The systems</p>{projects.map((project,index) => <button type="button" key={project.id} onClick={() => execute(`inspect ${project.id}`)}><span>0{index+1}</span>{project.title}<span aria-hidden>↗</span></button>)}<p className="workbench-index-note">Every entry opens the decision, the result and the evidence.</p></aside>
      <div className="workbench-console"><div ref={output} className="workbench-output" tabIndex={0} role="log" aria-live="polite" aria-label="Command output">
        {!history.length && <div className="workbench-welcome"><p className="folio-label">A different way through</p><h2>Go straight<br />to the working.</h2><p>Inspect a system, compare the projects, or take over the pager.</p><div>{["inspect heimdall","compare","oncall","sql"].map(cmd => <button type="button" key={cmd} onClick={() => execute(cmd)}>{cmd}<span aria-hidden>↵</span></button>)}</div></div>}
        {history.map((entry,index) => <div className="workbench-entry" key={index}><p><span aria-hidden>↳ </span>{entry.command}</p><pre>{entry.output}</pre>{entry.href && <button type="button" className="workbench-evidence" onClick={() => navigate(entry.href!)}>Open the case study ↗</button>}</div>)}
        {completion && <p className="workbench-completions">{completion}</p>}
      </div><form className="workbench-prompt" onSubmit={event => {event.preventDefault();execute(input);}}><label htmlFor="workbench-input">devlinops <span aria-hidden>❯</span></label><input id="workbench-input" ref={inputRef} value={input} onChange={event => setInput(event.target.value)} onKeyDown={key} autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="inspect heimdall" aria-label="Terminal command" /><button type="submit" aria-label="Run command">↵</button></form></div></div>
      <footer className="workbench-status"><span>LOCAL SESSION / {BUILD.shortSha ?? "development"}</span><span>Tab complete · ↑↓ history · help</span></footer>
    </div>
  </div>,document.body);
}
