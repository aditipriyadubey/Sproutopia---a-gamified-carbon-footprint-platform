import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { HUD } from "@/components/HUD";
import { WorldScene } from "@/components/WorldScene";
import { MissionCard } from "@/components/MissionCard";
import { BloomyChat } from "@/components/BloomyChat";
import { ToastHost, pushToast } from "@/components/ToastHost";
import { Bloomy } from "@/components/Bloomy";
import { levelFromXP, stageFromScore, STAGE_NAMES, todayKey, useGameState } from "@/lib/game-state";
import { ACHIEVEMENTS, getDailyMissions, WEEKLY_CHALLENGES } from "@/lib/missions-data";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Your Sproutopia world" },
      {
        name: "description",
        content: "Your eco-adventure dashboard: missions, world, achievements & Bloomy.",
      },
    ],
  }),
  component: AppDashboard,
});

function AppDashboard() {
  const { state, update } = useGameState();
  const navigate = useNavigate();

  // Redirect to assessment if not onboarded
  useEffect(() => {
    if (!state.onboarded) navigate({ to: "/assessment" });
  }, [state.onboarded, navigate]);

  // Rollover when day changes
  useEffect(() => {
    const today = todayKey();
    if (state.lastActiveDate !== today && state.lastActiveDate) {
      update((s) => ({ ...s, completedToday: [] }));
    }
  }, [state.lastActiveDate, update]);

  const missions = useMemo(() => getDailyMissions(todayKey()), []);
  const unlocked = ACHIEVEMENTS.filter((a) => state.achievements.includes(a.id));
  const locked = ACHIEVEMENTS.filter((a) => !state.achievements.includes(a.id));

  const treesSaved = Math.round(state.totalCompleted * 0.4);
  const phoneCharges = state.totalCompleted * 35;
  const carTripsAvoided = Math.round(state.totalCompleted * 0.8);

  const completeMission = (id: string) => {
    if (state.completedToday.includes(id)) return;
    const m = missions.find((x) => x.id === id);
    if (!m) return;

    update((s) => {
      const today = todayKey();
      const completedToday = [...s.completedToday, id];
      const isFirstToday = s.completedToday.length === 0;
      const newStreak = (() => {
        if (!isFirstToday) return s.streak;
        if (!s.lastActiveDate) return 1;
        const diffDays = Math.round((Date.now() - new Date(s.lastActiveDate).getTime()) / 86400000);
        if (diffDays <= 1 && s.lastActiveDate === today) return s.streak;
        if (diffDays === 1) return s.streak + 1;
        if (diffDays === 0) return Math.max(1, s.streak);
        return 1;
      })();

      const newCarbon = Math.min(100, s.carbonScore + m.carbon);
      const newTotal = s.totalCompleted + 1;
      const newStage = stageFromScore(newCarbon, newTotal);
      const newXp = s.xp + m.xp;

      // achievement detection
      const ns = {
        ...s,
        completedToday,
        lastActiveDate: today,
        streak: newStreak,
        carbonScore: newCarbon,
        totalCompleted: newTotal,
        worldStage: newStage,
        xp: newXp,
        coins: s.coins + m.coins,
      };

      const newlyUnlocked = ACHIEVEMENTS.filter(
        (a) => !s.achievements.includes(a.id) && a.check(ns),
      );
      ns.achievements = [...s.achievements, ...newlyUnlocked.map((a) => a.id)];

      // toasts (outside reducer is fine; setTimeout to avoid render warn)
      setTimeout(() => {
        pushToast({
          title: `${m.icon} ${m.title}`,
          body: `+${m.xp} XP · +${m.coins} 🪙 · +${m.carbon} 🌿`,
          variant: "info",
        });
        if (newStage > s.worldStage) {
          pushToast({
            title: STAGE_NAMES[newStage],
            body: "Your world just evolved!",
            variant: "stage",
          });
        }
        const oldLv = levelFromXP(s.xp).level;
        const newLv = levelFromXP(newXp).level;
        if (newLv > oldLv) {
          pushToast({
            title: `You are a ${levelFromXP(newXp).name}!`,
            body: "Level up!",
            variant: "level",
          });
        }
        newlyUnlocked.forEach((a) =>
          pushToast({ title: a.title, body: a.description, variant: "achievement" }),
        );
      }, 0);

      return ns;
    });
  };

  const completeAllMissions = () => {
    update((s) => {
      const today = todayKey();
      const allIds = missions.map((m) => m.id);

      let addedCarbon = 0;
      let addedXp = 0;
      let addedCoins = 0;
      const newlyCompleted: string[] = [];

      missions.forEach((m) => {
        if (!s.completedToday.includes(m.id)) {
          addedCarbon += m.carbon;
          addedXp += m.xp;
          addedCoins += m.coins;
          newlyCompleted.push(m.id);
        }
      });

      if (newlyCompleted.length === 0) return s;

      const newStreak = s.streak === 0 ? 1 : s.streak;
      const newCarbon = Math.min(100, s.carbonScore + addedCarbon);
      const newTotal = s.totalCompleted + newlyCompleted.length;
      const newStage = stageFromScore(newCarbon, newTotal);
      const newXp = s.xp + addedXp;

      const ns = {
        ...s,
        completedToday: allIds,
        lastActiveDate: today,
        streak: newStreak,
        carbonScore: newCarbon,
        totalCompleted: newTotal,
        worldStage: newStage,
        xp: newXp,
        coins: s.coins + addedCoins,
      };

      const newlyUnlocked = ACHIEVEMENTS.filter(
        (a) => !s.achievements.includes(a.id) && a.check(ns),
      );
      ns.achievements = [...s.achievements, ...newlyUnlocked.map((a) => a.id)];

      setTimeout(() => {
        pushToast({
          title: "🎉 All Daily Tasks Done!",
          body: `+${addedXp} XP · +${addedCoins} 🪙 · +${addedCarbon} 🌿`,
          variant: "info",
        });
        if (newStage > s.worldStage) {
          pushToast({
            title: STAGE_NAMES[newStage],
            body: "Your world just evolved!",
            variant: "stage",
          });
        }
        const oldLv = levelFromXP(s.xp).level;
        const newLv = levelFromXP(ns.xp).level;
        if (newLv > oldLv) {
          pushToast({
            title: `You are a ${levelFromXP(ns.xp).name}!`,
            body: "Level up!",
            variant: "level",
          });
        }
        newlyUnlocked.forEach((a) =>
          pushToast({ title: a.title, body: a.description, variant: "achievement" }),
        );
      }, 0);

      return ns;
    });
  };

  if (!state.onboarded) return null;

  const remainingToday = missions.filter((m) => !state.completedToday.includes(m.id)).length;

  return (
    <div className="min-h-screen">
      <ToastHost />

      <header className="px-4 sm:px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <Bloomy size={36} />
          <span className="font-display text-sm">Sproutopia</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm">
            Hi, <span className="font-display text-xs">{state.name}</span>
          </span>
          <Link
            to="/assessment"
            className="font-display text-[10px] px-3 py-2 bg-card border-2 border-border hover:bg-muted"
          >
            Retake quiz
          </Link>
        </div>
      </header>

      <main className="px-4 sm:px-6 pb-12 max-w-7xl mx-auto space-y-5">
        <HUD state={state} />

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <WorldScene
              stage={state.worldStage}
              dailyCompleted={state.completedToday.length > 0 && remainingToday === 0}
            />

            {/* missions */}
            <section className="pixel-card p-4">
              <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                <div>
                  <h2 className="font-display text-base">🎯 Today's Eco Missions</h2>
                  <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2 mt-1">
                    <span>
                      {remainingToday === 0
                        ? "All done — see you tomorrow! 🌟"
                        : `${remainingToday} of ${missions.length} left`}
                    </span>
                    {remainingToday > 0 && (
                      <button
                        onClick={completeAllMissions}
                        className="text-[9px] font-display px-2 py-0.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border border-yellow-300 rounded cursor-pointer transition-colors duration-150"
                        title="Shortcut to complete all tasks and trigger celebration"
                      >
                        🧪 Quick Complete (Dev/Judge)
                      </button>
                    )}
                  </div>
                </div>
                <div className="font-display text-[10px] px-2 py-1 bg-secondary border-2 border-border">
                  {todayKey()}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {missions.map((m) => (
                  <MissionCard
                    key={m.id}
                    mission={m}
                    done={state.completedToday.includes(m.id)}
                    onComplete={() => completeMission(m.id)}
                  />
                ))}
              </div>
            </section>

            {/* impact */}
            <section className="pixel-card p-4">
              <h2 className="font-display text-base mb-3">📊 Your Real-World Impact</h2>
              {state.totalCompleted === 0 ? (
                <div className="text-center py-6 px-4 bg-muted border-2 border-dashed border-border rounded-md">
                  <div className="text-2xl mb-1">🌱</div>
                  <div className="font-display text-[9px] text-muted-foreground leading-normal">
                    No impact recorded yet. Complete your first eco-mission to start tracking!
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Impact icon="🌳" value={treesSaved} label="trees saved" />
                  <Impact icon="🚗" value={carTripsAvoided} label="car trips avoided" />
                  <Impact icon="🔋" value={phoneCharges} label="phone charges" />
                </div>
              )}
            </section>

            {/* weekly */}
            <section className="pixel-card p-4">
              <h2 className="font-display text-base mb-3">📅 Weekly Challenges</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {WEEKLY_CHALLENGES.map((c) => {
                  const progress = Math.min(c.target, state.totalCompleted);
                  const pct = Math.round((progress / c.target) * 100);
                  return (
                    <div key={c.id} className="pixel-border-sm p-3 bg-card">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{c.icon}</span>
                        <span className="font-display text-xs">{c.title}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">{c.description}</div>
                      <div className="h-2 border-2 border-border bg-muted">
                        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="text-[10px] font-display text-muted-foreground mt-1">
                        {progress}/{c.target}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* right column */}
          <div className="space-y-5">
            <BloomyChat state={state} />

            <section className="pixel-card p-4">
              <h2 className="font-display text-base mb-3 flex items-center justify-between">
                <span>🏆 Achievements</span>
                <span className="text-[9px] text-muted-foreground font-normal">
                  {unlocked.length}/{ACHIEVEMENTS.length}
                </span>
              </h2>
              {state.achievements.length === 0 && (
                <div className="text-center py-4 mb-3 text-[9px] font-display text-muted-foreground leading-normal border-2 border-dashed border-border p-2 bg-muted/30">
                  No badges unlocked yet. Complete missions to earn achievements! 🌱
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                {unlocked.map((a) => (
                  <div key={a.id} className="pixel-border-sm bg-secondary text-center p-2">
                    <div className="text-2xl">{a.icon}</div>
                    <div className="font-display text-[9px] mt-1 leading-tight">{a.title}</div>
                  </div>
                ))}
                {locked.map((a) => (
                  <div
                    key={a.id}
                    className="pixel-border-sm bg-muted text-center p-2 opacity-60"
                    title={a.description}
                  >
                    <div className="text-2xl grayscale">🔒</div>
                    <div className="font-display text-[9px] mt-1 leading-tight">{a.title}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function Impact({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="pixel-border-sm p-3 bg-card text-center">
      <div className="text-3xl">{icon}</div>
      <div className="font-display text-lg mt-1">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}
