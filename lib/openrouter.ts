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
  futureAge: number;
  costUsd: number;
  ms: number;
};

/**
 * Single OpenRouter call. Throws on non-2xx or invalid JSON.
 * Caller is responsible for retry-on-parse-fail if desired.
 */
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

  const parsed = JSON.parse(content) as { body: string; signOff: string };
  return {
    body: parsed.body,
    signOff: parsed.signOff,
    futureAge: futureAge(answers),
    costUsd: data.usage?.cost ?? 0,
    ms: Date.now() - t0,
  };
}

/**
 * Generate a letter with one automatic retry if the first call comes back
 * with malformed JSON (rare but possible when reasoning eats the token
 * budget mid-response).
 */
export async function generateLetter(
  answers: LetterAnswers,
): Promise<GeneratedLetter> {
  const seed = Date.now();
  try {
    return await callOnce(answers, seed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.startsWith("OpenRouter ")) throw err; // upstream error, don't retry
    // JSON.parse failure or empty content — retry once with a fresh seed/anchor.
    return await callOnce(answers, seed + 1);
  }
}
