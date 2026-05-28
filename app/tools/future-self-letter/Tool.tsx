"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IntroStage } from "./stages/IntroStage";
import { ComposeStage, type ComposeAnswers } from "./stages/ComposeStage";
import { WritingStage } from "./stages/WritingStage";
import { LetterStage } from "./stages/LetterStage";
import { ScheduleModal } from "./modals/ScheduleModal";
import { ShareModal } from "./modals/ShareModal";
import { composeLetter } from "./lib/letter";
import type { LetterPayload } from "./lib/types";

export type { LetterPayload };

type Stage = "intro" | "compose" | "writing" | "letter";

export function Tool() {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<ComposeAnswers | null>(null);
  const [letter, setLetter] = useState<LetterPayload | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Reset scroll on every stage transition so the new stage's hero
  // is in view, not wherever the previous stage left the page.
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stage]);

  function handleBegin() {
    setStage("compose");
  }

  function handleComposeDone(submitted: ComposeAnswers) {
    setAnswers(submitted);
    setStage("writing");
  }

  function handleWritingComplete() {
    if (!answers) return;
    const composed = composeLetter(answers);
    setLetter(composed);
    setStage("letter");
  }

  function handleWriteAnother() {
    setAnswers(null);
    setLetter(null);
    setStage("compose");
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
