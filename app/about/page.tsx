import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactCTA } from "@/components/contact-cta";
import { profile } from "@/lib/profile";
import { roles, education, tradingAs, stackTiers } from "@/lib/experience";

export default function AboutPage() {
  return (
    <div className="folio-surface">
      <div className="container interior-page">
        <div className="folio-line"><span>About / Jack Devlin</span><span>Northern Ireland</span></div>
        <div className="about-opening">
          <div>
            <h1 className="interior-title">A little<br /><em>context.</em></h1>
            <p className="about-lead">I started in QA. The failures kept<br className="hidden lg:block" /> leading me further down the stack.</p>
            <div className="about-prose">
              <p>At Loweconex, I joined a team of five engineers in the middle of a monolith-to-microservices migration.
                Writing the tests kept exposing infrastructure problems, so I started fixing those too.</p>
              <p>That became observability, Kubernetes, GitOps, a shared pipeline library, and a deployment dashboard.
                Engineering grew to around forty people. More recently, I built the infrastructure and trust layer
                for Clarity and the gateway behind the company’s AI workloads.</p>
              <p>I’m based in Northern Ireland and work through {tradingAs.name}, my own limited company.
                Outside the day job, I’ve been testing Kubernetes recovery schedulers for my MSc and running
                rather more infrastructure in my flat than the lights strictly need.</p>
            </div>
            <a href="/cv.pdf" download="jack-devlin-cv.pdf" className="editorial-link mt-6">The one-page version <span aria-hidden>↓</span></a>
          </div>
          <figure className="about-photo">
            <Image src="/jack-photo.jpg" alt="Jack Devlin" width={800} height={1000} sizes="(min-width: 1024px) 35vw, (min-width: 768px) 40vw, 75vw" className="w-full h-auto aspect-[4/5] object-cover" priority />
            <figcaption><span>Jack Devlin</span><span>Usually behind a keyboard.</span></figcaption>
          </figure>
        </div>

        <section className="about-section">
          <div><p className="folio-label">01 / Experience</p><h2 className="ledger-heading mt-5">How I<br /><em>got here.</em></h2></div>
          <div>
            {roles.map((role) => (
              <article key={role.company} className="experience-entry">
                <p className="folio-label">{role.dates} / {role.location}</p>
                <h3>{role.company}</h3><p className="experience-role">{role.title}</p>
                <p className="story-summary mt-4">{role.summary}</p>
                {role.evidence && <div className="experience-links">{role.evidence.map((item) => <Link key={item.href} href={item.href}>{item.label} ↗</Link>)}</div>}
              </article>
            ))}
          </div>
        </section>

        <section className="about-section">
          <div><p className="folio-label">02 / A lesson learned</p><h2 className="ledger-heading mt-5">The dashboard<br /><em>nobody opened.</em></h2></div>
          <div>
            <p className="about-pullquote">The collector was correct for months.<br /><em>That didn’t make it useful.</em></p>
            <p className="story-summary mt-6">The DORA collector behind Heimdall had the right data, but nobody opened it.
              Once it had a UI, twenty people started reading it before standup. That changed how I think about
              platform work: getting the data right is only part of the job. Someone has to be able to use it.</p>
            <Link href="/projects/heimdall" className="editorial-link mt-6">What became of it <span aria-hidden>↗</span></Link>
          </div>
        </section>

        <section className="about-section">
          <div><p className="folio-label">03 / Education</p><h2 className="ledger-heading mt-5">Still<br /><em>learning.</em></h2></div>
          <div>{education.map((item) => <article key={item.award} className="experience-entry"><p className="folio-label">{item.dates}</p><h3>{item.award}</h3><p className="experience-role">{item.institution}{item.result ? ` / ${item.result}` : ""}</p><p className="story-summary mt-4">{item.note}</p></article>)}</div>
        </section>

        <section className="about-section">
          <div><p className="folio-label">04 / Tools</p><h2 className="ledger-heading mt-5">What I<br /><em>work with.</em></h2></div>
          <div>{stackTiers.map((tier, index) => <details key={tier.id} className="stack-detail" open={index === 0}><summary>{["In production", "At home", "Working knowledge"][index]}<span aria-hidden>+</span></summary><p className="story-summary mt-3">{tier.note}</p><p className="stack-text">{tier.items.join(" · ")}</p></details>)}</div>
        </section>
      </div>
      <ContactCTA />
    </div>
  );
}

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description: `Jack Devlin, platform engineer in Northern Ireland. From QA to Kubernetes, developer tools, and AI infrastructure. ${profile.availability.sentence}`,
  openGraph: { title: "About · Jack Devlin", description: "The person behind the platform: work, education, and a few lessons learned.", url: "/about" },
};
