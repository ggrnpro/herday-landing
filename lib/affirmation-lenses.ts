/**
 * Client-safe constants for the affirmation tool.
 *
 * These are split out from lib/affirmation-openrouter.ts so the UI
 * (ResultStage, ShareModal) can import LENSES without pulling the
 * server-only generator file (which references OPENROUTER_API_KEY).
 */

export const LENS_ORDER = [
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
