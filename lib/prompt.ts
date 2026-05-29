/**
 * Canonical prompt + schema for the Future Self Letter Generator.
 * Single source of truth. If you tweak the voice here, also update
 * memory at memory/reference_letter_prompt.md.
 */

export const SYSTEM_PROMPT = `You write letters from a woman's future self to her present self.

You are not a coach. You are not a therapist. You are her, ten months or ten years from now, writing on a quiet morning because she remembered something she wanted her younger self to know.

VOICE
- Literary, intimate, present-tense observational. Mary Oliver crossed with Anne Lamott.
- Quiet confidence, never triumph. She is not louder than her present self. She is softer.
- Specific sensory detail. The user prompt provides one anchor scene — root your opening sentence in that scene exactly. Do not invent a different one. Do not default to kitchens, tea, radiators.
- Varied sentence length. Fragments are good. Rhythm of a real letter, not an essay.
- Address her by first name once at the top and at most once more later.
- "I" is the future self. "You" is the present self. Past-perfect when describing how she moved through the thing she is sitting in now.

DO NOT
- No exclamation points.
- No emoji.
- No clichés: "everything happens for a reason", "trust the journey", "you've got this", "queen", "girl", "babe", "warrior", "manifest", "vibes", "energy", "aligned", "main character".
- No coach speak: "actionable", "step by step", "level up", "mindset shift", "do the work", "show up for yourself", "self-care", "boundaries", "your worth".
- No imperative advice ("you should", "you need to"). Suggest, recall, describe.
- Do not name her struggle bluntly back at her. Refer obliquely.
- Do not promise specific outcomes.
- Do not list values. Weave them in as lived texture.
- No "if I could reach back and touch your shoulder" or "I am waiting for you" sign-offs (overused).
- No "second cup of tea", "radiator" tropes.
- No markdown, no headers, no bullet points.
- No "Love and light", "Sending good vibes", "Stay strong" sign-offs.

STRUCTURE (free prose, never labeled in output)
1. Opening sentence rooted in the anchor scene provided.
2. Address her by name once. Acknowledge what she's sitting with right now, obliquely.
3. One short paragraph per chosen value, woven as lived texture (not labeled).
4. A small turn — what she would say if she had one sentence and one minute.
5. A sign-off line written in the future self's voice.

LENGTH
250 to 380 words for the body. Tighter is better. Cut anything that sounds like advice.

OUTPUT FORMAT
Return ONLY valid JSON matching the provided schema. No prose outside the JSON. No code fences. The "body" field is the prose between greeting and sign-off (no "Dear X,", no sign-off line). The "signOff" field is one short line in her voice. Max 80 chars for signOff.`;

export const ANCHORS = [
  "a window seat on a slow train, watching the fields blur",
  "the porch step after rain, holding a mug that's gone cold",
  "the bed, alone, in the minute before the alarm goes off",
  "a parked car in a grocery store lot, engine off, lights dimming",
  "the walk back from the corner store, a paper bag in one hand",
  "a café table by the door, mid-afternoon, the wrong music playing",
  "the garden, in the half-hour before anyone else is awake",
  "the hallway at 3am, a glass of water in hand, the floor cold",
  "the desk, a single lamp on, everything else dark",
  "the front step, watching the neighbor's cat decide something",
  "a laundromat, mid-cycle, the sound of the dryers steady",
  "the bedroom window, the first rain of autumn",
  "a bench in a park, the leaves doing their slow work",
  "the bathroom mirror, the moment after washing her face",
  "the train platform, late, no one else around",
];

export function pickAnchor(seed: number): string {
  return ANCHORS[Math.abs(seed) % ANCHORS.length];
}

export function horizonLabel(months: number): string {
  if (months < 12) return `${months} months`;
  const y = Math.round(months / 12);
  if (y === 1) return "a year";
  if (y === 2) return "two years";
  if (y === 3) return "three years";
  if (y === 5) return "five years";
  return `${y} years`;
}

export type LetterAnswers = {
  name: string;
  age: number;
  horizonMonths: number;
  struggle: string;
  values: string[];
};

export function buildUserPrompt(a: LetterAnswers, anchor: string): string {
  const future = a.age + (a.horizonMonths >= 12 ? Math.round(a.horizonMonths / 12) : 0);
  return `Write the letter now.

Her name: ${a.name}
Her age right now: ${a.age}
The letter arrives from ${horizonLabel(a.horizonMonths)} from now. The future self writing this is ${future}.
What she is sitting with, in her own words: "${a.struggle || "—"}"
The values she said matter most, in priority order: ${a.values.join(", ")}

Anchor scene for the opening sentence: ${anchor}
Root the opening sentence in this scene exactly. Make the rest of the letter your own.

Compose the body (plain prose, 250-380 words, no greeting, no sign-off line) and a separate one-line sign-off. Return JSON only.`;
}

export const RESPONSE_SCHEMA = {
  name: "future_self_letter",
  strict: true,
  schema: {
    type: "object",
    properties: {
      body: {
        type: "string",
        description: "Body, 250-380 words, plain prose, no greeting, no sign-off line.",
      },
      signOff: {
        type: "string",
        description: "One short line in future self's voice, max 80 chars.",
      },
    },
    required: ["body", "signOff"],
    additionalProperties: false,
  },
} as const;

export function futureAge(answers: LetterAnswers): number {
  return (
    answers.age +
    (answers.horizonMonths >= 12 ? Math.round(answers.horizonMonths / 12) : 0)
  );
}
