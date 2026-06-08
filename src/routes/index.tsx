import { createFileRoute, Link } from "@tanstack/react-router";
import { Bloomy } from "@/components/Bloomy";
import { Smogzilla } from "@/components/Smogzilla";
import { WorldScene } from "@/components/WorldScene";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sproutopia — Restore a world by living greener" },
      {
        name: "description",
        content:
          "A cozy pixel-art sustainability adventure. Track your carbon footprint, complete eco missions, and watch your world bloom.",
      },
      { property: "og:title", content: "Sproutopia — Restore a world by living greener" },
      {
        property: "og:description",
        content:
          "A cozy pixel-art sustainability adventure. Complete eco missions and watch your world bloom.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      {/* nav */}
      <header className="px-5 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bloomy size={40} />
          <span className="font-display text-sm sm:text-base">Sproutopia</span>
        </div>
        <Link
          to="/assessment"
          className="font-display text-xs px-3 py-2 bg-card border-2 border-border hover:bg-muted"
        >
          Play
        </Link>
      </header>

      {/* hero */}
      <section className="px-5 sm:px-8 pt-6 pb-12 max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-block font-display text-[10px] px-2 py-1 bg-secondary border-2 border-border mb-4">
            🌱 PIXEL SUSTAINABILITY ADVENTURE
          </div>
          <h1 className="text-3xl sm:text-5xl leading-tight mb-4">
            Heal a tiny world
            <br />
            by living a little greener.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-md mb-6">
            Sproutopia turns your daily eco-choices into XP, coins, and a world that literally grows
            back from Smogzilla's pollution.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/assessment"
              className="font-display text-xs px-4 py-3 bg-primary text-primary-foreground border-2 border-border shadow-[4px_4px_0_0_rgba(0,0,0,0.22)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.22)] transition-transform"
            >
              ▶ Start Your Adventure
            </Link>
            <Link
              to="/app"
              className="font-display text-xs px-4 py-3 bg-card border-2 border-border hover:bg-muted"
            >
              Continue Saved Game
            </Link>
          </div>

          <div className="flex items-center gap-6 mt-8">
            <Mascot label="Bloomy" sub="Your coach">
              <Bloomy size={64} mood="wave" />
            </Mascot>
            <span className="font-display text-xl text-muted-foreground">VS</span>
            <Mascot label="Smogzilla" sub="The villain">
              <Smogzilla size={64} weakness={1} />
            </Mascot>
          </div>
        </div>

        <div className="relative">
          <WorldScene stage={3} />
          <div className="absolute -top-4 -right-4 rotate-6 pixel-card bg-secondary px-3 py-2 font-display text-[10px]">
            Your world →
          </div>
        </div>
      </section>

      {/* features */}
      <section className="px-5 sm:px-8 pb-16 max-w-6xl mx-auto">
        <h2 className="text-2xl mb-6">A whole eco-game in your browser</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Feature
            icon="🎯"
            title="Daily Eco Missions"
            body="Fresh quests every day — public transit, meatless meals, plant care."
          />
          <Feature
            icon="🌍"
            title="A Living World"
            body="Trees, flowers, bunnies & rainbows return as you restore the planet."
          />
          <Feature
            icon="🔥"
            title="Streaks & Levels"
            body="Seed → Sprout → Sapling → Forest Guardian → Planet Protector."
          />
          <Feature
            icon="🏆"
            title="Achievements"
            body="Collect badges like Plastic-Free Hero and Carbon Crusher."
          />
          <Feature
            icon="🧠"
            title="Bloomy AI Coach"
            body="Personalized, friendly tips based on your real lifestyle."
          />
          <Feature
            icon="📊"
            title="Real Carbon Math"
            body="Translate emissions into trees, car trips, and phone charges."
          />
        </div>
      </section>
    </div>
  );
}

function Mascot({
  label,
  sub,
  children,
}: {
  label: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center">
      {children}
      <div className="font-display text-[10px] mt-2">{label}</div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="pixel-card p-4 hover:-translate-y-1 hover:shadow-pixel-lg transition-all duration-300 select-none">
      <div className="text-3xl mb-2 transition-transform duration-300 hover:scale-115 inline-block">
        {icon}
      </div>
      <div className="font-display text-sm mb-1">{title}</div>
      <div className="text-sm text-muted-foreground">{body}</div>
    </div>
  );
}
