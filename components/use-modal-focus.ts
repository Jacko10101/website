"use client";

import { useEffect, type RefObject } from "react";

/** Used by body-portalled overlays. Capture the opener before moving focus. */
export function useModalFocus(open: boolean, root: RefObject<HTMLElement | null>, initial?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open || !root.current) return;
    const overlay = root.current;
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const changed: HTMLElement[] = [];
    for (const child of Array.from(document.body.children)) {
      if (child instanceof HTMLElement && child !== overlay && !child.contains(overlay) && !child.inert) {
        child.inert = true;
        changed.push(child);
      }
    }
    document.body.style.overflow = "hidden";
    (initial?.current ?? overlay).focus({ preventScroll: true });
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || event.defaultPrevented) return;
      const items = Array.from(overlay.querySelectorAll<HTMLElement>('button:not(:disabled), summary, a[href], input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex="0"]')).filter(el => el.getClientRects().length > 0 && !el.closest('[hidden], [inert]'));
      const first = items[0];
      const last = items[items.length - 1];
      if (!first) { event.preventDefault(); overlay.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === overlay)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === overlay)) { event.preventDefault(); first.focus(); }
    };
    overlay.addEventListener("keydown", trap);
    return () => {
      overlay.removeEventListener("keydown", trap);
      changed.forEach(el => { el.inert = false; });
      document.body.style.overflow = overflow;
      if (opener?.isConnected && opener.getClientRects().length) opener.focus({ preventScroll: true });
      else {
        const fallback = Array.from(document.querySelectorAll<HTMLElement>('.terminal-key, .mobile-menu-toggle')).find(el => el.getClientRects().length);
        fallback?.focus({ preventScroll:true });
      }
    };
  }, [open, root, initial]);
}
