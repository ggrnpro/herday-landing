import { NextResponse } from "next/server";
import { translateInnerCritic } from "@/lib/inner-critic-openrouter";
import { consumeRateLimit, extractIp, peekRateLimit } from "@/lib/rate-limit";
import { safetyScan } from "@/lib/safety-filter";
import type { InnerCriticAnswers } from "@/lib/inner-critic-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = InnerCriticAnswers & {
  acknowledgeSafety?: boolean;
};

function isValid(a: unknown): a is Body {
  if (!a || typeof a !== "object") return false;
  const o = a as Record<string, unknown>;
  if (typeof o.name !== "string" || o.name.length < 1 || o.name.length > 60) return false;
  if (typeof o.critic !== "string" || o.critic.length < 5 || o.critic.length > 600) return false;
  if (o.acknowledgeSafety !== undefined && typeof o.acknowledgeSafety !== "boolean") return false;
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
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Safety scan FIRST, before anything else (don't burn rate-limit, don't
  // hit OpenRouter). If she has not explicitly acknowledged the safety
  // notice, surface the crisis interstitial instead.
  const safety = safetyScan(payload.critic);
  if (safety.flagged && !payload.acknowledgeSafety) {
    return NextResponse.json(
      {
        error: "safety_flagged",
        reason: safety.reason,
        message:
          "What you wrote sounds heavier than the day-to-day inner critic this tool was built for.",
      },
      { status: 200 },
    );
  }

  const ip = extractIp(req);
  const pre = await peekRateLimit(ip, "inner_critic");
  if (pre.blocked) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: `You've used your ${pre.limit} translations today. Try again tomorrow — or get the app for unlimited, read in your own voice.`,
        rateLimit: pre,
      },
      { status: 429 },
    );
  }

  let result;
  try {
    result = await translateInnerCritic({
      name: payload.name.trim(),
      critic: payload.critic.trim(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown";
    console.error("translateInnerCritic failed", message);
    return NextResponse.json(
      { error: "generation_failed", message: "The pen slipped. Try again." },
      { status: 502 },
    );
  }

  const post = await consumeRateLimit(ip, "inner_critic");

  return NextResponse.json({
    ok: true,
    payload: {
      answers: { name: payload.name.trim(), critic: payload.critic.trim() },
      criticType: result.criticType,
      criticIntent: result.criticIntent,
      translations: result.translations,
      imageQuote: result.imageQuote,
      safetyAcknowledged: Boolean(payload.acknowledgeSafety),
    },
    rateLimit: post,
    debug: { ms: result.ms, costUsd: result.costUsd },
  });
}
