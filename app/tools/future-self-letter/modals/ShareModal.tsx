"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { LetterPayload } from "../Tool";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  letter: LetterPayload;
  onClose: () => void;
};

/**
 * Picks one sentence from the body that feels share-worthy.
 * Heuristic: first sentence under 180 chars; falls back to first 160 chars.
 */
function pickPullQuote(body: string): string {
  const sentences = body
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30 && s.length < 200);
  return sentences[0] || body.slice(0, 160).trim() + "…";
}

export function ShareModal({ letter, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const quote = pickPullQuote(letter.body);

  function copy() {
    navigator.clipboard?.writeText(`"${quote}" — a letter from my future self · herday.app`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-title"
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
        className="relative w-full max-w-[560px] max-h-[92vh] overflow-y-auto"
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

        <div className="p-8 md:p-10">
          <div className="tag mb-5">Share</div>
          <h2
            id="share-title"
            className="font-display text-[clamp(24px,3.5vw,30px)] leading-[1.15] text-ink max-w-[22ch]"
          >
            A small piece of your letter, for{" "}
            <em className="italic font-light text-merlot">somewhere else.</em>
          </h2>

          {/* the share card itself — square, IG-ready */}
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="mt-7 relative rounded-[24px] overflow-hidden aspect-square w-full"
            style={{
              background:
                "linear-gradient(135deg, #FFEBF6 0%, #F6D7E8 45%, #E6D9FF 100%)",
              boxShadow:
                "0 32px 80px -30px rgba(138, 53, 86, 0.4), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            {/* drifting blob */}
            <motion.div
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 w-60 h-60 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(255,181,210,0.7), transparent 70%)",
                filter: "blur(30px)",
              }}
            />

            <div className="absolute inset-0 p-7 md:p-10 flex flex-col justify-between">
              <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-merlot/80">
                A letter from my future self
              </div>

              <p className="font-display italic text-[clamp(18px,3.4vw,26px)] leading-[1.35] text-ink relative">
                <span className="text-merlot/40 text-[1.3em] font-display italic leading-none mr-1">
                  &ldquo;
                </span>
                {quote}
              </p>

              <div className="flex items-center justify-between">
                <div className="font-display text-[15px] text-ink">
                  — {letter.answers.name || "you"}, {letter.futureYear}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-merlot">
                  herday.app
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-7 grid sm:grid-cols-2 gap-3">
            <button
              onClick={copy}
              className="btn-ghost py-3.5"
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12l5 5L20 7"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M8 8v8a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2h-8a2 2 0 00-2 2zM4 16V6a2 2 0 012-2h10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Copy the quote
                </>
              )}
            </button>
            <button className="btn-merlot py-3.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Save image
            </button>
          </div>

          <p className="mt-5 text-[12px] text-ink-mute text-center">
            Image download arrives with the next update. For now: long-press the card on
            mobile to save.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
