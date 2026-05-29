"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LENSES } from "@/lib/affirmation-openrouter";
import type { AffirmationPayload } from "../lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  payload: AffirmationPayload;
  onClose: () => void;
};

function buildShareImageUrl(quote: string, name: string, lensLabel: string): string {
  const params = new URLSearchParams({
    q: quote,
    n: name,
    e: `A daily affirmation · ${lensLabel}`,
  });
  return `/api/share-image?${params.toString()}`;
}

export function ShareModal({ payload, onClose }: Props) {
  const { affirmations, answers } = payload;
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const text = affirmations[index];
  const name = answers.name || "you";
  const lens = LENSES[index];
  const imageUrl = buildShareImageUrl(text, name, lens?.label || "");

  function copy() {
    navigator.clipboard?.writeText(
      `"${text}" — a daily affirmation · getherday.app`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function go(dir: -1 | 1) {
    setIndex((i) => (i + dir + affirmations.length) % affirmations.length);
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

        <div className="p-7 md:p-10">
          <div className="tag mb-4">
            Save · {index + 1} of {affirmations.length}
          </div>
          <h2
            id="share-title"
            className="font-display text-[clamp(22px,3.2vw,28px)] leading-[1.15] text-ink max-w-[26ch]"
          >
            Save any of the five.{" "}
            <em className="italic font-light text-merlot">For your lock screen.</em>
          </h2>

          <div className="mt-6 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="relative rounded-[24px] overflow-hidden aspect-square w-full"
                style={{
                  background:
                    "linear-gradient(135deg, #FFEBF6 0%, #F6D7E8 45%, #E6D9FF 100%)",
                  boxShadow:
                    "0 32px 80px -30px rgba(138, 53, 86, 0.4), inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
              >
                <motion.div
                  animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                  transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 -right-10 w-60 h-60 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,181,210,0.7), transparent 70%)",
                    filter: "blur(30px)",
                  }}
                />

                <div className="absolute inset-0 p-7 md:p-9 flex flex-col justify-between">
                  <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-merlot/80">
                    A daily affirmation · {lens?.label}
                  </div>

                  <p
                    className="font-display italic leading-[1.3] text-ink relative"
                    style={{
                      fontSize:
                        text.length > 160
                          ? "clamp(15px, 2.6vw, 20px)"
                          : text.length > 100
                            ? "clamp(17px, 3vw, 23px)"
                            : "clamp(19px, 3.4vw, 26px)",
                    }}
                  >
                    <span className="text-merlot/40 text-[1.3em] font-display italic leading-none mr-1">
                      &ldquo;
                    </span>
                    {text}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="font-display text-[15px] text-ink">— {name}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-merlot">
                      getherday.app
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-strong flex items-center justify-center hover:bg-white transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-strong flex items-center justify-center hover:bg-white transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            {affirmations.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Affirmation ${i + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === index ? 24 : 8,
                  background:
                    i === index
                      ? "var(--color-merlot)"
                      : "rgba(138, 53, 86, 0.25)",
                }}
              />
            ))}
          </div>

          <div className="mt-7 grid sm:grid-cols-2 gap-3">
            <button onClick={copy} className="btn-ghost py-3.5">
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
                  Copy the text
                </>
              )}
            </button>
            <a
              href={imageUrl}
              download={`herday-affirmation-${name.toLowerCase().replace(/\s+/g, "-")}-${index + 1}.png`}
              className="btn-merlot py-3.5 no-underline"
            >
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
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
