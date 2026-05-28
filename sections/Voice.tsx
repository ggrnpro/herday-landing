import { copy } from "@/messages/en";
import { PhoneMockup } from "@/components/PhoneMockup";
import { Reveal } from "@/components/Reveal";

export function Voice() {
  return (
    <section id="voice" className="section">
      <div className="container-wide">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
          <Reveal>
            <div className="relative flex justify-center lg:justify-start">
              <div className="absolute -inset-12 -z-10 rounded-full opacity-50" style={{ background: "radial-gradient(circle, rgba(230,217,255,0.5) 0%, transparent 70%)", filter: "blur(40px)" }} />
              <PhoneMockup variant="voice" />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <span className="eyebrow">{copy.voice.eyebrow}</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="display-2 mt-5 max-w-[18ch]">
                {copy.voice.title.pre}
                <em className="italic font-light text-merlot">{copy.voice.title.em}</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-[18px] text-ink-soft leading-[1.6] max-w-[56ch]">
                {copy.voice.body}
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <ul className="mt-9 space-y-3.5 max-w-[54ch]">
                {copy.voice.points.map((point, i) => (
                  <li key={i} className="flex gap-3 text-[15.5px] text-ink-soft leading-[1.55]">
                    <span className="text-merlot mt-[0.4em] shrink-0">✿</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.4}>
              <blockquote className="mt-10 pl-6 border-l-2 border-merlot/40 max-w-[52ch]">
                <p className="font-display italic text-[20px] text-ink leading-[1.4]">
                  &ldquo;{copy.voice.quote.text}&rdquo;
                </p>
                <footer className="mt-3 text-[12px] uppercase tracking-[0.18em] text-ink-mute font-mono">
                  {copy.voice.quote.attr}
                </footer>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
