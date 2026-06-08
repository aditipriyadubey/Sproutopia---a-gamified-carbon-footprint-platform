// Sproutopia game state — persisted to localStorage.
import { useEffect, useState, useCallback, useSyncExternalStore } from "react";

export type CarbonAnswers = {
  transport: "car_daily" | "mixed" | "transit" | "bike_walk";
  electricity: "high" | "medium" | "low" | "renewable";
  diet: "meat_heavy" | "balanced" | "vegetarian" | "vegan";
  shopping: "lots" | "some" | "minimal";
  waste: "no_recycle" | "some_recycle" | "zero_waste";
};

export type Mission = {
  id: string;
  completedAt: string; // ISO date
};

export type GameState = {
  onboarded: boolean;
  name: string;
  answers: CarbonAnswers | null;
  carbonScore: number; // 0-100, higher = greener
  xp: number;
  coins: number;
  streak: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  completedToday: string[]; // mission IDs completed today
  totalCompleted: number;
  achievements: string[];
  worldStage: number; // 0..5
};

const KEY = "sproutopia_v1";

const initialState: GameState = {
  onboarded: false,
  name: "Eco Friend",
  answers: null,
  carbonScore: 30,
  xp: 0,
  coins: 0,
  streak: 0,
  lastActiveDate: null,
  completedToday: [],
  totalCompleted: 0,
  achievements: [],
  worldStage: 0,
};

const listeners = new Set<() => void>();
let cached: GameState | null = null;

function read(): GameState {
  if (cached) return cached;
  if (typeof window === "undefined") return initialState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      cached = initialState;
      return cached;
    }
    cached = { ...initialState, ...JSON.parse(raw) };
    return cached!;
  } catch {
    cached = initialState;
    return cached;
  }
}

function write(s: GameState) {
  cached = s;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useGameState() {
  const state = useSyncExternalStore(
    subscribe,
    () => read(),
    () => initialState,
  );

  const update = useCallback((updater: (s: GameState) => GameState) => {
    write(updater(read()));
  }, []);

  return { state, update };
}

// --- helpers ---

export function carbonFromAnswers(a: CarbonAnswers): number {
  // higher = greener (better)
  const map = {
    transport: { car_daily: 5, mixed: 12, transit: 18, bike_walk: 22 },
    electricity: { high: 5, medium: 12, low: 18, renewable: 22 },
    diet: { meat_heavy: 5, balanced: 12, vegetarian: 18, vegan: 22 },
    shopping: { lots: 5, some: 12, minimal: 18 },
    waste: { no_recycle: 5, some_recycle: 12, zero_waste: 18 },
  } as const;
  return (
    map.transport[a.transport] +
    map.electricity[a.electricity] +
    map.diet[a.diet] +
    map.shopping[a.shopping] +
    map.waste[a.waste]
  );
}

export function stageFromScore(score: number, totalCompleted: number): number {
  // Combine carbon score and momentum
  const composite = score + Math.min(50, totalCompleted * 2);
  if (composite >= 130) return 5;
  if (composite >= 110) return 4;
  if (composite >= 85) return 3;
  if (composite >= 60) return 2;
  if (composite >= 40) return 1;
  return 0;
}

export const STAGE_NAMES = [
  "Polluted Wasteland",
  "Small Green Patch",
  "Flower Garden",
  "Growing Forest",
  "Wildlife Sanctuary",
  "Thriving Paradise",
];

export const LEVEL_NAMES = [
  "Seed",
  "Sprout",
  "Sapling",
  "Tree",
  "Forest Guardian",
  "Planet Protector",
];

export function levelFromXP(xp: number): {
  level: number;
  name: string;
  into: number;
  needed: number;
} {
  const thresholds = [0, 80, 220, 450, 800, 1300];
  let level = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) level = i;
  }
  const cur = thresholds[level];
  const next = thresholds[level + 1] ?? cur + 800;
  return {
    level,
    name: LEVEL_NAMES[level],
    into: xp - cur,
    needed: next - cur,
  };
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

// rolls daily mission list & streak housekeeping
export function rolloverDay(s: GameState): GameState {
  const today = todayKey();
  if (s.lastActiveDate === today) return s;
  let streak = s.streak;
  if (s.lastActiveDate) {
    const last = new Date(s.lastActiveDate);
    const diff = Math.round((Date.now() - last.getTime()) / 86400000);
    if (diff === 1)
      streak = s.streak; // continued via completion later
    else streak = 0;
  }
  return { ...s, completedToday: [], streak };
}
