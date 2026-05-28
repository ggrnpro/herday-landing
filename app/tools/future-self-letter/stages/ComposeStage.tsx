"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

export type ComposeAnswers = {
  name: string;
  age: number;
  horizonMonths: number;
  struggle: string;
  values: string[];
};

type Props = { onSubmit: (answers: ComposeAnswers) => void };

const HORIZONS = [
  { label: "3 months", value: 3 },
  { label: "6 months", value: 6 },
  { label: "1 year", value: 12 },
  { label: "3 years", value: 36 },
  { label: "5 years", value: 60 },
];

const VALUES = [
  { key: "career", label: "Career" },
  { key: "family", label: "Family" },
  { key: "health", label: "Health" },
  { key: "love", label: "Love" },
  { key: "purpose", label: "Purpose" },
  { key: "peace", label: "Peace" },
];

type QuestionKey = "name" | "age" | "horizon" | "struggle" | "values";
const ORDER: QuestionKey[] = ["name", "age", "horizon", "struggle", "values"];

export function ComposeStage({ onSubmit }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [horizonMonths, setHorizonMonths] = useState<number | null>(null);
  const [struggle, setStruggle] = useState("");
  const [values, setValues] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentKey = ORDER[step];
  const canContinue = (() => {
    if (currentKey === "name") return name.trim().length >= 1;
    if (currentKey === "age") {
      const n = parseInt(age, 10);
      return n >= 13 && n <= 99;
    }
    if (currentKey === "horizon") return horizonMonths !== null;
    if (currentKey === "struggle") return true; // skippable
    if (currentKey === "values") return values.length >= 1;
    return false;
  })();

  function next() {
    if (!canContinue) return;
    if (step < ORDER.length - 1) {
      setStep((s) => s + 1);
      // smooth scroll the new question into view
      requestAnimationFrame(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      });
    } else {
      onSubmit({
        name: name.trim(),
        age: parseInt(age, 10),
        horizonMonths: horizonMonths ?? 12,
        struggle: struggle.trim(),
        values,
      });
    }
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  function toggleValue(v: string) {
    setValues((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : prev.length < 3 ? [...prev, v] : prev,
    );
  }

  return (
    <section className="relative">
      <div className="container-narrow">
        <ProgressDots total={ORDER.length} current={step} />

        <div className="mt-12 space-y-12">
          {ORDER.slice(0, step + 1).map((key, i) => (
            <QuestionBlock
              key={key}
              questionKey={key}
              active={i === step}
              past={i < step}
              name={name}
              age={age}
              horizonMonths={horizonMonths}
              struggle={struggle}
              values={values}
              onName={setName}
              onAge={setAge}
              onHorizon={setHorizonMonths}
              onStruggle={setStruggle}
              onToggleValue={toggleValue}
              onSubmitEnter={next}
            />
          ))}
        </div>

        <div ref={scrollRef} />

        {/* sticky-ish action bar */}
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
            {step === ORDER.length - 1 ? "Write the letter" : "Continue"}
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
  age: string;
  horizonMonths: number | null;
  struggle: string;
  values: string[];
  onName: (v: string) => void;
  onAge: (v: string) => void;
  onHorizon: (v: number) => void;
  onStruggle: (v: string) => void;
  onToggleValue: (v: string) => void;
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
        {questionKey === "age" && "Then"}
        {questionKey === "horizon" && "And"}
        {questionKey === "struggle" && "Now"}
        {questionKey === "values" && "Finally"}
      </div>

      {questionKey === "name" && (
        <NameField
          value={props.name}
          onChange={props.onName}
          autoFocus={active}
          onEnter={props.onSubmitEnter}
        />
      )}
      {questionKey === "age" && (
        <AgeField
          value={props.age}
          onChange={props.onAge}
          name={props.name}
          autoFocus={active}
          onEnter={props.onSubmitEnter}
        />
      )}
      {questionKey === "horizon" && (
        <HorizonField
          value={props.horizonMonths}
          onChange={props.onHorizon}
        />
      )}
      {questionKey === "struggle" && (
        <StruggleField
          value={props.struggle}
          onChange={props.onStruggle}
          name={props.name}
        />
      )}
      {questionKey === "values" && (
        <ValuesField
          values={props.values}
          onToggle={props.onToggleValue}
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
        Your future self uses your name. Use whatever feels like yours, first name only is
        fine.
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

function AgeField({
  value,
  onChange,
  name,
  autoFocus,
  onEnter,
}: {
  value: string;
  onChange: (v: string) => void;
  name: string;
  autoFocus: boolean;
  onEnter: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  return (
    <>
      <QuestionLabel>And how old are you, {name || "friend"}?</QuestionLabel>
      <p className="mt-3 text-[15px] text-ink-mute max-w-[44ch]">
        So your future self knows where she is writing from.
      </p>
      <input
        ref={ref}
        type="number"
        inputMode="numeric"
        min={13}
        max={99}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, "").slice(0, 2))}
        onKeyDown={(e) => {
          if (e.key === "Enter") onEnter();
        }}
        placeholder="00"
        className="mt-8 w-32 bg-transparent border-b-2 border-merlot/30 focus:border-merlot focus:outline-none font-display italic text-merlot text-[clamp(28px,4vw,40px)] py-3 transition-colors placeholder:text-ink-mute/30 placeholder:not-italic placeholder:font-display tabular-nums"
      />
    </>
  );
}

function HorizonField({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <>
      <QuestionLabel>
        How far ahead is{" "}
        <em className="italic font-light text-merlot">your future self</em>?
      </QuestionLabel>
      <p className="mt-3 text-[15px] text-ink-mute max-w-[44ch]">
        The further out she sits, the more perspective she has. Closer feels softer.
      </p>
      <div className="mt-8 flex flex-wrap gap-2.5">
        {HORIZONS.map((h) => {
          const selected = value === h.value;
          return (
            <button
              key={h.value}
              type="button"
              onClick={() => onChange(h.value)}
              className={`px-5 py-3 rounded-full font-medium text-[15px] transition-all ${
                selected
                  ? "bg-merlot text-cream shadow-[0_12px_24px_-12px_rgba(138,53,86,0.5)]"
                  : "glass-strong text-ink hover:bg-white"
              }`}
            >
              {h.label}
            </button>
          );
        })}
      </div>
    </>
  );
}

function StruggleField({
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
        Whatever it is. One sentence is enough. Your future self will know what you mean.
        You can also skip this.
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 280))}
        placeholder="A breakup. A job interview. A quiet kind of dread I can't name. Anything."
        rows={4}
        className="mt-8 w-full bg-paper/70 border border-line rounded-2xl px-5 py-4 font-display italic text-[19px] text-ink leading-[1.5] focus:outline-none focus:border-merlot transition resize-none placeholder:text-ink-mute/50"
      />
      <div className="mt-2 text-right font-mono text-[11px] text-ink-mute">
        {value.length} / 280
      </div>
    </>
  );
}

function ValuesField({
  values,
  onToggle,
}: {
  values: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <>
      <QuestionLabel>What matters most to you right now?</QuestionLabel>
      <p className="mt-3 text-[15px] text-ink-mute max-w-[50ch]">
        Pick up to three. She will write about these specifically, not in the abstract.
      </p>
      <div className="mt-8 flex flex-wrap gap-2.5">
        {VALUES.map((v) => {
          const selected = values.includes(v.key);
          return (
            <button
              key={v.key}
              type="button"
              onClick={() => onToggle(v.key)}
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
              {v.label}
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
