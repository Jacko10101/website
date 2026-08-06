import { ReactNode } from "react";

/**
 * Per-project section chrome. Six case studies, six section anatomies, all
 * speaking the page's own dialect: Clarity reads as a chat session, the
 * gateway as a request trace, Heimdall as a day on the platform team,
 * the pipeline as a CI run, observability as dashboard panels, the
 * smart home as MQTT traffic. Every variant takes the same props as
 * CaseStudySection so a page swaps anatomy with one import line.
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
          <h2 className="font-mono font-semibold tracking-tight text-2xl sm:text-3xl text-foreground mb-6">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}

/* AI gateway — sections are spans in a request trace: a dot on a shared
   rail, the span label as a chip. */
export function TraceSection({ children, title, eyebrow, className = "" }: SectionProps) {
  return (
    <section className={`mb-14 relative pl-8 ${className}`}
    >
      <span
        className="absolute left-[5px] top-6 bottom-0 w-px bg-border"
        aria-hidden
      />
      <span
        className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-2 border-primary bg-background glow-border"
        aria-hidden
      />
      {eyebrow && (
        <span className="inline-block font-mono text-xs text-primary border border-primary/40 rounded px-2 py-0.5 mb-3 tracking-wider">
          {eyebrow.replace(/^\/\/\s*/, "")}
        </span>
      )}
      {title && (
        <h2 className="font-mono font-semibold tracking-tight text-2xl sm:text-3xl text-foreground mb-6">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

/* Heimdall — a day on the platform team: a clock time in the margin,
   schedule-style, because the product's job is the morning. */
export function DaySection({ children, title, eyebrow, className = "" }: SectionProps) {
  const match = eyebrow?.match(/(\d{2}:\d{2})\s*·\s*(.*)$/);
  const time = match?.[1];
  const label = match?.[2] ?? eyebrow?.replace(/^\/\/\s*/, "");
  return (
    <section className={`mb-16 ${className}`}>
      <div className="flex items-baseline gap-4 mb-1 font-mono">
        {time && (
          <span className="text-2xl font-semibold text-primary glow-soft tabular-nums shrink-0">
            {time}
          </span>
        )}
        <span className="text-sm text-muted-foreground tracking-wider">{label}</span>
      </div>
      <div className="border-t border-border/60 pt-5 mt-3">
        {title && (
          <h2 className="font-mono font-semibold tracking-tight text-2xl sm:text-3xl text-foreground mb-6">
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
        <h2 className="font-mono font-semibold tracking-tight text-2xl sm:text-3xl text-foreground mt-2 mb-6">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

/* Observability — sections are dashboard panels: chrome bar with the query,
   content inside the panel. */
export function PanelSection({ children, title, eyebrow, className = "" }: SectionProps) {
  return (
    <section className={`mb-14 rounded-lg border border-border bg-card/30 overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between gap-3 px-5 py-2.5 border-b border-border bg-card/60">
        <span className="font-mono text-xs text-primary tracking-wider truncate">
          {eyebrow?.replace(/^\/\/\s*/, "")}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground shrink-0" aria-hidden>
          ⌄ · ⋯
        </span>
      </div>
      <div className="p-5 md:p-6">
        {title && (
          <h2 className="font-mono font-semibold tracking-tight text-2xl sm:text-3xl text-foreground mb-6">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}

/* Smart home — sections arrive as MQTT messages: topic chip, retained flag,
   soft card. Cosy, not corporate. */
export function TopicSection({ children, title, eyebrow, className = "" }: SectionProps) {
  return (
    <section className={`mb-16 ${className}`}>
      {eyebrow && (
        <div className="flex items-center gap-2 mb-4 font-mono text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" aria-hidden />
          <span className="text-primary bg-primary/10 border border-primary/30 rounded-full px-3 py-1">
            {eyebrow.replace(/^\/\/\s*/, "")}
          </span>
          <span className="text-muted-foreground" aria-hidden>
            qos 0 · retained
          </span>
        </div>
      )}
      {title && (
        <h2 className="font-mono font-semibold tracking-tight text-2xl sm:text-3xl text-foreground mb-6">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
