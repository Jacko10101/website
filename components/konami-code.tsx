"use client";

import { useEffect, useState, useRef } from "react";

export function KonamiCode() {
  const [isActive, setIsActive] = useState(false);
  const [keys, setKeys] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Konami code sequence
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close matrix rain with Escape
      if (e.key === "Escape" && isActive) {
        setIsActive(false);
        return;
      }

      // Track key sequence
      setKeys((prevKeys) => {
        const newKeys = [...prevKeys, e.key].slice(-konamiCode.length);

        // Check if konami code matches
        const matches = newKeys.every((key, index) => key === konamiCode[index]);

        if (matches && !isActive) {
          setIsActive(true);
          return [];
        }

        return newKeys;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive]);

  // Matrix rain effect
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns = Math.floor(canvas.width / 20);
    const drops: number[] = Array(columns).fill(1);

    // Characters to display (terminal/DevOps themed)
    const chars = "kubectl argocd terraform docker helm kustomize prometheus grafana bash python javascript typescript 0123456789@#$%^&*(){}[]|/<>";
    const charArray = chars.split("");

    let animationId: number;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0f0";
      ctx.font = "15px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative z-10 max-w-2xl rounded-lg border-2 border-green-500 bg-black/90 p-8 text-center backdrop-blur-sm">
          <div className="mb-4 font-mono text-4xl font-bold text-green-500">
            [ ACCESS GRANTED ]
          </div>
          <div className="mb-6 font-mono text-sm text-green-400">
            <p>PLATFORM ENGINEERING SYSTEMS UNLOCKED</p>
            <p className="mt-2 text-xs opacity-70">
              "In DevOps we trust, but we always verify with Prometheus"
            </p>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-4 text-left font-mono text-xs text-green-300">
            <div className="rounded border border-green-700 bg-black/50 p-3">
              <div className="text-green-500">$ kubectl get pods</div>
              <div className="mt-1 opacity-70">STATUS: Running</div>
            </div>
            <div className="rounded border border-green-700 bg-black/50 p-3">
              <div className="text-green-500">$ argocd app list</div>
              <div className="mt-1 opacity-70">SYNC: Healthy</div>
            </div>
            <div className="rounded border border-green-700 bg-black/50 p-3">
              <div className="text-green-500">$ docker ps -a</div>
              <div className="mt-1 opacity-70">CONTAINERS: 42</div>
            </div>
          </div>

          <div className="space-y-2 font-mono text-xs text-green-400">
            <p>✓ CI/CD Pipeline: OPERATIONAL</p>
            <p>✓ GitOps Sync: ENABLED</p>
            <p>✓ Observability Stack: HEALTHY</p>
            <p>✓ DORA Metrics: COLLECTING</p>
          </div>

          <div className="mt-8">
            <button
              onClick={() => setIsActive(false)}
              className="rounded-lg border-2 border-green-500 bg-green-500/10 px-6 py-2 font-mono text-sm font-bold text-green-500 transition-all hover:bg-green-500 hover:text-black"
            >
              [ ESC TO EXIT ]
            </button>
          </div>

          <div className="mt-4 font-mono text-[10px] text-green-600">
            <p>KONAMI CODE DETECTED</p>
            <p className="mt-1 opacity-50">
              Easter egg by Jack Devlin • Platform Engineering
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
