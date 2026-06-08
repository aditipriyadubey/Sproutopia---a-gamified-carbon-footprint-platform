import { levelFromXP, type GameState } from "@/lib/game-state";
import { Flame } from "lucide-react";

export function HUD({ state }: { state: GameState }) {
  const lv = levelFromXP(state.xp);
  const pct = Math.min(100, Math.round((lv.into / lv.needed) * 100));

  return (
    <div className="pixel-card p-3 sm:p-4">
      <div className="flex flex-wrap items-center gap-3 sm:gap-5">
        {/* level */}
        <div className="flex items-center gap-2">
          <div className="grid place-items-center h-10 w-10 rounded-md bg-primary text-primary-foreground font-display text-sm border-2 border-border">
            {lv.level}
          </div>
          <div>
            <div className="text-[9px] font-display text-muted-foreground">LEVEL</div>
            <div className="font-display text-xs sm:text-sm">{lv.name}</div>
          </div>
        </div>

        {/* XP bar */}
        <div className="flex-1 min-w-[160px]">
          <div className="flex justify-between text-[9px] font-display text-muted-foreground mb-1">
            <span>XP</span>
            <span>
              {lv.into}/{lv.needed}
            </span>
          </div>
          <div className="h-4 border-2 border-border bg-muted overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background:
                  "repeating-linear-gradient(45deg, var(--xp) 0 6px, color-mix(in oklab, var(--xp) 70%, white) 6px 12px)",
              }}
            />
          </div>
        </div>

        {/* coins */}
        <Stat label="COINS" value={state.coins} color="var(--coin)" icon="🪙" />
        {/* carbon */}
        <Stat label="CARBON" value={state.carbonScore} color="var(--leaf)" icon="🌿" />
        {/* streak */}
        <div className="flex items-center gap-1.5">
          <Flame className="h-5 w-5 text-[color:var(--flame)] animate-flame" fill="currentColor" />
          <div>
            <div className="text-[9px] font-display text-muted-foreground">STREAK</div>
            <div className="font-display text-sm">{state.streak}d</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: string;
}) {
  return (
    <div className="flex items-center gap-1.5 group select-none">
      <div
        className="h-7 w-7 grid place-items-center border-2 border-border text-sm transition-transform duration-200 group-hover:scale-110 active:scale-95"
        style={{ background: color }}
      >
        {icon}
      </div>
      <div>
        <div className="text-[9px] font-display text-muted-foreground transition-colors group-hover:text-foreground">
          {label}
        </div>
        <div className="font-display text-sm group-hover:scale-105 transition-transform duration-100 origin-left">
          {value}
        </div>
      </div>
    </div>
  );
}
