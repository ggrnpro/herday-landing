import type { ComposeAnswers } from "../stages/ComposeStage";

export type LetterPayload = {
  answers: ComposeAnswers;
  body: string;
  greeting: string;
  closing: string;
  signOff: string;
  shareQuotes: string[];
  futureAge: number;
  futureYear: number;
};

export type RateLimitInfo = {
  used: number;
  remaining: number;
  limit: number;
  blocked: boolean;
};
