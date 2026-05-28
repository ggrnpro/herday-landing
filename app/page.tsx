import { AnimatedBackground } from "@/components/AnimatedBackground";
import { FlowerField } from "@/components/FlowerField";
import { Nav } from "@/components/Nav";
import { Hero } from "@/sections/Hero";
import { SocialProof } from "@/sections/SocialProof";
import { Problem } from "@/sections/Problem";
import { HowItWorks } from "@/sections/HowItWorks";
import { Voice } from "@/sections/Voice";
import { InnerCritic } from "@/sections/InnerCritic";
import { VoiceDemo } from "@/sections/VoiceDemo";
import { Letter } from "@/sections/Letter";
import { Garden } from "@/sections/Garden";
import { Science } from "@/sections/Science";
import { Compare } from "@/sections/Compare";
import { Pricing } from "@/sections/Pricing";
import { FAQ } from "@/sections/FAQ";
import { CTA } from "@/sections/CTA";
import { BlogPreview } from "@/sections/BlogPreview";
import { Tools } from "@/sections/Tools";
import { Footer } from "@/sections/Footer";

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <FlowerField />
      <Nav />
      <main id="top" className="relative">
        <Hero />
        <SocialProof />
        <Problem />
        <HowItWorks />
        <Voice />
        <InnerCritic />
        <VoiceDemo />
        <Letter />
        <Garden />
        <Science />
        <Compare />
        <Pricing />
        <BlogPreview />
        <Tools />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
