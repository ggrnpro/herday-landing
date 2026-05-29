import { NextResponse } from "next/server";
import { generateLetter } from "@/lib/openrouter";
import { consumeRateLimit, extractIp, peekRateLimit } from "@/lib/rate-limit";
import type { LetterAnswers } from "@/lib/prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALUE_KEYS = new Set(["career", "family", "health", "love", "purpose", "peace"]);

function isValid(a: unknown): a is LetterAnswers {
  if (!a || typeof a !== "object") return false;
  const o = a as Record<string, unknown>;
  if (typeof o.name !== "string" || o.name.length < 1 || o.name.length > 60) return false;
  if (typeof o.age !== "number" || o.age < 13 || o.age > 99) return false;
  if (typeof o.horizonMonths !== "number" || o.horizonMonths < 1 || o.horizonMonths > 240) return false;
  if (typeof o.struggle !== "string" || o.struggle.length > 500) return false;
  if (!Array.isArray(o.values) || o.values.length < 1 || o.values.length > 3) return false;
  for (const v of o.values) {
    if (typeof v !== "string" || !VALUE_KEYS.has(v)) return false;
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

  // Peek first so we return a friendly 429 without an extra DB write.
  const pre = await peekRateLimit(ip, "letter");
  if (pre.blocked) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: `You've sent your ${pre.limit} free letters today. The kettle goes on again tomorrow.`,
        rateLimit: pre,
      },
      { status: 429 },
    );
  }

  let letter;
  try {
    letter = await generateLetter(payload);
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown";
    console.error("generateLetter failed", message);
    return NextResponse.json(
      { error: "generation_failed", message: "The pen slipped. Try again." },
      { status: 502 },
    );
  }

  // Only count successful generations against the limit.
  const post = await consumeRateLimit(ip, "letter");

  return NextResponse.json({
    ok: true,
    letter: {
      greeting: `Dear ${payload.name},`,
      body: letter.body,
      signOff: letter.signOff,
      shareQuotes: letter.shareQuotes,
      futureAge: letter.futureAge,
      closing: `${letter.signOff}\n\n— you, ${letter.futureAge}`,
      futureYear: new Date().getFullYear() + Math.max(Math.round(payload.horizonMonths / 12), 1),
      answers: payload,
    },
    rateLimit: post,
    debug: { ms: letter.ms, costUsd: letter.costUsd },
  });
}
