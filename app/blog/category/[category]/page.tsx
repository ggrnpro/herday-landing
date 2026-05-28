import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Nav } from "@/components/Nav";
import { Footer } from "@/sections/Footer";
import { getAllArticles } from "@/lib/content/articles";
import { CATEGORY_META } from "@/lib/content/types";

export async function generateStaticParams() {
  return Object.keys(CATEGORY_META).map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category as keyof typeof CATEGORY_META];
  if (!meta) return {};
  return {
    title: `${meta.label} — HerDay Blog`,
    description: meta.description,
    alternates: { canonical: `/blog/category/${category}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = CATEGORY_META[category as keyof typeof CATEGORY_META];
  if (!meta) notFound();
  const articles = getAllArticles().filter((a) => a.category === category);

  return (
    <>
      <AnimatedBackground />
      <Nav />
      <main className="relative pt-24 md:pt-32 pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <header className="mb-16 max-w-[58ch]">
            <Link
              href="/blog"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-merlot)] hover:text-[var(--color-merlot-deep)] mb-5 inline-block"
            >
              ← Back to blog
            </Link>
            <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-[var(--color-ink)] mb-4">
              {meta.label}
            </h1>
            <p className="font-display text-xl italic text-[var(--color-ink-soft)] leading-[1.5]">
              {meta.description}
            </p>
          </header>

          {articles.length === 0 ? (
            <p className="text-[var(--color-ink-mute)] italic">
              Nothing here yet — coming soon.
            </p>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <article key={a.slug}>
                  <Link
                    href={`/blog/${a.slug}`}
                    className="overflow-hidden rounded-xl border border-[var(--color-line)] block group mb-4"
                  >
                    <Image
                      src={`/blog/${a.slug}/${a.images.hero.file}`}
                      alt={a.images.hero.alt}
                      width={700}
                      height={394}
                      className="h-auto w-full transition duration-500 group-hover:scale-[1.02]"
                    />
                  </Link>
                  <h2 className="font-display text-2xl leading-[1.2] text-[var(--color-ink)] mb-2">
                    <Link href={`/blog/${a.slug}`} className="hover:text-[var(--color-merlot)] transition">
                      {a.title}
                    </Link>
                  </h2>
                  <p className="text-[15px] leading-[1.6] text-[var(--color-ink-soft)] line-clamp-3">
                    {a.description}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
