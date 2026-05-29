/**
 * Crisis-language safety filter.
 *
 * Scans free-text input for first-person self-harm intent. Conservative
 * on false positives — only matches phrases that combine a self pronoun
 * with explicit harm verbs.
 *
 * If matched, the UI shows the Crisis Modal with hotline numbers and the
 * generation does not proceed unless the user explicitly chooses to.
 *
 * This is NOT clinical screening. It is a duty-of-care guardrail so the
 * tool doesn't return a glib answer to "I want to kill myself."
 */

const PATTERNS: RegExp[] = [
  /\b(i|i'?m|i am|i'?ll|i'?ve|i will|i'?d|i would)\s+(want(ed)? to|going to|gonna|plan to|need to|might)\s+(kill|hurt|cut|harm|end)\s+(myself|me)\b/i,
  /\b(kill|killing|end)\s+(myself|my\s+life|my\s+existence|it\s+all)\b/i,
  /\b(cutting|cut)\s+myself\b/i,
  /\b(want|wanted|wish|wishing)\s+(to\s+)?(die|be\s+dead|not\s+exist|not\s+be\s+here|not\s+be\s+alive)\b/i,
  /\b(don'?t|do\s+not|no\s+longer)\s+want\s+to\s+(live|be\s+here|be\s+alive|exist)\b/i,
  /\bsuicid(e|al)\b/i,
  /\bself[\s-]?harm(ing)?\b/i,
  /\bbetter\s+off\s+(dead|gone|without\s+me)\b/i,
  /\bno\s+(point|reason)\s+(in\s+)?(living|being\s+here|going\s+on)\b/i,
  /\b(end|take)\s+my\s+own\s+life\b/i,
];

export type SafetyResult = {
  flagged: boolean;
  reason?: "self_harm";
};

export function safetyScan(text: string): SafetyResult {
  if (!text) return { flagged: false };
  const normalized = text.replace(/\s+/g, " ").trim();
  for (const re of PATTERNS) {
    if (re.test(normalized)) {
      return { flagged: true, reason: "self_harm" };
    }
  }
  return { flagged: false };
}
