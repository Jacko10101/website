"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reading scrollHeight inside the scroll handler forces a layout on
    // every frame. Measure on resize instead.
    let scrollable = 0;

    const measure = () => {
      scrollable = document.documentElement.scrollHeight - window.innerHeight;
    };

    const updateProgress = () => {
      setProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
    };

    measure();
    updateProgress();

    const onResize = () => {
      measure();
      updateProgress();
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", onResize);

    // Scroll-reveal sections change the document height as they mount, so the
    // cached value needs a nudge from something other than window resizes.
    const observer = new ResizeObserver(onResize);
    observer.observe(document.documentElement);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-secondary/30">
      <div
        className="h-full bg-gradient-to-r from-primary/60 to-primary relative"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute right-0 top-0 h-full w-2 bg-foreground/50 animate-pulse" />
      </div>
    </div>
  );
}
