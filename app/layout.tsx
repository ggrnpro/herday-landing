import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { copy } from "@/messages/en";
import { JsonLd } from "@/components/JsonLd";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://herday.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HerDay · The other voice. Yours, but kind.",
    template: "%s · HerDay",
  },
  description:
    "A morning ritual built on your own voice. HerDay clones your voice in 30 seconds, then writes a 30-second message each morning for the season you're in. Addressed by name, conditional when you need it. Built on real psychology.",
  keywords: [
    "affirmation app",
    "voice affirmations",
    "future self letter",
    "inner critic",
    "self-compassion",
    "morning affirmations",
    "voice cloning affirmations",
    "personalized affirmations",
    "ai affirmations",
    "best affirmation app 2026",
  ],
  authors: [{ name: "HerDay" }],
  creator: "HerDay",
  publisher: "HerDay",
  alternates: { canonical: "/" },
  openGraph: {
    title: "HerDay · The other voice. Yours, but kind.",
    description:
      "A morning ritual built on your own voice. Cloned in 30 seconds, addressed by name, conditional when you need it.",
    url: siteUrl,
    siteName: "HerDay",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "HerDay. The other voice, yours, but kind.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HerDay · The other voice. Yours, but kind.",
    description:
      "A morning ritual built on your own voice. Cloned in 30 seconds, addressed by name, conditional when you need it.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "lifestyle",
  applicationName: copy.brand.name,
};

export const viewport: Viewport = {
  themeColor: "#FEF7DF",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <JsonLd />
      </head>
      <body>{children}</body>
    </html>
  );
}
