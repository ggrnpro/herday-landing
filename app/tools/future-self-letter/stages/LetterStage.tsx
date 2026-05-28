"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Flower } from "@/components/Flower";
import type { LetterPayload } from "../Tool";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  letter: LetterPayload;
  onSchedule: () => void;
  onShare: () => void;
  onWriteAnother: () => void;
};

/**
 * Streams the body word by word for a hand-written feel.
 * Uses requestAnimationFrame and timestamp deltas, so it doesn't
 * fight React's scheduler and stays smooth on slow devices.
 */
function useWordStream(text: string, msPerWord = 55) {
  const [visible, setVisible] = useState("");
  const done = visible.length === text.length;

  useEffect(() => {
    if (!text) return;
    const words = text.split(/(\s+)/);
    let i = 0;
    let cancelled = false;
    let buffer = "";
    const tick = () => {
      if (cancelled) return;
      if (i < words.length) {
        buffer += words[i];
        setVisible(buffer);
        i++;
        window.setTimeout(tick, msPerWord);
      }
    };
    const start = window.setTimeout(tick, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(start);
    };
    // text/msPerWord are intentionally stable per component instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { visible, done };
}

export function LetterStage({ letter, onSchedule, onShare, onWriteAnother }: Props) {
  const { visible: body, done } = useWordStream(letter.body, 28);
  const letterRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative">
      {/* ambient flowers */}
      <Flower
        size={90}
        variant="daisy"
        opacity={0.4}
        className="flower-spin absolute top-[2%] right-[4%] hidden md:block"
      />
      <Flower
        size={60}
        variant="petal"
        opacity={0.45}
        className="flower-spin-rev absolute top-[40%] left-[3%] hidden md:block"
      />

      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-center justify-between mb-8"
        >
          <span className="tag">A letter for {letter.answers.name}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute">
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </motion.div>

        {/* the letter card — paper feel */}
        <motion.div
          ref={letterRef}
          initial={{ opacity: 0, y: 20, rotateX: 4 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="relative rounded-[36px] p-8 md:p-14 lg:p-16 overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, #FFF8E9 0%, #FEF7DF 100%)",
            boxShadow:
              "0 60px 120px -40px rgba(138, 53, 86, 0.3), 0 20px 40px -20px rgba(138, 53, 86, 0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
            border: "1px solid rgba(138, 53, 86, 0.08)",
          }}
        >
          {/* corner ornament */}
          <div className="absolute top-6 right-6 md:top-8 md:right-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 opacity-30"
            >
              <Flower size={24} variant="daisy" opacity={1} />
            </motion.div>
          </div>

          {/* greeting */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-display italic text-[clamp(26px,4vw,42px)] leading-[1.15] text-ink mb-10"
          >
            {letter.greeting}
          </motion.div>

          {/* body with word streaming */}
          <div className="font-display text-[clamp(18px,2.1vw,22px)] leading-[1.7] text-ink-soft whitespace-pre-wrap min-h-[200px]">
            {body}
            {!done && (
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="inline-block w-[0.6em] h-[1em] ml-0.5 align-text-bottom rounded-sm"
                style={{ background: "var(--color-merlot)" }}
              />
            )}
          </div>

          {/* closing — only after streaming done */}
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="mt-12 font-display italic text-[clamp(18px,2.2vw,22px)] leading-[1.5] text-merlot whitespace-pre-wrap"
            >
              {letter.closing}
            </motion.div>
          )}
        </motion.div>

        {/* actions */}
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="mt-10"
          >
            <div className="grid sm:grid-cols-3 gap-3">
              <ActionCard
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                  </svg>
                }
                label="Listen in your voice"
                meta="Coming soon"
                disabled
                onClick={() => {}}
              />
              <ActionCard
                primary
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6M4 6l8 7 8-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                label="Send to my future self"
                meta="Pick a date"
                onClick={onSchedule}
              />
              <ActionCard
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                label="Save as image"
                meta="For your phone"
                onClick={onShare}
              />
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={onWriteAnother}
                className="text-[14px] text-ink-mute hover:text-merlot transition inline-flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 4v6h6M20 20v-6h-6M4 10a8 8 0 0114-4M20 14a8 8 0 01-14 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Write another letter
              </button>

              <Link
                href="/#cta"
                className="group inline-flex items-center gap-2 text-[14px] text-merlot font-medium"
              >
                Hear it in your real voice in HerDay
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ActionCard({
  icon,
  label,
  meta,
  onClick,
  primary,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  meta: string;
  onClick: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group rounded-3xl p-6 text-left transition-all ${
        primary
          ? "bg-merlot text-cream hover:bg-merlot-deep hover:-translate-y-0.5"
          : "glass-strong text-ink hover:bg-white hover:-translate-y-0.5"
      } ${disabled ? "opacity-50 cursor-not-allowed hover:translate-y-0 hover:bg-current" : ""}`}
      style={
        primary
          ? { boxShadow: "0 18px 40px -16px rgba(138, 53, 86, 0.55)" }
          : undefined
      }
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${
          primary ? "bg-cream/15" : "bg-merlot/10 text-merlot"
        }`}
      >
        {icon}
      </div>
      <div
        className={`font-display text-[17px] leading-tight ${
          primary ? "text-cream" : "text-ink"
        }`}
      >
        {label}
      </div>
      <div
        className={`mt-1 text-[12px] font-mono uppercase tracking-[0.15em] ${
          primary ? "text-cream/65" : "text-ink-mute"
        }`}
      >
        {meta}
      </div>
    </button>
  );
}
