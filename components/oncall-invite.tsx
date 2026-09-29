"use client";

export function OncallInvite() {
  return <button
    type="button"
    className="pager-invite"
    aria-label="Take the pager — play the on-call incident simulator"
    onClick={() => {
      window.__oncallRequested = true;
      window.dispatchEvent(new Event("devlinops:oncall"));
    }}
  >
    <span className="pager-device" aria-hidden="true">
      <span className="pager-hardware-top"><span>DEVLINOPS / ONCALL</span><span className="pager-reception">▂▄▆</span></span>
      <span className="pager-lcd">
        <span className="pager-lcd-meta"><span><i /> INCOMING PAGE</span><span>01 / 05</span></span>
        <span className="pager-lcd-clock">03<span>:</span>12</span>
        <span className="pager-lcd-service">checkout-api</span>
        <span className="pager-lcd-message">Error rate climbing. You’re up.</span>
        <svg className="pager-sparkline" viewBox="0 0 340 42" fill="none"><path d="M0 35H340" stroke="currentColor" opacity=".15" /><path d="M0 33L30 32L42 34L65 31L86 32L111 28L125 32L150 27L165 25L173 29L192 21L202 25L224 16L235 20L249 10L265 14L281 6L292 11L309 5L324 9L340 3" stroke="currentColor" strokeWidth="2" /></svg>
      </span>
      <span className="pager-hardware-bottom"><span className="pager-speaker"><i /><i /><i /><i /><i /></span><span className="pager-hardware-buttons"><i>−</i><i>+</i><i>↵</i></span></span>
    </span>
    <span className="pager-invite-copy"><span><strong>Take the pager</strong><small>Five incidents, about five minutes.</small></span><span className="pager-start-arrow" aria-hidden>↗</span></span>
  </button>;
}
