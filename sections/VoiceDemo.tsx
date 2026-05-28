"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

/**
 * Signature moment. Drenched merlot section, full-bleed.
 * Pretend audio player with hand-tuned bar visualizer.
 * Breaks the cream/serif editorial rhythm in the middle of the page.
 */
export function VoiceDemo() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  const startedAtRef = useRef<number>(0);
  const baseProgressRef = useRef<number>(0);
  const DURATION = 32; // seconds

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    startedAtRef.current = performance.now();
    const tick = () => {
      const elapsed = (performance.now() - startedAtRef.current) / 1000;
      const next = Math.min(1, baseProgressRef.current + elapsed / DURATION);
      setProgress(next);
      if (next >= 1) {
        setPlaying(false);
        baseProgressRef.current = 0;
        setProgress(0);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      baseProgressRef.current = progress;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const elapsed = Math.floor(progress * DURATION);
  const mm = Math.floor(elapsed / 60).toString();
  const ss = (elapsed % 60).toString().padStart(2, "0");

  // 64 bars hand-tuned heights, simulates real waveform of warm speech
  const heights = [
    18, 28, 42, 36, 22, 32, 48, 56, 44, 30, 24, 38, 52, 62, 50, 36,
    28, 44, 58, 70, 64, 52, 40, 30, 22, 32, 46, 60, 72, 66, 54, 42,
    34, 48, 62, 74, 68, 56, 44, 32, 26, 38, 50, 64, 70, 58, 46, 34,
    28, 40, 52, 66, 60, 48, 36, 26, 20, 30, 44, 56, 50, 38, 28, 20,
  ];

  return (
    <section className="relative overflow-hidden" id="hear">
      <div
        className="relative"
        style={{
          background:
            "radial-gradient(120% 80% at 70% 20%, #B04E7A 0%, #8A3556 45%, #6B1923 100%)",
        }}
      >
        {/* Subtle inner highlights */}
        <div
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            background:
              "radial-gradient(40% 60% at 15% 80%, rgba(255,235,246,0.18), transparent 70%), radial-gradient(50% 50% at 90% 90%, rgba(230,217,255,0.16), transparent 70%)",
          }}
        />

        <div className="relative section">
          <div className="container-wide grid lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-20 items-center">
            <div className="text-cream">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-pink mb-6">
                What a morning sounds like
              </p>
              <h2 className="font-display text-[clamp(40px,5.5vw,68px)] leading-[1.02] tracking-tight font-light text-cream max-w-[18ch]">
                Press play.
                <br />
                <span className="italic text-pink-soft font-light">
                  This is what your own voice does
                </span>{" "}
                <span className="italic text-pink-soft font-light">
                  when it's on your side.
                </span>
              </h2>
              <p className="mt-7 text-[18px] leading-[1.6] text-cream/80 max-w-[52ch]">
                A 32-second sample from a beta listener, cloned from her own voice. We softened
                the pace by 12%, warmed the timbre, and asked it to read the letter HerDay wrote
                for her that Tuesday morning.
              </p>
              <p className="mt-4 text-[13px] uppercase tracking-[0.18em] text-pink/80 font-mono">
                In the app, the voice you hear is yours.
              </p>
            </div>

            <div className="relative">
              <div
                className="absolute -inset-8 rounded-[40px] opacity-60"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,235,246,0.3) 0%, transparent 70%)",
                  filter: "blur(30px)",
                }}
              />

              <div
                className="relative rounded-[32px] p-8 md:p-10"
                style={{
                  background: "rgba(255, 235, 246, 0.06)",
                  border: "1px solid rgba(255, 235, 246, 0.18)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.12), 0 30px 60px -20px rgba(0,0,0,0.35)",
                }}
              >
                <div className="flex items-baseline justify-between mb-7">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-pink-soft/70">
                      Morning letter · sample
                    </p>
                    <p className="font-display text-[22px] text-cream mt-1 leading-tight">
                      For Maddie, Tuesday
                    </p>
                  </div>
                  <span className="font-mono text-[12px] text-pink-soft/70">
                    {mm}:{ss} / 0:32
                  </span>
                </div>

                {/* Waveform */}
                <div className="flex items-center gap-[3px] h-20">
                  {heights.map((h, i) => {
                    const filled = i / heights.length < progress;
                    return (
                      <motion.span
                        key={i}
                        className="flex-1 rounded-full block"
                        style={{
                          background: filled ? "#FFEBF6" : "rgba(255, 235, 246, 0.22)",
                          height: `${h}%`,
                        }}
                        animate={
                          playing && filled
                            ? { scaleY: [1, 1.15, 1] }
                            : { scaleY: 1 }
                        }
                        transition={{
                          duration: 0.7,
                          repeat: playing && filled ? Infinity : 0,
                          delay: (i % 8) * 0.05,
                          ease: "easeInOut",
                        }}
                      />
                    );
                  })}
                </div>

                <div className="mt-7 flex items-center gap-4">
                  <button
                    onClick={() => setPlaying((p) => !p)}
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition"
                    style={{
                      background: "#FFEBF6",
                      color: "#8A3556",
                      boxShadow: "0 10px 30px -10px rgba(255,235,246,0.5)",
                    }}
                    aria-label={playing ? "Pause" : "Play sample"}
                  >
                    {playing ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="5" width="4" height="14" rx="1.5" />
                        <rect x="14" y="5" width="4" height="14" rx="1.5" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 4.5v15l13-7.5L7 4.5z" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1">
                    <p className="font-display italic text-[16px] text-cream/90 leading-[1.45]">
                      &ldquo;Hi, Maddie. I know yesterday was loud in your head. I want you to
                      know that the noise was data, not truth&hellip;&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
