import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";

type Tool = {
  slug: string;
  title: string;
  body: string;
  eta: "Live" | "In progress";
};

const tools: Tool[] = [
  {
    slug: "affirmation-generator",
    title: "Affirmation generator",
    body:
      "Type a value you care about. Get a conditional affirmation written against it, in seconds.",
    eta: "Live",
  },
  {
    slug: "future-self-letter",
    title: "Letter from your future self",
    body:
      "Tell us what you're sitting with. We'll draft a short letter from yourself, one year ahead.",
    eta: "Live",
  },
  {
    slug: "inner-critic-translator",
    title: "Inner-critic translator",
    body:
      "Paste a sentence the critic said today. Watch it rewritten in conditional language.",
    eta: "Live",
  },
  {
    slug: "morning-mantra-builder",
    title: "Morning mantra builder",
    body:
      "A four-step prompt to write a personal mantra that holds against the rest of the day.",
    eta: "In progress",
  },
];

export function Tools() {
  return (
    <section id="tools" className="section relative overflow-hidden">
      <div className="container-wide">
        <div className="max-w-[40ch] mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-merlot mb-4">
            Free tools
          </p>
          <h2 className="font-display text-[clamp(36px,5vw,56px)] leading-[1.02] tracking-[-0.025em] font-light text-ink">
            Try a small piece of HerDay
            <br />
            <span className="italic text-merlot font-light">without the app.</span>
          </h2>
          <p className="mt-6 text-[18px] text-ink-soft leading-[1.6] max-w-[58ch]">
            Each one runs in your browser. No sign-up. Built on the same conditional-language
            engine the app uses every morning.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((t, i) => {
            const live = t.eta === "Live";
            const cardStyle = {
              background:
                "linear-gradient(160deg, rgba(255, 235, 246, 0.85), rgba(246, 215, 232, 0.65) 60%, rgba(230, 217, 255, 0.55))",
              border: "1px solid rgba(138, 53, 86, 0.12)",
              boxShadow: "0 18px 40px -20px rgba(138, 53, 86, 0.25)",
            };
            const inner = (
              <>
                <div className="flex items-center justify-between mb-7">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-merlot">
                    Tool {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-[0.18em] px-2.5 py-1 rounded-full ${
                      live
                        ? "bg-merlot/90 text-cream"
                        : "bg-cream/70 text-merlot border border-merlot/20"
                    }`}
                  >
                    {t.eta}
                  </span>
                </div>
                <h3
                  className={`font-display text-[22px] leading-[1.15] text-ink ${
                    live ? "group-hover:text-merlot transition-colors" : ""
                  }`}
                >
                  {t.title}
                </h3>
                <p className="mt-3 text-[14.5px] text-ink-soft leading-[1.55]">{t.body}</p>
                <p
                  className={`mt-7 text-[13px] font-medium inline-flex items-center gap-1.5 ${
                    live ? "text-merlot" : "text-ink-mute"
                  }`}
                >
                  {live ? "Open" : "Coming soon"}
                  {live && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </p>
              </>
            );
            return (
              <Reveal key={t.slug} delay={0.06 * i}>
                {live ? (
                  <TiltCard
                    href={`/tools/${t.slug}`}
                    className="group block rounded-3xl p-7 h-full no-underline"
                    style={cardStyle}
                  >
                    {inner}
                  </TiltCard>
                ) : (
                  <TiltCard
                    ariaDisabled
                    className="block rounded-3xl p-7 h-full cursor-not-allowed opacity-65"
                    style={cardStyle}
                  >
                    {inner}
                  </TiltCard>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
