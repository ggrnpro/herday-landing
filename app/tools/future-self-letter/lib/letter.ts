import type { ComposeAnswers } from "../stages/ComposeStage";
import type { LetterPayload } from "./types";

/**
 * Mock letter composer. Picks templates by selected values and
 * substitutes the user's name and details. Replace this module
 * with the real LLM call (OpenRouter -> Claude Sonnet) when ready.
 */

const OPENINGS = [
  (n: string) =>
    `I am writing this on a quiet Tuesday morning, ${n}. The light is doing that thing on the kitchen wall. You know the one. I wanted to send something back before I forgot how it felt.`,
  (n: string) =>
    `${n}, I started this letter three times before I got to the part I actually wanted to say. So here it is in the first sentence: you made it. Not loudly. Quietly. Which is the only way it was ever going to happen.`,
  (n: string) =>
    `Hello from the other side of the thing you are sitting with right now, ${n}. I want to be careful not to make this sound easy. It was not easy. But you did move through it, and I am still here, on the morning I am writing this, because of decisions you are about to make.`,
];

const MIDDLES: Record<string, () => string> = {
  career: () =>
    `About the work: the version of it that is making you tense right now is not the version that survives. You stop trying to prove you belong in the room and start asking better questions in it. The room gets bigger. You stop apologising for the way you think.`,
  family: () =>
    `About the people who matter: you stop trying to earn what you already have. You let them love you on a Tuesday for no reason. It feels strange at first. Then it feels like the most obvious thing.`,
  health: () =>
    `About the body: you stop negotiating with it. You start listening to it the way you would listen to a friend who knows things you do not. It tells you when to rest. You learn to believe it the first time, not the fourth.`,
  love: () =>
    `About the heart: you stop bringing the old script to new people. You let them be themselves first. Some leave. The ones who stay, stay for the version of you that is not performing.`,
  purpose: () =>
    `About what you are for: it gets smaller and more honest. You stop trying to find a thing big enough to justify being alive. You find a few things small enough to do today. The justification handles itself.`,
  peace: () =>
    `About the noise inside: the volume drops. Not because you fight it. Because you learn what it is afraid of, and you sit with that, the way you would sit with a child who had a bad dream. It still visits. It stops running the day.`,
};

const CLOSINGS = [
  () =>
    `So: be patient with the version of you reading this. She is doing more than she can see. Do not rush her into being me. She gets here on her own.`,
  (n: string) =>
    `If you take one thing from this letter, ${n}, let it be this: the thing you are most afraid is wrong with you is the thing that ends up making the rest of it possible. Do not edit it out. Carry it carefully.`,
  () =>
    `One more thing, and then I will let you go. Whatever you do today, do it as if it counts. Because from here, it did.`,
];

const SIGN_OFFS = [
  "With love, you (the slightly less tired one).",
  "Still here. Still yours.",
  "Yours, on the other side.",
  "All my love, the version of you who already made it.",
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function composeLetter(a: ComposeAnswers): LetterPayload {
  const name = a.name.trim() || "you";
  const seed = hashString(name + a.struggle + a.values.join(""));

  const opening = pick(OPENINGS, seed)(name);

  const valueParagraphs = a.values
    .slice(0, 2)
    .map((v) => MIDDLES[v]?.())
    .filter(Boolean) as string[];

  const closing = pick(CLOSINGS, seed + 7)(name);
  const signOff = pick(SIGN_OFFS, seed + 13);

  const yearsAhead = a.horizonMonths >= 12 ? Math.round(a.horizonMonths / 12) : 0;
  const futureLabel = yearsAhead >= 1
    ? `you, ${a.age + yearsAhead}`
    : `you, ${a.horizonMonths} months from now`;

  const body = [opening, ...valueParagraphs, closing].join("\n\n");

  return {
    answers: a,
    greeting: `Dear ${name},`,
    body,
    closing: `${signOff}\n\n— ${futureLabel}`,
    futureYear: new Date().getFullYear() + Math.max(yearsAhead, 1),
  };
}
