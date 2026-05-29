"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Flower } from "@/components/Flower";
import { LENSES } from "@/lib/inner-critic-lenses";
import type { InnerCriticPayload } from "../lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  payload: InnerCriticPayload;
  onShare: () => void;
  onEmail: () => void;
  onWriteAnother: () => void;
};

export function ResultStage({ payload, onShare, onEmail, onWriteAnother }: Props) {
  const { translations, answers, criticType, criticIntent } = payload;

  return (
    <section className="relative">
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
          <span className="tag">A translation for {answers.name}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute">
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </motion.div>

        {/* IFS identification — main brand hook */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative rounded-[28px] p-7 md:p-9 mb-12 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #FFEBF6 0%, #F6D7E8 45%, #E6D9FF 100%)",
            boxShadow: "0 28px 64px -32px rgba(138, 53, 86, 0.3)",
            border: "1px solid rgba(138, 53, 86, 0.1)",
          }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-merlot mb-3">
            That voice sounds like
          </div>
          <h2 className="font-display text-[clamp(30px,4.5vw,44px)] leading-[1.1] tracking-[-0.02em] text-ink mb-3">
            The <em className="italic font-light text-merlot">{criticType}</em>
          </h2>
          <p className="font-display italic text-[clamp(17px,2.1vw,21px)] leading-[1.45] text-ink/85 max-w-[44ch]">
            It is {criticIntent}.
          </p>
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="font-display text-[clamp(26px,3.8vw,38px)] leading-[1.1] tracking-[-0.02em] text-ink max-w-[20ch] mb-8"
        >
          Four kinder <em className="shimmer-italic font-light">translations</em>.
        </motion.h3>

        <ul className="space-y-5">
          {translations.map((text, i) => {
            const lens = LENSES[i];
            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.18, ease: EASE }}
                className="relative rounded-[28px] p-7 md:p-9 overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, #FFF8E9 0%, #FEF7DF 100%)",
                  boxShadow:
                    "0 28px 64px -32px rgba(138, 53, 86, 0.28), inset 0 1px 0 rgba(255,255,255,0.9)",
                  border: "1px solid rgba(138, 53, 86, 0.08)",
                }}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-merlot mb-3 flex items-center gap-3">
                  <span>{lens?.label || `Lens ${i + 1}`}</span>
                  <span className="text-merlot/40">·</span>
                  <span className="text-merlot/60 normal-case tracking-normal italic font-display text-[12px]">
                    {lens?.description}
                  </span>
                </div>
                <p className="font-display italic text-[clamp(18px,2.3vw,23px)] leading-[1.5] text-ink">
                  {text}
                </p>
              </motion.li>
            );
          })}
        </ul>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
          className="mt-12"
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
                    d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              label="Save as image"
              meta="Pick a translation"
              onClick={onShare}
            />
            <ActionCard
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
              label="Email them to me"
              meta="Optional"
              onClick={onEmail}
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
              Translate another voice
            </button>
            <Link
              href="/#cta"
              className="group inline-flex items-center gap-2 text-[14px] text-merlot font-medium"
            >
              Hear these in your own voice in HerDay
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
