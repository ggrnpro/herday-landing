import "server-only";

import { Resend } from "resend";
import { sql } from "./db";
import { SequenceEmail } from "@/emails/SequenceEmail";
import { SENDER, SEQUENCE, LAST_STEP, unsubscribeUrl } from "./email-sequence";

const MAX_ATTEMPTS = 3;

type DueRow = {
  id: string;
  email: string;
  name: string | null;
  unsub_token: string;
  next_step: number;
  created_at: Date;
};

export type SequenceRunResult = {
  processed: number;
  sent: number;
  failed: number;
};

/**
 * Sends every onboarding step that is due, advancing each subscriber to the
 * next step. Driven by the daily cron. Idempotent enough: a step is only marked
 * advanced after Resend acknowledges, so a mid-batch crash is picked up next run.
 */
export async function processSequence(): Promise<SequenceRunResult> {
  const due = await sql<DueRow[]>`
    select id, email, name, unsub_token, next_step, created_at
      from subscribers
     where unsubscribed = false
       and next_send_at is not null
       and next_send_at <= now()
       and next_step <= ${LAST_STEP}
       and send_attempts < ${MAX_ATTEMPTS}
     order by next_send_at asc
     limit 100
  `;

  if (due.length === 0) return { processed: 0, sent: 0, failed: 0 };

  const resend = new Resend(process.env.RESEND_API_KEY);
  let sent = 0;
  let failed = 0;

  for (const row of due) {
    const step = SEQUENCE[row.next_step];
    if (!step) continue; // out of range guard

    const unsubUrl = unsubscribeUrl(row.unsub_token);

    try {
      const { data, error } = await resend.emails.send({
        from: `${SENDER.name} <${process.env.EMAIL_FROM}>`,
        replyTo: SENDER.replyTo,
        to: [row.email],
        subject: step.subject,
        react: SequenceEmail({ step, name: row.name ?? undefined, unsubUrl }),
        headers: {
          "X-Entity-Ref-ID": `herday-seq-${step.key}-${row.id}`,
          "List-Unsubscribe": `<${unsubUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });

      if (error) {
        throw new Error(typeof error === "string" ? error : JSON.stringify(error));
      }

      const nextStep = row.next_step + 1;
      const next = SEQUENCE[nextStep];
      const nextSendAt =
        next != null
          ? new Date(
              row.created_at.getTime() + next.delayDays * 24 * 60 * 60 * 1000,
            ).toISOString()
          : null;

      await sql`
        update subscribers
           set last_sent_step = ${row.next_step},
               last_sent_at = now(),
               next_step = ${nextStep},
               next_send_at = ${nextSendAt},
               send_attempts = 0,
               last_error = null
         where id = ${row.id}
      `;
      sent++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`sequence send failed for ${row.id} step ${row.next_step}`, msg);
      await sql`
        update subscribers
           set send_attempts = send_attempts + 1,
               last_error = ${msg.slice(0, 1000)}
         where id = ${row.id}
      `;
      failed++;
    }
  }

  return { processed: due.length, sent, failed };
}
