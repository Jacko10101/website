"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress(); // Initial calculation

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-secondary/30">
      {/* Pipeline stages background */}
      <div className="absolute inset-0 flex">
        <div className="flex-1 border-r border-border/50" />
        <div className="flex-1 border-r border-border/50" />
        <div className="flex-1 border-r border-border/50" />
        <div className="flex-1" />
      </div>

      {/* Progress bar */}
      <div
        className="h-full bg-gradient-to-r from-primary via-blue-500 to-green-500 transition-all duration-150 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        {/* Animated pulse at the end */}
        <div className="absolute right-0 top-0 h-full w-2 bg-white/50 animate-pulse" />
      </div>
    </div>
  );
}
