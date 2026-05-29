"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { InnerCriticAnswers } from "@/lib/inner-critic-prompt";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = { onSubmit: (answers: InnerCriticAnswers) => void };

type QuestionKey = "name" | "critic";
const ORDER: QuestionKey[] = ["name", "critic"];

export function ComposeStage({ onSubmit }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [critic, setCritic] = useState("");
  const questionRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("herday_name");
      if (saved) setName(saved);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (step === 0) return;
    const t = window.setTimeout(() => {
      const el = questionRefs.current[step];
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }, 160);
    return () => window.clearTimeout(t);
  }, [step]);

  const currentKey = ORDER[step];
  const canContinue = (() => {
    if (currentKey === "name") return name.trim().length >= 1;
    if (currentKey === "critic") return critic.trim().length >= 5;
    return false;
  })();

  function next() {
    if (!canContinue) return;
    if (step < ORDER.length - 1) {
      setStep((s) => s + 1);
    } else {
      onSubmit({ name: name.trim(), critic: critic.trim() });
    }
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  return (
    <section className="relative">
      <div className="container-narrow">
        <ProgressDots total={ORDER.length} current={step} />

        <div className="mt-12 space-y-12">
          {ORDER.slice(0, step + 1).map((key, i) => (
            <div
              key={key}
              ref={(el) => {
                questionRefs.current[i] = el;
              }}
              style={{ scrollMarginTop: 96 }}
            >
              <QuestionBlock
                questionKey={key}
                active={i === step}
                past={i < step}
                name={name}
                critic={critic}
                onName={setName}
                onCritic={setCritic}
                onSubmitEnter={next}
              />
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-16 flex items-center justify-between gap-4"
        >
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="text-[14px] text-ink-mute hover:text-merlot transition disabled:opacity-30 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 12H5M11 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>

          <button
            type="button"
            onClick={next}
            disabled={!canContinue}
            className="btn-merlot disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {step === ORDER.length - 1 ? "Translate the voice" : "Continue"}
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
        </motion.div>
      </div>
    </section>
  );
}

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{
            width: i === current ? 32 : 8,
            opacity: i <= current ? 1 : 0.3,
          }}
          transition={{ duration: 0.4, ease: EASE }}
          className="h-1 rounded-full bg-merlot"
        />
      ))}
    </div>
  );
}

type QBProps = {
  questionKey: QuestionKey;
  active: boolean;
  past: boolean;
  name: string;
  critic: string;
  onName: (v: string) => void;
  onCritic: (v: string) => void;
  onSubmitEnter: () => void;
};

function QuestionBlock(props: QBProps) {
  const { questionKey, active, past } = props;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={{ opacity: past ? 0.5 : 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-merlot mb-3">
        {questionKey === "name" && "First"}
        {questionKey === "critic" && "Now"}
      </div>

      {questionKey === "name" && (
        <NameField
          value={props.name}
          onChange={props.onName}
          autoFocus={active}
          onEnter={props.onSubmitEnter}
        />
      )}
      {questionKey === "critic" && (
        <CriticField
          value={props.critic}
          onChange={props.onCritic}
          name={props.name}
        />
      )}
    </motion.div>
  );
}

function QuestionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[clamp(28px,4.2vw,44px)] leading-[1.1] tracking-[-0.02em] text-ink max-w-[26ch]">
      {children}
    </h2>
  );
}

function NameField({
  value,
  onChange,
  autoFocus,
  onEnter,
}: {
  value: string;
  onChange: (v: string) => void;
  autoFocus: boolean;
  onEnter: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);
  return (
    <>
      <QuestionLabel>What should I call you?</QuestionLabel>
      <p className="mt-3 text-[15px] text-ink-mute max-w-[44ch]">
        Used in the lens that addresses you directly.
      </p>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onEnter();
        }}
        placeholder="Type your name"
        autoComplete="given-name"
        className="mt-8 w-full max-w-[24ch] bg-transparent border-b-2 border-merlot/30 focus:border-merlot focus:outline-none font-display italic text-merlot text-[clamp(28px,4vw,40px)] py-3 transition-colors placeholder:text-ink-mute/30 placeholder:not-italic placeholder:font-display"
      />
    </>
  );
}

function CriticField({
  value,
  onChange,
  name,
}: {
  value: string;
  onChange: (v: string) => void;
  name: string;
}) {
  return (
    <>
      <QuestionLabel>
        What did the voice just say to you, {name || "friend"}?
      </QuestionLabel>
      <p className="mt-3 text-[15px] text-ink-mute max-w-[54ch]">
        Verbatim is best &mdash; the exact words the voice used. Even if they
        feel mean to write down. We translate what you give us.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 600))}
        placeholder="You're going to embarrass yourself in this meeting. Everyone will see you don't actually know what you're doing."
        rows={6}
        className="mt-8 w-full bg-paper/70 border border-line rounded-2xl px-5 py-4 font-display italic text-[19px] text-ink leading-[1.5] focus:outline-none focus:border-merlot transition resize-none placeholder:text-ink-mute/50"
      />
      <div className="mt-2 text-right font-mono text-[11px] text-ink-mute">
        {value.length} / 600
      </div>
    </>
  );
}
