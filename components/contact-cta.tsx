import Link from "next/link";

export function ContactCTA({ title = "Want to chat?", lede = "I’m open to platform engineering roles. Remote-first, happy to relocate, and no sponsorship needed." }: { title?: string; lede?: string }) {
  return <section className="new-signoff container"><div><p className="overline">Let’s talk</p><h2>{title}</h2><p>{lede}</p></div><Link href="/contact" className="signoff-orbit" aria-label="Get in touch"><span>Say hello</span><span aria-hidden>↗</span></Link></section>;
}
