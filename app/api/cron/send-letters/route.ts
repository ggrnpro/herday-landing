import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sql } from "@/lib/db";
import { FutureSelfLetterEmail } from "@/emails/FutureSelfLetter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

type DueRow = {
  id: string;
  email: string;
  name: string;
  scheduled_for: Date;
  body: string;
  sign_off: string;
  future_age: number;
  send_attempts: number;
};

const MAX_ATTEMPTS = 3;

/**
 * Vercel Cron — runs daily per vercel.json schedule.
 * Auth: Vercel adds Authorization: Bearer CRON_SECRET (we set the secret in env).
 *
 * Picks unsent letters whose scheduled_for is past, sends each, records result.
 * Idempotent enough: we only mark sent_at after Resend acknowledges; if we
 * crash mid-batch, the next run picks up the rest.
 */
export async function GET(req: Request) {
  // Verify the cron secret. In dev we allow no-auth localhost calls.
  const auth = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (process.env.NODE_ENV === "production" && auth !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const due = await sql<DueRow[]>`
    select id, email, name, scheduled_for, body, sign_off, future_age, send_attempts
    from scheduled_letters
    where sent_at is null
      and send_attempts < ${MAX_ATTEMPTS}
      and scheduled_for <= now()
    order by scheduled_for asc
    limit 100
  `;

  if (due.length === 0) {
    return NextResponse.json({ ok: true, processed: 0 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  let sent = 0;
  let failed = 0;

  for (const row of due) {
    try {
      const { data, error } = await resend.emails.send({
        from: `${process.env.EMAIL_FROM_NAME || "HerDay"} <${process.env.EMAIL_FROM}>`,
        to: [row.email],
        subject: `A letter from your future self, ${row.name}`,
        react: FutureSelfLetterEmail({
          name: row.name,
          body: row.body,
          signOff: row.sign_off,
          futureAge: row.future_age,
          sentAtIso: new Date().toISOString(),
        }),
        headers: {
          "X-Entity-Ref-ID": `herday-letter-${row.id}`,
        },
      });

      if (error) {
        throw new Error(typeof error === "string" ? error : JSON.stringify(error));
      }

      await sql`
        update scheduled_letters
        set sent_at = now(),
            resend_message_id = ${data?.id ?? null},
            send_attempts = send_attempts + 1
        where id = ${row.id}
      `;
      sent++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`send failed for ${row.id}`, msg);
      await sql`
        update scheduled_letters
        set send_attempts = send_attempts + 1,
            last_error = ${msg.slice(0, 1000)}
        where id = ${row.id}
      `;
      failed++;
    }
  }

  // Daily GC of old rate-limit rows. Cheap, idempotent.
  await sql`delete from rate_limits where day < current_date - 30`;

  return NextResponse.json({ ok: true, processed: due.length, sent, failed });
}
