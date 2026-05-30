"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type Props = {
  words: readonly string[];
  intervalMs?: number;
  className?: string;
};

/**
 * Rotates through `words` in place. Each word slides up + fades.
 * Pauses on prefers-reduced-motion (locks to first word).
 *
 * Container height locked to 1em so descenders don't get clipped and the
 * surrounding text doesn't jump. Width follows the current word naturally
 * (no sizer) — slight horizontal reflow per swap is intentional + organic.
 *
 * Adapted from 21st.dev "Hero Section - Nexus" RotatingText, simplified.
 */
export function RotatingWord({ words, intervalMs = 2400, className = "" }: Props) {
  const [idx, setIdx] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % words.length), intervalMs);
    return () => clearInterval(t);
  }, [reduced, words.length, intervalMs]);

  const word = words[idx];

  return (
    <span
      className={`inline-block overflow-hidden relative whitespace-nowrap ${className}`}
      style={{ height: "1em", lineHeight: 1, verticalAlign: "bottom" }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={word}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
          className="inline-block whitespace-nowrap"
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
