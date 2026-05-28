"use client";

import { motion } from "motion/react";
import { Flower } from "@/components/Flower";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = { onBegin: () => void };

const PROOF_POINTS = [
  {
    label: "Self-affirmation theory",
    body: "Steele, Stanford 1988",
  },
  {
    label: "Future-self continuity",
    body: "Hershfield, UCLA 2011",
  },
  {
    label: "Self-distancing",
    body: "Kross, Michigan 2014",
  },
];

export function IntroStage({ onBegin }: Props) {
  return (
    <section className="relative overflow-hidden">
      {/* ghost wordmark behind */}
      <div
        aria-hidden
        className="absolute top-[35%] -left-[5%] font-display font-black leading-[0.8] tracking-[-0.04em] pointer-events-none select-none"
        style={{
          fontSize: "clamp(180px, 22vw, 360px)",
          color: "rgba(138, 53, 86, 0.045)",
        }}
      >
        Letter
      </div>

      <Flower
        size={110}
        variant="daisy"
        opacity={0.45}
        className="flower-spin absolute top-[10%] right-[6%] hidden md:block"
      />
      <Flower
        size={70}
        variant="petal"
        opacity={0.5}
        className="flower-spin-rev absolute bottom-[6%] left-[4%] hidden md:block"
      />

      <div className="container-narrow relative">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="tag">Free tool · 60 seconds</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.1, ease: EASE }}
          className="display-1 mt-7 max-w-[16ch]"
        >
          A short letter from{" "}
          <em className="italic font-light shimmer-italic">your future self.</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          className="mt-8 text-[20px] leading-[1.55] text-ink-soft max-w-[54ch]"
        >
          Tell us what you are sitting with right now. We will draft a short letter from
          yourself, written from a year or two ahead. You can read it. You can listen to it.
          You can seal it and send it back to yourself on a date you choose.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button onClick={onBegin} className="btn-merlot text-[16px]">
            Begin writing
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
          <a href="#how-it-works" className="link text-[14px]">
            How it works
          </a>
        </motion.div>

        {/* preview letter — partial, intentionally cut off */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
          className="mt-20 relative"
        >
          <div className="absolute -inset-8 -z-10 rounded-[40px] opacity-60" style={{
            background: "radial-gradient(ellipse, rgba(255,181,210,0.5) 0%, transparent 70%)",
            filter: "blur(40px)",
          }} />
          <div
            className="relative glass-strong rounded-[32px] p-10 md:p-14 overflow-hidden"
            style={{
              boxShadow:
                "0 40px 80px -30px rgba(138, 53, 86, 0.25), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            <div className="absolute top-6 right-6 font-mono text-[10px] uppercase tracking-[0.2em] text-merlot/70">
              Preview
            </div>

            <p className="font-display italic text-[22px] md:text-[26px] leading-[1.45] text-ink max-w-[52ch]">
              Dear you,
            </p>
            <p className="font-display italic text-[20px] md:text-[23px] leading-[1.5] text-ink-soft mt-6 max-w-[58ch]">
              I am writing this on a quiet Tuesday morning. The light is doing that thing on
              the kitchen wall. You know the one. I wanted to send something back before I
              forgot how it felt to be where you are right now.
            </p>

            {/* fade-out gradient at bottom to imply more */}
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, var(--color-paper) 90%)",
              }}
            />
          </div>
        </motion.div>

        {/* science strip */}
        <motion.div
          id="how-it-works"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
          className="mt-24 scroll-mt-24"
        >
          <div className="eyebrow mb-5">Why it works</div>
          <p className="font-display text-[clamp(24px,3.2vw,34px)] leading-[1.2] text-ink max-w-[40ch] font-normal">
            Three decades of research on{" "}
            <em className="italic text-merlot font-light">how the brain hears</em>{" "}
            future-self language, packed into one short letter.
          </p>

          <div className="mt-10 grid sm:grid-cols-3 gap-3">
            {PROOF_POINTS.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.85 + i * 0.08, ease: EASE }}
                className="glass rounded-2xl p-5"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-merlot mb-2">
                  Study {String(i + 1).padStart(2, "0")}
                </div>
                <div className="font-display text-[17px] text-ink leading-tight">
                  {p.label}
                </div>
                <div className="mt-1 text-[13px] text-ink-mute">{p.body}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
