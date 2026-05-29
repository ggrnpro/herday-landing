import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/sections/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Tool } from "./Tool";

export const metadata: Metadata = {
  title: "Daily affirmations, written for your morning · Free tool",
  description:
    "Five literary affirmations, written for the exact morning you are in. No cringe. No manifestation BS. Free, no signup.",
  alternates: { canonical: "/tools/affirmation-generator" },
};

export default function AffirmationGeneratorPage() {
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
