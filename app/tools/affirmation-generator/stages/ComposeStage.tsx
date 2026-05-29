"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  NEEDS,
  TONES,
  type AffirmationAnswers,
  type NeedKey,
  type ToneKey,
} from "@/lib/affirmation-prompt";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = { onSubmit: (answers: AffirmationAnswers) => void };

type QuestionKey = "name" | "situation" | "needs" | "tone";
const ORDER: QuestionKey[] = ["name", "situation", "needs", "tone"];

export function ComposeStage({ onSubmit }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [situation, setSituation] = useState("");
  const [needs, setNeeds] = useState<NeedKey[]>([]);
  const [tone, setTone] = useState<ToneKey>("gentle");
  const questionRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Pre-fill name from a previous tool run if available.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("herday_name");
      if (saved) setName(saved);
    } catch {
      // ignore
    }
  }, []);

  // After step changes, smoothly bring the newly-revealed question into
  // view. We wait ~140ms so Framer Motion has actually mounted the new
  // block (otherwise getBoundingClientRect points at the old layout).
  // Offset of 96px clears the sticky nav and gives the eyebrow room.
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
    if (currentKey === "situation") return true; // skippable
    if (currentKey === "needs") return needs.length >= 1;
    if (currentKey === "tone") return true; // default 'gentle' already set
    return false;
  })();

  function next() {
    if (!canContinue) return;
    if (step < ORDER.length - 1) {
      setStep((s) => s + 1);
      // Scroll is handled by the useEffect above so we don't fire it
      // here — at this point the new question hasn't mounted yet.
    } else {
      onSubmit({
        name: name.trim(),
        situation: situation.trim(),
        needs,
        tone,
      });
    }
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  function toggleNeed(key: NeedKey) {
    setNeeds((prev) =>
      prev.includes(key)
        ? prev.filter((x) => x !== key)
        : prev.length < 3
          ? [...prev, key]
          : prev,
    );
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
                situation={situation}
                needs={needs}
                tone={tone}
                onName={setName}
                onSituation={setSituation}
                onToggleNeed={toggleNeed}
                onTone={setTone}
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
            {step === ORDER.length - 1 ? "Write the affirmations" : "Continue"}
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
  situation: string;
  needs: NeedKey[];
  tone: ToneKey;
  onName: (v: string) => void;
  onSituation: (v: string) => void;
  onToggleNeed: (v: NeedKey) => void;
  onTone: (v: ToneKey) => void;
  onSubmitEnter: () => void;
};

function QuestionBlock(props: QBProps) {
  const { questionKey, active, past } = props;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={{
        opacity: past ? 0.5 : 1,
        y: 0,
        filter: "blur(0px)",
      }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-merlot mb-3">
        {questionKey === "name" && "First"}
        {questionKey === "situation" && "Now"}
        {questionKey === "needs" && "Then"}
        {questionKey === "tone" && "Finally"}
      </div>

      {questionKey === "name" && (
        <NameField
          value={props.name}
          onChange={props.onName}
          autoFocus={active}
          onEnter={props.onSubmitEnter}
        />
      )}
      {questionKey === "situation" && (
        <SituationField
          value={props.situation}
          onChange={props.onSituation}
          name={props.name}
        />
      )}
      {questionKey === "needs" && (
        <NeedsField values={props.needs} onToggle={props.onToggleNeed} />
      )}
      {questionKey === "tone" && (
        <ToneField value={props.tone} onChange={props.onTone} />
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
        Used once, in the lens that addresses you directly.
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

function SituationField({
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
      <QuestionLabel>What are you sitting with today, {name || "friend"}?</QuestionLabel>
      <p className="mt-3 text-[15px] text-ink-mute max-w-[50ch]">
        One or two sentences. Specific beats abstract. Optional — you can skip.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 280))}
        placeholder="An interview that scares me. A body I don't recognize. A friend I haven't called back. Anything."
        rows={4}
        className="mt-8 w-full bg-paper/70 border border-line rounded-2xl px-5 py-4 font-display italic text-[19px] text-ink leading-[1.5] focus:outline-none focus:border-merlot transition resize-none placeholder:text-ink-mute/50"
      />
      <div className="mt-2 text-right font-mono text-[11px] text-ink-mute">
        {value.length} / 280
      </div>
    </>
  );
}

function NeedsField({
  values,
  onToggle,
}: {
  values: NeedKey[];
  onToggle: (k: NeedKey) => void;
}) {
  return (
    <>
      <QuestionLabel>What do you need today?</QuestionLabel>
      <p className="mt-3 text-[15px] text-ink-mute max-w-[50ch]">
        Pick up to three. The affirmations will lean toward these.
      </p>
      <div className="mt-8 flex flex-wrap gap-2.5">
        {NEEDS.map((n) => {
          const selected = values.includes(n.key);
          return (
            <button
              key={n.key}
              type="button"
              onClick={() => onToggle(n.key)}
              className={`px-5 py-3 rounded-full font-medium text-[15px] transition-all ${
                selected
                  ? "bg-merlot text-cream shadow-[0_12px_24px_-12px_rgba(138,53,86,0.5)]"
                  : "glass-strong text-ink hover:bg-white"
              }`}
            >
              {selected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center mr-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12l5 5L20 7"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.span>
              )}
              {n.label}
            </button>
          );
        })}
      </div>
      <div className="mt-3 text-[13px] text-ink-mute">
        {values.length} selected {values.length >= 3 && "(max)"}
      </div>
    </>
  );
}

function ToneField({
  value,
  onChange,
}: {
  value: ToneKey;
  onChange: (v: ToneKey) => void;
}) {
  return (
    <>
      <QuestionLabel>
        And the tone — <em className="italic font-light text-merlot">how should she speak?</em>
      </QuestionLabel>
      <p className="mt-3 text-[15px] text-ink-mute max-w-[50ch]">
        Same content, different register.
      </p>
      <div className="mt-8 flex flex-wrap gap-2.5">
        {TONES.map((t) => {
          const selected = value === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={`px-5 py-3 rounded-full font-medium text-[15px] transition-all ${
                selected
                  ? "bg-merlot text-cream shadow-[0_12px_24px_-12px_rgba(138,53,86,0.5)]"
                  : "glass-strong text-ink hover:bg-white"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[12px] text-ink-mute italic">
        {value === "gentle" && "Soft, warm. Default for most mornings."}
        {value === "plainspoken" && "Direct without coldness. No frills."}
        {value === "sharp" && "Pointed, honest. For the mornings you need it."}
      </p>
    </>
  );
}
