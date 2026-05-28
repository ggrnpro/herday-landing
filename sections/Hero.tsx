import { copy } from "@/messages/en";
import { PhoneMockup } from "@/components/PhoneMockup";
import { Reveal } from "@/components/Reveal";
import { Flower } from "@/components/Flower";

export function Hero() {
  return (
    <section className="relative pt-36 md:pt-44 pb-20 md:pb-32 overflow-hidden">
      {/* large ghost wordmark */}
      <div
        aria-hidden="true"
        className="absolute top-[58%] -left-[6%] font-display font-black leading-[0.8] tracking-[-0.04em] pointer-events-none select-none"
        style={{
          fontSize: "clamp(220px, 28vw, 440px)",
          color: "rgba(138, 53, 86, 0.04)",
        }}
      >
        HerDay
      </div>

      {/* decorative flowers around hero */}
      <Flower size={120} variant="daisy" opacity={0.5} className="flower-spin absolute top-[15%] right-[8%] hidden md:block" />
      <Flower size={80} variant="petal" opacity={0.5} className="flower-spin-rev absolute bottom-[10%] left-[5%] hidden md:block" />

      <div className="container-wide relative">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-20 items-center">
          <div>
            <Reveal>
              <span className="tag">{copy.hero.eyebrow}</span>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="display-1 mt-7 max-w-[18ch]">
                {copy.hero.title.pre}{" "}
                <em className="italic font-light shimmer-italic">{copy.hero.title.em}</em>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-8 text-[19px] leading-[1.55] text-ink-soft max-w-[58ch]">
                {copy.hero.deck}
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a href="#cta" className="btn-merlot">
                  {copy.hero.cta_primary}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a href="#hear" className="btn-ghost">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                  </svg>
                  {copy.hero.cta_secondary}
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="mt-14 pt-8 border-t border-line grid grid-cols-2 md:grid-cols-4 gap-6">
                {copy.hero.meta.map((m) => (
                  <div key={m.label}>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-ink-mute font-mono">
                      {m.label}
                    </p>
                    <p className="font-display text-[18px] text-ink mt-2 leading-tight">
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute -inset-10 -z-10 rounded-full opacity-50" style={{ background: "radial-gradient(circle, rgba(255,181,210,0.5) 0%, transparent 70%)", filter: "blur(40px)" }} />
              <PhoneMockup variant="intro" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
