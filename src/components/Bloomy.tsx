import { cn } from "@/lib/utils";

// Bloomy: an adorable pixel sprout, built in pure SVG with chunky pixels.
export function Bloomy({
  size = 96,
  mood = "happy",
  className,
}: {
  size?: number;
  mood?: "happy" | "wave" | "wink" | "cheer" | "hero";
  className?: string;
}) {
  const p = 8; // pixel size in viewBox units
  // 12x12 grid; '.' empty, 'L' leaf-dark, 'l' leaf, 'g' leaf-light,
  // 's' stem, 'f' face (cream), 'e' eye, 'c' cheek, 'm' mouth, 'b' bloom, 'K' crown, 'R' cape
  const grid =
    mood === "hero"
      ? [
          "....KKKK....",
          "...K.KK.K...",
          "..LlggglL...",
          "...LllllL...",
          "....LssL....",
          "...ffffff...",
          "..ffeeeeff..",
          "..fffmmfff..",
          "..ffcmmcff..",
          "...ffffff...",
          "..RssssssR..",
          ".RRggggggRR.",
        ]
      : mood === "cheer"
        ? [
            "....bL.Lb...",
            "...LlLLlL...",
            "..LlggglL...",
            "...LllllL...",
            "....LssL....",
            "...ffffff...",
            "..ffeeeeff..",
            "..fffmmfff..",
            "..ffcmmcff..",
            "...ffffff...",
            "....ssss....",
            "...gggggg...",
          ]
        : [
            ".....LL.....",
            "....LlLL....",
            "...LlggL....",
            "...LlllL....",
            "....LssL....",
            "...ffffff...",
            "..ffeefeff..",
            "..fffffmf...",
            "..ffcmmcff..",
            "...ffffff...",
            "....ssss....",
            "...gggggg...",
          ];

  const C = {
    L: "#2f6b2a",
    l: "#5fae46",
    g: "#9bd766",
    s: "#3f8a32",
    f: "#fff4d6",
    e: "#1f1f1f",
    c: "#ffb1b1",
    m: "#7a3a25",
    b: "#ff7aa8",
    K: "#ffd700", // gold crown
    R: "#e63946", // red cape
  } as const;

  return (
    <svg
      viewBox={`0 0 ${12 * p} ${12 * p}`}
      width={size}
      height={size}
      className={cn("pixelated drop-shadow-[2px_2px_0_rgba(0,0,0,0.25)]", className)}
      aria-label="Bloomy the sprout"
    >
      {grid.map((row, y) =>
        row.split("").map((ch, x) => {
          if (ch === ".") return null;
          const fill = (C as Record<string, string>)[ch] ?? "#000";
          return <rect key={`${x}-${y}`} x={x * p} y={y * p} width={p} height={p} fill={fill} />;
        }),
      )}
      {mood === "wave" && (
        <rect x={p * 10} y={p * 6} width={p} height={p} fill={C.l}>
          <animate
            attributeName="y"
            values={`${p * 6};${p * 5};${p * 6}`}
            dur="0.8s"
            repeatCount="indefinite"
          />
        </rect>
      )}
    </svg>
  );
}
