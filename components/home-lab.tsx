import Link from "next/link";
import { RecoveryEvidence } from "@/components/recovery-evidence";

export function HomeLab() {
  return <section className="home-lab research-scene"><div className="container">
    <div className="section-masthead"><span className="folio-label">03 / Below the platform</span><span className="folio-label">MSc · Queen’s University Belfast · 2026</span></div>
    <div className="research-layout">
      <div className="research-copy"><h2>A node failed.<br />The labels<br /><span>lied.</span></h2>
        <p>When there isn’t room for every service, Kubernetes has to choose. But what if the services claiming to be important aren’t doing useful work?</p>
        <p>I tested that on real EKS clusters. The same workload, the same node failure, two ways to decide what comes back: trust the labels, or check them against measured behaviour.</p>
        <p className="research-note">Here are the five recorded pairs from the always-down services experiment. You can inspect every one.</p>
        <Link href="/projects/ml-scheduler" className="editorial-link">Read the research <span aria-hidden>↗</span></Link>
      </div>
      <RecoveryEvidence />
    </div>
    <div className="side-notes">
      <Link href="/projects/smart-home" className="side-note"><span className="folio-label">After work</span><h3>The flat runs K3s.<span aria-hidden>↗</span></h3><p>A Raspberry Pi, a Zigbee mesh, and lights that keep working when the internet doesn’t.</p></Link>
      <Link href="/lab" className="side-note"><span className="folio-label">Take over</span><h3>Your turn on call.<span aria-hidden>↗</span></h3><p>Five incidents. An error budget. Make the call and see what happens.</p></Link>
      <Link href="/lab#query" className="side-note"><span className="folio-label">Another way in</span><h3>Query the portfolio.<span aria-hidden>↗</span></h3><p>The projects on this site, in a working SQLite database. Bring your own SELECT.</p></Link>
    </div>
  </div></section>;
}
