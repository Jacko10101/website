"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { profile } from "@/lib/profile";

const layers = [
  { name: "The product", tag: "01 / Heimdall", title: "One screen. Twenty services.", detail: "The dashboard 20+ engineers open every day. Tickets, releases and the state of the pods, brought into the same view.", decision: "Built and operated at Loweconex.", href: "/projects/heimdall", cta: "Open Heimdall" },
  { name: "Delivery", tag: "02 / Pipeline platform", title: "Build once. Let Git take it from here.", detail: "A shared library builds the image. Image Updater changes the GitOps revision. ArgoCD handles the rollout, then PostSync tests what is actually running.", decision: "The build pipeline doesn’t own deployment credentials.", href: "/projects/pipeline-platform", cta: "Read the decision" },
  { name: "Runtime", tag: "03 / Kubernetes", title: "Healthy according to what?", detail: "A green ArgoCD status can hide new pods in a crashloop. Heimdall reads pod state directly, alongside the revision each environment should be running.", decision: "A deployment verdict is only as good as its source.", href: "/projects/heimdall", cta: "See what Heimdall reads" },
  { name: "Signals", tag: "04 / Observability", title: "An incident starts with a Grafana link.", detail: "Prometheus, Grafana and Loki across four environments. Monitoring quoted near £100k a year runs in-house for roughly £5k.", decision: "We already had the cluster capacity. I used it.", href: "/projects/observability", cta: "Read the architecture decision" },
];

function DeliveryDrawing() {
  return <svg viewBox="0 0 720 380" fill="none">
    <path d="M145 172H215M325 172H395M505 172H575" stroke="currentColor" strokeOpacity=".3" />
    {[[35,"Shared CI","build + image"],[215,"Image Updater","GitOps commit"],[395,"ArgoCD","reconcile"],[575,"PostSync","verify"]].map(([x,label,sub]) => <g key={x} transform={`translate(${x},125)`}>
      <rect width="110" height="94" rx="3" fill="#17241f" stroke="currentColor" />
      <path d="M12 16H30M12 23H23" stroke="currentColor" />
      <text x="12" y="51" fill="#e9eee8" fontSize="12">{label}</text>
      <text x="12" y="72" fill="currentColor" fontSize="9">{sub}</text>
    </g>)}
    <text x="35" y="55" fill="currentColor" fontSize="12">DELIVERY / ONE SHARED LIBRARY</text>
    <text x="35" y="328" fill="currentColor" fontSize="11">20 services</text><text x="510" y="328" fill="currentColor" fontSize="11">~400 deploys / month</text>
  </svg>;
}
function RuntimeDrawing() {
  return <svg viewBox="0 0 720 380" fill="none">
    <text x="35" y="45" fill="currentColor" fontSize="12">RUNTIME / FOUR ENVIRONMENTS</text>
    {["DEV","QA","PREPROD","PROD"].map((label,col) => <g key={label} transform={`translate(${35 + col * 172},80)`}>
      <rect width="145" height="230" rx="3" fill="#15211c" stroke="currentColor" strokeOpacity=".7" />
      <text x="15" y="29" fill="currentColor" fontSize="12">{label}</text>
      {Array.from({length:9},(_,i) => <rect key={i} x={15 + i % 3 * 39} y={56 + Math.floor(i / 3) * 44} width="30" height="30" rx="2" fill="currentColor" fillOpacity={.08 + (i % 3) * .07} stroke="currentColor" strokeOpacity=".45" />)}
      <text x="15" y="210" fill="currentColor" fontSize="9">pod state ↗</text>
    </g>)}
    <text x="35" y="349" fill="currentColor" fontSize="10">Schematic / environment layout, not live workload counts</text>
  </svg>;
}
function SignalsDrawing() {
  return <svg viewBox="0 0 720 380" fill="none">
    <text x="35" y="45" fill="currentColor" fontSize="12">OBSERVABILITY / FOLLOW THE EVIDENCE</text>
    {["Metrics","Logs","Dashboards"].map((name,i) => <g key={name} transform={`translate(35,${85 + i * 83})`}>
      <text x="0" y="24" fill="currentColor" fontSize="12">{name}</text>
      <path d="M110 20H200M430 20H580" stroke="currentColor" strokeOpacity=".5" />
      <rect x="200" width="230" height="45" rx="3" fill="#17241f" stroke="currentColor" />
      <text x="219" y="28" fill="#e9eee8" fontSize="14">{["Prometheus + Thanos","Loki","Grafana"][i]}</text>
      <circle cx="594" cy="20" r="9" stroke="currentColor" />
    </g>)}
    <text x="35" y="352" fill="currentColor" fontSize="11">22 dashboards as code / 50+ alerts, a runbook each</text>
  </svg>;
}

