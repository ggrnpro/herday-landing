"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import type { AffirmationPayload } from "../lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  payload: AffirmationPayload;
  onClose: () => void;
};

export function EmailModal({ payload, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const valid =
    !submitting && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function submit() {
    if (!valid) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/affirmations/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: payload.answers.name,
          affirmations: payload.affirmations,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setSubmitError(err.message || err.error || "Could not send.");
        return;
      }
      setSent(true);
    } catch {
      setSubmitError("We couldn't reach the page. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{
        background: "rgba(26, 14, 21, 0.4)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative w-full max-w-[540px] max-h-[92vh] overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, #FFF8E9 0%, #FEF7DF 100%)",
          borderRadius: 32,
          boxShadow: "0 60px 120px -30px rgba(138, 53, 86, 0.45)",
          border: "1px solid rgba(138, 53, 86, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-ink/10" />
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 w-10 h-10 rounded-full glass-strong flex items-center justify-center hover:bg-white transition z-10"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M6 18L18 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="p-8 md:p-12">
          {!sent ? (
            <>
              <div className="tag mb-5">Optional</div>
              <h2
                id="email-title"
                className="font-display text-[clamp(26px,4vw,36px)] leading-[1.1] text-ink max-w-[22ch]"
              >
                Send these five to <em className="italic font-light text-merlot">your inbox</em>?
              </h2>
              <p className="mt-4 text-[15px] text-ink-soft max-w-[48ch]">
                One email, once. No newsletter, no follow-ups. Just so you have
                them somewhere on a rougher Tuesday.
              </p>

              <div className="mt-8">
                <label
                  htmlFor="affirm-email"
                  className="block font-mono text-[10px] uppercase tracking-[0.2em] text-merlot mb-2"
                >
                  Your email
                </label>
                <input
                  id="affirm-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@somewhere.com"
                  className="w-full bg-paper/70 border border-line rounded-xl px-4 py-3.5 text-[16px] text-ink focus:outline-none focus:border-merlot transition placeholder:text-ink-mute/50"
                />
              </div>

              <button
                type="button"
                onClick={submit}
                disabled={!valid}
                className="mt-7 w-full btn-merlot text-[16px] py-4 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {submitting ? "Sending..." : "Send to my inbox"}
                {!submitting && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>

              {submitError && (
                <p className="mt-3 text-[13px] text-merlot text-center" role="alert">
                  {submitError}
                </p>
              )}
            </>
          ) : (
            <Sent email={email} onClose={onClose} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Sent({ email, onClose }: { email: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="text-center py-4"
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-merlot mb-4">
        Sent
      </div>
      <h2 className="font-display text-[clamp(26px,3.5vw,34px)] leading-[1.15] text-ink max-w-[22ch] mx-auto">
        On its way to{" "}
        <em className="italic font-light text-merlot">{email}</em>.
      </h2>
      <p className="mt-5 text-[15px] text-ink-soft max-w-[44ch] mx-auto">
        Check your inbox. If it didn&rsquo;t arrive in five minutes, look in
        promotions or spam.
      </p>
      <div className="mt-9 flex flex-col sm:flex-row gap-3 items-center justify-center">
        <Link href="/#cta" className="btn-merlot">
          Get HerDay
        </Link>
        <button onClick={onClose} className="btn-ghost">
          Close
        </button>
      </div>
    </motion.div>
  );
}
