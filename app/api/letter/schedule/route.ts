import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sql } from "@/lib/db";
import { ScheduleConfirmationEmail } from "@/emails/ScheduleConfirmation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  email: string;
  scheduledFor: string; // ISO datetime
  letter: {
    answers: { name: string };
    body: string;
    signOff: string;
    futureAge: number;
  };
};

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
}

function isValid(b: unknown): b is Body {
  if (!b || typeof b !== "object") return false;
  const o = b as Record<string, unknown>;
  if (typeof o.email !== "string" || !isValidEmail(o.email)) return false;
  if (typeof o.scheduledFor !== "string") return false;
  const when = new Date(o.scheduledFor);
  if (isNaN(when.getTime())) return false;
  if (when.getTime() < Date.now() - 60_000) return false; // can't schedule in the past
  if (when.getTime() > Date.now() + 1000 * 60 * 60 * 24 * 365 * 10) return false; // 10y max
  if (!o.letter || typeof o.letter !== "object") return false;
  const l = o.letter as Record<string, unknown>;
  if (typeof l.body !== "string" || l.body.length < 50 || l.body.length > 4000) return false;
  if (typeof l.signOff !== "string" || l.signOff.length > 200) return false;
  if (typeof l.futureAge !== "number") return false;
  if (!l.answers || typeof (l.answers as Record<string, unknown>).name !== "string") return false;
  return true;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isValid(payload)) {
    return NextResponse.json({ error: "Invalid schedule payload" }, { status: 400 });
  }

  const name = payload.letter.answers.name.slice(0, 60);
  const scheduledFor = new Date(payload.scheduledFor);

  let row;
  try {
    const rows = await sql<{ id: string }[]>`
      insert into scheduled_letters
        (email, name, scheduled_for, body, sign_off, future_age)
      values
        (${payload.email}, ${name}, ${scheduledFor.toISOString()},
         ${payload.letter.body}, ${payload.letter.signOff}, ${payload.letter.futureAge})
      returning id
    `;
    row = rows[0];
  } catch (e) {
    console.error("schedule insert failed", e);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  // Fire-and-await a confirmation email so the user knows it landed.
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME || "HerDay"} <${process.env.EMAIL_FROM}>`,
      to: [payload.email],
      subject: "Your letter is sealed.",
      react: ScheduleConfirmationEmail({
        name,
        scheduledForLabel: formatDate(scheduledFor),
      }),
      headers: {
        "X-Entity-Ref-ID": `herday-sealed-${row.id}`,
      },
    });
  } catch (e) {
    // Non-fatal — the row is saved; we can resend confirmation manually if needed.
    console.error("confirmation email failed", e);
  }

  return NextResponse.json({
    ok: true,
    id: row.id,
    scheduledFor: scheduledFor.toISOString(),
  });
}
