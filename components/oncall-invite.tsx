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
        (window as Window & { __oncallRequested?: boolean }).__oncallRequested = true;
        window.dispatchEvent(new Event("devlinops:oncall"));
      }}
      className="rounded-md bg-primary px-6 py-3 font-mono text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
    >
      Take the pager
    </button>
  );
}
