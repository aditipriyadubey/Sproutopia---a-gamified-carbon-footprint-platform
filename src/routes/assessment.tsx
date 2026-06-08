import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bloomy } from "@/components/Bloomy";
import {
  carbonFromAnswers,
  stageFromScore,
  useGameState,
  type CarbonAnswers,
} from "@/lib/game-state";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    meta: [
      { title: "Carbon assessment — Sproutopia" },
      {
        name: "description",
        content: "Quick onboarding to size up your footprint and meet Bloomy.",
      },
    ],
  }),
  component: Assessment,
});

type Step =
  | { kind: "intro" }
  | { kind: "name" }
  | { kind: "question"; idx: number }
  | { kind: "result" };

const QUESTIONS = [
  {
    key: "transport" as const,
    icon: "🚗",
    title: "How do you usually get around?",
    options: [
      { v: "car_daily", label: "Drive daily" },
      { v: "mixed", label: "Mix of car & transit" },
      { v: "transit", label: "Mostly public transport" },
      { v: "bike_walk", label: "Bike or walk" },
    ],
  },
  {
    key: "electricity" as const,
    icon: "💡",
    title: "How would you describe your home energy use?",
    options: [
      { v: "high", label: "AC/heat on a lot" },
      { v: "medium", label: "Average" },
      { v: "low", label: "Pretty mindful" },
      { v: "renewable", label: "Renewable / green plan" },
    ],
  },
  {
    key: "diet" as const,
    icon: "🍽️",
    title: "What's your diet like?",
    options: [
      { v: "meat_heavy", label: "Meat with most meals" },
      { v: "balanced", label: "Balanced" },
      { v: "vegetarian", label: "Vegetarian" },
      { v: "vegan", label: "Vegan / plant-based" },
    ],
  },
  {
    key: "shopping" as const,
    icon: "🛍️",
    title: "How often do you shop new stuff?",
    options: [
      { v: "lots", label: "Pretty often" },
      { v: "some", label: "Sometimes" },
      { v: "minimal", label: "Rarely / second-hand" },
    ],
  },
  {
    key: "waste" as const,
    icon: "🗑️",
    title: "How do you handle waste?",
    options: [
      { v: "no_recycle", label: "Mostly trash bin" },
      { v: "some_recycle", label: "Recycle when I can" },
      { v: "zero_waste", label: "Zero-waste mindset" },
    ],
  },
];

function Assessment() {
  const navigate = useNavigate();
  const { update } = useGameState();
  const [step, setStep] = useState<Step>({ kind: "intro" });
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<Partial<CarbonAnswers>>({});

  const total = QUESTIONS.length;

  if (step.kind === "intro") {
    return (
      <Frame>
        <div className="flex flex-col items-center text-center gap-4">
          <Bloomy size={140} mood="wave" />
          <h1 className="text-2xl">Hi! I'm Bloomy 🌱</h1>
          <p className="text-muted-foreground max-w-md">
            Smogzilla has polluted this world. With your real-life eco choices, we're going to bring
            it back to life — one sprout at a time.
          </p>
          <button
            onClick={() => setStep({ kind: "name" })}
            className="font-display text-xs px-4 py-3 bg-primary text-primary-foreground border-2 border-border shadow-[4px_4px_0_0_rgba(0,0,0,0.22)]"
          >
            ▶ Let's go!
          </button>
        </div>
      </Frame>
    );
  }

  if (step.kind === "name") {
    return (
      <Frame>
        <div className="flex flex-col items-center text-center gap-4">
          <Bloomy size={100} mood="wink" />
          <h2 className="text-xl">What should I call you?</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full max-w-xs px-3 py-2 border-2 border-border bg-card text-center font-display text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => setStep({ kind: "question", idx: 0 })}
            disabled={!name.trim()}
            className="font-display text-xs px-4 py-3 bg-primary text-primary-foreground border-2 border-border disabled:opacity-50"
          >
            Nice to meet you!
          </button>
        </div>
      </Frame>
    );
  }

  if (step.kind === "question") {
    const q = QUESTIONS[step.idx];
    const pct = Math.round((step.idx / total) * 100);
    return (
      <Frame>
        <div className="mb-4">
          <div className="flex justify-between text-[10px] font-display text-muted-foreground mb-1">
            <span>
              Q{step.idx + 1} of {total}
            </span>
            <span>{pct}%</span>
          </div>
          <div className="h-3 border-2 border-border bg-muted overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{q.icon}</div>
          <h2 className="text-xl">{q.title}</h2>
        </div>
        <div className="grid gap-3">
          {q.options.map((o) => (
            <button
              key={o.v}
              onClick={() => {
                const next = { ...answers, [q.key]: o.v };
                setAnswers(next);
                if (step.idx + 1 < total) setStep({ kind: "question", idx: step.idx + 1 });
                else {
                  // finalize
                  const full = next as CarbonAnswers;
                  const score = carbonFromAnswers(full);
                  update((s) => ({
                    ...s,
                    onboarded: true,
                    name: name || s.name,
                    answers: full,
                    carbonScore: score,
                    worldStage: stageFromScore(score, s.totalCompleted),
                  }));
                  setStep({ kind: "result" });
                }
              }}
              className="pixel-card p-3 text-left font-display text-xs hover:bg-muted active:translate-y-0.5"
            >
              {o.label}
            </button>
          ))}
        </div>
      </Frame>
    );
  }

  // result
  const full = answers as CarbonAnswers;
  const score = carbonFromAnswers(full);
  const stage = stageFromScore(score, 0);
  const treesEquivalent = Math.max(1, Math.round((100 - score) / 5));
  const carTripsEquivalent = Math.round((100 - score) * 3);
  return (
    <Frame>
      <div className="flex flex-col items-center text-center gap-4">
        <Bloomy size={120} mood="cheer" />
        <h2 className="text-2xl">Your Carbon Score</h2>
        <div className="text-6xl font-display">{score}</div>
        <div className="text-sm text-muted-foreground">out of 100 — higher is greener</div>
        <div className="pixel-card p-4 w-full grid grid-cols-2 gap-3">
          <Stat label="Trees to offset / yr" value={`${treesEquivalent} 🌳`} />
          <Stat label="Car trips equivalent" value={`${carTripsEquivalent} 🚗`} />
          <Stat label="Starting world" value={`Stage ${stage}`} />
          <Stat label="Bloomy says" value={score >= 60 ? "Strong start! 🌱" : "Lots of room! 💪"} />
        </div>
        <button
          onClick={() => navigate({ to: "/app" })}
          className="font-display text-xs px-4 py-3 bg-primary text-primary-foreground border-2 border-border shadow-[4px_4px_0_0_rgba(0,0,0,0.22)]"
        >
          ▶ Enter Sproutopia
        </button>
      </div>
    </Frame>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="pixel-border-sm p-2 bg-card">
      <div className="text-[9px] font-display text-muted-foreground">{label}</div>
      <div className="font-display text-sm mt-1">{value}</div>
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="pixel-card p-6 sm:p-8 w-full max-w-lg bg-card">{children}</div>
    </div>
  );
}
