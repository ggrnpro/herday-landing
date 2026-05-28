"use client";

import { useState, type FormEvent } from "react";
import { copy } from "@/messages/en";
import { Reveal } from "@/components/Reveal";
import { Flower } from "@/components/Flower";

export function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section id="cta" className="section relative overflow-hidden">
      <Flower
        size={140}
        variant="daisy"
        opacity={0.45}
        className="flower-spin absolute -top-10 -left-10 hidden md:block"
      />
      <Flower
        size={100}
        variant="petal"
        opacity={0.5}
        className="flower-spin-rev absolute bottom-10 right-10 hidden md:block"
      />

      <div className="container-narrow text-center relative">
        <Reveal>
          <span className="eyebrow">{copy.cta.eyebrow}</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display-1 mt-6 mx-auto max-w-[18ch]">
            {copy.cta.title.pre}
            <em className="italic font-light text-merlot">{copy.cta.title.em}</em>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 text-[19px] text-ink-soft leading-[1.55] max-w-[58ch] mx-auto">
            {copy.cta.body}
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          {submitted ? (
            <div className="mt-12 mx-auto max-w-md glass-strong rounded-3xl p-9">
              <p className="font-display text-[28px] text-merlot italic">
                You&rsquo;re in.
              </p>
              <p className="mt-4 text-[16px] text-ink-soft leading-[1.55]">
                The first letter from your weekly read lands in your inbox on Sunday. We&rsquo;ll write when HerDay opens to your wave.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile: two separate pills stacked. Clear thumb targets. */}
              <form
                onSubmit={handleSubmit}
                className="mt-12 mx-auto max-w-md flex flex-col gap-3 sm:hidden"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={copy.cta.placeholder}
                  aria-label="Email address"
                  className="w-full rounded-full px-6 py-4 text-[15px] text-ink placeholder:text-ink-mute focus:outline-none border border-white/90"
                  style={{
                    background: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(28px) saturate(160%)",
                    WebkitBackdropFilter: "blur(28px) saturate(160%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.8), 0 24px 48px -20px rgba(138,53,86,0.18)",
                  }}
                />
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-medium text-[15px] text-cream whitespace-nowrap transition-all hover:-translate-y-px"
                  style={{
                    background: "#8A3556",
                    boxShadow: "0 14px 32px -12px rgba(138, 53, 86, 0.5)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {copy.cta.button}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>

              {/* Desktop: combined capsule with glass outer + inline input + button. */}
              <form
                onSubmit={handleSubmit}
                className="mt-12 mx-auto max-w-xl hidden sm:flex items-center gap-2 rounded-full p-2 group"
                style={{
                  background: "rgba(255, 255, 255, 0.65)",
                  backdropFilter: "blur(28px) saturate(160%)",
                  WebkitBackdropFilter: "blur(28px) saturate(160%)",
                  border: "1px solid rgba(255, 255, 255, 0.9)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.85), 0 6px 18px -6px rgba(138,53,86,0.12), 0 32px 60px -22px rgba(138, 53, 86, 0.25)",
                }}
              >
                <div className="pl-5 pr-2 text-merlot/60 shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 8l9 6 9-6M3 7v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={copy.cta.placeholder}
                  aria-label="Email address"
                  className="flex-1 min-w-0 bg-transparent border-0 px-2 py-3.5 text-[16px] text-ink placeholder:text-ink-mute/80 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-medium text-[14.5px] text-cream whitespace-nowrap transition-all hover:-translate-y-px shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #8A3556 0%, #6B1923 100%)",
                    boxShadow:
                      "0 10px 24px -8px rgba(138, 53, 86, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {copy.cta.button}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            </>
          )}
        </Reveal>

        <Reveal delay={0.4}>
          <p className="mt-6 text-[13px] text-ink-mute font-mono">
            {copy.cta.fineprint}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
