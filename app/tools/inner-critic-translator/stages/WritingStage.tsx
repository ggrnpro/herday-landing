"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

const PHASES = [
  "Reading what you wrote, slowly.",
  "Naming the voice.",
  "Looking for who it is trying to protect.",
  "Drafting four kinder translations.",
  "Almost ready.",
];

const PHASE_MS = 2200;
const TOTAL_MS = PHASE_MS * PHASES.length;

type Props = { onComplete: () => void };

export function WritingStage({ onComplete }: Props) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => Math.min(p + 1, PHASES.length - 1));
    }, PHASE_MS);
    const timer = setTimeout(onComplete, TOTAL_MS);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center">
      <div className="container-narrow flex flex-col items-center text-center">
        <div className="relative h-56 w-56 flex items-center justify-center">
          <motion.div
            aria-hidden
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,181,210,0.6) 0%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
          <motion.div
            aria-hidden
            animate={{ scale: [0.96, 1.06, 0.96] }}
            transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity }}
            className="absolute inset-8 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(176,78,122,0.45) 0%, rgba(176,78,122,0.05) 70%)",
              filter: "blur(8px)",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
            className="relative w-24 h-24 rounded-full"
            style={{
              background: "linear-gradient(135deg, #8A3556, #B04E7A)",
              boxShadow: "0 24px 48px -16px rgba(138, 53, 86, 0.6)",
            }}
          />
        </div>

        <div className="mt-12 h-16 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="font-display italic text-[clamp(20px,2.6vw,28px)] text-ink-soft"
            >
              {PHASES[phase]}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-merlot"
        >
          Translating the voice
        </motion.div>
      </div>
    </section>
  );
}
