import { copy } from "@/messages/en";
import { Reveal } from "@/components/Reveal";

export function HowItWorks() {
  return (
    <section id="how" className="section">
      <div className="container-wide">
        <div className="max-w-[60ch] mb-16 md:mb-20">
          <Reveal>
            <span className="eyebrow">{copy.howItWorks.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display-2 mt-5">
              {copy.howItWorks.title.pre}
              <em className="italic font-light text-merlot">{copy.howItWorks.title.em}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-[18px] text-ink-soft leading-[1.6]">
              {copy.howItWorks.deck}
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
          {copy.howItWorks.steps.map((step, i) => (
            <Reveal key={step.n} delay={0.1 * i}>
              <div className="glass-strong rounded-3xl p-8 md:p-9 h-full flex flex-col">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-[44px] text-merlot leading-none font-light">
                    {step.n}
                  </span>
                  <span className="w-8 h-px bg-merlot/30" />
                </div>
                <h3 className="font-display text-[26px] mt-6 text-ink leading-[1.15] tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-4 text-[15.5px] text-ink-soft leading-[1.6]">
                  {step.body}
                </p>
                <div className="mt-auto pt-6">
                  <p className="text-[13px] text-ink-mute italic leading-[1.5] border-t border-line pt-4">
                    <span className="not-italic font-mono uppercase tracking-[0.15em] text-merlot text-[10px] block mb-2">
                      Why this works
                    </span>
                    {step.why}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
