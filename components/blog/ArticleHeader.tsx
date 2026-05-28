import Image from "next/image";
import Link from "next/link";
import type { Article, Author } from "@/lib/content/types";
import { CATEGORY_META } from "@/lib/content/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ArticleHeader({
  article,
  author,
}: {
  article: Article;
  author: Author | null;
}) {
  const category = CATEGORY_META[article.category];
  return (
    <header className="mx-auto max-w-[68ch] pt-8 md:pt-16 px-6 md:px-0">
      <div className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-merlot)]">
        <Link href={`/blog`} className="hover:text-[var(--color-merlot-deep)]">
          Blog
        </Link>
        <span aria-hidden className="text-[var(--color-ink-mute)]">·</span>
        <Link
          href={`/blog/category/${article.category}`}
          className="hover:text-[var(--color-merlot-deep)]"
        >
          {category?.label ?? article.category}
        </Link>
      </div>

      <h1 className="font-display text-4xl md:text-6xl leading-[1.05] text-[var(--color-ink)] mb-6">
        {article.title}
      </h1>

      <p className="font-display text-xl md:text-2xl italic leading-[1.5] text-[var(--color-ink-soft)] mb-10 max-w-[58ch]">
        {article.description}
      </p>

      {author && (
        <div className="border-t border-b border-[var(--color-line)] py-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4 min-w-0">
            <Link href={`/blog/author/${author.slug}`} className="shrink-0">
              <Image
                src={author.avatar}
                alt={`Portrait of ${author.name}`}
                width={56}
                height={56}
                className="rounded-full border border-[var(--color-line)]"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <div>
                <Link
                  href={`/blog/author/${author.slug}`}
                  className="font-medium text-[var(--color-ink)] hover:text-[var(--color-merlot)]"
                >
                  {author.name}
                </Link>
                {author.credentials && (
                  <span className="text-[var(--color-ink-mute)] text-sm"> · {author.credentials}</span>
                )}
              </div>
              <div className="text-sm text-[var(--color-ink-mute)]">{author.role}</div>
            </div>
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-ink-mute)] sm:text-right sm:shrink-0 sm:ml-auto pl-[72px] sm:pl-0">
            <div>Published {formatDate(article.publishedAt)}</div>
            {article.updatedAt !== article.publishedAt && (
              <div>Updated {formatDate(article.updatedAt)}</div>
            )}
            {article.readingTime && (
              <div>{article.readingTime} min read</div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
