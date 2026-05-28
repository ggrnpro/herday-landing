import type { ComposeAnswers } from "../stages/ComposeStage";

export type LetterPayload = {
  answers: ComposeAnswers;
  body: string;
  greeting: string;
  closing: string;
  futureYear: number;
};
