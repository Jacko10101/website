"use client";

import { useState } from "react";

/** Decorative, compositor-animated light. No canvas loop or pointer tracking. */
export function AmbientField() {
  return <>
    <div className="ambient-field" aria-hidden="true">
      <div className="ambient-light ambient-light-one" />
      <div className="ambient-light ambient-light-two" />
      <svg className="ambient-contours" viewBox="0 0 1600 1100" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M ${-350 + i * 43} -100 C ${920 + i * 21} ${40 + i * 18}, ${290 + i * 32} ${590 + i * 18}, ${1740 + i * 38} ${830 + i * 32}`} />)}
      </svg>
      <div className="ambient-vignette" />
    </div>

  </>;
}

export function MotionToggle() {
  const [paused, setPaused] = useState(false);
  function toggle() {
    const next = !paused;
    document.documentElement.style.setProperty("--ambient-play-state", next ? "paused" : "running");
    setPaused(next);
  }
  return <button type="button" className="motion-toggle" aria-pressed={paused} aria-label={paused ? "Resume background motion" : "Pause background motion"} onClick={toggle}><span aria-hidden>{paused ? "▷" : "Ⅱ"}</span><span>{paused ? "Motion paused" : "Pause motion"}</span></button>;
}
