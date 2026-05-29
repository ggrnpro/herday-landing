"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { IntroStage } from "./stages/IntroStage";
import { ComposeStage } from "./stages/ComposeStage";
import { WritingStage } from "./stages/WritingStage";
import { ResultStage } from "./stages/ResultStage";
import { CrisisModal } from "./modals/CrisisModal";
import { ShareModal } from "./modals/ShareModal";
import { EmailModal } from "./modals/EmailModal";
import type { InnerCriticPayload, RateLimitInfo } from "./lib/types";
import type { InnerCriticAnswers } from "@/lib/inner-critic-prompt";

type Stage = "intro" | "compose" | "writing" | "result" | "error";

type ErrorState =
  | { kind: "rate_limited"; message: string; rateLimit?: RateLimitInfo }
  | { kind: "generation_failed"; message: string }
  | { kind: "network"; message: string };

const EASE = [0.22, 1, 0.36, 1] as const;

export function Tool() {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<InnerCriticAnswers | null>(null);
  const [payload, setPayload] = useState<InnerCriticPayload | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [crisisOpen, setCrisisOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);

  const writingDoneRef = useRef(false);
  const resultReadyRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stage]);

  const maybeAdvance = useCallback(() => {
    if (writingDoneRef.current && resultReadyRef.current) {
      setStage("result");
    }
  }, []);

  function handleBegin() {
    setStage("compose");
  }

  async function handleComposeDone(submitted: InnerCriticAnswers, acknowledgeSafety = false) {
    setAnswers(submitted);
    setError(null);
    setPayload(null);
    writingDoneRef.current = false;
    resultReadyRef.current = false;

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("herday_name", submitted.name);
      } catch {
        // localStorage may be blocked in private mode.
      }
    }

    // Start the writing animation only after we've cleared safety.
    setStage("writing");

    try {
      const res = await fetch("/api/inner-critic/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...submitted, acknowledgeSafety }),
      });
      const data = await res.json();

      if (data.error === "safety_flagged") {
        // Roll back to compose stage and open the crisis modal so the
        // user explicitly chooses to continue or close.
        writingDoneRef.current = false;
        resultReadyRef.current = false;
        setStage("compose");
        setCrisisOpen(true);
        return;
      }

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
      setPayload(data.payload as InnerCriticPayload);
      resultReadyRef.current = true;
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
    setPayload(null);
    setError(null);
    writingDoneRef.current = false;
    resultReadyRef.current = false;
    setStage("compose");
  }

  function handleRetry() {
    if (answers) {
      void handleComposeDone(answers);
    } else {
      setStage("compose");
    }
  }

  function handleCrisisContinue() {
    setCrisisOpen(false);
    if (answers) {
      void handleComposeDone(answers, true);
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
            transition={{ duration: 0.6, ease: EASE }}
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
            transition={{ duration: 0.7, ease: EASE }}
          >
            <ComposeStage onSubmit={(a) => handleComposeDone(a, false)} />
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

        {stage === "result" && payload && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <ResultStage
              payload={payload}
              onShare={() => setShareOpen(true)}
              onEmail={() => setEmailOpen(true)}
              onWriteAnother={handleWriteAnother}
            />
          </motion.div>
        )}

        {stage === "error" && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <ErrorStage error={error} onRetry={handleRetry} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {crisisOpen && (
          <CrisisModal
            onContinue={handleCrisisContinue}
            onClose={() => setCrisisOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shareOpen && payload && (
          <ShareModal payload={payload} onClose={() => setShareOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {emailOpen && payload && (
          <EmailModal payload={payload} onClose={() => setEmailOpen(false)} />
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
          <h2 className="font-display text-[clamp(34px,5vw,52px)] leading-[1.1] tracking-[-0.02em] text-ink max-w-[20ch] mx-auto">
            That voice gets two translations a day.
          </h2>
          <p className="mt-6 text-[17px] leading-[1.6] text-ink-soft max-w-[44ch] mx-auto">
            Want translations like these whenever the voice gets loud, read
            in your own kinder voice?
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
            Translate again
          </button>
        </div>
      </div>
    </section>
  );
}
