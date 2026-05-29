import type { AffirmationAnswers } from "@/lib/affirmation-prompt";

export type AffirmationPayload = {
  answers: AffirmationAnswers;
  affirmations: string[];
  imageQuote: string;
};

export type RateLimitInfo = {
  used: number;
  remaining: number;
  limit: number;
  blocked: boolean;
};
