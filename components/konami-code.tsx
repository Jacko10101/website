"use client";

import { useEffect, useState, useRef, useCallback } from "react";

type Position = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type GameState = "menu" | "playing" | "paused" | "gameover";

const GRID_SIZE = 20;
const GAME_SPEED = 100;

const POD_TYPES = {
  healthy: { label: "Running", points: 10, color: "#22c55e" },
  pending: { label: "Pending", points: 5, color: "#eab308" },
  danger: { label: "OOMKilled", points: -1, color: "#ef4444" },
};

export function KonamiCode() {
  const [isActive, setIsActive] = useState(false);
  const [keys, setKeys] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [gameState, setGameState] = useState<GameState>("menu");
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [food, setFood] = useState<Position & { type: keyof typeof POD_TYPES }>({ x: 15, y: 10, type: "healthy" });
  const [obstacles, setObstacles] = useState<Position[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gridWidth, setGridWidth] = useState(30);
  const [gridHeight, setGridHeight] = useState(20);

  const directionRef = useRef(direction);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const scoreRef = useRef(score);

  // Keep scoreRef in sync
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const konamiCode = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a",
  ];

  useEffect(() => {
    const saved = localStorage.getItem("kubectl-snake-highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    const updateGridSize = () => {
      const maxWidth = Math.floor((window.innerWidth - 200) / GRID_SIZE);
      const maxHeight = Math.floor((window.innerHeight - 300) / GRID_SIZE);
      setGridWidth(Math.min(35, Math.max(20, maxWidth)));
      setGridHeight(Math.min(20, Math.max(12, maxHeight)));
    };
    updateGridSize();
    window.addEventListener("resize", updateGridSize);
    return () => window.removeEventListener("resize", updateGridSize);
  }, []);

  const getRandomPosition = useCallback((excludeSnake: Position[] = []): Position => {
    let pos: Position;
    do {
      pos = {
        x: Math.floor(Math.random() * (gridWidth - 2)) + 1,
        y: Math.floor(Math.random() * (gridHeight - 2)) + 1,
      };
    } while (excludeSnake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
  }, [gridWidth, gridHeight]);

  const spawnFood = useCallback((excludeSnake: Position[]) => {
    const types: (keyof typeof POD_TYPES)[] = ["healthy", "healthy", "healthy", "pending"];
    const type = types[Math.floor(Math.random() * types.length)];
    const pos = getRandomPosition(excludeSnake);
    setFood({ ...pos, type });
  }, [getRandomPosition]);

  const spawnObstacles = useCallback((count: number, excludeSnake: Position[]) => {
    const newObstacles: Position[] = [];
    for (let i = 0; i < count; i++) {
      newObstacles.push(getRandomPosition([...excludeSnake, ...newObstacles]));
    }
    setObstacles(newObstacles);
  }, [getRandomPosition]);

  const startGame = useCallback(() => {
    const initialSnake = [{ x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }];
    setSnake(initialSnake);
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    setScore(0);
    scoreRef.current = 0;
    setGameState("playing");
    spawnFood(initialSnake);
    spawnObstacles(3, initialSnake);
  }, [gridWidth, gridHeight, spawnFood, spawnObstacles]);

  const endGame = useCallback(() => {
    setGameState("gameover");
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    const currentScore = scoreRef.current;
    if (currentScore > highScore) {
      setHighScore(currentScore);
      localStorage.setItem("kubectl-snake-highscore", currentScore.toString());
    }
  }, [highScore]);

  // Game loop - NO score in dependencies
  useEffect(() => {
    if (gameState !== "playing") return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        const dir = directionRef.current;

        switch (dir) {
          case "UP": head.y -= 1; break;
          case "DOWN": head.y += 1; break;
          case "LEFT": head.x -= 1; break;
          case "RIGHT": head.x += 1; break;
        }

        if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
          endGame();
          return prevSnake;
        }

        if (prevSnake.some(s => s.x === head.x && s.y === head.y)) {
          endGame();
          return prevSnake;
        }

        if (obstacles.some(o => o.x === head.x && o.y === head.y)) {
          endGame();
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        if (head.x === food.x && head.y === food.y) {
          const points = POD_TYPES[food.type].points;
          if (points < 0) {
            endGame();
            return prevSnake;
          }
          setScore(s => s + points);
          spawnFood(newSnake);
          // Check for obstacle spawn using ref
          const newScore = scoreRef.current + points;
          if (newScore > 0 && newScore % 50 === 0) {
            spawnObstacles(obstacles.length + 1, newSnake);
          }
          return newSnake;
        }

        newSnake.pop();
        return newSnake;
      });
    };

    gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState, food, obstacles, gridWidth, gridHeight, endGame, spawnFood, spawnObstacles]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isActive) {
          setIsActive(false);
          setGameState("menu");
          if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current);
            gameLoopRef.current = null;
          }
        }
        return;
      }

      if (!isActive) {
        setKeys((prevKeys) => {
          const newKeys = [...prevKeys, e.key].slice(-konamiCode.length);
          const matches = newKeys.length === konamiCode.length &&
            newKeys.every((key, index) => key === konamiCode[index]);
          if (matches) {
            setIsActive(true);
            return [];
          }
          return newKeys;
        });
        return;
      }

      if (gameState === "menu" || gameState === "gameover") {
        if (e.key === "Enter" || e.key === " ") {
          startGame();
        }
        return;
      }

      if (gameState === "playing") {
        e.preventDefault();
        const dir = directionRef.current;
        switch (e.key) {
          case "ArrowUp":
          case "w":
            if (dir !== "DOWN") { setDirection("UP"); directionRef.current = "UP"; }
            break;
          case "ArrowDown":
          case "s":
            if (dir !== "UP") { setDirection("DOWN"); directionRef.current = "DOWN"; }
            break;
          case "ArrowLeft":
          case "a":
            if (dir !== "RIGHT") { setDirection("LEFT"); directionRef.current = "LEFT"; }
            break;
          case "ArrowRight":
          case "d":
            if (dir !== "LEFT") { setDirection("RIGHT"); directionRef.current = "RIGHT"; }
            break;
          case "p":
            setGameState("paused");
            break;
        }
      } else if (gameState === "paused" && e.key === "p") {
        setGameState("playing");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, gameState, startGame]);

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
    const chars = "kubectlgetpodsdeploysvc01".split("");

    let animationId: number;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(34, 197, 94, 0.3)";
      ctx.font = "14px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationId = requestAnimationFrame(draw);
    };

    draw();

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

  const gameWidth = gridWidth * GRID_SIZE;
  const gameHeight = gridHeight * GRID_SIZE;

  // Get direction emoji for snake head
  const getHeadEmoji = () => {
    switch (directionRef.current) {
      case "UP": return "🔼";
      case "DOWN": return "🔽";
      case "LEFT": return "◀️";
      case "RIGHT": return "▶️";
      default: return "▶️";
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70" />

      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        <div className="relative rounded-2xl border border-green-500/30 bg-black/95 p-6 shadow-[0_0_80px_rgba(34,197,94,0.2)] backdrop-blur-md">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between border-b border-green-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 text-2xl shadow-inner">
                🐍
              </div>
              <div>
                <div className="font-mono text-lg font-bold text-green-400">KUBECTL SNAKE</div>
                <div className="font-mono text-[10px] text-green-600">Collect pods • Avoid crashes</div>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="text-right">
                <div className="font-mono text-[10px] uppercase tracking-wider text-green-600">Score</div>
                <div className="font-mono text-3xl font-bold tabular-nums text-green-400">{score}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[10px] uppercase tracking-wider text-yellow-600">Best</div>
                <div className="font-mono text-3xl font-bold tabular-nums text-yellow-500">{highScore}</div>
              </div>
            </div>
          </div>

          {/* Game Area */}
          <div
            className="relative overflow-hidden rounded-xl"
            style={{
              width: gameWidth,
              height: gameHeight,
              background: "linear-gradient(180deg, #000 0%, #001a00 100%)",
              boxShadow: "inset 0 0 100px rgba(34,197,94,0.05), 0 0 1px rgba(34,197,94,0.3)"
            }}
          >
            {/* Subtle grid */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(34,197,94,0.5) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(34,197,94,0.5) 1px, transparent 1px)
                `,
                backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
              }}
            />

            {/* Snake body */}
            {snake.map((segment, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: segment.x * GRID_SIZE + 2,
                  top: segment.y * GRID_SIZE + 2,
                  width: GRID_SIZE - 4,
                  height: GRID_SIZE - 4,
                  transition: "all 0.05s linear"
                }}
              >
                {i === 0 ? (
                  // Snake head
                  <div
                    className="w-full h-full rounded-md flex items-center justify-center text-xs"
                    style={{
                      background: "linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)",
                      boxShadow: "0 0 15px rgba(74,222,128,0.6), inset 0 1px 0 rgba(255,255,255,0.2)"
                    }}
                  >
                    {getHeadEmoji()}
                  </div>
                ) : (
                  // Snake body segment
                  <div
                    className="w-full h-full rounded-sm"
                    style={{
                      background: `linear-gradient(135deg,
                        rgba(34,197,94,${Math.max(0.3, 1 - i * 0.08)}) 0%,
                        rgba(22,163,74,${Math.max(0.2, 0.8 - i * 0.08)}) 100%)`,
                      boxShadow: i < 3 ? "0 0 6px rgba(34,197,94,0.3)" : "none"
                    }}
                  />
                )}
              </div>
            ))}

            {/* Food (Pod) */}
            <div
              className="absolute flex items-center justify-center"
              style={{
                left: food.x * GRID_SIZE,
                top: food.y * GRID_SIZE,
                width: GRID_SIZE,
                height: GRID_SIZE,
              }}
            >
              <div
                className="relative flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold animate-pulse"
                style={{
                  background: food.type === "healthy"
                    ? "linear-gradient(135deg, #4ade80, #22c55e)"
                    : "linear-gradient(135deg, #facc15, #eab308)",
                  boxShadow: food.type === "healthy"
                    ? "0 0 20px rgba(74,222,128,0.8), 0 0 40px rgba(34,197,94,0.4)"
                    : "0 0 20px rgba(250,204,21,0.8), 0 0 40px rgba(234,179,8,0.4)",
                  color: "#000"
                }}
              >
                {food.type === "healthy" ? "✓" : "?"}
              </div>
            </div>

            {/* Obstacles (OOMKilled pods) */}
            {obstacles.map((obs, i) => (
              <div
                key={`obs-${i}`}
                className="absolute flex items-center justify-center"
                style={{
                  left: obs.x * GRID_SIZE,
                  top: obs.y * GRID_SIZE,
                  width: GRID_SIZE,
                  height: GRID_SIZE,
                }}
              >
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold"
                  style={{
                    background: "linear-gradient(135deg, #f87171, #ef4444, #dc2626)",
                    boxShadow: "0 0 15px rgba(239,68,68,0.6), 0 0 30px rgba(220,38,38,0.3)",
                    color: "#fff"
                  }}
                >
                  ✕
                </div>
              </div>
            ))}

            {/* Menu Overlay */}
            {gameState === "menu" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm">
                <div className="mb-8 text-center">
                  <div className="mb-3 text-5xl">🐍</div>
                  <div className="font-mono text-3xl font-bold tracking-wider text-green-400">
                    KUBECTL SNAKE
                  </div>
                  <div className="mt-2 font-mono text-sm text-green-600/80">
                    Collect pods. Avoid OOMKilled.
                  </div>
                </div>

                <div className="mb-8 grid grid-cols-3 gap-4 font-mono text-xs">
                  <div className="flex flex-col items-center gap-2 rounded-lg bg-green-500/5 p-3 border border-green-500/10">
                    <div
                      className="h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold"
                      style={{ background: "linear-gradient(135deg, #4ade80, #22c55e)", color: "#000" }}
                    >✓</div>
                    <span className="text-green-400">Running</span>
                    <span className="text-green-600">+20 pts</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg bg-yellow-500/5 p-3 border border-yellow-500/10">
                    <div
                      className="h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold"
                      style={{ background: "linear-gradient(135deg, #facc15, #eab308)", color: "#000" }}
                    >?</div>
                    <span className="text-yellow-400">Pending</span>
                    <span className="text-yellow-600">+10 pts</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg bg-red-500/5 p-3 border border-red-500/10">
                    <div
                      className="h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold"
                      style={{ background: "linear-gradient(135deg, #f87171, #ef4444)", color: "#fff" }}
                    >✕</div>
                    <span className="text-red-400">OOMKilled</span>
                    <span className="text-red-600">Crash</span>
                  </div>
                </div>

                <button
                  onClick={startGame}
                  className="group rounded-xl border border-green-500/30 bg-gradient-to-r from-green-500/20 to-emerald-500/10 px-10 py-4 font-mono text-sm font-bold text-green-400 transition-all hover:from-green-500/30 hover:to-emerald-500/20 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:border-green-500/50"
                >
                  [ PRESS ENTER TO DEPLOY ]
                </button>

                <div className="mt-6 font-mono text-[10px] text-green-700/70">
                  ↑↓←→ or WASD to move • P pause • ESC exit
                </div>
              </div>
            )}

            {/* Game Over Overlay */}
            {gameState === "gameover" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm">
                <div className="mb-3 text-5xl">💥</div>
                <div className="font-mono text-3xl font-bold text-red-500">
                  POD CRASHED
                </div>
                <div className="mb-8 font-mono text-sm text-red-400/60">
                  Reason: CrashLoopBackOff
                </div>

                <div className="mb-2 font-mono text-xs uppercase tracking-wider text-green-600">Final Score</div>
                <div className="mb-6 font-mono text-5xl font-bold text-green-400">{score}</div>

                {score >= highScore && score > 0 && (
                  <div className="mb-6 flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-5 py-2 font-mono text-sm text-yellow-400">
                    🏆 NEW HIGH SCORE!
                  </div>
                )}

                <button
                  onClick={startGame}
                  className="rounded-xl border border-green-500/30 bg-green-500/10 px-10 py-4 font-mono text-sm font-bold text-green-400 transition-all hover:bg-green-500/20 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                >
                  [ RESTART DEPLOYMENT ]
                </button>
              </div>
            )}

            {/* Paused Overlay */}
            {gameState === "paused" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm">
                <div className="mb-3 text-5xl">⏸️</div>
                <div className="mb-4 font-mono text-3xl font-bold text-yellow-500">PAUSED</div>
                <div className="font-mono text-sm text-green-600">Press P to resume</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-green-500/10 pt-4">
            <div className="flex gap-2 font-mono text-[10px]">
              <span className="rounded-md bg-green-500/10 px-2 py-1 text-green-600">ESC</span>
              <span className="rounded-md bg-green-500/10 px-2 py-1 text-green-600">P</span>
              <span className="rounded-md bg-green-500/10 px-2 py-1 text-green-600">↑↓←→</span>
            </div>
            <div className="font-mono text-[10px] text-green-800">
              ↑↑↓↓←→←→BA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
