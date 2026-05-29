import {
  SYSTEM_PROMPT,
  RESPONSE_SCHEMA,
  buildUserPrompt,
  type AffirmationAnswers,
} from "./affirmation-prompt";

export type GeneratedAffirmations = {
  affirmations: string[];
  imageQuote: string;
  costUsd: number;
  ms: number;
};

const LENS_ORDER = [
  "balanced",
  "process",
  "distanced",
  "commonHumanity",
  "choosing",
] as const;

export type LensKey = (typeof LENS_ORDER)[number];

export const LENSES: { key: LensKey; label: string; description: string }[] = [
  {
    key: "balanced",
    label: "Balanced",
    description: "Soft truth, with light.",
  },
  {
    key: "process",
    label: "In progress",
    description: "Moving toward, not arrived.",
  },
  {
    key: "distanced",
    label: "From outside",
    description: "Your name, in second person.",
  },
  {
    key: "commonHumanity",
    label: "Common ground",
    description: "Many women, one weight.",
  },
  {
    key: "choosing",
    label: "Today's choice",
    description: "What you are choosing now.",
  },
];

function normalizeAffirmations(arr: unknown): string[] {
  const list = Array.isArray(arr)
    ? arr.filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    : [];
  if (list.length >= 5) return list.slice(0, 5).map((s) => s.trim());
  while (list.length < 5) {
    list.push("Today, I am choosing to be gentle with the version of me that is reading this.");
  }
  return list;
}

function pickImageQuote(input: unknown, affirmations: string[]): string {
  if (typeof input === "string" && input.trim().length >= 40) {
    return input.trim().slice(0, 240);
  }
  // Fall back to the longest affirmation between 80-200 chars,
  // else the distanced one (index 2), else the first.
  const goodLen = affirmations.find((a) => a.length >= 80 && a.length <= 200);
  if (goodLen) return goodLen;
  return affirmations[2] ?? affirmations[0] ?? "";
}

async function callOnce(answers: AffirmationAnswers): Promise<GeneratedAffirmations> {
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
      temperature: 0.9,
      top_p: 0.95,
      presence_penalty: 0.5,
      max_tokens: 2200,
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
    affirmations: string[];
    imageQuote?: string;
  };

  const affirmations = normalizeAffirmations(parsed.affirmations);
  const imageQuote = pickImageQuote(parsed.imageQuote, affirmations);

  return {
    affirmations,
    imageQuote,
    costUsd: data.usage?.cost ?? 0,
    ms: Date.now() - t0,
  };
}

export async function generateAffirmations(
  answers: AffirmationAnswers,
): Promise<GeneratedAffirmations> {
  try {
    return await callOnce(answers);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.startsWith("OpenRouter ")) throw err;
    return await callOnce(answers);
  }
}
