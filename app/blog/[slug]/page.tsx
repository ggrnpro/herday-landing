import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Nav } from "@/components/Nav";
import { Footer } from "@/sections/Footer";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { mdxComponents } from "@/components/blog/MDXComponents";
import {
  getAllArticles,
  getArticleBySlug,
  getAuthor,
  getRelatedArticles,
} from "@/lib/content/articles";
import { buildArticleSchema } from "@/lib/content/schema";
import { RelatedArticles } from "@/components/blog/MDXComponents";
import { CATEGORY_META } from "@/lib/content/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://getherday.app";

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  const url = `${siteUrl}/blog/${article.slug}`;
  const ogImage = `${siteUrl}/blog/${article.slug}/${article.images.hero.file}`;
  return {
    title: article.seoTitle ?? article.title,
    description: article.description,
    keywords: [article.keywords.primary, ...(article.keywords.secondary ?? [])],
    alternates: { canonical: `/blog/${article.slug}` },
    authors: [{ name: article.author }],
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url,
      images: [{ url: ogImage, width: 1200, height: 675, alt: article.images.hero.alt }],
      publishedTime: new Date(article.publishedAt).toISOString(),
      modifiedTime: new Date(article.updatedAt).toISOString(),
      authors: [article.author],
      tags: [article.keywords.primary, ...(article.keywords.secondary ?? [])],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [ogImage],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const author = getAuthor(article.author);
  const related = getRelatedArticles(article.slug, article.internalLinks);

  const faqItems = article.schema?.faqItems ?? [];
  const { articleLd, faqLd, breadcrumbLd } = buildArticleSchema(article, author, faqItems);

  const cat = CATEGORY_META[article.category];

  return (
    <>
      <AnimatedBackground />
      <Nav />
      <main className="relative pt-20 pb-24">
        <article className="mx-auto max-w-[68ch] px-6 md:px-0">
          <ArticleHeader article={article} author={author} />

          <div className="prose-herday mt-12">
            <MDXRemote source={article.body} components={mdxComponents} />
          </div>

          {related.length > 0 && (
            <RelatedArticles
              articles={related.map((a) => ({
                slug: a.slug,
                title: a.title,
                description: a.description,
                category: CATEGORY_META[a.category]?.label ?? a.category,
              }))}
            />
          )}

          <footer className="mt-16 border-t border-[var(--color-line)] pt-8 text-sm text-[var(--color-ink-mute)]">
            <p>
              Filed under <strong className="text-[var(--color-ink)]">{cat?.label}</strong>.
              Edited by Lena Hartwell. Citations link to original sources.
            </p>
          </footer>
        </article>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </>
  );
}
