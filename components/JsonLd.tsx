import { copy } from "@/messages/en";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://herday.app";

export function JsonLd() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: copy.brand.name,
    url: siteUrl,
    logo: `${siteUrl}/logo.svg`,
    description:
      "HerDay is a morning ritual built on your own voice. Softened and written by AI for the season you're in.",
    sameAs: [
      "https://www.instagram.com/herday.app",
      "https://www.tiktok.com/@herday.app",
    ],
  };

  const software = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: copy.brand.name,
    operatingSystem: "iOS",
    applicationCategory: "LifestyleApplication",
    description:
      "A morning ritual built on your own voice. Clones your voice in 30 seconds, writes a letter for the season you're in, and grows a quiet garden behind your home screen.",
    offers: {
      "@type": "Offer",
      price: "59.99",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "247",
      bestRating: "5",
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: copy.brand.name,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(software) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
