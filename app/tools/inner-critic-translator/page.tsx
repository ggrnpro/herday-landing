import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/sections/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Tool } from "./Tool";

export const metadata: Metadata = {
  title: "Inner critic translator — turn cruel self-talk into a kinder voice · Free",
  description:
    "Type what your inner critic just said. We translate it through four evidence-based lenses: IFS, self-compassion, distanced self-talk, future self. No signup. No cringe.",
  alternates: { canonical: "/tools/inner-critic-translator" },
};

export default function InnerCriticTranslatorPage() {
  return (
    <>
      <AnimatedBackground />
      <Nav />
      <main className="relative pt-24 md:pt-32 pb-32 min-h-screen">
        <Tool />
      </main>
      <Footer />
    </>
  );
}
