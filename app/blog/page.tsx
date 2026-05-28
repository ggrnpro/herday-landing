import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Nav } from "@/components/Nav";
import { Footer } from "@/sections/Footer";
import { getAllArticles } from "@/lib/content/articles";
import { CATEGORY_META } from "@/lib/content/types";

export const metadata: Metadata = {
  title: "Blog · Research-backed notes on self-talk, voice, and the other voice inside you",
  description:
    "HerDay's editorial blog — what 30 years of psychology research says about affirmations, voice, future-self letters, and the inner critic. Written for the woman who reads the footnotes.",
  alternates: { canonical: "/blog" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function BlogIndex() {
  const articles = getAllArticles();
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <>
      <AnimatedBackground />
      <Nav />
      <main className="relative pt-24 md:pt-32 pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <header className="mb-16 md:mb-24 max-w-[60ch]">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-merlot)] mb-5">
              The HerDay blog
            </div>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.02] text-[var(--color-ink)] mb-6">
              Notes on the <em className="italic font-light text-[var(--color-merlot)]">voice inside</em> — and how to make it kinder.
            </h1>
            <p className="font-display text-xl italic leading-[1.5] text-[var(--color-ink-soft)] max-w-[58ch]">
              Research that actually replicated, edited for women who don't have time for the long version but won't accept the dumb one.
            </p>
          </header>

          {featured && (
            <FeaturedArticle article={featured} />
          )}

          {rest.length > 0 && (
            <section className="mt-20 md:mt-28">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-merlot)] mb-8">
                More from the blog
              </div>
              <div className="grid gap-10 md:gap-12 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            </section>
          )}

          {articles.length === 0 && (
            <p className="text-[var(--color-ink-mute)] italic">No articles yet. Soon.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function FeaturedArticle({ article }: { article: ReturnType<typeof getAllArticles>[number] }) {
  const cat = CATEGORY_META[article.category];
  return (
    <article className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
      <Link
        href={`/blog/${article.slug}`}
        className="overflow-hidden rounded-2xl border border-[var(--color-line)] block group"
      >
        <Image
          src={`/blog/${article.slug}/${article.images.hero.file}`}
          alt={article.images.hero.alt}
          width={1200}
          height={675}
          priority
          className="h-auto w-full transition duration-700 group-hover:scale-[1.02]"
        />
      </Link>
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-merlot)] mb-3">
          {cat?.label} · Featured
        </div>
        <h2 className="font-display text-3xl md:text-5xl leading-[1.05] text-[var(--color-ink)] mb-4">
          <Link href={`/blog/${article.slug}`} className="hover:text-[var(--color-merlot)] transition">
            {article.title}
          </Link>
        </h2>
        <p className="text-[18px] leading-[1.65] text-[var(--color-ink-soft)] mb-5 max-w-[52ch]">
          {article.description}
        </p>
        <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-ink-mute)]">
          {formatDate(article.publishedAt)} · {article.readingTime} min read
        </div>
      </div>
    </article>
  );
}

function ArticleCard({ article }: { article: ReturnType<typeof getAllArticles>[number] }) {
  const cat = CATEGORY_META[article.category];
  return (
    <article>
      <Link
        href={`/blog/${article.slug}`}
        className="overflow-hidden rounded-xl border border-[var(--color-line)] block group mb-4"
      >
        <Image
          src={`/blog/${article.slug}/${article.images.hero.file}`}
          alt={article.images.hero.alt}
          width={700}
          height={394}
          className="h-auto w-full transition duration-500 group-hover:scale-[1.02]"
        />
      </Link>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-merlot)] mb-2">
        {cat?.label}
      </div>
      <h3 className="font-display text-2xl leading-[1.2] text-[var(--color-ink)] mb-2">
        <Link href={`/blog/${article.slug}`} className="hover:text-[var(--color-merlot)] transition">
          {article.title}
        </Link>
      </h3>
      <p className="text-[15px] leading-[1.6] text-[var(--color-ink-soft)] line-clamp-3 mb-3">
        {article.description}
      </p>
      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-ink-mute)]">
        {formatDate(article.publishedAt)} · {article.readingTime} min
      </div>
    </article>
  );
}
