/**
 * Shared terminal chrome. The traffic lights were previously re-implemented
 * inline in seven components. Plain markup: it renders on the server and
 * inside client components alike.
 */
export function TerminalWindow({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-border bg-black/60 overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/60 bg-card/50">
        <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-error/60" />
        <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-warn/60" />
        <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-primary/60" />
        <span className="ml-2 text-xs text-muted-foreground font-mono">{title}</span>
      </div>
      {children}
    </div>
  );
}
