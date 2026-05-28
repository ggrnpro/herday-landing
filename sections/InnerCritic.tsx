"use client";

import { useEffect, useRef, useState } from "react";
import { copy } from "@/messages/en";
import { Reveal } from "@/components/Reveal";
import { motion, AnimatePresence } from "motion/react";

const examples = [
  { critic: "You're behind.", herday: "You're learning to move at a pace that holds." },
  { critic: "Why can't you just be confident?", herday: "You're learning to trust what you already know." },
  { critic: "You should be over this by now.", herday: "You're learning that healing isn't linear." },
  { critic: "Everyone else has it figured out.", herday: "You're learning what figured out looks like for you." },
];

const AUTO_INTERVAL = 5500;

export function InnerCritic() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance unless user paused (hover/touch).
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setActive((a) => (a + 1) % examples.length);
    }, AUTO_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused]);

  // Swipe (mobile)
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    if (start == null) return;
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) > 40) {
      setActive((a) =>
        dx < 0
          ? (a + 1) % examples.length
          : (a - 1 + examples.length) % examples.length,
      );
    }
    touchStartX.current = null;
    setTimeout(() => setPaused(false), 4000);
  };

  const pickIndex = (i: number) => {
    setActive(i);
    setPaused(true);
    setTimeout(() => setPaused(false), 6000);
  };

  return (
    <section id="critic" className="section relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-50"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 30%, rgba(138,53,86,0.08), transparent 70%)",
        }}
      />

      <div className="container-narrow">
        <Reveal>
          <span className="eyebrow">{copy.innerCritic.eyebrow}</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display-2 mt-5">
            {copy.innerCritic.title.pre}
            <em className="italic font-light text-merlot">{copy.innerCritic.title.em}</em>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-7 text-[18px] text-ink-soft leading-[1.6] max-w-[60ch]">
            {copy.innerCritic.body}
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div
            className="mt-12 glass-strong rounded-3xl p-6 sm:p-9 md:p-10 select-none"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Header: dots + counter + swipe hint */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {examples.map((_, i) => (
                <button
                  key={i}
                  onClick={() => pickIndex(i)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    i === active ? "w-10 bg-merlot" : "w-2.5 bg-merlot/30 hover:bg-merlot/60"
                  }`}
                  aria-label={`Show example ${i + 1}`}
                />
              ))}
              <span className="ml-auto text-[11px] uppercase tracking-[0.18em] font-mono text-ink-mute flex items-center gap-2">
                <span className="hidden sm:inline">Tap or swipe</span>
                <span className="sm:hidden">Swipe</span>
                <span>· {active + 1} / {examples.length}</span>
              </span>
            </div>

            {/* Auto-advance progress bar */}
            <div className="h-[2px] bg-merlot/10 rounded-full overflow-hidden mb-7">
              <motion.div
                key={`${active}-${paused}`}
                initial={{ width: "0%" }}
                animate={{ width: paused ? "0%" : "100%" }}
                transition={{
                  duration: paused ? 0.3 : AUTO_INTERVAL / 1000,
                  ease: paused ? "easeOut" : "linear",
                }}
                className="h-full bg-merlot/50 rounded-full"
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="grid sm:grid-cols-2 gap-4 sm:gap-5"
              >
                <div className="rounded-2xl p-6 bg-ink/95 text-cream/90 min-h-[140px] flex flex-col justify-center">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-rose-200/70 font-mono mb-3">
                    The inner critic
                  </div>
                  <p className="font-display italic text-[20px] sm:text-[22px] leading-[1.3]">
                    &ldquo;{examples[active].critic}&rdquo;
                  </p>
                </div>
                <div
                  className="rounded-2xl p-6 min-h-[140px] flex flex-col justify-center"
                  style={{ background: "linear-gradient(140deg, #FFEBF6, #F6D7E8)" }}
                >
                  <div className="text-[10px] uppercase tracking-[0.22em] text-merlot font-mono mb-3">
                    HerDay translates
                  </div>
                  <p className="font-display italic text-[20px] sm:text-[22px] leading-[1.3] text-ink">
                    &ldquo;{examples[active].herday}&rdquo;
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-7 pt-5 border-t border-line text-[12px] sm:text-[13px] text-ink-mute leading-[1.55]">
              <span className="font-mono uppercase tracking-[0.18em] text-merlot mr-2">
                {copy.innerCritic.citation.label}:
              </span>
              {copy.innerCritic.citation.text}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
