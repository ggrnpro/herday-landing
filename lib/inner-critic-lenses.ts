/**
 * Client-safe constants for the inner-critic tool.
 *
 * Split out from lib/inner-critic-openrouter.ts so client components
 * (ResultStage, ShareModal) can import LENSES without pulling in the
 * server-only generator file.
 */

export const LENSES = [
  {
    key: "distanced",
    label: "From outside",
    description: "Your name, second person, no agreeing.",
  },
  {
    key: "friend",
    label: "A friend's voice",
    description: "What a kind, specific friend would say.",
  },
  {
    key: "ifs",
    label: "Meet the part",
    description: "Name the part. Thank it. Tell it to rest.",
  },
  {
    key: "future",
    label: "From later",
    description: "Three years from now, reading this back.",
  },
] as const;
