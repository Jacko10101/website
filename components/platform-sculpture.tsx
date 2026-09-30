"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";

const layers = [
  { id: "intelligence", label: "AI services", number: "03", title: "Queries and engineering agents.", description: "Clarity answers questions about customer data. Nightshift works on tickets, reviews and incidents. Both use our shared model gateway.", href: "/projects/clarity", cta: "Read about Clarity" },
  { id: "delivery", label: "Developer platform", number: "02", title: "Builds, deployments and tests.", description: "Shared pipelines deliver our services. Heimdall shows the revision and test results in each environment.", href: "/projects/heimdall", cta: "Read about Heimdall" },
  { id: "infrastructure", label: "Infrastructure", number: "01", title: "Running and monitoring the services.", description: "Kubernetes and GitOps manage the workloads. Connected metrics, logs and traces help us investigate them.", href: "/projects/observability", cta: "Read about observability" },
] as const;

function Slab({ y, top, left, right, children }: { y: number; top: string; left: string; right: string; children?: ReactNode }) {
  return <g transform={`translate(0 ${y})`}>
    <path d="M70 170 320 300 320 322 70 192Z" fill={left} stroke="#26342e" strokeOpacity=".14" />
    <path d="M320 300 570 170 570 192 320 322Z" fill={right} stroke="#26342e" strokeOpacity=".14" />
    <path d="M320 40 570 170 320 300 70 170Z" fill={top} stroke="#26342e" strokeOpacity=".22" />
    {children}
  </g>;
}

function Block({ x, y, w = 62, d = 62, h = 26, colour = "paper", children }: { x: number; y: number; w?: number; d?: number; h?: number; colour?: "paper" | "ink" | "orange"; children?: ReactNode }) {
  const palette = { paper: ["#faf9f3", "#deded1", "#eae9df"], ink: ["#34433c", "#1b2821", "#26362d"], orange: ["#e47550", "#b94728", "#cd5836"] }[colour];
  const px = (a: number, b: number) => 320 + (a - b) * .88;
  const py = (a: number, b: number) => 62 + (a + b) * .46;
  const a = [px(x, y), py(x, y)], b = [px(x + w, y), py(x + w, y)], c = [px(x + w, y + d), py(x + w, y + d)], e = [px(x, y + d), py(x, y + d)];
  const points = (...p: number[][]) => p.map(v => v.join(",")).join(" ");
  return <g>
    <polygon points={points([e[0], e[1] - h], [c[0], c[1] - h], c, e)} fill={palette[1]} stroke="#23312a" strokeOpacity=".22" />
    <polygon points={points([b[0], b[1] - h], [c[0], c[1] - h], c, b)} fill={palette[2]} stroke="#23312a" strokeOpacity=".22" />
    <polygon points={points([a[0], a[1] - h], [b[0], b[1] - h], [c[0], c[1] - h], [e[0], e[1] - h])} fill={palette[0]} stroke="#23312a" strokeOpacity=".26" />
    <g transform={`matrix(.88 .46 -.88 .46 320 ${62 - h})`}>{children}</g>
  </g>;
}

