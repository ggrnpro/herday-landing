import type { InnerCriticAnswers, CriticType } from "@/lib/inner-critic-prompt";

export type InnerCriticPayload = {
  answers: InnerCriticAnswers;
  criticType: CriticType;
  criticIntent: string;
  translations: string[];
  imageQuote: string;
  safetyAcknowledged: boolean;
};

export type RateLimitInfo = {
  used: number;
  remaining: number;
  limit: number;
  blocked: boolean;
};
