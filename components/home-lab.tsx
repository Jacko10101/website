import Link from "next/link";
import { OncallInvite } from "@/components/oncall-invite";

export function HomeLab() {
  return <section className="play-section"><div className="container play-section-inner">
    <div><p className="overline">A five-minute detour</p><h2>You have<br /><em>the pager.</em></h2><p>Something’s broken. Read the clues, choose your next move and get the service back. Coffee is optional.</p><Link href="/lab" className="text-link">Explore the lab <span aria-hidden>↗</span></Link></div>
    <div className="play-invitation"><OncallInvite /><p className="play-note">Realistic incidents. Fictional services. No actual sleep lost.</p></div>
  </div><div className="container after-hours"><Link href="/projects/ml-scheduler"><span className="overline">MSc AI · Distinction</span><h3>What recovers first?</h3><p>A Kubernetes node fails. There isn’t room for everything.</p><span aria-hidden>↗</span></Link><Link href="/projects/smart-home"><span className="overline">At home</span><h3>The lights run on K3s.</h3><p>A place to try ideas, break things and put them back together.</p><span aria-hidden>↗</span></Link></div></section>;
}
