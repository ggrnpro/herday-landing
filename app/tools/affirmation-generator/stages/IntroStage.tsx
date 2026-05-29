"use client";

import { motion } from "motion/react";
import { Flower } from "@/components/Flower";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = { onBegin: () => void };

export function IntroStage({ onBegin }: Props) {
  return (
    <section className="relative">
      <Flower
        size={120}
        variant="petal"
        opacity={0.45}
        className="flower-spin absolute top-[4%] right-[6%] hidden md:block"
      />
      <Flower
        size={80}
        variant="daisy"
        opacity={0.4}
        className="flower-spin-rev absolute top-[36%] left-[5%] hidden md:block"
      />

      <div className="container-narrow relative">
        {/* ghost wordmark */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 select-none font-display italic text-merlot/[0.045]"
          style={{ fontSize: "22vw", lineHeight: 0.9, letterSpacing: -2 }}
        >
          Today
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative pt-8"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-merlot mb-5">
            A free tool · Affirmations, written for your morning
          </div>
          <h1 className="font-display text-[clamp(40px,7vw,80px)] leading-[0.98] tracking-[-0.02em] text-ink max-w-[16ch]">
            Five small <em className="shimmer-italic font-light">true things</em>
            <br />
            to carry today.
          </h1>
          <p className="mt-7 max-w-[52ch] text-[17px] leading-[1.6] text-ink-soft">
            Tell us what you are sitting with this morning. We write five
            affirmations — quiet, specific, never cringe — using five
            different lenses from the research on what actually helps. No
            &ldquo;I am a millionaire.&rdquo; No manifestation. No emoji.
          </p>
        </motion.div>

        {/* preview card */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="mt-12 relative rounded-[32px] p-8 md:p-12 overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #FFF8E9 0%, #FEF7DF 100%)",
            boxShadow:
              "0 50px 100px -40px rgba(138, 53, 86, 0.3), inset 0 1px 0 rgba(255,255,255,0.9)",
            border: "1px solid rgba(138, 53, 86, 0.08)",
          }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-merlot mb-5">
            A preview, for someone called Anna
          </div>
          <ul className="space-y-5">
            {PREVIEW.map((p, i) => (
              <li key={i}>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-merlot/70 mb-1.5">
                  {p.lens}
                </div>
                <p className="font-display italic text-[clamp(17px,2vw,21px)] leading-[1.45] text-ink-soft">
                  {p.text}
                </p>
              </li>
            ))}
          </ul>

          {/* fade out at bottom */}
          <div
            className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent, #FEF7DF 80%)",
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="mt-12 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
        >
          <button onClick={onBegin} className="btn-merlot text-[16px] px-7 py-4">
            Begin
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
          <span className="text-[13px] text-ink-mute">
            Two free sets a day · no signup · ~6 seconds
          </span>
        </motion.div>

        {/* science strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          className="mt-20 grid md:grid-cols-3 gap-3"
        >
          {SCIENCE.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 glass-strong"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-merlot mb-2">
                {s.eyebrow}
              </div>
              <p className="font-display italic text-[16px] text-ink leading-[1.4]">
                {s.text}
              </p>
              <div className="mt-2 text-[12px] text-ink-mute">{s.cite}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const PREVIEW = [
  {
    lens: "Balanced",
    text:
      "Your voice feels shaky and too loud in your own ears right now, and you still have a quiet, necessary right to sit at that table.",
  },
  {
    lens: "In progress",
    text:
      "You are practicing the slow art of leaving your words in the room without following them home to dissect them.",
  },
  {
    lens: "From outside",
    text:
      "Anna, today you do not have to perform perfect confidence — you only need to let your breathing be steadier than your doubts.",
  },
];

const SCIENCE = [
  {
    eyebrow: "Why balanced",
    text: "Repeating pure positives like “I am lovable” backfires for low self-esteem.",
    cite: "Wood, Perunovic, Lee · 2009",
  },
  {
    eyebrow: "Why your name",
    text:
      "Second-person self-talk (“Anna, you …”) beats first-person for emotion regulation.",
    cite: "Kross · Univ. of Michigan",
  },
  {
    eyebrow: "Why common ground",
    text:
      "Naming shared struggle softens self-blame more than personal pep talk.",
    cite: "Neff · self-compassion",
  },
];
