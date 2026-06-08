import { cn } from "@/lib/utils";

// Smogzilla: a pixel pollution monster. Strength scales with weakness (1..5),
// where weakness=5 means fully defeated (faded/smaller).
export function Smogzilla({
  size = 120,
  weakness = 1, // 1 = full power, 5 = nearly defeated
  className,
}: {
  size?: number;
  weakness?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}) {
  const p = 6;
  const grid = [
    "...SSSSSS...",
    "..SddddddS..",
    ".SddhhhhddS.",
    ".SdhEEhhEhdS".slice(0, 12),
    ".SdhhhhhhhS.",
    ".SddmmmmddS.",
    "..SddddddS..",
    "..SdSddSdSd.".slice(0, 12),
    "...SSSSSS...",
    "...S....S...",
    "..SS....SS..",
    ".SS......SS.",
  ];
  const C = {
    S: "#2a223a",
    d: "#4a3c66",
    h: "#6b5b86",
    E: "#ff5d5d",
    m: "#1a1a1a",
  } as const;

  const opacity = 1 - (weakness - 1) * 0.18;
  const scale = 1 - (weakness - 1) * 0.06;

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      {/* smog wisps */}
      <div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background: `radial-gradient(circle, rgba(80,60,110,${0.35 * opacity}) 0%, transparent 70%)`,
        }}
      />
      <svg
        viewBox={`0 0 ${12 * p} ${12 * p}`}
        width={size}
        height={size}
        className="pixelated relative animate-bob"
        style={{
          opacity,
          transform: `scale(${scale})`,
          filter: weakness >= 4 ? "grayscale(0.6)" : "none",
        }}
        aria-label="Smogzilla pollution monster"
      >
        {grid.map((row, y) =>
          row.split("").map((ch, x) => {
            if (ch === "." || ch === " ") return null;
            const fill = (C as Record<string, string>)[ch] ?? "#000";
            return <rect key={`${x}-${y}`} x={x * p} y={y * p} width={p} height={p} fill={fill} />;
          }),
        )}
      </svg>
    </div>
  );
}
