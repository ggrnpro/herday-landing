import { getAllArticles } from "@/lib/content/articles";
import { CATEGORY_META } from "@/lib/content/types";
import { Reveal } from "@/components/Reveal";
import { Flower } from "@/components/Flower";

const upcomingTeasers = [
  {
    title: "What conditional language actually does to the inner critic",
    category: "inner-critic" as const,
    pillar: "Pillar 02 · Inner critic",
    readingTime: 9,
  },
  {
    title: "A six-question intake we wrote with three therapists",
    category: "how-to" as const,
    pillar: "Pillar 04 · How to",
    readingTime: 7,
  },
];

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogPreview() {
  const articles = getAllArticles().slice(0, 3);
  const slotsToFill = Math.max(0, 3 - articles.length);
  const teasers = upcomingTeasers.slice(0, slotsToFill);

  return (
    <section id="reading" className="section relative overflow-hidden">
      <Flower
        size={90}
        variant="small"
        opacity={0.45}
        className="flower-spin absolute top-10 right-6 hidden md:block"
      />

      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-14">
          <div className="max-w-[34ch]">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-merlot mb-4">
              From the journal
            </p>
            <h2 className="font-display text-[clamp(36px,5vw,56px)] leading-[1.02] tracking-[-0.025em] font-light text-ink">
              The reading,
              <br />
              <span className="italic text-merlot font-light">in your own time.</span>
            </h2>
          </div>
          <a
            href="/blog"
            className="btn-ghost text-[14px] py-3 px-5 self-start md:self-auto whitespace-nowrap"
          >
            Open the journal
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {articles.map((a, i) => {
            const cat = CATEGORY_META[a.category];
            return (
              <Reveal key={a.slug} delay={0.08 * i}>
                <a
                  href={`/blog/${a.slug}`}
                  className="block glass-strong rounded-3xl p-7 md:p-8 h-full group hover:-translate-y-0.5 transition-transform"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-merlot">
                      {cat.label}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-merlot/40" />
                    <span className="text-[11px] text-ink-mute font-mono">
                      {a.readingTime} min read
                    </span>
                  </div>
                  <h3 className="font-display text-[22px] md:text-[24px] leading-[1.18] text-ink group-hover:text-merlot transition-colors">
                    {a.title.replace(/—/g, ".")}
                  </h3>
                  <p className="mt-4 text-[15px] text-ink-soft leading-[1.55] line-clamp-3">
                    {a.description.replace(/—/g, ".")}
                  </p>
                  <div className="mt-7 pt-5 border-t border-line flex items-center justify-between">
                    <span className="text-[12px] text-ink-mute font-mono">
                      {fmtDate(a.publishedAt)}
                    </span>
                    <span className="text-[13px] text-merlot font-medium inline-flex items-center gap-1.5">
                      Read
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </a>
              </Reveal>
            );
          })}

          {teasers.map((t, i) => (
            <Reveal key={`u-${i}`} delay={0.08 * (articles.length + i)}>
              <div className="rounded-3xl p-7 md:p-8 h-full border-2 border-dashed border-merlot/25 bg-cream/40 backdrop-blur-sm flex flex-col">
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-merlot">
                    {CATEGORY_META[t.category].label}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-merlot/40" />
                  <span className="text-[11px] text-ink-mute font-mono">
                    ~{t.readingTime} min
                  </span>
                </div>
                <h3 className="font-display text-[22px] md:text-[24px] leading-[1.18] text-ink/70">
                  {t.title}
                </h3>
                <p className="mt-auto pt-7 text-[12px] uppercase tracking-[0.2em] font-mono text-merlot/80">
                  Coming this season
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
