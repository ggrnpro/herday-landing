import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sql } from "@/lib/db";
import { consumeRateLimit, extractIp, peekRateLimit } from "@/lib/rate-limit";
import { SequenceEmail } from "@/emails/SequenceEmail";
import {
  SENDER,
  SEQUENCE,
  unsubscribeUrl,
} from "@/lib/email-sequence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = { email?: unknown; source?: unknown; name?: unknown };

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
}

const WELCOME = SEQUENCE[0]; // step 0
const STEP_1 = SEQUENCE[1]; // first cron-driven step

export async function POST(req: Request) {
  let payload: Body;
  try {
    payload = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  const source =
    typeof payload.source === "string" ? payload.source.slice(0, 32) : "site";
  const name =
    typeof payload.name === "string" && payload.name.trim()
      ? payload.name.trim().slice(0, 80)
      : null;

  // Anti-abuse: cap signups per IP per day. Same email resubmitted is idempotent
  // and does not burn quota (we only consume on a fresh insert below).
  const ip = extractIp(req);
  const peek = await peekRateLimit(ip, "subscribe");
  if (peek.blocked) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  // When step 1 is due, relative to signup.
  const nextSendAt = new Date(
    Date.now() + STEP_1.delayDays * 24 * 60 * 60 * 1000,
  ).toISOString();

  let row: { id: string; unsub_token: string } | undefined;
  try {
    const rows = await sql<{ id: string; unsub_token: string }[]>`
      insert into subscribers
        (email, name, source, next_step, next_send_at, last_sent_step, last_sent_at)
      values
        (${email}, ${name}, ${source}, 1, ${nextSendAt}, 0, now())
      on conflict (email) do nothing
      returning id, unsub_token
    `;
    row = rows[0];
  } catch (e) {
    console.error("subscriber insert failed", e);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  // Already subscribed -> idempotent success, no second welcome, no quota burn.
  if (!row) {
    return NextResponse.json({ ok: true, already: true });
  }

  await consumeRateLimit(ip, "subscribe");

  const unsubUrl = unsubscribeUrl(row.unsub_token);
  const resend = new Resend(process.env.RESEND_API_KEY);

  // 1) Store the contact in the Resend Audience (source of truth for sends).
  //    Skips gracefully if the audience id is not configured yet (dev).
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (audienceId) {
    try {
      const { data } = await resend.contacts.create({
        audienceId,
        email,
        ...(name ? { firstName: name } : {}),
        unsubscribed: false,
      });
      if (data?.id) {
        await sql`update subscribers set resend_contact_id = ${data.id} where id = ${row.id}`;
      }
    } catch (e) {
      // Non-fatal: the row is saved; we can backfill the contact later.
      console.error("resend contact create failed", e);
    }
  }

  // 2) Send the welcome (step 0) immediately, transactionally.
  try {
    await resend.emails.send({
      from: `${SENDER.name} <${process.env.EMAIL_FROM}>`,
      replyTo: SENDER.replyTo,
      to: [email],
      subject: WELCOME.subject,
      react: SequenceEmail({ step: WELCOME, name: name ?? undefined, unsubUrl }),
      headers: {
        "X-Entity-Ref-ID": `herday-welcome-${row.id}`,
        "List-Unsubscribe": `<${unsubUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
  } catch (e) {
    // Non-fatal: they are on the list; cron continues the sequence regardless.
    console.error("welcome email failed", e);
  }

  return NextResponse.json({ ok: true });
}
