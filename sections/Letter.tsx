import { copy } from "@/messages/en";
import { PhoneMockup } from "@/components/PhoneMockup";
import { Reveal } from "@/components/Reveal";

export function Letter() {
  return (
    <section id="letters" className="section">
      <div className="container-wide">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
          <div>
            <Reveal>
              <span className="eyebrow">{copy.letter.eyebrow}</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="display-2 mt-5 max-w-[16ch]">
                {copy.letter.title.pre}
                <em className="italic font-light text-merlot">{copy.letter.title.em}</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-7 text-[18px] text-ink-soft leading-[1.6] max-w-[56ch]">
                {copy.letter.body}
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10 glass-strong rounded-3xl p-7">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-merlot mb-4">
                  {copy.letter.sample.label}
                </div>
                <p className="font-display italic text-[20px] leading-[1.5] text-ink">
                  &ldquo;{copy.letter.sample.text}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-2">
                  <button className="btn-ghost text-[13px] py-2.5 px-5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7L8 5z" />
                    </svg>
                    Hear in your voice
                  </button>
                  <span className="text-[12px] text-ink-mute font-mono">36 sec</span>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute -inset-12 -z-10 rounded-full opacity-50" style={{ background: "radial-gradient(circle, rgba(246,215,232,0.6) 0%, transparent 70%)", filter: "blur(40px)" }} />
              <PhoneMockup variant="letter" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
