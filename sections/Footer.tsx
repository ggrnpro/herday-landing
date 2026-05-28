import { copy } from "@/messages/en";

export function Footer() {
  const cols = [copy.footer.nav.product, copy.footer.nav.science, copy.footer.nav.tools, copy.footer.nav.company];

  return (
    <footer className="relative bg-ink text-cream/85 mt-10">
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 60% at 20% 0%, rgba(176,78,122,0.4), transparent 70%), radial-gradient(40% 50% at 90% 80%, rgba(230,217,255,0.2), transparent 70%)",
        }}
      />

      <div className="relative container-wide py-14 md:py-20">
        {/* Mobile: brand stacked above nav. Desktop: 2-col with nav on right. */}
        <div className="grid gap-10 md:gap-12 md:grid-cols-[1.3fr_2fr]">
          <div>
            <a href="/" className="inline-flex items-center gap-3">
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center text-cream font-display text-[17px]"
                style={{ background: "linear-gradient(135deg, #B04E7A, #8A3556)" }}
              >
                H
              </span>
              <span className="font-display text-[22px] text-cream tracking-tight">
                {copy.brand.name}
              </span>
            </a>
            <p className="font-display italic text-[19px] md:text-[20px] text-cream/80 mt-5 max-w-[28ch] leading-[1.4]">
              {copy.footer.tagline}
            </p>
          </div>

          {/* Mobile: 2x2 grid for the 4 columns. Desktop: 4 equal columns. */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 md:gap-x-8">
            {cols.map((col) => (
              <div key={col.label}>
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-pink mb-4">
                  {col.label}
                </h4>
                <ul className="space-y-2.5">
                  {col.items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-[14px] text-cream/70 hover:text-cream transition leading-snug"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 md:mt-14 pt-7 md:pt-8 border-t border-cream/10 flex flex-col md:flex-row md:justify-between gap-3 text-[12px] md:text-[13px] text-cream/55">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
            <span className="font-mono">{copy.brand.domain}</span>
            <span>{copy.footer.copyright}</span>
          </div>
          <span className="leading-snug max-w-[40ch] md:text-right">
            Made for women carrying a loud inner critic.
          </span>
        </div>
      </div>
    </footer>
  );
}
