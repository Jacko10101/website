/** Shared exhibit frame. The title identifies the actual artefact inside. */
export function TerminalWindow({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return <div className={`instrument-surface terminal-exhibit ${className}`}><div className="instrument-title"><span className="instrument-glyph" aria-hidden>⌁</span><span>{title}</span><span className="instrument-corner" aria-hidden>↗</span></div>{children}</div>;
}
