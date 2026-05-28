import { copy } from "@/messages/en";

export function SocialProof() {
  return (
    <section className="relative py-12 border-y border-line">
      <div className="container-wide">
        <p className="text-center text-[11px] uppercase tracking-[0.22em] text-ink-mute font-mono mb-5">
          {copy.socialProof.eyebrow}
        </p>
        <div className="relative overflow-hidden mask-fade">
          <div className="marquee">
            {[...copy.socialProof.items, ...copy.socialProof.items].map((item, i) => (
              <div
                key={i}
                className="font-display italic text-[18px] md:text-[20px] text-ink-soft whitespace-nowrap flex items-center gap-14"
              >
                <span>{item}</span>
                <span className="text-merlot opacity-30">✿</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .mask-fade {
          mask-image: linear-gradient(90deg, transparent 0, black 10%, black 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0, black 10%, black 90%, transparent 100%);
        }
      `}</style>
    </section>
  );
}
