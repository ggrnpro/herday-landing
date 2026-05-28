import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Nav } from "@/components/Nav";
import { Footer } from "@/sections/Footer";
import { mdxComponents } from "@/components/blog/MDXComponents";
import { getAllArticles, getAllAuthors, getAuthor } from "@/lib/content/articles";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://herday.app";

export async function generateStaticParams() {
  return getAllAuthors().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return {};
  return {
    title: `${author.name} — ${author.role}`,
    description: author.bio,
    alternates: { canonical: `/blog/author/${author.slug}` },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();
  const articles = getAllArticles().filter((a) => a.author === slug);

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `${siteUrl}/blog/author/${author.slug}`,
    image: `${siteUrl}${author.avatar}`,
    jobTitle: author.role,
    description: author.bio,
    ...(author.sameAs ? { sameAs: author.sameAs } : {}),
  };

  return (
    <>
      <AnimatedBackground />
      <Nav />
      <main className="relative pt-24 md:pt-32 pb-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start mb-16">
            <Image
              src={author.avatar}
              alt={`Portrait of ${author.name}`}
              width={180}
              height={180}
              className="rounded-full border border-[var(--color-line)] shrink-0"
            />
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-merlot)] mb-3">
                {author.role}
              </div>
              <h1 className="font-display text-4xl md:text-5xl leading-[1.05] text-[var(--color-ink)] mb-4">
                {author.name}
              </h1>
              {author.credentials && (
                <div className="text-[var(--color-ink-mute)] mb-4">
                  {author.credentials}
                  {author.location && <> · {author.location}</>}
                </div>
              )}
              <p className="text-[18px] leading-[1.7] text-[var(--color-ink-soft)] max-w-[60ch]">
                {author.bio}
              </p>
            </div>
          </div>

          <div className="prose-herday mb-16 max-w-[68ch]">
            <MDXRemote source={author.body} components={mdxComponents} />
          </div>

          {articles.length > 0 && (
            <section className="border-t border-[var(--color-line)] pt-12">
              <h2 className="font-display text-3xl text-[var(--color-ink)] mb-8">
                Articles by {author.name.split(" ")[0]}
              </h2>
              <div className="space-y-8">
                {articles.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/blog/${a.slug}`}
                    className="block group border-b border-[var(--color-line)] pb-8 last:border-b-0"
                  >
                    <h3 className="font-display text-2xl leading-[1.25] text-[var(--color-ink)] group-hover:text-[var(--color-merlot)] transition mb-2">
                      {a.title}
                    </h3>
                    <p className="text-[15px] leading-[1.6] text-[var(--color-ink-soft)]">
                      {a.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
    </>
  );
}
