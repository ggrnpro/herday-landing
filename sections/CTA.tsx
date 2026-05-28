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
            <form
              onSubmit={handleSubmit}
              className="mt-12 mx-auto max-w-lg flex flex-col sm:flex-row sm:gap-0 gap-3 sm:rounded-full sm:p-2 sm:items-center"
              style={{
                /* Desktop wrapper styling applied only via sm+ via class. For mobile we leave wrapper transparent so each pill stands alone. */
              }}
            >
              {/* Mobile-only background applied on wrapper at sm+ */}
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={copy.cta.placeholder}
                aria-label="Email address"
                className="w-full sm:flex-1 rounded-full px-6 py-4 sm:py-3.5 text-[15px] text-ink placeholder:text-ink-mute focus:outline-none border border-white/90 sm:border-0"
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 sm:py-3.5 font-medium text-[15px] text-cream whitespace-nowrap transition-all hover:-translate-y-px"
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
