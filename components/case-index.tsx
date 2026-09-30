import Link from "next/link";
import { ProjectCover } from "@/components/project-cover";
import { caseStories } from "@/lib/case-studies";
import { projects } from "@/lib/projects";

const featured = ["nightshift", "heimdall", "pipeline-platform", "clarity"];
export function CaseIndex() {
  return <section id="selected-work" className="work-section container">
    <div className="section-heading"><div><p className="overline">Selected work</p><h2>Four things I’ve built<br />that people use.</h2></div><p>All four run at Loweconex.</p></div>
    <div className="featured-work">{featured.map((id, index) => { const item = caseStories[id]; return <article className={`work-feature work-feature-${id}`} key={id}>
      <Link href={`/projects/${id}`} className="work-art" aria-label={`Read the ${item.title} case study`}><ProjectCover id={id} /><span className="art-arrow" aria-hidden>↗</span></Link>
      <div className="work-copy"><div className="work-meta"><span>0{index + 1} / {item.category}</span><span>{item.status}</span></div><h3><Link href={`/projects/${id}`}>{item.title}</Link></h3><p className="work-headline">{item.headline}</p><p>{item.intro}</p><dl className="work-stats">{projects.find((p) => p.id === id)?.stats.filter((s) => /^~?\d/.test(s.value)).map((s) => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl><Link href={`/projects/${id}`} className="text-link">Read the story <span aria-hidden>↗</span></Link></div>
    </article>; })}</div>
    <div className="work-index-link"><p>Also: the monitoring stack, the AI gateway, my MSc research and the homelab.</p><Link href="/projects" className="button-outline">All the work <span aria-hidden>↗</span></Link></div>
  </section>;
}
