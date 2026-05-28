import { copy } from "@/messages/en";
import { Reveal } from "@/components/Reveal";

export function Science() {
  return (
    <section id="science" className="section relative">
      <div className="container-wide">
        <div className="max-w-[60ch] mb-14">
          <Reveal>
            <span className="eyebrow">{copy.science.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display-2 mt-5">
              {copy.science.title.pre}
              <em className="italic font-light text-merlot">{copy.science.title.em}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-[18px] text-ink-soft leading-[1.6]">
              {copy.science.deck}
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {copy.science.studies.map((s, i) => (
            <Reveal key={i} delay={0.08 * i}>
              <article className="glass-dark rounded-3xl p-7 md:p-9 h-full flex flex-col">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-pink mb-3">
                  Study {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-[24px] md:text-[26px] leading-[1.15] text-cream tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-3 text-[12px] uppercase tracking-[0.15em] text-rose-200/80 font-mono">
                  {s.attr}
                </p>
                <p className="mt-5 text-[15px] text-cream/80 leading-[1.6]">{s.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
