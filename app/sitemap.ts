import type { MetadataRoute } from "next";
import { getAllArticles, getAllAuthors } from "@/lib/content/articles";
import { CATEGORY_META } from "@/lib/content/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://getherday.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const articles = getAllArticles();
  const authors = getAllAuthors();

  const latestArticle = articles[0] ? new Date(articles[0].updatedAt) : now;

  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: latestArticle,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/tools/future-self-letter`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/tools/affirmation-generator`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...Object.keys(CATEGORY_META).map((cat) => ({
      url: `${siteUrl}/blog/category/${cat}`,
      lastModified: latestArticle,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...authors.map((a) => ({
      url: `${siteUrl}/blog/author/${a.slug}`,
      lastModified: latestArticle,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...articles.map((a) => ({
      url: `${siteUrl}/blog/${a.slug}`,
      lastModified: new Date(a.updatedAt),
      changeFrequency:
        a.category === "situational" ? ("monthly" as const) : ("yearly" as const),
      priority: 0.8,
    })),
  ];

  return entries;
}
