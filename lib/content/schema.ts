import type { Article, Author } from "./types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://getherday.app";

interface FaqEntry { q: string; a: string }

export function buildArticleSchema(article: Article, author: Author | null, faqItems: FaqEntry[] = []) {
  const articleUrl = `${siteUrl}/blog/${article.slug}`;
  const heroUrl = `${siteUrl}/blog/${article.slug}/${article.images.hero.file}`;

  const articleLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": article.schema?.type === "HowTo" ? "Article" : "Article",
    "@id": articleUrl,
    headline: article.title,
    description: article.description,
    image: [heroUrl],
    datePublished: new Date(article.publishedAt).toISOString(),
    dateModified: new Date(article.updatedAt).toISOString(),
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "HerDay",
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/logo.svg` },
    },
  };

  if (author) {
    articleLd.author = {
      "@type": "Person",
      name: author.name,
      url: `${siteUrl}/blog/author/${author.slug}`,
      ...(author.sameAs ? { sameAs: author.sameAs } : {}),
      ...(author.role ? { jobTitle: author.role } : {}),
      ...(author.credentials ? { description: author.credentials } : {}),
    };
  }

  const citations = article.schema?.citations;
  if (citations && citations.length > 0) {
    articleLd.citation = citations.map((c) => ({
      "@type": "ScholarlyArticle",
      name: c.title,
      author: c.author,
      datePublished: String(c.year),
      ...(c.doi ? { sameAs: `https://doi.org/${c.doi}` } : {}),
      ...(c.url ? { url: c.url } : {}),
    }));
  }

  const faqLd =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
    ],
  };

  return { articleLd, faqLd, breadcrumbLd };
}
