import { NextResponse } from "next/server";
import { processSequence } from "@/lib/send-sequence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Vercel Cron — runs daily per vercel.json. Sends every due onboarding step.
 * Auth mirrors /api/cron/send-letters: Bearer CRON_SECRET, enforced in prod only.
 *
 * Manual trigger (to process sooner than the next 9am UTC run):
 *   GET /api/cron/send-sequence  with  Authorization: Bearer $CRON_SECRET
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (process.env.NODE_ENV === "production" && auth !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await processSequence();
  return NextResponse.json({ ok: true, ...result });
}
