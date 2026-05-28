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
              className="mt-12 mx-auto max-w-lg flex flex-col sm:flex-row gap-3 glass-strong rounded-full p-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={copy.cta.placeholder}
                className="flex-1 px-6 py-3.5 bg-transparent text-[15px] text-ink placeholder:text-ink-mute focus:outline-none rounded-full"
              />
              <button type="submit" className="btn-merlot whitespace-nowrap">
                {copy.cta.button}
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
