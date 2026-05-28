"use client";

import { motion } from "motion/react";
import { Flower } from "./Flower";

type Variant = "intro" | "voice" | "letter" | "garden";

type Props = {
  variant?: Variant;
  className?: string;
};

export function PhoneMockup({ variant = "intro", className = "" }: Props) {
  return (
    <div className={`phone-frame ${className}`}>
      <div className="phone-notch" />
      <div className="phone-screen">
        {/* in-screen fog */}
        <div className="absolute inset-0">
          <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full opacity-70" style={{ background: "radial-gradient(circle, rgba(255,181,210,0.7) 0%, rgba(255,181,210,0) 70%)", filter: "blur(20px)" }} />
          <div className="absolute top-1/3 -right-12 w-64 h-64 rounded-full opacity-60" style={{ background: "radial-gradient(circle, rgba(230,217,255,0.7) 0%, rgba(230,217,255,0) 70%)", filter: "blur(20px)" }} />
          <div className="absolute -bottom-16 left-1/4 w-72 h-72 rounded-full opacity-70" style={{ background: "radial-gradient(circle, rgba(246,215,232,0.8) 0%, rgba(246,215,232,0) 70%)", filter: "blur(20px)" }} />
        </div>

        {/* floating flowers in screen */}
        <Flower size={42} variant="small" opacity={0.5} className="flower-spin absolute top-[12%] right-[10%]" />
        <Flower size={32} variant="petal" opacity={0.45} className="flower-spin-rev absolute bottom-[18%] left-[12%]" />

        {variant === "intro" && <IntroScreen />}
        {variant === "voice" && <VoiceScreen />}
        {variant === "letter" && <LetterScreen />}
        {variant === "garden" && <GardenScreen />}
      </div>
    </div>
  );
}

function IntroScreen() {
  return (
    <div className="relative h-full flex flex-col items-center justify-end px-7 pb-12 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-auto mt-12"
      >
        <p className="font-display text-[28px] leading-[1.1] tracking-tight text-merlot">
          A note before<br />we begin...
        </p>
        <p className="mt-5 text-[12px] leading-[1.5] text-ink-mute max-w-[200px] mx-auto">
          Answer honestly. What you say now becomes the voice of your future self.
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="w-full py-3.5 rounded-full bg-merlot text-cream text-[14px] font-medium shadow-lg"
      >
        I'm ready
      </motion.button>
    </div>
  );
}

function VoiceScreen() {
  return (
    <div className="relative h-full flex flex-col px-6 pt-14 pb-8">
      <div className="text-center mb-4">
        <p className="text-[10px] tracking-[0.18em] uppercase text-merlot font-medium">HerDay · morning</p>
        <p className="font-display text-[22px] leading-[1.15] text-merlot mt-3">
          What's on your<br />mind these days?
        </p>
        <p className="text-[11px] text-ink-mute mt-3 max-w-[200px] mx-auto">
          A few words are enough. This helps HerDay meet you where you are.
        </p>
      </div>

      <div className="mt-4 mx-auto w-full glass rounded-2xl p-4 text-left">
        <p className="font-display italic text-[14px] text-ink-soft leading-tight">
          "Trying to feel like myself again..."
        </p>
      </div>

      <div className="mt-auto flex flex-col items-center gap-4">
        <motion.div
          className="relative w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #8A3556, #B04E7A)" }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="absolute inset-0 rounded-full" style={{ boxShadow: "0 0 0 0 rgba(138,53,86,0.45)" }} />
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <rect x="9" y="3" width="6" height="14" rx="3" />
            <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <line x1="12" y1="19" x2="12" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
        <p className="text-[11px] text-ink-mute">Tap to speak · 0:12</p>
      </div>
    </div>
  );
}

function LetterScreen() {
  return (
    <div className="relative h-full flex flex-col px-6 pt-14 pb-8">
      <div className="text-center mb-4">
        <p className="text-[10px] tracking-[0.18em] uppercase text-merlot font-medium">a letter for you · friday</p>
        <p className="font-display text-[20px] leading-[1.18] text-merlot mt-3">
          From you,<br /><em>one year from now</em>
        </p>
      </div>

      <div className="mt-4 flex-1 glass-strong rounded-2xl p-5 overflow-hidden">
        <p className="font-display italic text-[14px] leading-[1.55] text-ink-soft">
          "Hi, Maddie. I know this week felt like waiting for nothing. But I'm writing from the other side of it. The job you didn't get, it cleared the path for the one you did. Keep showing up softly. I'm proud of how you held this week."
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-merlot" />
          <div className="w-1 h-1 rounded-full bg-merlot opacity-60" />
          <div className="w-1 h-1 rounded-full bg-merlot opacity-30" />
        </div>
      </div>

      <button className="mt-4 w-full py-3 rounded-full glass text-merlot text-[13px] font-medium">
        Play in your voice
      </button>
    </div>
  );
}

function GardenScreen() {
  return (
    <div className="relative h-full flex flex-col px-6 pt-14 pb-8">
      {/* "Preview" badge — this screen is a directional sketch, not the final UI. */}
      <div className="absolute top-12 right-4 z-20">
        <span
          className="font-mono text-[8px] uppercase tracking-[0.18em] px-2 py-1 rounded-full"
          style={{
            background: "rgba(26, 14, 21, 0.85)",
            color: "#FFEBF6",
            border: "1px solid rgba(255, 235, 246, 0.2)",
          }}
        >
          Preview
        </span>
      </div>

      <div className="text-center">
        <p className="text-[10px] tracking-[0.18em] uppercase text-merlot font-medium">your garden · day 47</p>
        <p className="font-display text-[20px] leading-[1.15] text-merlot mt-3">
          Something is<br /><em>blooming</em>
        </p>
      </div>

      <div className="relative flex-1 mt-6">
        {/* garden ground */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 rounded-2xl" style={{ background: "linear-gradient(180deg, rgba(221,241,232,0.4), rgba(221,241,232,0.8))" }} />

        <div className="absolute top-[8%] left-[14%]">
          <Flower size={42} variant="daisy" opacity={0.95} className="flower-spin" />
        </div>
        <div className="absolute top-[30%] right-[12%]">
          <Flower size={52} variant="petal" opacity={0.9} className="flower-spin-rev" />
        </div>
        <div className="absolute top-[58%] left-[34%]">
          <Flower size={48} variant="small" opacity={0.9} className="flower-spin" />
        </div>
        <div className="absolute bottom-[8%] left-[8%]">
          <Flower size={36} variant="daisy" opacity={0.8} />
        </div>
        <div className="absolute bottom-[12%] right-[18%]">
          <Flower size={40} variant="petal" opacity={0.85} />
        </div>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
        <div className="glass rounded-xl py-2">
          <p className="font-display text-[18px] text-merlot leading-none">47</p>
          <p className="text-[9px] uppercase tracking-wider text-ink-mute mt-1">days</p>
        </div>
        <div className="glass rounded-xl py-2">
          <p className="font-display text-[18px] text-merlot leading-none">12</p>
          <p className="text-[9px] uppercase tracking-wider text-ink-mute mt-1">letters</p>
        </div>
        <div className="glass rounded-xl py-2">
          <p className="font-display text-[18px] text-merlot leading-none">8</p>
          <p className="text-[9px] uppercase tracking-wider text-ink-mute mt-1">blooms</p>
        </div>
      </div>
    </div>
  );
}
