import type { ReactNode, CSSProperties } from "react";
import { ScrollProgress } from "@/components/scroll-progress";
import { ReadingRail } from "@/components/reading-rail";
import { TerminalWindow } from "@/components/terminal-window";
import type { Phosphor } from "@/lib/phosphors";

/**
 * What every case study shares, which is very little on purpose: the
 * article wrapper, its phosphor tint, the reading-progress bar and the
 * JSON-LD block. Each page brings its own anatomy (a day log, a PR, an ADR,
 * an incident review, a spec sheet, a ledger, a paper) from its own
 * components. There used to be a shared hero, stats grid, skills sidebar
 * and closing CTA in here; they were the template tell, and every page
 * had stopped using them.
 */

// Code block with terminal chrome
export function EnhancedCodeBlock({
  title,
  code,
  language = "bash",
}: {
  title?: string;
  code: string;
  language?: string;
}) {
  return (
    <TerminalWindow title={title ?? language}>
      <div className="p-4 font-mono text-xs overflow-x-auto">
        <pre className="text-muted-foreground whitespace-pre-wrap">{code}</pre>
      </div>
    </TerminalWindow>
  );
}

/**
 * Per-project accent: each case study renders on its own CRT phosphor (see
 * lib/phosphors.ts). Scoped CSS variables re-tint everything on the page
 * without touching the rest of the site, which stays on the house P1 green.
 */
export function CaseStudyLayout({
  children,
  schema,
  phosphor,
}: {
  children: ReactNode;
  schema?: object;
  phosphor?: Phosphor;
}) {
  const accentStyle = phosphor
    ? ({
        "--color-primary": `oklch(${phosphor.lightness ?? 0.72} ${
          phosphor.chroma ?? 0.17
        } ${phosphor.hue})`,
        "--color-primary-foreground": `oklch(0.08 0.01 ${phosphor.hue})`,
      } as CSSProperties)
    : undefined;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <article className="bg-background min-h-screen" style={accentStyle}>
        <ScrollProgress />
        <ReadingRail />
        {children}
      </article>
    </>
  );
}
