import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { copy } from "@/messages/en";
import { JsonLd } from "@/components/JsonLd";

const YANDEX_METRIKA_ID = 109491579;

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
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="HerDay" />
        <link rel="manifest" href="/site.webmanifest" />
        <JsonLd />
      </head>
      <body>
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}","ym");ym(${YANDEX_METRIKA_ID},"init",{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});`}
        </Script>
        <noscript>
          <div>
            <img
              src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        {children}
      </body>
    </html>
  );
}
