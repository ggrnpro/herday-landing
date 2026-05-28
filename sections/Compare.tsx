import { copy } from "@/messages/en";
import { Reveal } from "@/components/Reveal";

export function Compare() {
  return (
    <section id="compare" className="section">
      <div className="container-wide">
        <div className="max-w-[60ch] mb-12">
          <Reveal>
            <span className="eyebrow">{copy.compare.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display-2 mt-5">
              {copy.compare.title.pre}
              <em className="italic font-light text-merlot">{copy.compare.title.em}</em>
            </h2>
          </Reveal>
        </div>

        {/* Desktop / tablet table */}
        <Reveal delay={0.2}>
          <div className="hidden md:block glass-strong rounded-3xl overflow-hidden">
            <div className="grid grid-cols-[1.4fr_1fr_1fr] bg-merlot text-cream text-[12px] uppercase tracking-[0.15em] font-mono">
              <div className="p-5">Feature</div>
              <div className="p-5 border-l border-cream/15 flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #FFEBF6, #FFB5D2)" }}
                />
                HerDay
              </div>
              <div className="p-5 border-l border-cream/15">Most other apps</div>
            </div>
            {copy.compare.rows.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-[1.4fr_1fr_1fr] ${
                  i % 2 === 1 ? "bg-white/30" : ""
                }`}
              >
                <div className="p-5 font-display text-[17px] text-ink">
                  {row.feature}
                </div>
                <div className="p-5 border-l border-line text-[15px] text-merlot font-medium leading-snug">
                  {row.herday}
                </div>
                <div className="p-5 border-l border-line text-[15px] text-ink-mute leading-snug">
                  {row.others}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Mobile card stack. Vertical layout per row: feature → HerDay → Others,
            so long words like "Personalisation" never have to fit into a narrow column. */}
        <div className="md:hidden space-y-4">
          {copy.compare.rows.map((row, i) => (
            <Reveal key={i} delay={0.05 * i}>
              <div className="glass-strong rounded-2xl overflow-hidden">
                <div className="px-5 pt-5 pb-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-merlot mb-2">
                    {String(i + 1).padStart(2, "0")} · feature
                  </p>
                  <p className="font-display text-[20px] text-ink leading-[1.15] break-words">
                    {row.feature}
                  </p>
                </div>

                <div className="px-5 pb-4 pt-3 border-t border-line/60 bg-pink-blush/40">
                  <p className="text-[10px] uppercase tracking-[0.18em] font-mono text-merlot mb-1.5 flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: "linear-gradient(135deg, #FFEBF6, #FFB5D2)" }}
                    />
                    HerDay
                  </p>
                  <p className="text-[15px] text-merlot font-medium leading-[1.4] break-words">{row.herday}</p>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-line/60">
                  <p className="text-[10px] uppercase tracking-[0.18em] font-mono text-ink-mute mb-1.5">
                    Most other apps
                  </p>
                  <p className="text-[15px] text-ink-mute leading-[1.4] break-words">{row.others}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
