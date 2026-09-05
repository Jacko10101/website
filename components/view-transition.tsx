"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";

/**
 * Shared-element transitions between routes, on the browser's own View
 * Transitions API. A link made with `TransitionLink` (or a push through
 * `useTransitionRouter`) wraps the client-side navigation in
 * `document.startViewTransition`, so any element carrying a
 * `view-transition-name` on both pages morphs from one to the other: the
 * title in an index row becomes the heading of its case study.
 *
 * The transition callback resolves when the pathname changes, which is the
 * commit that put the new route in the DOM, so the browser snapshots the
 * finished page rather than a loading state. A safety timeout resolves it
 * regardless, so a slow route never leaves the page frozen.
 *
 * Without the API, or with reduced motion on, it is a plain push. While a
 * transition runs, app/template.tsx skips its own entrance animation.
 */

type Push = (href: string) => void;
const Ctx = createContext<Push>(() => {});

declare global {
  interface Window {
    /** Set while a view transition is driving a navigation. */
    __viewTransition?: boolean;
  }
}

export function ViewTransitions({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef<(() => void) | null>(null);

  useEffect(() => {
    pending.current?.();
    pending.current = null;
  }, [pathname]);

  const push = useCallback<Push>(
    (href) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!document.startViewTransition || reduced) {
        router.push(href);
        return;
      }
      window.__viewTransition = true;
      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            pending.current = resolve;
            router.push(href);
            window.setTimeout(resolve, 1500);
          }),
      );
      transition.finished.finally(() => {
        window.__viewTransition = false;
      });
    },
    [router],
  );

  return <Ctx.Provider value={push}>{children}</Ctx.Provider>;
}

export function useTransitionRouter() {
  return useContext(Ctx);
}

function plainLeftClick(e: MouseEvent) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.defaultPrevented;
}

/** A next/link that animates the crossing. Same props, same behaviour otherwise. */
export function TransitionLink({ href, onClick, ...rest }: ComponentProps<typeof Link>) {
  const push = useTransitionRouter();
  return (
    <Link
      {...rest}
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (typeof href === "string" && plainLeftClick(e) && rest.target !== "_blank") {
          e.preventDefault();
          push(href);
        }
      }}
    />
  );
}
