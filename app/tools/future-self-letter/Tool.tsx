"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { IntroStage } from "./stages/IntroStage";
import { ComposeStage, type ComposeAnswers } from "./stages/ComposeStage";
import { WritingStage } from "./stages/WritingStage";
import { LetterStage } from "./stages/LetterStage";
import { ScheduleModal } from "./modals/ScheduleModal";
import { ShareModal } from "./modals/ShareModal";
import type { LetterPayload, RateLimitInfo } from "./lib/types";

export type { LetterPayload };

type Stage = "intro" | "compose" | "writing" | "letter" | "error";

type ErrorState =
  | { kind: "rate_limited"; message: string; rateLimit?: RateLimitInfo }
  | { kind: "generation_failed"; message: string }
  | { kind: "network"; message: string };

export function Tool() {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<ComposeAnswers | null>(null);
  const [letter, setLetter] = useState<LetterPayload | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const writingDoneRef = useRef(false);
  const letterReadyRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stage]);

  const maybeAdvance = useCallback(() => {
    if (writingDoneRef.current && letterReadyRef.current) {
      setStage("letter");
    }
  }, []);

  function handleBegin() {
    setStage("compose");
  }

  async function handleComposeDone(submitted: ComposeAnswers) {
    setAnswers(submitted);
    setError(null);
    setLetter(null);
    writingDoneRef.current = false;
    letterReadyRef.current = false;
    setStage("writing");

    try {
      const res = await fetch("/api/letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitted),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          setError({
            kind: "rate_limited",
            message: data.message || "You're at your daily limit.",
            rateLimit: data.rateLimit,
          });
        } else {
          setError({
            kind: "generation_failed",
            message: data.message || "Something went off-script. Try again.",
          });
        }
        setStage("error");
        return;
      }
      setLetter(data.letter as LetterPayload);
      letterReadyRef.current = true;
      maybeAdvance();
    } catch {
      setError({
        kind: "network",
        message: "We couldn't reach the page. Check your connection.",
      });
      setStage("error");
    }
  }

  function handleWritingComplete() {
    writingDoneRef.current = true;
    maybeAdvance();
  }

  function handleWriteAnother() {
    setAnswers(null);
    setLetter(null);
    setError(null);
    writingDoneRef.current = false;
    letterReadyRef.current = false;
    setStage("compose");
  }

  function handleRetry() {
    if (answers) {
      void handleComposeDone(answers);
    } else {
      setStage("compose");
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <IntroStage onBegin={handleBegin} />
          </motion.div>
        )}

        {stage === "compose" && (
          <motion.div
            key="compose"
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <ComposeStage onSubmit={handleComposeDone} />
          </motion.div>
        )}

        {stage === "writing" && (
          <motion.div
            key="writing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <WritingStage onComplete={handleWritingComplete} />
          </motion.div>
        )}

        {stage === "letter" && letter && (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <LetterStage
              letter={letter}
              onSchedule={() => setScheduleOpen(true)}
              onShare={() => setShareOpen(true)}
              onWriteAnother={handleWriteAnother}
            />
          </motion.div>
        )}

        {stage === "error" && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <ErrorStage error={error} onRetry={handleRetry} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {scheduleOpen && letter && (
          <ScheduleModal
            letter={letter}
            onClose={() => setScheduleOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shareOpen && letter && (
          <ShareModal
            letter={letter}
            onClose={() => setShareOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function ErrorStage({
  error,
  onRetry,
}: {
  error: ErrorState;
  onRetry: () => void;
}) {
  if (error.kind === "rate_limited") {
    return (
      <section className="relative min-h-[60vh] flex items-center">
        <div className="container-narrow text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-merlot mb-5">
            For today
          </div>
          <h2 className="font-display text-[clamp(34px,5vw,52px)] leading-[1.1] tracking-[-0.02em] text-ink max-w-[18ch] mx-auto">
            You&rsquo;ve sent both your free letters today.
          </h2>
          <p className="mt-6 text-[17px] leading-[1.6] text-ink-soft max-w-[44ch] mx-auto">
            Want letters like this — read in your own voice, every single morning,
            while the kettle is on?
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link href="/#cta" className="btn-merlot">
              Get HerDay
            </Link>
            <button onClick={onRetry} className="btn-ghost">
              Try again tomorrow
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[60vh] flex items-center">
      <div className="container-narrow text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-merlot mb-5">
          A small hiccup
        </div>
        <h2 className="font-display text-[clamp(28px,4vw,42px)] leading-[1.15] text-ink max-w-[24ch] mx-auto">
          The pen slipped. Try again?
        </h2>
        <p className="mt-5 text-[15px] text-ink-mute max-w-[42ch] mx-auto">
          {error.message}
        </p>
        <div className="mt-8">
          <button onClick={onRetry} className="btn-merlot">
            Write the letter again
          </button>
        </div>
      </div>
    </section>
  );
}
