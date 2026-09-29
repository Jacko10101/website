import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { caseStories } from "@/lib/case-studies";
import { ProjectCover } from "@/components/project-cover";
import { ContactCTA } from "@/components/contact-cta";

export interface CaseFigure { src: string; width: number; height: number; alt: string; caption: string }

export function WorkCaseStudy({ id, children, titleStyle, figures }: { id: string; children?: ReactNode; titleStyle?: CSSProperties; figures?: CaseFigure[] }) {
  const story = caseStories[id];
  const next = caseStories[story.next];
  const schema = { "@context": "https://schema.org", "@type": "TechArticle", headline: `${story.title}: ${story.headline}`, description: story.intro, author: { "@type": "Person", name: "Jack Devlin", url: "https://www.devlinops.com" } };
  return <div className="folio-surface"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><article className="work-case container">
    <header className="work-case-header"><Link href="/projects" className="case-back">← All work</Link><div className="case-eyebrow"><span className="overline">{story.category}</span><span className="case-status">{story.status}</span></div><h1 style={titleStyle}>{story.title}<span>.</span></h1><p className="case-headline">{story.headline}</p><p className="case-intro">{story.intro}</p><dl className="case-facts"><div><dt>My role</dt><dd>{story.role}</dd></div><div><dt>Context</dt><dd>{story.context}</dd></div><div><dt>Built with</dt><dd>{story.stack.join(" · ")}</dd></div></dl></header>
    <div className="case-cover"><ProjectCover id={id} /></div>
    <div className="case-reading-layout"><aside className="case-contents"><span className="overline">In this story</span><nav aria-label="In this case study">{story.sections.map((section, i) => <a key={section.id} href={`#${section.id}`}><span>0{i + 1}</span>{section.title}</a>)}{children && <a href="#try-it"><span>↳</span>Try the idea</a>}</nav></aside><div className="case-prose">{story.sections.map((section, index) => <section id={section.id} key={section.id}><p className="overline">0{index + 1}</p><h2>{section.title}</h2>{section.paragraphs.map((p) => <p key={p}>{p}</p>)}</section>)}</div></div>
    {figures?.map((f) => <figure key={f.src} className="case-figure"><Image src={f.src} alt={f.alt} width={f.width} height={f.height} sizes="(min-width: 1200px) 1100px, 95vw" /><figcaption>{f.caption}</figcaption></figure>)}
    {children && <section id="try-it" className="case-exhibit"><div className="exhibit-heading"><p className="overline">{id === "ml-scheduler" ? "Recorded data" : "Demo"}</p><h2>{id === "ml-scheduler" ? "Explore the recorded results." : "Try the idea."}</h2><p>{id === "ml-scheduler" ? "Five recorded pairs from the separate label-mismatch experiment. Select a run to compare the schedulers." : "An interactive example with illustrative data. No customer systems are connected."}</p></div><div className="ink-surface exhibit-frame">{children}</div></section>}
    <Link href={`/projects/${story.next}`} className="case-next"><div><span className="overline">Keep exploring</span><h2>{next.title}</h2><p>{next.headline}</p></div><span aria-hidden>↗</span></Link>
  </article><ContactCTA /></div>;
}
