import { useEffect, useState } from "react";
import { Bloomy } from "./Bloomy";
import { X } from "lucide-react";
import { cn } from "../lib/utils";

export type Toast = {
  id: number;
  title: string;
  body?: string;
  icon?: string;
  variant?: "achievement" | "level" | "stage" | "info";
};

let counter = 1;
const listeners = new Set<(t: Toast) => void>();

export function pushToast(t: Omit<Toast, "id">) {
  const toast = { ...t, id: counter++ };
  listeners.forEach((l) => l(toast));
}

export function ToastHost() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    const l = (t: Toast) => {
      setItems((prev) => [...prev, t]);
      setTimeout(() => setItems((p) => p.filter((x) => x.id !== t.id)), 4500);
    };
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {items.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pixel-card animate-pop-in p-3 flex items-center gap-3 bg-card transition-all duration-300",
            t.variant === "achievement" &&
              "border-yellow-500 bg-yellow-50/70 dark:bg-yellow-950/20",
            t.variant === "level" && "border-blue-500 bg-blue-50/70 dark:bg-blue-950/20",
            t.variant === "stage" && "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/20",
          )}
        >
          <div className="h-12 w-12 grid place-items-center bg-secondary border-2 border-border text-2xl">
            {t.variant === "achievement"
              ? "🏆"
              : t.variant === "stage"
                ? "🌍"
                : t.variant === "level"
                  ? "⭐"
                  : (t.icon ?? <Bloomy size={36} />)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-[10px] text-muted-foreground">
              {t.variant === "achievement"
                ? "ACHIEVEMENT UNLOCKED"
                : t.variant === "stage"
                  ? "WORLD EVOLVED"
                  : t.variant === "level"
                    ? "LEVEL UP"
                    : "BLOOMY"}
            </div>
            <div className="font-display text-xs leading-tight mt-0.5">{t.title}</div>
            {t.body && <div className="text-xs text-muted-foreground mt-1">{t.body}</div>}
          </div>
          <button
            onClick={() => setItems((p) => p.filter((x) => x.id !== t.id))}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
