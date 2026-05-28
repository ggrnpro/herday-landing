import { copy } from "@/messages/en";
import { Reveal } from "@/components/Reveal";

export function Problem() {
  return (
    <section className="section">
      <div className="container-narrow">
        {/* Asymmetric opener: big quoted question, no eyebrow.
            Breaks the eyebrow-headline-deck template that runs through the page. */}
        <Reveal>
          <p className="font-display italic text-merlot font-light leading-[1.05] tracking-[-0.02em] text-[clamp(40px,6vw,80px)] max-w-[16ch]">
            If saying<br />
            &ldquo;I am enough&rdquo;<br />
            worked,
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <h2 className="font-display text-[clamp(28px,3.5vw,44px)] leading-[1.1] tracking-tight text-ink mt-4 max-w-[28ch]">
            you&rsquo;d already be done.
          </h2>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-10 text-[19px] text-ink-soft leading-[1.6] max-w-[60ch]">
            {copy.problem.body}
          </p>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-3 gap-[1px] bg-line border border-line rounded-2xl overflow-hidden">
          {copy.problem.points.map((p, i) => (
            <Reveal key={i} delay={0.15 * i} className="bg-cream/80 backdrop-blur-sm p-7 md:p-9">
              <span className="font-mono text-[11px] text-merlot tracking-[0.18em]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-[22px] mt-4 text-ink leading-tight">{p.title}</h3>
              <p className="mt-3 text-[15.5px] text-ink-soft leading-[1.55]">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