export function PlatformSculpture() {
  const [active, setActive] = useState<(typeof layers)[number]["id"]>("delivery");
  const selected = layers.find(layer => layer.id === active)!;
  const id = useId();

  return <div className="platform-sculpture" data-active={active}>
    <div className="sculpture-figure">
      <div className="sculpture-coordinate landing-label">Fig. 01 <span>/</span> Three parts of the platform.</div>
      <svg viewBox="0 0 640 640" className="sculpture-svg" role="img" aria-labelledby={`${id}-title ${id}-description`}>
        <title id={`${id}-title`}>An exploded view of a software platform</title>
        <desc id={`${id}-description`}>Three architectural layers: Kubernetes infrastructure, a developer platform, and AI services. Use the buttons below to explore the projects behind each layer.</desc>
        <defs>
          <pattern id={`${id}-grid`} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#748176" strokeWidth=".6" opacity=".26" /></pattern>
          <linearGradient id={`${id}-shadow`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#394037" stopOpacity=".14" /><stop offset="1" stopColor="#394037" stopOpacity="0" /></linearGradient>
        </defs>
        <path d="M320 350 620 502 320 660 20 502Z" fill={`url(#${id}-grid)`} />
        <path d="M320 370 588 508 320 646 52 508Z" fill={`url(#${id}-shadow)`} />
        <g className="sculpture-guides" fill="none" stroke="#888e7e" strokeWidth="1" strokeDasharray="3 6"><path d="M70 170V510M570 170V510M320 40V380M320 300V620" /></g>
        <g className="sculpture-layer sculpture-infrastructure">
          <Slab y={284} top="#2d3a32" left="#19261e" right="#223027">
            <g transform="matrix(.88 .46 -.88 .46 320 62)" fill="none" stroke="#667b61" strokeWidth="1"><rect x="10" y="10" width="245" height="245" rx="3" />{[45,90,135,180,225].map(n => <path key={n} d={`M${n} 10V255M10 ${n}H255`} opacity=".38" />)}</g>
            <Block x={32} y={38} w={178} d={48} h={22} colour="ink"><path d="M45 56H194M45 66H194" stroke="#718068" strokeWidth="2" /><circle cx="192" cy="76" r="3" fill="#b6cc8b" /></Block>
            <Block x={32} y={106} w={178} d={48} h={22} colour="ink"><path d="M45 124H194M45 134H194" stroke="#718068" strokeWidth="2" /><circle cx="192" cy="144" r="3" fill="#b6cc8b" /></Block>
            <Block x={32} y={174} w={178} d={48} h={22} colour="ink"><path d="M45 192H194M45 202H194" stroke="#718068" strokeWidth="2" /><circle cx="192" cy="212" r="3" fill="#b6cc8b" /></Block>
          </Slab>
          <path d="M86 473 132 497" stroke="#98a58d" strokeWidth="2" />
          <text x="420" y="556" transform="rotate(-27.5 420 556)" fill="#b7c1a9" className="sculpture-etched">01 / INFRASTRUCTURE</text>
        </g>
        <g className="sculpture-layer sculpture-delivery">
          <Slab y={148} top="#eceee3" left="#ccd0c0" right="#dce0d2">
            <g transform="matrix(.88 .46 -.88 .46 320 62)" fill="none" stroke="#a3ac99" strokeWidth="1"><rect x="12" y="12" width="240" height="240" rx="3" /><path d="M65 65H195V195H65ZM65 130H195M130 65V195" strokeDasharray="3 4" /></g>
            <Block x={32} y={32} w={78} d={66} h={23}><text x="70" y="70" textAnchor="middle" className="sculpture-plane-label">BUILD</text><path d="M48 83H93" stroke="#c95130" strokeWidth="3" /></Block>
            <Block x={152} y={32} w={78} d={66} h={23}><text x="190" y="70" textAnchor="middle" className="sculpture-plane-label">TEST</text><path d="M167 83H213" stroke="#c95130" strokeWidth="3" /></Block>
            <Block x={32} y={152} w={78} d={66} h={23}><text x="70" y="190" textAnchor="middle" className="sculpture-plane-label">SHIP</text><path d="M48 203H93" stroke="#c95130" strokeWidth="3" /></Block>
            <Block x={152} y={152} w={78} d={66} h={23} colour="orange"><path d="M170 189h8l8-15 10 29 8-14h10" fill="none" stroke="#fff0dc" strokeWidth="2.5" /></Block>
          </Slab>
          <text x="405" y="433" transform="rotate(-27.5 405 433)" fill="#56664b" className="sculpture-etched">02 / DEVELOPER PLATFORM</text>
        </g>
        <g className="sculpture-layer sculpture-intelligence">
          <Slab y={8} top="#df714d" left="#b94c2d" right="#cc5d39">
            <g transform="matrix(.88 .46 -.88 .46 320 62)"><rect x="12" y="12" width="240" height="240" rx="3" fill="none" stroke="#f4b696" strokeOpacity=".65" /><g fill="none" stroke="#f7c7a6" strokeWidth="1.5"><path d="M74 74H192V192H74ZM74 132H192M132 74V192" /><path d="M35 132H74M192 132H232M132 35V74M132 192V232" /></g>{[[74,74],[192,74],[74,192],[192,192]].map(([x,y]) => <g key={`${x}-${y}`}><circle cx={x} cy={y} r="13" fill="#e58962" stroke="#f4c09e" /><circle cx={x} cy={y} r="3" fill="#ffdec0" /></g>)}</g>
            <Block x={103} y={103} w={60} d={60} h={36} colour="paper"><path d="M117 133h30m-15-15v30m-11-26 22 22m0-22-22 22" stroke="#c85735" strokeWidth="3" /></Block>
          </Slab>
          <text x="443" y="272" transform="rotate(-27.5 443 272)" fill="#fff0d7" className="sculpture-etched">03 / AI SERVICES</text>
        </g>
        <g fill="#7c8171" className="sculpture-marks"><path d="M35 506h12m-6-6v12M593 506h12m-6-6v12" fill="none" stroke="currentColor" /><text x="30" y="544">PLATFORM / EXPLODED VIEW</text><text x="565" y="600">JD—01</text></g>
      </svg>
      <span className="sculpture-margin-note">Explore a layer below.</span>
    </div>
    <div className="sculpture-controls" role="group" aria-label="Explore the platform layers">
      {layers.slice().reverse().map(layer => <button key={layer.id} type="button" aria-pressed={active === layer.id} aria-controls={`${id}-detail`} onClick={() => setActive(layer.id)}><span className="layer-control-number">{layer.number}</span>{layer.label}<span className="layer-control-dot" /></button>)}
    </div>
    <div id={`${id}-detail`} className="sculpture-detail" aria-live="polite"><p><strong>{selected.title}</strong> {selected.description}</p><Link href={selected.href}>{selected.cta} <span aria-hidden>↗</span></Link></div>
  </div>;
}
