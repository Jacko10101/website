import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactCTA } from "@/components/contact-cta";
import { profile } from "@/lib/profile";
import { roles, education, stackTiers } from "@/lib/experience";

export default function AboutPage() {
  return (
    <div className="folio-surface">
      <div className="container interior-page">
        <div className="folio-line"><span>About / Jack Devlin</span><span>Northern Ireland</span></div>
        <div className="about-opening">
          <div>
            <h1 className="interior-title">Hi, I’m<br /><em>Jack.</em></h1>
            <p className="about-lead">Platform engineer at Loweconex since 2023.<br className="hidden lg:block" /> Before that, a year writing C# for architects.</p>
            <div className="about-prose">
              <p>I’m a platform engineer at Loweconex, based in Northern Ireland. I work on the systems behind the software: how it gets released, how we understand it when something breaks, and the tools engineers use along the way.</p>
              <p>That has taken me from Kubernetes and shared delivery pipelines to Heimdall, our deployment dashboard. More recently, I took Clarity from an early prototype into a service customers can ask questions of, and built Nightshift to turn engineering tickets into reviewable changes.</p>
              <p>I completed an MSc in Artificial Intelligence with Distinction alongside work. My dissertation involved deliberately breaking Kubernetes clusters to study how they recover. At home, the experiments are smaller, although the lights still run on their own cluster.</p>
            </div>
            <a href="/cv.pdf" download="jack-devlin-cv.pdf" className="editorial-link mt-6">The one-page version <span aria-hidden>↓</span></a>
          </div>
          <figure className="about-photo">
            <Image src="/jack-photo.jpg" alt="Jack Devlin" width={800} height={1000} sizes="(min-width: 1024px) 35vw, (min-width: 768px) 40vw, 75vw" className="w-full h-auto aspect-[4/5] object-cover" priority />
            <figcaption><span>Jack Devlin</span><span>Northern Ireland</span></figcaption>
          </figure>
        </div>

        <section className="about-section">
          <div><p className="folio-label">01 / Experience</p><h2 className="ledger-heading mt-5">Where I’ve<br />worked</h2></div>
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
          <div><p className="folio-label">02 / A lesson learned</p><h2 className="ledger-heading mt-5">The dashboard<br />nobody opened</h2></div>
          <div>
            <p className="about-pullquote">The numbers were correct.<br />Nobody ever opened it.</p>
            <p className="story-summary mt-6">The DORA collector behind Heimdall had the right data, but nobody opened it.
              The useful change was making that evidence easy for the team to read. That changed how I think about
              platform work: getting the data right is only part of the job. Someone has to be able to use it.</p>
            <Link href="/projects/heimdall" className="editorial-link mt-6">What became of it <span aria-hidden>↗</span></Link>
          </div>
        </section>

        <section className="about-section">
          <div><p className="folio-label">03 / Education</p><h2 className="ledger-heading mt-5">Education</h2></div>
          <div>{education.map((item) => <article key={item.award} className="experience-entry"><p className="folio-label">{item.dates}</p><h3>{item.award}</h3><p className="experience-role">{item.institution}{item.result ? ` / ${item.result}` : ""}</p><p className="story-summary mt-4">{item.note}</p></article>)}</div>
        </section>

        <section className="about-section">
          <div><p className="folio-label">04 / Tools</p><h2 className="ledger-heading mt-5">What I<br />work with</h2></div>
          <div>{stackTiers.map((tier, index) => <details key={tier.id} className="stack-detail" open={index === 0}><summary>{["At work", "At home", "Other projects & study"][index]}<span aria-hidden>+</span></summary><p className="story-summary mt-3">{tier.note}</p><p className="stack-text">{tier.items.join(" · ")}</p></details>)}</div>
        </section>
      </div>
      <ContactCTA />
    </div>
  );
}

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description: `Jack Devlin, platform engineer in Northern Ireland. Kubernetes, developer tools, and AI delivery. ${profile.availability.sentence}`,
  openGraph: { title: "About · Jack Devlin", description: "The person behind the platform: work, education, and a few lessons learned.", url: "/about" },
};
