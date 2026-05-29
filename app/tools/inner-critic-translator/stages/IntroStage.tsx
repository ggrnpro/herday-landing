"use client";

import { motion } from "motion/react";
import { Flower } from "@/components/Flower";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = { onBegin: () => void };

export function IntroStage({ onBegin }: Props) {
  return (
    <section className="relative">
      <Flower
        size={110}
        variant="daisy"
        opacity={0.4}
        className="flower-spin absolute top-[4%] right-[6%] hidden md:block"
      />
      <Flower
        size={70}
        variant="petal"
        opacity={0.45}
        className="flower-spin-rev absolute top-[36%] left-[5%] hidden md:block"
      />

      <div className="container-narrow relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 select-none font-display italic text-merlot/[0.045]"
          style={{ fontSize: "20vw", lineHeight: 0.9, letterSpacing: -2 }}
        >
          Critic
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative pt-8"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-merlot mb-5">
            A free tool · Inner critic translator
          </div>
          <h1 className="font-display text-[clamp(40px,7vw,80px)] leading-[0.98] tracking-[-0.02em] text-ink max-w-[14ch]">
            Type what it said.
            <br />
            We&rsquo;ll <em className="shimmer-italic font-light">translate it.</em>
          </h1>
          <p className="mt-7 max-w-[54ch] text-[17px] leading-[1.6] text-ink-soft">
            That voice in your head that just told you you&rsquo;re not enough?
            Paste the sentence in. We read it carefully, name which kind of
            inner critic is talking, and give it back to you in four kinder
            voices &mdash; one from research, one from a friend, one from a
            part of you, and one from you, three years from now.
          </p>
        </motion.div>

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
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-merlot mb-3">
            What the critic said
          </div>
          <p className="font-display italic text-[clamp(18px,2.4vw,22px)] leading-[1.5] text-ink/85">
            &ldquo;You&rsquo;re going to embarrass yourself in this meeting. Everyone will see
            you don&rsquo;t actually know what you&rsquo;re doing.&rdquo;
          </p>

          <div className="mt-7 mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-merlot">
            One of four translations
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-merlot/70 mb-1">
            Meet the part · IFS
          </div>
          <p className="font-display italic text-[clamp(17px,2vw,21px)] leading-[1.45] text-ink-soft">
            This part sounds like the Underminer. Its job is to keep you small
            so failure cannot hurt you. You can thank it for trying, gently,
            and tell it you have this one. It can rest.
          </p>

          <div
            className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
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
            Translate the voice
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
            Two free translations a day · no signup · ~6 seconds
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          className="mt-20 grid md:grid-cols-2 gap-3"
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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
          className="mt-10 rounded-2xl p-5 border border-line bg-paper/40"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-merlot mb-2">
            A note
          </div>
          <p className="text-[14px] text-ink-soft leading-[1.55]">
            This is a tool, not therapy. If what you&rsquo;re carrying feels
            heavier than the day-to-day critic, please talk to a human. In
            the US: <strong className="text-ink">988</strong> (call or text).
            UK: <strong className="text-ink">116 123</strong>. Anywhere:{" "}
            <a
              href="https://findahelpline.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-merlot underline underline-offset-2"
            >
              findahelpline.com
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}

const SCIENCE = [
  {
    eyebrow: "Don't silence — talk to it",
    text: "Suppression makes the inner critic louder. Engaging with it dissolves the shame spiral.",
    cite: "Harvard Business Review · 2025",
  },
  {
    eyebrow: "Why four voices",
    text: "Distanced self-talk, self-compassion, IFS, and future-self continuity each work on a different muscle.",
    cite: "Kross · Neff · Schwartz · Hershfield",
  },
];
