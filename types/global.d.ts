export {};

declare global {
  interface Window {
    /** Set while a view transition is driving a navigation (components/view-transition.tsx). */
    __viewTransition?: boolean;
    /** The terminal was asked for before it had loaded (components/extras.tsx). */
    __cliRequested?: boolean;
    /** The on-call simulator was asked for before it had loaded. */
    __oncallRequested?: boolean;
  }
}
