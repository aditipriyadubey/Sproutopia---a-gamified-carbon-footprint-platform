import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatWithBloomy } from "@/lib/bloomy.functions";
import { Bloomy } from "./Bloomy";
import { Send } from "lucide-react";
import { levelFromXP, STAGE_NAMES, type GameState } from "@/lib/game-state";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

export function BloomyChat({ state }: { state: GameState }) {
  const ask = useServerFn(chatWithBloomy);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Bloomy 🌱 Ask me anything about reducing your footprint, or tell me what you did today and I'll cheer you on!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const lv = levelFromXP(state.xp);
      const { reply } = await ask({
        data: {
          messages: next.slice(-10),
          context: {
            name: state.name,
            carbonScore: state.carbonScore,
            streak: state.streak,
            stage: STAGE_NAMES[state.worldStage],
            level: lv.name,
            totalCompleted: state.totalCompleted,
            answers: state.answers as unknown as Record<string, string> | null,
          },
        },
      });
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: `Oh no, ${(e as Error).message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "How can I cut my biggest emissions?",
    "Quick win for today?",
    "Why does my streak matter?",
  ];

  return (
    <div className="pixel-card flex flex-col h-[520px]">
      <div className="flex items-center gap-3 p-3 border-b-[3px] border-border bg-secondary">
        <Bloomy size={48} mood="wave" />
        <div>
          <div className="font-display text-sm">Bloomy</div>
          <div className="text-xs text-secondary-foreground">Your sustainability coach</div>
        </div>
      </div>
      <div
        ref={scroller}
        className="flex-1 overflow-y-auto p-3 space-y-3 bg-[color-mix(in_oklab,var(--sky)_30%,var(--card))]"
      >
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role}>
            {m.content}
          </Bubble>
        ))}
        {loading && (
          <Bubble role="assistant">
            <span className="inline-flex gap-1">
              <Dot />
              <Dot d={0.15} />
              <Dot d={0.3} />
            </span>
          </Bubble>
        )}
      </div>
      <div className="px-3 pt-2 flex gap-2 flex-wrap">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={loading}
            className="text-xs font-display px-2 py-1 bg-card border-2 border-border hover:bg-muted disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="p-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Bloomy…"
          disabled={loading}
          className="flex-1 px-3 py-2 border-2 border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-3 py-2 bg-primary text-primary-foreground border-2 border-border font-display text-xs disabled:opacity-50 active:translate-y-0.5"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] px-3 py-2 border-2 border-border text-sm whitespace-pre-wrap",
          role === "user"
            ? "bg-primary text-primary-foreground rounded-tr-none rounded-md"
            : "bg-card text-card-foreground rounded-tl-none rounded-md",
        )}
      >
        {children}
      </div>
    </div>
  );
}
function Dot({ d = 0 }: { d?: number }) {
  return (
    <span
      className="inline-block h-2 w-2 rounded-full bg-foreground animate-bob"
      style={{ animationDelay: `${d}s` }}
    />
  );
}
