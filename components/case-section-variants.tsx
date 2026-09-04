import { ReactNode } from "react";

/**
 * Per-project section chrome, for the two pages whose sections share one
 * shape: Clarity reads as a chat session, the pipeline as a CI run. The
 * other case studies build their sections from their own frames. Both
 * variants take the same props, so a page swaps anatomy with one import.
 */

interface SectionProps {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
  className?: string;
}

/* Clarity — every section is a chat turn: the question typed into an input
   line, the body indented like the answer that came back. */
export function ChatSection({ children, title, eyebrow, className = "" }: SectionProps) {
  return (
    <section className={`mb-16 ${className}`}>
      {eyebrow && (
        <div className="flex items-center gap-3 rounded-md border border-border bg-black/40 px-4 py-2.5 font-mono text-sm mb-5">
          <span className="text-muted-foreground" aria-hidden>
            clarity&gt;
          </span>
          <span className="text-primary">{eyebrow.replace(/^>\s*/, "")}</span>
          <span className="cursor-blink !w-[0.5em] !h-[1em] shrink-0" aria-hidden />
        </div>
      )}
      <div className="border-l-2 border-primary/25 pl-5">
        {title && (
          <h2 className="display text-2xl sm:text-3xl text-foreground mb-6">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}

/* Pipeline — sections are steps in a CI run. `// exit 1 · x` renders a
   failed step, `// step: y` a passing one, `// exit 0 · z` the green run. */
export function StepSection({ children, title, eyebrow, className = "" }: SectionProps) {
  const raw = eyebrow?.replace(/^\/\/\s*/, "") ?? "";
  const failed = raw.startsWith("exit 1");
  const passed = raw.startsWith("exit 0") || raw.startsWith("step:");
  const glyph = failed ? "✗" : passed ? "✓" : "▸";
  const tone = failed ? "text-error border-error/50" : passed ? "text-primary border-primary/50" : "text-muted-foreground border-border";
  return (
    <section className={`mb-14 relative pl-9 ${className}`}
    >
      <span className="absolute left-[9px] top-7 bottom-0 w-px border-l border-dashed border-border" aria-hidden />
      <span
        className={`absolute left-0 top-0.5 w-5 h-5 rounded-full border bg-background font-mono text-[11px] flex items-center justify-center ${tone}`}
        aria-hidden
      >
        {glyph}
      </span>
      {eyebrow && (
        <span className={`font-mono text-xs tracking-wider ${failed ? "text-error" : "text-primary"}`}>
          {raw}
        </span>
      )}
      {title && (
        <h2 className="display text-2xl sm:text-3xl text-foreground mt-2 mb-6">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
