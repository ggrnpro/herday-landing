import { NextResponse } from "next/server";
import { generateAffirmations } from "@/lib/affirmation-openrouter";
import { consumeRateLimit, extractIp, peekRateLimit } from "@/lib/rate-limit";
import {
  NEEDS,
  TONES,
  type AffirmationAnswers,
  type NeedKey,
  type ToneKey,
} from "@/lib/affirmation-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NEED_KEYS = new Set<string>(NEEDS.map((n) => n.key));
const TONE_KEYS = new Set<string>(TONES.map((t) => t.key));

function isValid(a: unknown): a is AffirmationAnswers {
  if (!a || typeof a !== "object") return false;
  const o = a as Record<string, unknown>;
  if (typeof o.name !== "string" || o.name.length < 1 || o.name.length > 60) return false;
  if (typeof o.situation !== "string" || o.situation.length > 500) return false;
  if (typeof o.tone !== "string" || !TONE_KEYS.has(o.tone)) return false;
  if (!Array.isArray(o.needs) || o.needs.length < 1 || o.needs.length > 3) return false;
  for (const n of o.needs) {
    if (typeof n !== "string" || !NEED_KEYS.has(n)) return false;
  }
  return true;
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isValid(payload)) {
    return NextResponse.json({ error: "Invalid answers payload" }, { status: 400 });
  }

  const ip = extractIp(req);
  const pre = await peekRateLimit(ip, "affirmation");
  if (pre.blocked) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: `You've generated your ${pre.limit} sets of affirmations today. Come back tomorrow — or hear them daily, in your own voice, on the app.`,
        rateLimit: pre,
      },
      { status: 429 },
    );
  }

  let result;
  try {
    result = await generateAffirmations({
      name: payload.name.trim(),
      situation: payload.situation.trim(),
      needs: payload.needs as NeedKey[],
      tone: payload.tone as ToneKey,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown";
    console.error("generateAffirmations failed", message);
    return NextResponse.json(
      { error: "generation_failed", message: "The pen slipped. Try again." },
      { status: 502 },
    );
  }

  const post = await consumeRateLimit(ip, "affirmation");

  return NextResponse.json({
    ok: true,
    payload: {
      answers: payload,
      affirmations: result.affirmations,
      imageQuote: result.imageQuote,
    },
    rateLimit: post,
    debug: { ms: result.ms, costUsd: result.costUsd },
  });
}
