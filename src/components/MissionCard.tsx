import { type MissionDef } from "@/lib/missions-data";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function MissionCard({
  mission,
  done,
  onComplete,
}: {
  mission: MissionDef;
  done: boolean;
  onComplete: () => void;
}) {
  return (
    <button
      onClick={onComplete}
      disabled={done}
      className={cn(
        "pixel-card text-left p-3 sm:p-4 group transition-transform",
        "hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.22)]",
        "disabled:opacity-80 disabled:cursor-default disabled:hover:translate-y-0",
        done && "bg-[color-mix(in_oklab,var(--primary)_18%,var(--card))]",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "h-12 w-12 grid place-items-center text-2xl border-2 border-border shrink-0",
            done ? "bg-primary" : "bg-secondary",
          )}
        >
          {done ? (
            <div className="animate-pop-in">
              <Check className="h-6 w-6 text-primary-foreground" strokeWidth={3} />
            </div>
          ) : (
            mission.icon
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-xs sm:text-sm leading-tight mb-1">{mission.title}</div>
          <div className="text-sm text-muted-foreground line-clamp-2">{mission.description}</div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <Pill>+{mission.xp} XP</Pill>
            <Pill>+{mission.coins} 🪙</Pill>
            <Pill>+{mission.carbon} 🌿</Pill>
          </div>
        </div>
      </div>
    </button>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-display text-[9px] px-1.5 py-0.5 bg-background border-2 border-border">
      {children}
    </span>
  );
}
