import Image from "next/image";
import { GitBranch, Package, Container, ShieldCheck, Radio, Home, Lightbulb, Power, KeyRound, Network, Cpu, MessageSquare } from "lucide-react";

const covers = {
  nightshift: { tag: "NIGHTSHIFT", title: "A little less in the queue.", note: "From a well-scoped ticket to a change you can review." },
  "pipeline-platform": { tag: "DELIVERY", title: "One path. Fewer surprises.", note: "A shared route from source to running software." },
  observability: { tag: "OBSERVABILITY", title: "Follow the signal.", note: "Metrics, traces and logs. One investigation." },
  "ai-gateway": { tag: "AI INFRASTRUCTURE", title: "Every call has a home.", note: "Access, budgets and usage in one place." },
  "smart-home": { tag: "AFTER HOURS", title: "Yes, the lights need a cluster.", note: "A small platform with a very local user base." },
  "ml-scheduler": { tag: "RESEARCH", title: "Room for what matters.", note: "Kubernetes recovery under limited capacity." },
};

function CoverDrawing({ id }: { id: string }) {
  if (id === "nightshift") return <div className="cover-ticket-art"><div className="cover-ticket"><span>ENGINEERING / READY</span><strong>A well-scoped ticket</strong><i /><i /></div><span className="cover-ticket-connector">↗</span><div className="cover-draft"><span>↳ DRAFT PULL REQUEST</span><div><b>+</b><i /></div><div><b>+</b><i /></div><small>✓ Checks attached · ready for review</small></div></div>;
  if (id === "observability") return <div className="cover-signal-art"><div><span>METRICS</span><svg viewBox="0 0 280 32" fill="none"><path d="M0 26L25 25L38 27L53 25L62 8L73 4L84 13L97 10L106 21L120 24L140 22L160 25L180 23L200 24L230 23L280 24" stroke="currentColor" strokeWidth="1.7" /></svg></div><div><span>TRACES</span><svg viewBox="0 0 280 32"><rect x="48" y="3" width="130" height="5" rx="2" fill="currentColor" opacity=".7" /><rect x="63" y="12" width="42" height="5" rx="2" fill="currentColor" opacity=".5" /><rect x="81" y="21" width="72" height="5" rx="2" fill="currentColor" opacity=".8" /></svg></div><div><span>LOGS</span><svg viewBox="0 0 280 32" stroke="currentColor" strokeWidth="3"><path d="M5 6H15M23 6H166M5 15H15M23 15H213M5 24H15M23 24H139" opacity=".35" /></svg></div></div>;
  if (id === "ml-scheduler") return <div className="cover-capacity-art"><div className="capacity-node capacity-lost"><span>NODE LOST</span><div>{Array.from({ length: 6 }, (_, i) => <i key={i} />)}</div></div><span>→</span><div className="capacity-node"><span>SURVIVING CAPACITY</span><div>{Array.from({ length: 12 }, (_, i) => <i key={i} data-filled={i < 9} />)}</div></div></div>;
  const items = id === "pipeline-platform"
    ? [[GitBranch, "Commit"], [Package, "Build"], [Container, "Deploy"], [ShieldCheck, "Verify"]] as const
    : id === "smart-home"
      ? [[Power, "Switch"], [Radio, "Zigbee"], [Home, "Home"], [Lightbulb, "Light"]] as const
      : [[MessageSquare, "Feature"], [KeyRound, "Identity"], [Network, "Gateway"], [Cpu, "Model"]] as const;
  return <div className="cover-flow">{items.map(([Icon, label]) => <div key={label}><span className="cover-node"><Icon size={19} strokeWidth={1.4} /></span><span>{label}</span></div>)}</div>;
}

export function ProjectCover({ id }: { id: string }) {
  if (id === "heimdall" || id === "clarity") return <div className={`project-cover cover-${id}`}><div className="cover-browser"><div className="browser-bar"><span /><span /><span /><p>{id === "heimdall" ? "A clearer view of the release" : "A question, with the answer behind it"}</p></div><Image src={id === "heimdall" ? "/heimdall/dashboard.png" : "/clarity/answer-with-sql.png"} alt={id === "heimdall" ? "Heimdall’s release dashboard" : "Clarity’s answer and the SQL behind it"} width={id === "heimdall" ? 2192 : 2000} height={id === "heimdall" ? 1810 : 1025} sizes="(min-width: 1000px) 600px, 90vw" /></div></div>;
  const item = covers[id as keyof typeof covers] ?? covers.nightshift;
  return <div className={`project-cover diagram-cover cover-${id}`} aria-hidden="true"><span className="cover-tag">{item.tag}</span><p className="cover-title">{item.title}</p><CoverDrawing id={id} /><p className="cover-note">{item.note}</p></div>;
}
