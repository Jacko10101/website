"use client";

/**
 * The footer's line about the terminal. On a pointer device it says which
 * key; on a phone there is no key, so it says tap, and either way the line
 * itself opens the terminal. If the terminal has not loaded yet (it arrives
 * after the page is idle), the request is remembered and honoured on mount.
 */
export function TerminalHint() {
  const open = () => {
    window.__cliRequested = true;
    window.dispatchEvent(new Event("devlinops:cli"));
  };
  return (
    <button
      type="button"
      onClick={open}
      className="w-full px-4 py-2 border-t border-border/60 text-center text-muted-foreground transition-colors hover:text-foreground"
    >
      <span className="hidden [@media(hover:hover)]:inline">
        press{" "}
        <kbd className="px-1.5 py-0.5 mx-1 rounded bg-secondary border border-border text-foreground/70 text-[10px]">/</kbd>{" "}
        for the terminal
      </span>
      <span className="[@media(hover:hover)]:hidden">tap here for the terminal</span>
    </button>
  );
}
