"use client";

/**
 * The front door to ONCALL. The game already listens for a `devlinops:oncall`
 * event (see components/konami-code.tsx), which is how the CLI opens it; this
 * button dispatches the same event from a page anyone can find.
 */
export function OncallInvite() {
  return (
    <button
      type="button"
      onClick={() => {
        // The game loads after the page is idle. If the click lands first,
        // the flag lets it open itself on mount instead of losing the event.
        window.__oncallRequested = true;
        window.dispatchEvent(new Event("devlinops:oncall"));
      }}
      className="pager-invite"
    >
      <span className="pager-invite-screen"><span>INCOMING / INCIDENT SIMULATOR</span><strong>03:12</strong><span>FIVE PAGES BEFORE HANDOVER</span></span>
      <span className="pager-invite-copy"><strong>Start the shift <span aria-hidden>↗</span></strong><span>Read the evidence. Make the call.</span><small>14 scenarios · keyboard or touch</small></span>
    </button>
  );
}