export function Hero() {
  const [active,setActive] = useState(0);
  const layer = layers[active];
  const cutaway = useRef<HTMLDivElement>(null);
  function lookUnderneath() {
    setActive(active === 0 ? 1 : 0);
    if (window.matchMedia("(max-width: 767px)").matches) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      cutaway.current?.scrollIntoView({ block: "center", behavior: reduced ? "instant" : "smooth" });
    }
  }
  return <section className="machine-hero" aria-labelledby="machine-title"><div className="container">
    <div className="machine-byline"><h1><Link href="/about" aria-label="About Jack Devlin"><Image src="/jack-photo.jpg" alt="" width={32} height={38} /></Link>Jack Devlin<span> / Platform engineer</span></h1><span>Northern Ireland · {profile.availability.short}</span></div>
    <div className="machine-opening">
      <div className="machine-introduction">
        <p className="machine-kicker">Built. Shipped. Still running.</p>
        <h2 id="machine-title">The work.<br />And everything<br /><span>underneath.</span></h2>
        <p className="machine-lede">I build the platforms behind the product.<br />Here’s one you can look inside.</p>
        <button type="button" className="machine-invitation" onClick={lookUnderneath} aria-controls="machine-detail"><span className="cutaway-icon" aria-hidden><i /><i /><i /></span>{active === 0 ? "Look underneath" : "Back to the surface"}<span aria-hidden>↗</span></button>
      </div>
      <div ref={cutaway} className="machine-cutaway" data-layer={active} aria-hidden="true">
        <div className="cutaway-registration"><span>FIG. 01 / THE PLATFORM</span><span>{active === 0 ? "ASSEMBLED" : "SECTION VIEW"}</span></div>
        <div className="cutaway-datum datum-top" /><div className="cutaway-datum datum-bottom" />
        <div className="cutaway-plane plane-signals"><SignalsDrawing /></div>
        <div className="cutaway-plane plane-runtime"><RuntimeDrawing /></div>
        <div className="cutaway-plane plane-delivery"><DeliveryDrawing /></div>
        <div className="cutaway-plane plane-product"><div className="product-chrome"><span>HEIMDALL</span><span>THE VIEW FROM ABOVE ↗</span></div><Image src="/heimdall/dashboard.png" alt="" width={2192} height={1810} sizes="(min-width: 1024px) 60vw, 100vw" priority /></div>
        <span className="cutaway-coordinate">{String(active + 1).padStart(2,"0")} / 04</span>
        <span className="cutaway-caption">Select a layer. Follow the decision into the case study.</span>
      </div>
    </div>
    <div className="machine-inspector">
      <div className="machine-depths" role="group" aria-label="Explore the platform layers">{layers.map((item,index) => <button key={item.name} type="button" aria-pressed={active === index} aria-controls="machine-detail" onClick={() => setActive(index)}><span>0{index + 1}</span>{item.name}<span aria-hidden>↗</span></button>)}</div>
      <div className="machine-detail" id="machine-detail" aria-live="polite" aria-atomic="true"><div><p className="folio-label">{layer.tag}</p><h3>{layer.title}</h3></div><div><p>{layer.detail}</p><p className="machine-decision">↳ {layer.decision}</p><Link href={layer.href} className="quiet-link">{layer.cta}<span aria-hidden>↗</span></Link></div></div>
    </div>
    <div className="machine-next"><a href="#selected-work">Continue into the work <span aria-hidden>↓</span></a><a href="/cv.pdf" download="jack-devlin-cv.pdf">Download CV ↗</a></div>
  </div></section>;
}
