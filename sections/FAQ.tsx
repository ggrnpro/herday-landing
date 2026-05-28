"use client";

import { useState } from "react";
import { copy } from "@/messages/en";
import { Reveal } from "@/components/Reveal";
import { motion, AnimatePresence } from "motion/react";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section">
      <div className="container-narrow">
        <Reveal>
          <span className="eyebrow">{copy.faq.eyebrow}</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display-2 mt-5">
            {copy.faq.title.pre}
            <em className="italic font-light text-merlot">{copy.faq.title.em}</em>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 glass-strong rounded-3xl overflow-hidden">
            {copy.faq.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className={`${i !== 0 ? "border-t border-line" : ""}`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full text-left p-6 md:p-7 flex items-start gap-5 hover:bg-white/30 transition"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-[18px] md:text-[20px] text-ink flex-1 leading-snug">
                      {item.q}
                    </span>
                    <motion.span
                      className="text-merlot mt-1 shrink-0"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 md:px-7 pb-6 md:pb-7 text-[16px] text-ink-soft leading-[1.65] max-w-[60ch]">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
