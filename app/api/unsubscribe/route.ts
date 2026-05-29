import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * One-click unsubscribe.
 *
 * - POST  -> RFC 8058 one-click (mail clients hit this from List-Unsubscribe-Post).
 * - GET   -> a human clicked the footer link; flip + show a small confirmation page.
 *
 * Flips `unsubscribed` in our Postgres mirror AND in the Resend Audience so the
 * contact stops receiving any future broadcasts too.
 */

async function unsubscribe(token: string): Promise<"ok" | "notfound"> {
  if (!token) return "notfound";

  const rows = await sql<{ email: string; already: boolean }[]>`
    update subscribers
       set unsubscribed = true,
           unsubscribed_at = coalesce(unsubscribed_at, now()),
           next_send_at = null
     where unsub_token = ${token}
     returning email, (unsubscribed_at is not null) as already
  `;
  const row = rows[0];
  if (!row) return "notfound";

  // Mirror to Resend so future broadcasts also stop.
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (audienceId) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.contacts.update({
        audienceId,
        email: row.email,
        unsubscribed: true,
      });
    } catch (e) {
      console.error("resend unsubscribe mirror failed", e);
    }
  }
  return "ok";
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("t") ?? "";
  const result = await unsubscribe(token);
  if (result === "notfound") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("t") ?? "";
  const result = await unsubscribe(token);

  const ok = result === "ok";
  const title = ok ? "You're unsubscribed." : "Link not found.";
  const body = ok
    ? "You won't hear from the HerDay waitlist again. No hard feelings, and the door stays open if you change your mind."
    : "We couldn't find that unsubscribe link. It may have already been used.";

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title}</title>
<style>
  :root { color-scheme: light only; }
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
         background:#FEF7DF; font-family: Georgia, "Times New Roman", serif; color:#1A0E15; padding:24px; }
  .card { max-width:460px; background:#FFF8E9; border:1px solid rgba(138,53,86,0.12);
          border-radius:24px; padding:44px 36px; text-align:center;
          box-shadow:0 28px 56px -32px rgba(138,53,86,0.28); }
  h1 { font-style:italic; font-weight:400; font-size:28px; line-height:1.2; margin:0 0 16px; }
  p { font-size:16px; line-height:1.6; color:#3E2530; margin:0 0 24px; }
  a { display:inline-block; padding:12px 24px; background:#8A3556; color:#FEF7DF;
      text-decoration:none; border-radius:999px; font-size:15px; }
</style></head>
<body><div class="card">
  <h1>${title}</h1>
  <p>${body}</p>
  <a href="https://getherday.app">Back to HerDay</a>
</div></body></html>`;

  return new NextResponse(html, {
    status: ok ? 200 : 404,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
