import Link from "next/link";
import { ProjectCover } from "@/components/project-cover";
import { caseStories } from "@/lib/case-studies";

const featured = ["nightshift", "heimdall", "clarity"];
export function CaseIndex() {
  return <section id="selected-work" className="work-section container">
    <div className="section-heading"><div><p className="overline">Selected work</p><h2>Things I’ve built.<br /><em>And learned from.</em></h2></div><p>Real projects, the decisions behind them, and what happened when people started using them.</p></div>
    <div className="featured-work">{featured.map((id, index) => { const item = caseStories[id]; return <article className={`work-feature work-feature-${id}`} key={id}>
      <Link href={`/projects/${id}`} className="work-art" aria-label={`Read the ${item.title} case study`}><ProjectCover id={id} /><span className="art-arrow" aria-hidden>↗</span></Link>
      <div className="work-copy"><div className="work-meta"><span>0{index + 1} / {item.category}</span><span>{item.status}</span></div><h3><Link href={`/projects/${id}`}>{item.title}</Link></h3><p className="work-headline">{item.headline}</p><p>{item.intro}</p><Link href={`/projects/${id}`} className="text-link">Read the story <span aria-hidden>↗</span></Link></div>
    </article>; })}</div>
    <div className="work-index-link"><p>There’s more underneath: delivery, observability, AI infrastructure and a little research.</p><Link href="/projects" className="button-outline">All the work <span aria-hidden>↗</span></Link></div>
  </section>;
}
