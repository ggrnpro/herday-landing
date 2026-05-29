import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Nav } from "@/components/Nav";
import { Footer } from "@/sections/Footer";
import { Reveal } from "@/components/Reveal";
import { Flower } from "@/components/Flower";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "This page wandered off. Head back home or read something kinder.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <AnimatedBackground />
      <Nav />
      <main className="relative flex items-center justify-center overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32 min-h-[calc(100svh-160px)]">
        {/* ghost 404 numeral behind */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black leading-none tracking-[-0.05em] pointer-events-none select-none whitespace-nowrap"
          style={{
            fontSize: "clamp(340px, 44vw, 620px)",
            color: "rgba(138, 53, 86, 0.09)",
          }}
        >
          404
        </div>

        {/* decorative flowers — desktop only */}
        <Flower
          size={140}
          variant="daisy"
          opacity={0.5}
          className="flower-spin absolute top-[14%] left-[6%] hidden md:block"
        />
        <Flower
          size={100}
          variant="petal"
          opacity={0.5}
          className="flower-spin-rev absolute bottom-[18%] right-[8%] hidden md:block"
        />
        <Flower
          size={70}
          variant="small"
          opacity={0.45}
          className="flower-spin absolute top-[22%] right-[14%] hidden lg:block"
        />
        <Flower
          size={80}
          variant="small"
          opacity={0.4}
          className="flower-spin-rev absolute bottom-[24%] left-[12%] hidden lg:block"
        />

        <div className="container-narrow relative text-center">
          <Reveal>
            <span className="tag">404 · misplaced</span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="display-1 mt-8 max-w-[18ch] mx-auto">
              Even good days{" "}
              <em className="italic font-light shimmer-italic">
                lose their way.
              </em>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-8 text-[17px] md:text-[19px] leading-[1.55] text-ink-soft max-w-[54ch] mx-auto">
              The page you came for isn&rsquo;t here. Maybe the link is old. Maybe a letter got returned to sender. Try heading home, or pour yourself a quiet read.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 md:mt-12 flex flex-wrap justify-center items-center gap-3 md:gap-4">
              <Link href="/" className="btn-merlot">
                Back home
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link href="/blog" className="btn-ghost">
                Read the blog
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <p className="mt-12 md:mt-14 text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-ink-mute font-mono leading-[1.8]">
              you didn&rsquo;t break anything
              <span className="hidden sm:inline"> · </span>
              <br className="sm:hidden" />
              the page just took a longer walk
            </p>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
