"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import type { LetterPayload } from "../Tool";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  letter: LetterPayload;
  onClose: () => void;
};

const PRESETS = [
  { label: "In 1 month", days: 30 },
  { label: "In 3 months", days: 90 },
  { label: "In 6 months", days: 182 },
  { label: "In 1 year", days: 365 },
  { label: "In 2 years", days: 730 },
  { label: "Pick a date", days: 0 },
];

function addDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function ScheduleModal({ letter, onClose }: Props) {
  const [selectedDays, setSelectedDays] = useState<number>(180);
  const [customDate, setCustomDate] = useState<string>(isoDate(addDays(365)));
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const usingCustom = selectedDays === 0;
  const finalDate = usingCustom
    ? new Date(customDate + "T09:00:00")
    : addDays(selectedDays);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = validEmail && !isNaN(finalDate.getTime()) && finalDate > new Date();

  function handleSubmit() {
    if (!canSubmit) return;
    // Visual confirmation only — backend wiring comes later.
    setConfirmed(true);
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-title"
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
        className="relative w-full max-w-[640px] max-h-[92vh] overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, #FFF8E9 0%, #FEF7DF 100%)",
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          boxShadow: "0 60px 120px -30px rgba(138, 53, 86, 0.45)",
          border: "1px solid rgba(138, 53, 86, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* mobile grabber */}
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
          {!confirmed ? (
            <ScheduleForm
              letter={letter}
              selectedDays={selectedDays}
              setSelectedDays={setSelectedDays}
              customDate={customDate}
              setCustomDate={setCustomDate}
              email={email}
              setEmail={setEmail}
              canSubmit={canSubmit}
              onSubmit={handleSubmit}
              finalDate={finalDate}
            />
          ) : (
            <Sealed letter={letter} finalDate={finalDate} email={email} onClose={onClose} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ScheduleForm({
  letter,
  selectedDays,
  setSelectedDays,
  customDate,
  setCustomDate,
  email,
  setEmail,
  canSubmit,
  onSubmit,
  finalDate,
}: {
  letter: LetterPayload;
  selectedDays: number;
  setSelectedDays: (n: number) => void;
  customDate: string;
  setCustomDate: (s: string) => void;
  email: string;
  setEmail: (s: string) => void;
  canSubmit: boolean;
  onSubmit: () => void;
  finalDate: Date;
}) {
  return (
    <>
      <div className="tag mb-5">Schedule delivery</div>
      <h2 id="schedule-title" className="font-display text-[clamp(28px,4vw,38px)] leading-[1.1] text-ink max-w-[22ch]">
        When should this letter find{" "}
        <em className="italic font-light text-merlot">{letter.answers.name || "you"}</em>?
      </h2>
      <p className="mt-4 text-[15px] text-ink-soft max-w-[52ch]">
        We will save it now, and email it back to you on the morning you choose. You can
        always cancel from the inbox link inside the email.
      </p>

      {/* preset chips */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {PRESETS.map((p) => {
          const selected = selectedDays === p.days;
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => setSelectedDays(p.days)}
              className={`px-4 py-3.5 rounded-2xl font-medium text-[14.5px] transition-all text-left ${
                selected
                  ? "bg-merlot text-cream shadow-[0_14px_28px_-14px_rgba(138,53,86,0.5)]"
                  : "glass-strong text-ink hover:bg-white"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* custom date */}
      {selectedDays === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mt-5"
        >
          <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-merlot mb-2">
            Custom date
          </label>
          <input
            type="date"
            value={customDate}
            min={isoDate(addDays(1))}
            max={isoDate(addDays(3650))}
            onChange={(e) => setCustomDate(e.target.value)}
            className="w-full bg-paper/70 border border-line rounded-xl px-4 py-3 font-display text-[18px] text-ink focus:outline-none focus:border-merlot transition"
          />
        </motion.div>
      )}

      {/* email */}
      <div className="mt-7">
        <label
          htmlFor="future-self-email"
          className="block font-mono text-[10px] uppercase tracking-[0.2em] text-merlot mb-2"
        >
          Your email
        </label>
        <input
          id="future-self-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@somewhere.com"
          className="w-full bg-paper/70 border border-line rounded-xl px-4 py-3.5 text-[16px] text-ink focus:outline-none focus:border-merlot transition placeholder:text-ink-mute/50"
        />
        <p className="mt-2 text-[12px] text-ink-mute">
          We will send the letter once, on your chosen date. No newsletter, no other emails.
        </p>
      </div>

      {/* preview */}
      <motion.div
        initial={false}
        animate={{ opacity: canSubmit ? 1 : 0.5 }}
        transition={{ duration: 0.3 }}
        className="mt-8 rounded-2xl px-5 py-4 border border-line bg-paper/40"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-merlot mb-1">
          Arrives
        </div>
        <div className="font-display italic text-[20px] text-ink">
          {formatDate(finalDate)}
        </div>
      </motion.div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        className="mt-8 w-full btn-merlot text-[16px] py-4 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        Seal the letter
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}

function Sealed({
  finalDate,
  email,
  onClose,
}: {
  letter: LetterPayload;
  finalDate: Date;
  email: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="text-center py-6"
    >
      {/* sealed envelope animation */}
      <div className="relative h-40 flex items-center justify-center mb-6">
        <motion.div
          initial={{ scale: 0.7, rotate: -8, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative"
        >
          <svg width="120" height="90" viewBox="0 0 120 90" fill="none">
            <rect
              x="4"
              y="14"
              width="112"
              height="72"
              rx="6"
              fill="#FFF8E9"
              stroke="#8A3556"
              strokeWidth="1.5"
            />
            <path
              d="M4 20 L60 56 L116 20"
              stroke="#8A3556"
              strokeWidth="1.5"
              fill="none"
            />
            <motion.circle
              cx="60"
              cy="44"
              r="14"
              fill="#8A3556"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            />
            <motion.path
              d="M55 44 l4 4 l8 -8"
              stroke="#FEF7DF"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            />
          </svg>
        </motion.div>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="font-display text-[clamp(26px,3.5vw,34px)] leading-[1.15] text-ink max-w-[22ch] mx-auto"
      >
        Sealed. It will find you on{" "}
        <em className="italic font-light text-merlot">
          {finalDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </em>
        .
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        className="mt-5 text-[15px] text-ink-soft max-w-[44ch] mx-auto"
      >
        Until then, try to forget about it. We will send the full letter to{" "}
        <span className="text-ink font-medium">{email}</span> on the morning of your date.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-9 flex flex-col sm:flex-row gap-3 items-center justify-center"
      >
        <Link href="/#cta" className="btn-merlot">
          Get the daily morning letter
        </Link>
        <button onClick={onClose} className="btn-ghost">
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
