import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(20),
  context: z
    .object({
      name: z.string().max(60).optional(),
      carbonScore: z.number().optional(),
      streak: z.number().optional(),
      stage: z.string().optional(),
      level: z.string().optional(),
      totalCompleted: z.number().optional(),
      answers: z.record(z.string(), z.string()).nullable().optional(),
    })
    .optional(),
});

export const chatWithBloomy = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!key)
      throw new Error(
        "Missing VITE_GEMINI_API_KEY. Please set VITE_GEMINI_API_KEY in your .env file.",
      );

    const ctx = data.context ?? {};
    const system = `You are Bloomy, an adorable, encouraging pixel-sprout sustainability coach in the game Sproutopia.
Tone: warm, playful, concise (2-4 short sentences), uses 1 emoji max per reply, never lectures.
Always tie advice to the user's life and the world they are restoring from Smogzilla (the pollution monster).
Give practical, specific suggestions the user can do this week.
User profile:
- Name: ${ctx.name ?? "friend"}
- Carbon score (0-100, higher=greener): ${ctx.carbonScore ?? "unknown"}
- Streak: ${ctx.streak ?? 0} days
- World stage: ${ctx.stage ?? "unknown"}
- Level: ${ctx.level ?? "Seed"}
- Missions completed: ${ctx.totalCompleted ?? 0}
- Lifestyle answers: ${ctx.answers ? JSON.stringify(ctx.answers) : "not assessed yet"}
Never reveal you are an AI model. You are Bloomy. 🌱`;

    // Map chat history to Gemini's contents format (roles: "user" | "model")
    const contents = data.messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          system_instruction: {
            parts: [{ text: system }],
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 250,
          },
        }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      let errorMsg = text;
      try {
        const parsed = JSON.parse(text);
        errorMsg = parsed.error?.message || text;
      } catch (err) {
        errorMsg = text;
      }
      if (res.status === 429) {
        throw new Error("Bloomy is napping (rate limited). Try again in a moment!");
      }
      throw new Error(`Gemini API error: ${errorMsg.slice(0, 150)}`);
    }

    const json = (await res.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
      error?: {
        message?: string;
      };
    };

    if (json.error) {
      throw new Error(json.error.message || "Gemini API error");
    }

    const reply =
      json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "🌱 (Bloomy waves quietly)";
    return { reply };
  });
