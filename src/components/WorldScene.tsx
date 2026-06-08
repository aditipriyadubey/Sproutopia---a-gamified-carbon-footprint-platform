import { useState, useMemo, useEffect } from "react";
import { STAGE_NAMES } from "@/lib/game-state";
import { Smogzilla } from "./Smogzilla";
import { Bloomy } from "./Bloomy";

// The big animated world that evolves with the user's stage (0..5)
export function WorldScene({
  stage,
  dailyCompleted = false,
}: {
  stage: number;
  dailyCompleted?: boolean;
}) {
  const [dismissedCelebration, setDismissedCelebration] = useState(false);

  useEffect(() => {
    if (!dailyCompleted) {
      setDismissedCelebration(false);
    }
  }, [dailyCompleted]);

  const s = Math.max(0, Math.min(5, stage));
  const greenness = s / 5;

  // sky color shift: gray -> blue
  const skyTop = mix("#7a7d8c", "#9fd6ff", greenness);
  const skyBot = mix("#aab0b8", "#dff3ff", greenness);
  const grassColor = mix("#7e7654", "#5fae46", greenness);
  const grassDark = mix("#5d5640", "#3f8a32", greenness);

  const trees = [0, 1, 2, 3].filter((_, i) => s >= i + 1);
  const flowers = dailyCompleted ? 12 : s >= 2 ? 6 : 0;
  const animals = dailyCompleted ? 3 : s >= 4 ? 3 : 0;

  const smogWeakness = Math.min(5, s + 1) as 1 | 2 | 3 | 4 | 5;

  const confettiParticles = useMemo(() => {
    if (!dailyCompleted) return [];
    return Array.from({ length: 45 }).map((_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2.5 + Math.random() * 2.5,
      size: 6 + Math.round(Math.random() * 6),
      color: ["#ff5d5d", "#ffd96a", "#3ab0ff", "#ff7aa8", "#9bd766", "#ffb13b"][i % 6],
    }));
  }, [dailyCompleted]);

  const showCelebrationOverlay = dailyCompleted && !dismissedCelebration;

  return (
    <div className="pixel-card relative w-full overflow-hidden">
      <div
        className="relative h-[320px] sm:h-[380px] md:h-[440px] w-full"
        style={{ background: `linear-gradient(to bottom, ${skyTop} 0%, ${skyBot} 70%)` }}
      >
        {/* clouds */}
        <Cloud top={20} delay={0} opacity={0.5 + greenness * 0.5} />
        <Cloud top={60} delay={-30} opacity={0.4 + greenness * 0.5} />
        <Cloud top={100} delay={-15} opacity={0.5 + greenness * 0.5} />

        {/* sun / rainbow when thriving */}
        <div
          className="absolute right-6 top-6 h-14 w-14 rounded-full"
          style={{
            background: mix("#c9c2a8", "#ffe27a", greenness),
            boxShadow: `0 0 ${20 + greenness * 30}px ${mix("#bbb", "#ffd96a", greenness)}`,
          }}
        />

        {/* Confetti particles */}
        {dailyCompleted &&
          confettiParticles.map((p, i) => (
            <div
              key={i}
              className="absolute animate-confetti pointer-events-none z-10"
              style={{
                left: `${p.left}%`,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                top: -20,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                boxShadow: "1px 1px 0 0 rgba(0,0,0,0.15)",
              }}
            />
          ))}

        {/* Smogzilla weakens / disappears */}
        {s < 5 && (
          <div
            className="absolute left-4 top-4 sm:left-8 sm:top-8 transition-all duration-1000 ease-out"
            style={{
              transform: dailyCompleted ? "scale(0) rotate(180deg)" : "scale(1) rotate(0deg)",
              opacity: dailyCompleted ? 0 : 1,
              pointerEvents: dailyCompleted ? "none" : "auto",
            }}
          >
            <Smogzilla size={96} weakness={smogWeakness} />
          </div>
        )}

        {/* trees */}
        <div className="absolute inset-x-0 bottom-[78px] flex justify-around items-end px-6 pointer-events-none">
          {trees.map((i) => (
            <PixelTree key={i} variant={i % 2 === 0 ? "round" : "tall"} grow={greenness} />
          ))}
        </div>

        {/* flowers */}
        {flowers > 0 && (
          <div className="absolute inset-x-0 bottom-[60px] flex justify-around px-10">
            {Array.from({ length: flowers }).map((_, i) => (
              <PixelFlower key={i} hue={i * (360 / flowers)} />
            ))}
          </div>
        )}

        {/* animals */}
        {animals > 0 && (
          <div className="absolute inset-x-0 bottom-[70px] flex justify-between px-12">
            <PixelBunny />
            <PixelBird />
            <PixelDeer />
          </div>
        )}

        {/* Bloomy on the grass */}
        <div className="absolute bottom-[60px] right-8 animate-bob">
          <Bloomy size={64} mood={dailyCompleted ? "hero" : s >= 3 ? "cheer" : "happy"} />
        </div>

        {/* ground */}
        <div className="absolute inset-x-0 bottom-0 h-[80px]" style={{ background: grassColor }}>
          <div
            className="absolute inset-x-0 top-0 h-3"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${grassDark} 0 6px, ${grassColor} 6px 12px)`,
            }}
          />
        </div>

        {/* Celebration Overlay */}
        {showCelebrationOverlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 z-20 animate-fade-in p-4 text-center">
            <div className="pixel-card bg-card p-5 max-w-[280px] sm:max-w-xs border-[3px] border-primary shadow-[6px_6px_0_0_rgba(0,0,0,0.3)] animate-pop-in space-y-3 relative">
              <button
                onClick={() => setDismissedCelebration(true)}
                className="absolute right-2 top-2 text-muted-foreground hover:text-foreground hover:scale-110 active:translate-y-0.5 cursor-pointer font-bold text-sm"
                aria-label="Close celebration message"
              >
                ✕
              </button>
              <div className="flex justify-center gap-1.5 items-center">
                <span className="text-xl animate-bounce">✨</span>
                <div className="font-display text-[9px] sm:text-[10px] text-primary leading-relaxed">
                  SMOGZILLA DEFEATED!
                </div>
                <span className="text-xl animate-bounce" style={{ animationDelay: "0.2s" }}>
                  ✨
                </span>
              </div>
              <p className="font-display text-[10px] sm:text-xs text-foreground leading-normal px-2">
                "Today, our world blooms because of you."
              </p>
              <div className="flex justify-center items-center gap-2 pt-1">
                <PixelHeart />
                <Bloomy size={44} mood="hero" />
                <PixelHeart />
              </div>
              <button
                onClick={() => setDismissedCelebration(true)}
                className="font-display text-[8px] sm:text-[9px] px-2.5 py-1.5 bg-primary text-primary-foreground border-2 border-border hover:bg-primary/95 transition-colors duration-150 cursor-pointer"
              >
                View World
              </button>
            </div>
          </div>
        )}

        {/* CRT vibe */}
        <div className="absolute inset-0 pointer-events-none crt-scanlines" />
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t-[3px] border-border bg-card">
        <div>
          <div className="text-[10px] font-display text-muted-foreground">WORLD STAGE</div>
          <div className="font-display text-sm sm:text-base text-foreground">{STAGE_NAMES[s]}</div>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-3 w-6 border-2 border-border"
              style={{ background: i <= s ? grassDark : "transparent" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Cloud({ top, delay, opacity }: { top: number; delay: number; opacity: number }) {
  return (
    <div
      className="absolute animate-float-cloud"
      style={{ top, animationDelay: `${delay}s`, opacity }}
    >
      <svg viewBox="0 0 60 24" width="120" height="48" className="pixelated">
        {[
          [2, 12],
          [2, 18],
          [8, 6],
          [8, 12],
          [8, 18],
          [14, 6],
          [14, 12],
          [14, 18],
          [20, 0],
          [20, 6],
          [20, 12],
          [20, 18],
          [26, 0],
          [26, 6],
          [26, 12],
          [26, 18],
          [32, 6],
          [32, 12],
          [32, 18],
          [38, 6],
          [38, 12],
          [38, 18],
          [44, 12],
          [44, 18],
          [50, 12],
          [50, 18],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width={6} height={6} fill="#ffffff" />
        ))}
      </svg>
    </div>
  );
}

function PixelTree({ variant, grow }: { variant: "round" | "tall"; grow: number }) {
  const size = 60 + grow * 24;
  const leaf = mix("#7a8f53", "#4ea143", grow);
  const leafDark = mix("#5a6d3f", "#2f7c2a", grow);
  const trunk = "#6b4a2a";
  return (
    <svg viewBox="0 0 20 24" width={size} height={size * 1.2} className="pixelated animate-sway">
      {variant === "round" ? (
        <>
          {[
            [6, 0],
            [8, 0],
            [10, 0],
            [4, 2],
            [6, 2],
            [8, 2],
            [10, 2],
            [12, 2],
            [4, 4],
            [6, 4],
            [8, 4],
            [10, 4],
            [12, 4],
            [6, 6],
            [8, 6],
            [10, 6],
          ].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width={2} height={2} fill={i % 3 === 0 ? leafDark : leaf} />
          ))}
        </>
      ) : (
        <>
          {[
            [6, 0],
            [8, 0],
            [10, 0],
            [4, 2],
            [6, 2],
            [8, 2],
            [10, 2],
            [12, 2],
            [6, 4],
            [8, 4],
            [10, 4],
            [8, 6],
          ].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width={2} height={2} fill={i % 2 === 0 ? leafDark : leaf} />
          ))}
        </>
      )}
      <rect x={8} y={8} width={2} height={6} fill={trunk} />
    </svg>
  );
}

function PixelFlower({ hue }: { hue: number }) {
  const c1 = `hsl(${hue}, 80%, 65%)`;
  const c2 = `hsl(${hue}, 80%, 78%)`;
  return (
    <svg viewBox="0 0 8 10" width={20} height={28} className="pixelated">
      <rect x={2} y={0} width={2} height={2} fill={c1} />
      <rect x={4} y={0} width={2} height={2} fill={c2} />
      <rect x={0} y={2} width={2} height={2} fill={c2} />
      <rect x={2} y={2} width={4} height={2} fill="#ffd24c" />
      <rect x={6} y={2} width={2} height={2} fill={c1} />
      <rect x={2} y={4} width={2} height={2} fill={c2} />
      <rect x={4} y={4} width={2} height={2} fill={c1} />
      <rect x={3} y={6} width={2} height={4} fill="#3f8a32" />
    </svg>
  );
}

function PixelBunny() {
  return (
    <svg viewBox="0 0 10 10" width={28} height={28} className="pixelated animate-bob">
      <rect x={2} y={0} width={2} height={4} fill="#fff" />
      <rect x={6} y={0} width={2} height={4} fill="#fff" />
      <rect x={2} y={4} width={6} height={4} fill="#fff" />
      <rect x={3} y={5} width={1} height={1} fill="#000" />
      <rect x={6} y={5} width={1} height={1} fill="#000" />
      <rect x={4} y={6} width={2} height={1} fill="#ff9bb3" />
    </svg>
  );
}
function PixelBird() {
  return (
    <svg viewBox="0 0 12 8" width={32} height={20} className="pixelated animate-bounce">
      <rect x={2} y={2} width={6} height={4} fill="#3ab0ff" />
      <rect x={8} y={3} width={2} height={2} fill="#3ab0ff" />
      <rect x={10} y={4} width={1} height={1} fill="#ffae3a" />
      <rect x={9} y={3} width={1} height={1} fill="#000" />
      <rect x={0} y={3} width={2} height={2} fill="#1d8acc">
        <animate attributeName="y" values="3;1;3" dur="0.6s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}
function PixelDeer() {
  return (
    <svg viewBox="0 0 14 12" width={36} height={32} className="pixelated">
      <rect x={2} y={0} width={1} height={2} fill="#6b4a2a" />
      <rect x={3} y={0} width={1} height={2} fill="#6b4a2a" />
      <rect x={1} y={2} width={4} height={3} fill="#c08c5a" />
      <rect x={4} y={5} width={8} height={4} fill="#c08c5a" />
      <rect x={2} y={3} width={1} height={1} fill="#000" />
      <rect x={5} y={9} width={1} height={3} fill="#6b4a2a" />
      <rect x={10} y={9} width={1} height={3} fill="#6b4a2a" />
    </svg>
  );
}

function PixelHeart() {
  return (
    <svg viewBox="0 0 8 8" width={16} height={16} className="pixelated animate-bounce shrink-0">
      {[
        [2, 1],
        [3, 1],
        [5, 1],
        [6, 1],
        [1, 2],
        [2, 2],
        [3, 2],
        [4, 2],
        [5, 2],
        [6, 2],
        [7, 2],
        [1, 3],
        [2, 3],
        [3, 3],
        [4, 3],
        [5, 3],
        [6, 3],
        [7, 3],
        [2, 4],
        [3, 4],
        [4, 4],
        [5, 4],
        [6, 4],
        [3, 5],
        [4, 5],
        [5, 5],
        [4, 6],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={1} height={1} fill="#e63946" />
      ))}
    </svg>
  );
}

// Hex color mix helper
function mix(a: string, b: string, t: number): string {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  const r = Math.round(pa.r + (pb.r - pa.r) * t);
  const g = Math.round(pa.g + (pb.g - pa.g) * t);
  const bl = Math.round(pa.b + (pb.b - pa.b) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}
function hexToRgb(h: string) {
  const s = h.replace("#", "");
  return {
    r: parseInt(s.slice(0, 2), 16),
    g: parseInt(s.slice(2, 4), 16),
    b: parseInt(s.slice(4, 6), 16),
  };
}
