"use client";

import { useEffect, useState } from "react";

type Request = { id: string; name: string; type: string; start: number; duration: number; bytes: number; sameOrigin: boolean };

function readRequests(): Request[] {
  return (performance.getEntriesByType("resource") as PerformanceResourceTiming[]).map((entry, index) => {
    const url = new URL(entry.name);
    return { id: `${entry.name}-${index}`, name: url.pathname.split("/").pop() || url.hostname, type: entry.initiatorType, start: entry.startTime, duration: entry.duration, bytes: entry.transferSize, sameOrigin: url.origin === location.origin };
  }).sort((a, b) => a.start - b.start);
}

export function RequestWaterfall() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const refresh = () => setRequests(readRequests());
    // The browser owns this buffer; read its initial contents and subsequent entries.
    refresh();
    try {
      const observer = new PerformanceObserver(refresh);
      observer.observe({ type: "resource", buffered: true });
      return () => observer.disconnect();
    } catch { /* The initial snapshot remains useful without observer support. */ }
  }, [paused]);

  const visible = requests.filter(item => filter === "all" || (filter === "code" ? ["script", "link", "css"].includes(item.type) : ["fetch", "xmlhttprequest"].includes(item.type))).slice(-60);
  const origin = visible[0]?.start ?? 0;
  const end = Math.max(origin + 1, ...visible.map(item => item.start + item.duration));
  const span = end - origin;
  const detail = visible.find(item => item.id === selected);

  return <div className="waterfall ink-surface">
    <header><div><span className="waterfall-led" data-paused={paused} />{paused ? "SNAPSHOT" : "RECORDING"} / THIS DOCUMENT</div><button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? "Resume recording" : "Freeze view"}</button></header>
    <div className="waterfall-intro"><h3>The page leaves a trail.</h3><p>Scripts, fonts, images, queries. Every line below is a request your browser recorded. Select one to look closer.</p></div>
    <div className="waterfall-toolbar"><div aria-label="Filter requests">{["all", "code", "fetch"].map(value => <button type="button" key={value} aria-pressed={filter === value} onClick={() => {setFilter(value);setSelected(null);}}>{value === "all" ? "Everything" : value === "code" ? "Code & styles" : "Fetch / data"}</button>)}</div><span>{visible.length} shown / {requests.length} recorded</span></div>
    <div className="waterfall-axis"><span>Request / duration</span><span>+{(origin/1000).toFixed(2)}s</span><span>+{(end/1000).toFixed(2)}s</span></div>
    <div className="waterfall-rows" tabIndex={0} role="region" aria-label="Request timeline">
      {visible.length === 0 && <p className="waterfall-empty">No recorded requests in this group yet.</p>}
      {visible.map(item => <button type="button" key={item.id} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)} className="waterfall-row"><span><span title={item.name}>{item.name}</span><small>{item.type} · {item.duration.toFixed(1)}ms</small></span><span className="waterfall-track" aria-hidden="true"><i style={{left:`${(item.start-origin)/span*100}%`, width:`${Math.max(.4,item.duration/span*100)}%`}} /></span></button>)}
    </div>
    <div className="waterfall-detail" aria-live="polite">{detail ? <><strong>{detail.name}</strong><span>Started +{(detail.start/1000).toFixed(3)}s</span><span>{detail.duration.toFixed(1)}ms elapsed</span><span>{detail.bytes ? `${(detail.bytes/1024).toFixed(1)} KB transferred` : "Transfer size unavailable or served from cache"}</span><span>{detail.sameOrigin ? "Same origin" : "External origin"}</span></> : <p>Select a request. These are measured timings, including any time spent waiting for the browser to schedule it.</p>}</div>
    <footer>Latest 60 matching entries in the browser’s resource buffer. Timings are relative to this document’s navigation; client-side page changes share the same recording. Cross-origin details may be restricted.</footer>
  </div>;
}
