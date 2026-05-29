import { NextResponse } from "next/server";
import { Resend } from "resend";
import { InnerCriticEmail } from "@/emails/InnerCritic";
import { LENSES } from "@/lib/inner-critic-openrouter";
import { CRITIC_TYPES, type CriticType } from "@/lib/inner-critic-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  email: string;
  name: string;
  critic: string;
  criticType: string;
  criticIntent: string;
  translations: string[];
};

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
}

function isCriticType(s: string): s is CriticType {
  return (CRITIC_TYPES as readonly string[]).includes(s);
}

function isValid(b: unknown): b is Body {
  if (!b || typeof b !== "object") return false;
  const o = b as Record<string, unknown>;
  if (typeof o.email !== "string" || !isValidEmail(o.email)) return false;
  if (typeof o.name !== "string" || o.name.length < 1 || o.name.length > 60) return false;
  if (typeof o.critic !== "string" || o.critic.length < 5 || o.critic.length > 600) return false;
  if (typeof o.criticType !== "string" || !isCriticType(o.criticType)) return false;
  if (typeof o.criticIntent !== "string" || o.criticIntent.length > 400) return false;
  if (!Array.isArray(o.translations) || o.translations.length !== 4) return false;
  for (const t of o.translations) {
    if (typeof t !== "string" || t.length < 20 || t.length > 600) return false;
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
      subject: `Four kinder translations for ${payload.name}.`,
      react: InnerCriticEmail({
        name: payload.name,
        criticType: payload.criticType,
        criticIntent: payload.criticIntent,
        translations: payload.translations,
        lensLabels,
        sentAtIso: new Date().toISOString(),
      }),
      headers: {
        "X-Entity-Ref-ID": `herday-inner-critic-${Date.now()}`,
      },
    });

    if (error) {
      console.error("inner-critic email send failed", error);
      return NextResponse.json(
        { error: "send_failed", message: "Could not send the email." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (e) {
    console.error("inner-critic email error", e);
    return NextResponse.json(
      { error: "send_failed", message: "Could not send the email." },
      { status: 500 },
    );
  }
}
