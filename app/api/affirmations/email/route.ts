import { NextResponse } from "next/server";
import { Resend } from "resend";
import { AffirmationsEmail } from "@/emails/Affirmations";
import { LENSES } from "@/lib/affirmation-openrouter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  email: string;
  name: string;
  affirmations: string[];
};

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
}

function isValid(b: unknown): b is Body {
  if (!b || typeof b !== "object") return false;
  const o = b as Record<string, unknown>;
  if (typeof o.email !== "string" || !isValidEmail(o.email)) return false;
  if (typeof o.name !== "string" || o.name.length < 1 || o.name.length > 60) return false;
  if (!Array.isArray(o.affirmations) || o.affirmations.length !== 5) return false;
  for (const a of o.affirmations) {
    if (typeof a !== "string" || a.length < 20 || a.length > 400) return false;
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
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const lensLabels = LENSES.map((l) => l.label);

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME || "HerDay"} <${process.env.EMAIL_FROM}>`,
      to: [payload.email],
      subject: `Five small true things for ${payload.name}, today.`,
      react: AffirmationsEmail({
        name: payload.name,
        affirmations: payload.affirmations,
        lensLabels,
        sentAtIso: new Date().toISOString(),
      }),
      headers: {
        "X-Entity-Ref-ID": `herday-affirmations-${Date.now()}`,
      },
    });

    if (error) {
      console.error("affirmations email send failed", error);
      return NextResponse.json(
        { error: "send_failed", message: "Could not send the email." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (e) {
    console.error("affirmations email error", e);
    return NextResponse.json(
      { error: "send_failed", message: "Could not send the email." },
      { status: 500 },
    );
  }
}
