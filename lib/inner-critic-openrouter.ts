import "server-only";

import {
  SYSTEM_PROMPT,
  RESPONSE_SCHEMA,
  buildUserPrompt,
  CRITIC_TYPES,
  type InnerCriticAnswers,
  type CriticType,
} from "./inner-critic-prompt";

export { LENSES } from "./inner-critic-lenses";

export type GeneratedTranslation = {
  criticType: CriticType;
  criticIntent: string;
  translations: string[];
  imageQuote: string;
  costUsd: number;
  ms: number;
};

function isCriticType(s: string): s is CriticType {
  return (CRITIC_TYPES as readonly string[]).includes(s);
}

function normalizeTranslations(arr: unknown, name: string): string[] {
  const list = Array.isArray(arr)
    ? arr.filter((s): s is string => typeof s === "string" && s.trim().length > 20)
    : [];
  if (list.length >= 4) return list.slice(0, 4).map((s) => s.trim());
  while (list.length < 4) {
    list.push(
      `${name}, the voice you heard is not the truth — it is a part of you doing its job badly. You can let it rest for the next hour.`,
    );
  }
  return list;
}

function pickImageQuote(input: unknown, translations: string[]): string {
  if (typeof input === "string" && input.trim().length >= 40) {
    return input.trim().slice(0, 240);
  }
  // Pull the strongest sentence across all 4 translations.
  const sentences = translations
    .flatMap((t) => t.split(/(?<=[.!?])\s+/))
    .map((s) => s.trim())
    .filter((s) => s.length >= 60 && s.length <= 200);
  return sentences[0] ?? translations[0] ?? "";
}

async function callOnce(answers: InnerCriticAnswers): Promise<GeneratedTranslation> {
  const t0 = Date.now();

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": process.env.OPENROUTER_REFERER || "https://getherday.app",
      "X-Title": process.env.OPENROUTER_TITLE || "HerDay",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || "google/gemini-3.5-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(answers) },
      ],
      temperature: 0.85,
      top_p: 0.95,
      presence_penalty: 0.4,
      max_tokens: 2400,
      reasoning: { effort: "low" },
      response_format: { type: "json_schema", json_schema: RESPONSE_SCHEMA },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `OpenRouter ${res.status}: ${JSON.stringify(data.error || data).slice(0, 400)}`,
    );
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter returned empty content");

  const parsed = JSON.parse(content) as {
    criticType?: string;
    criticIntent?: string;
    translations?: string[];
    imageQuote?: string;
  };

  const criticType: CriticType =
    typeof parsed.criticType === "string" && isCriticType(parsed.criticType)
      ? parsed.criticType
      : "Underminer";
  const criticIntent =
    typeof parsed.criticIntent === "string" && parsed.criticIntent.trim().length > 0
      ? parsed.criticIntent.trim().slice(0, 240)
      : "trying to protect you, badly, by keeping you small";
  const translations = normalizeTranslations(parsed.translations, answers.name);
  const imageQuote = pickImageQuote(parsed.imageQuote, translations);

  return {
    criticType,
    criticIntent,
    translations,
    imageQuote,
    costUsd: data.usage?.cost ?? 0,
    ms: Date.now() - t0,
  };
}

export async function translateInnerCritic(
  answers: InnerCriticAnswers,
): Promise<GeneratedTranslation> {
  try {
    return await callOnce(answers);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.startsWith("OpenRouter ")) throw err;
    return await callOnce(answers);
  }
}
