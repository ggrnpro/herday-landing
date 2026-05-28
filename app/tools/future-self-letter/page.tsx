import type { Metadata } from "next";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Nav } from "@/components/Nav";
import { Footer } from "@/sections/Footer";
import { Tool } from "./Tool";

export const metadata: Metadata = {
  title: "Letter from your future self · Free tool",
  description:
    "A short letter from your future self, written in the voice she would use. Grounded in self-affirmation theory and future-self continuity research. Send it back to yourself when you're ready to hear it.",
  alternates: { canonical: "/tools/future-self-letter" },
  openGraph: {
    title: "Letter from your future self",
    description:
      "Tell us what you're sitting with. We'll draft a short letter from yourself, written from a year ahead. Schedule it to land in your inbox when you need it.",
    type: "website",
  },
};

export default function FutureSelfLetterPage() {
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
