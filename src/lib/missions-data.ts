// Mission & achievement data
export type MissionDef = {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji
  xp: number;
  coins: number;
  carbon: number; // bump to carbon score
  category: "transport" | "energy" | "food" | "waste" | "nature";
};

export const ALL_MISSIONS: MissionDef[] = [
  {
    id: "bottle",
    title: "Carry a reusable bottle",
    description: "Use a reusable bottle and refuse single-use plastic.",
    icon: "🥤",
    xp: 10,
    coins: 4,
    carbon: 1,
    category: "waste",
  },
  {
    id: "cloth_bag",
    title: "Use a cloth bag",
    description: "Bring your own reusable cloth bag for shopping.",
    icon: "🛍️",
    xp: 12,
    coins: 5,
    carbon: 1,
    category: "waste",
  },
  {
    id: "shorter_shower",
    title: "Reduce shower time",
    description: "Keep it under 5 minutes to save water and energy.",
    icon: "🚿",
    xp: 10,
    coins: 4,
    carbon: 1,
    category: "energy",
  },
  {
    id: "recycle",
    title: "Recycle waste",
    description: "Sort and recycle paper, plastic, glass, or metal correctly.",
    icon: "♻️",
    xp: 10,
    coins: 4,
    carbon: 1,
    category: "waste",
  },
  {
    id: "unplug_chargers",
    title: "Unplug unused chargers",
    description: "Unplug phone and laptop chargers when not in use.",
    icon: "🔌",
    xp: 10,
    coins: 4,
    carbon: 1,
    category: "energy",
  },
  {
    id: "walk",
    title: "Walk short distances",
    description: "Walk instead of driving or taking a ride for nearby trips.",
    icon: "🚶",
    xp: 15,
    coins: 6,
    carbon: 2,
    category: "transport",
  },
  {
    id: "transit",
    title: "Use public transport",
    description: "Take a bus, metro, or train instead of driving alone.",
    icon: "🚌",
    xp: 20,
    coins: 8,
    carbon: 2,
    category: "transport",
  },
  {
    id: "plant_sapling",
    title: "Plant a sapling",
    description: "Plant a new sapling or take care of plants in your garden.",
    icon: "🌱",
    xp: 25,
    coins: 10,
    carbon: 3,
    category: "nature",
  },
  {
    id: "reduce_food_waste",
    title: "Reduce food waste",
    description: "Finish leftovers or plan meals to avoid throwing food away.",
    icon: "🥗",
    xp: 12,
    coins: 5,
    carbon: 1,
    category: "food",
  },
  {
    id: "natural_lighting",
    title: "Use natural lighting",
    description: "Open curtains and use natural sunlight instead of electric lights.",
    icon: "☀️",
    xp: 10,
    coins: 4,
    carbon: 1,
    category: "energy",
  },
  {
    id: "donate_items",
    title: "Donate unused items",
    description: "Give away clothes, books, or toys you no longer need.",
    icon: "🎁",
    xp: 15,
    coins: 6,
    carbon: 2,
    category: "waste",
  },
  {
    id: "support_local",
    title: "Support local products",
    description: "Buy locally grown food or goods to reduce transport emissions.",
    icon: "🛒",
    xp: 16,
    coins: 6,
    carbon: 2,
    category: "food",
  },
  {
    id: "meatless",
    title: "Meatless meal",
    description: "Have a delicious veggie or plant-based meal today.",
    icon: "🥦",
    xp: 16,
    coins: 6,
    carbon: 2,
    category: "food",
  },
  {
    id: "bike",
    title: "Bike a trip",
    description: "Choose pedaling over fuel for a cleaner environment.",
    icon: "🚴",
    xp: 22,
    coins: 9,
    carbon: 2,
    category: "transport",
  },
  {
    id: "cold_wash",
    title: "Cold-water laundry",
    description: "Wash clothes with cold water to save heating energy.",
    icon: "🧺",
    xp: 12,
    coins: 5,
    carbon: 1,
    category: "energy",
  },
];

// pick a stable daily set
export function getDailyMissions(seedDate: string, count = 4): MissionDef[] {
  let h = 0;
  for (let i = 0; i < seedDate.length; i++) h = (h * 31 + seedDate.charCodeAt(i)) >>> 0;
  const pool = [...ALL_MISSIONS];
  const out: MissionDef[] = [];
  for (let i = 0; i < count && pool.length; i++) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const idx = h % pool.length;
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

export type AchievementDef = {
  id: string;
  title: string;
  description: string;
  icon: string;
  check: (s: import("./game-state").GameState) => boolean;
};

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_step",
    title: "First Green Step",
    description: "Complete your first mission",
    icon: "🌱",
    check: (s) => s.totalCompleted >= 1,
  },
  {
    id: "streak_3",
    title: "Getting Rooted",
    description: "3-day streak",
    icon: "🔥",
    check: (s) => s.streak >= 3,
  },
  {
    id: "streak_7",
    title: "7-Day Streak",
    description: "A full eco-week!",
    icon: "🔥🔥",
    check: (s) => s.streak >= 7,
  },
  {
    id: "crusher",
    title: "Carbon Crusher",
    description: "Carbon score above 80",
    icon: "💪",
    check: (s) => s.carbonScore >= 80,
  },
  {
    id: "plastic_free",
    title: "Plastic-Free Hero",
    description: "Complete 5 waste missions",
    icon: "🦸",
    check: (s) => s.totalCompleted >= 5,
  },
  {
    id: "guardian",
    title: "Forest Guardian",
    description: "Reach the Growing Forest stage",
    icon: "🌳",
    check: (s) => s.worldStage >= 3,
  },
  {
    id: "protector",
    title: "Planet Protector",
    description: "Reach the Thriving Paradise",
    icon: "🌍",
    check: (s) => s.worldStage >= 5,
  },
  {
    id: "veteran",
    title: "Eco Veteran",
    description: "Complete 25 missions total",
    icon: "🏆",
    check: (s) => s.totalCompleted >= 25,
  },
];

export const WEEKLY_CHALLENGES = [
  {
    id: "low_carbon",
    title: "Low Carbon Week",
    description: "Complete 10 missions in 7 days",
    icon: "🌬️",
    target: 10,
  },
  {
    id: "plastic_free",
    title: "Plastic-Free Challenge",
    description: "5 waste-cutting missions",
    icon: "🚯",
    target: 5,
  },
  {
    id: "transit_week",
    title: "Public Transport Week",
    description: "5 transport missions",
    icon: "🚆",
    target: 5,
  },
  {
    id: "energy_saver",
    title: "Energy Saver",
    description: "5 energy missions",
    icon: "⚡",
    target: 5,
  },
];
