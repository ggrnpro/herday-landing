"use client";

import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  onContinue: () => void;
  onClose: () => void;
};

export function CrisisModal({ onContinue, onClose }: Props) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="crisis-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{
        background: "rgba(26, 14, 21, 0.5)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="relative w-full max-w-[560px] max-h-[94vh] overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, #FFF8E9 0%, #FEF7DF 100%)",
          borderRadius: 32,
          boxShadow: "0 60px 120px -30px rgba(138, 53, 86, 0.5)",
          border: "1px solid rgba(138, 53, 86, 0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-ink/10" />
        </div>

        <div className="p-8 md:p-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-merlot mb-5">
            One pause, before we go on
          </div>
          <h2
            id="crisis-title"
            className="font-display text-[clamp(26px,4vw,36px)] leading-[1.1] text-ink max-w-[24ch]"
          >
            What you wrote sounds{" "}
            <em className="italic font-light text-merlot">heavier</em> than the
            day-to-day inner critic.
          </h2>
          <p className="mt-5 text-[15px] text-ink-soft leading-[1.6] max-w-[52ch]">
            This tool was built for the harsh, familiar voice that shows up on
            ordinary mornings. What you wrote sounds like something more &mdash;
            and we do not want to hand back a clever sentence to it. Please do
            not sit with this alone.
          </p>

          <div className="mt-7 space-y-2">
            <Resource
              region="United States &amp; Canada"
              number="988"
              detail="Call or text. Free, 24/7. Trained crisis counselors."
            />
            <Resource
              region="United States — text only"
              number="Text HOME to 741741"
              detail="Crisis Text Line."
            />
            <Resource
              region="United Kingdom &amp; Ireland"
              number="116 123"
              detail="Samaritans. Free, 24/7."
            />
            <Resource
              region="Anywhere in the world"
              link="https://findahelpline.com"
              detail="findahelpline.com — directory by country."
            />
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-merlot flex-1 py-4 text-[15px]"
            >
              Close this for now
            </button>
            <button
              type="button"
              onClick={onContinue}
              className="btn-ghost flex-1 py-4 text-[14px] text-ink-mute"
            >
              I&rsquo;m safe — continue anyway
            </button>
          </div>

          <p className="mt-5 text-[11px] font-mono uppercase tracking-[0.2em] text-ink-mute/70 text-center">
            HerDay is not therapy
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Resource({
  region,
  number,
  link,
  detail,
}: {
  region: string;
  number?: string;
  link?: string;
  detail: string;
}) {
  return (
    <div
      className="rounded-2xl px-5 py-4 border border-line bg-paper/40"
      style={{ borderColor: "rgba(138, 53, 86, 0.15)" }}
    >
      <div
        className="font-mono text-[10px] uppercase tracking-[0.18em] text-merlot mb-1"
        dangerouslySetInnerHTML={{ __html: region }}
      />
      {number && (
        <div className="font-display text-[20px] text-ink leading-tight">
          {number}
        </div>
      )}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-display text-[20px] text-merlot leading-tight underline underline-offset-2"
        >
          {link.replace(/^https?:\/\//, "")}
        </a>
      )}
      <p className="mt-1 text-[13px] text-ink-soft leading-[1.45]">{detail}</p>
    </div>
  );
}
