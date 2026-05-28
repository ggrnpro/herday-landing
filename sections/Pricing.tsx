import { copy } from "@/messages/en";
import { Reveal } from "@/components/Reveal";

export function Pricing() {
  return (
    <section id="pricing" className="section">
      <div className="container-wide">
        <div className="max-w-[60ch] mb-12 md:mb-16">
          <Reveal>
            <span className="eyebrow">{copy.pricing.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display-2 mt-5">
              {copy.pricing.title.pre}
              <em className="italic font-light text-merlot">{copy.pricing.title.em}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-[18px] text-ink-soft leading-[1.6]">
              {copy.pricing.body}
            </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {copy.pricing.plans.map((plan, i) => {
            const featured = "featured" in plan && plan.featured;
            return (
              <Reveal key={plan.name} delay={0.1 * i}>
                <div
                  className={`relative rounded-3xl p-8 h-full flex flex-col ${
                    featured
                      ? "glass-strong border-2 border-merlot/40"
                      : "glass"
                  }`}
                  style={
                    featured
                      ? { boxShadow: "0 30px 60px -20px rgba(138,53,86,0.3)" }
                      : undefined
                  }
                >
                  {featured && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.18em] font-mono text-cream"
                      style={{ background: "linear-gradient(135deg, #8A3556, #B04E7A)" }}
                    >
                      Most chosen
                    </span>
                  )}
                  <div className="font-mono uppercase tracking-[0.18em] text-[11px] text-merlot">
                    {plan.name}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="font-display text-[56px] leading-none text-ink font-light tracking-tight">
                      {plan.price}
                    </span>
                  </div>
                  <div className="mt-1 text-[13px] text-ink-mute font-mono">{plan.period}</div>
                  <p className="mt-6 text-[15px] text-ink-soft leading-[1.55] flex-1">
                    {plan.note}
                  </p>
                  <a
                    href="#cta"
                    className={`mt-7 ${
                      featured ? "btn-merlot" : "btn-ghost"
                    } w-full`}
                  >
                    Join the waitlist
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.4}>
          <p className="mt-10 text-center text-[13px] text-ink-mute max-w-[70ch] mx-auto leading-[1.6]">
            {copy.pricing.fineprint}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
