import { copy } from "@/messages/en";
import { PhoneMockup } from "@/components/PhoneMockup";
import { Reveal } from "@/components/Reveal";

export function Garden() {
  return (
    <section id="garden" className="section">
      <div className="container-wide">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
          <Reveal>
            <div className="relative flex justify-center lg:justify-start">
              <div className="absolute -inset-14 -z-10 rounded-full opacity-60" style={{ background: "radial-gradient(circle, rgba(221,241,232,0.6) 0%, transparent 70%)", filter: "blur(40px)" }} />
              <PhoneMockup variant="garden" />
            </div>
          </Reveal>

          <div>
            {/* No eyebrow here. Direct, three-beat opening that lets the metaphor land. */}
            <Reveal>
              <h2 className="font-display text-[clamp(40px,6vw,76px)] leading-[0.98] tracking-[-0.025em] text-ink font-light">
                Not a pet.
                <br />
                Not a streak.
                <br />
                <span className="italic font-light text-merlot">A garden.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-9 text-[18px] text-ink-soft leading-[1.6] max-w-[54ch]">
                {copy.garden.body}
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <ul className="mt-10 space-y-4 max-w-[52ch] border-t border-line pt-7">
                {copy.garden.points.map((p, i) => (
                  <li key={i} className="flex gap-5 text-[15.5px] text-ink-soft leading-[1.55]">
                    <span className="font-mono text-[12px] text-merlot pt-[0.4em] tracking-[0.12em] w-6 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.35}>
              <p className="mt-8 text-[12px] uppercase tracking-[0.2em] font-mono text-merlot/80 max-w-[52ch] leading-[1.5]">
                What you see on the phone is an early sketch. The real garden in the app is hand-illustrated and far more alive.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
