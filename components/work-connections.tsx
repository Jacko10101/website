"use client";

import { useState } from "react";
import Link from "next/link";
import { CareerQuery } from "@/components/career-query";
import { inReadingOrder } from "@/lib/projects";

const work = inReadingOrder();
const tools = [...new Set(work.flatMap(project => project.tags))]
  .map(name => ({ name, count: work.filter(project => project.tags.includes(name)).length }))
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
const recurring = tools.filter(tool => tool.count > 1);

export function WorkConnections() {
  const [tool, setTool] = useState("Prometheus");
  const [selected, setSelected] = useState("heimdall");
  const [allTools, setAllTools] = useState(false);
  const project = work.find(item => item.id === selected)!;
  const connected = work.filter(item => item.tags.includes(tool));
  const visibleTools = allTools ? tools : recurring;

  function trace(name: string) {
    setTool(name);
    if (!work.find(item => item.id === selected)?.tags.includes(name)) {
      setSelected(work.find(item => item.tags.includes(name))!.id);
    }
  }

  return <div className="connections ink-surface">
    <header className="connections-header"><span>CONNECTION STUDY / 01</span><span>{work.length} projects · {tools.length} tools</span></header>
    <div className="connections-tools">
      <p className="folio-label">Pick a thread</p>
      <div>{visibleTools.map(item => <button type="button" key={item.name} aria-pressed={tool === item.name} onClick={() => trace(item.name)}>{item.name}<sup>{item.count}</sup></button>)}</div>
      <button type="button" className="connections-expand" aria-expanded={allTools} onClick={() => setAllTools(value => !value)}>{allTools ? "Show shared tools only −" : `All ${tools.length} tools +`}</button>
    </div>
    <div className="connections-board">
      <div className="connections-origin"><span className="folio-label">Following</span><strong>{tool}</strong><span>{connected.length} project{connected.length === 1 ? "" : "s"}</span><span className="connections-origin-note">Select a connected project to inspect the work.</span></div>
      <div className="connections-wires" aria-hidden="true"><svg viewBox={`0 0 240 ${work.length * 60}`} style={{ height: work.length * 60 }} preserveAspectRatio="none">{work.map((item,index) => <path key={item.id} data-lit={item.tags.includes(tool)} data-selected={selected === item.id} d={`M 0 ${work.length * 30} C 120 ${work.length * 30}, 110 ${index*60+30}, 240 ${index*60+30}`} />)}</svg></div>
      <div className="connections-projects" style={{ gridTemplateRows: `repeat(${work.length}, 60px)` }} aria-label="Projects using the selected tool">{work.map((item,index) => <button key={item.id} type="button" disabled={!item.tags.includes(tool)} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}><span>0{index+1}</span><span>{item.id === "ml-scheduler" ? "Recovery research" : item.title}</span><span aria-hidden="true">{selected === item.id ? "↙" : "↗"}</span></button>)}</div>
    </div>
    <div className="connections-evidence" aria-live="polite">
      <div><p className="folio-label">{tool} / {project.year} / {project.status}</p><h3>{project.title}</h3><p>{project.context}</p><Link href={project.href}>Read the case study ↗</Link></div>
      <div><p className="connections-outcome">{project.outcome ?? project.description}</p><dl>{project.stats.map(stat => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl></div>
    </div>
    <footer>Connections come from the tools listed in each case study. They show shared technology, not dependencies between systems.</footer>
  </div>;
}

export function QueryDrawer() {
  const [opened, setOpened] = useState(false);
  return <details className="lab-query-drawer" onToggle={event => setOpened(event.currentTarget.open)}>
    <summary><span>Go one level deeper</span><span>Open the SQL workbench +</span></summary>
    <p>Write your own joins across projects, tools and reported results. This is a real SQLite database running in your browser, using the same read-only validator as the Clarity demo.</p>
    {opened && <CareerQuery />}
  </details>;
}
