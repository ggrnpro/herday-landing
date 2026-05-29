import {
  SYSTEM_PROMPT,
  RESPONSE_SCHEMA,
  buildUserPrompt,
  pickAnchor,
  futureAge,
  type LetterAnswers,
} from "./prompt";

export type GeneratedLetter = {
  body: string;
  signOff: string;
  shareQuotes: string[];
  futureAge: number;
  costUsd: number;
  ms: number;
};

/**
 * If the model returns the body as one block (no blank lines between
 * paragraphs), synthesize paragraphs by chunking sentences. The prompt
 * already requires \\n\\n, but this is a safety net so the UI/email
 * never renders a 300-word wall of text.
 */
function ensureParagraphs(body: string): string {
  const cleaned = body.replace(/\r\n/g, "\n").trim();
  if (cleaned.includes("\n\n")) return cleaned;

  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length <= 1) return cleaned;

  // Aim for ~3 sentences per paragraph, capped at 5 paragraphs total.
  const target = Math.min(5, Math.max(3, Math.ceil(sentences.length / 3)));
  const per = Math.ceil(sentences.length / target);
  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += per) {
    paragraphs.push(sentences.slice(i, i + per).join(" "));
  }
  return paragraphs.join("\n\n");
}

/**
 * Clamp and validate the share quote array. We trust the LLM to follow
 * the prompt, but defensively ensure we always return exactly 3 strings
 * shaped roughly right.
 */
function normalizeShareQuotes(input: unknown, fallbackBody: string): string[] {
  const arr = Array.isArray(input) ? input.filter((s): s is string => typeof s === "string" && s.length > 0) : [];

  if (arr.length >= 3) {
    return arr.slice(0, 3).map((s) => s.trim().slice(0, 240));
  }

  // Fall back to sentence picks from the body so the share UI never breaks.
  const sentences = fallbackBody
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 60 && s.length <= 220);
  while (arr.length < 3 && sentences.length > 0) {
    arr.push(sentences.shift()!);
  }
  while (arr.length < 3) {
    arr.push(fallbackBody.slice(0, 160).trim() + "…");
  }
  return arr.slice(0, 3);
}

async function callOnce(
  answers: LetterAnswers,
  seed: number,
): Promise<GeneratedLetter> {
  const anchor = pickAnchor(seed);
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
        { role: "user", content: buildUserPrompt(answers, anchor) },
      ],
      temperature: 0.9,
      top_p: 0.95,
      presence_penalty: 0.4,
      max_tokens: 2500,
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
    body: string;
    signOff: string;
    shareQuotes?: string[];
  };

  const body = ensureParagraphs(parsed.body);
  const shareQuotes = normalizeShareQuotes(parsed.shareQuotes, body);

  return {
    body,
    signOff: parsed.signOff,
    shareQuotes,
    futureAge: futureAge(answers),
    costUsd: data.usage?.cost ?? 0,
    ms: Date.now() - t0,
  };
}

export async function generateLetter(
  answers: LetterAnswers,
): Promise<GeneratedLetter> {
  const seed = Date.now();
  try {
    return await callOnce(answers, seed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.startsWith("OpenRouter ")) throw err;
    return await callOnce(answers, seed + 1);
  }
}
