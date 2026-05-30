import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

/* ------------------------------ Callout ------------------------------ */
type CalloutKind = "science" | "action" | "caution" | "insight";

const calloutMeta: Record<CalloutKind, { label: string; accent: string; bg: string }> = {
  science: { label: "Behind the science", accent: "text-[var(--color-merlot)]", bg: "bg-[var(--color-pink-blush)]" },
  action: { label: "What you can try", accent: "text-[var(--color-merlot-deep)]", bg: "bg-[var(--color-mint)]" },
  caution: { label: "Note", accent: "text-[var(--color-merlot-deep)]", bg: "bg-[var(--color-cream-deep)]" },
  insight: { label: "Important", accent: "text-[var(--color-merlot)]", bg: "bg-[var(--color-lilac)]" },
};

export function Callout({ type = "science", children }: { type?: CalloutKind; children: ReactNode }) {
  const m = calloutMeta[type];
  return (
    <aside
      className={clsx(
        "my-10 rounded-2xl border border-[var(--color-line)] px-6 py-5 md:px-7 md:py-6",
        m.bg,
      )}
    >
      <div className={clsx("mb-2 font-mono text-[11px] uppercase tracking-[0.18em]", m.accent)}>
        {m.label}
      </div>
      <div className="text-[17px] leading-[1.7] text-[var(--color-ink-soft)]">
        {children}
      </div>
    </aside>
  );
}

/* ------------------------------ Citation ------------------------------ */
export function Citation({
  doi,
  author,
  year,
  title,
  url,
}: {
  doi?: string;
  author: string;
  year: number;
  title: string;
  url?: string;
}) {
  const href = url ?? (doi ? `https://doi.org/${doi}` : undefined);
  return (
    <sup className="font-mono text-[0.7em] align-super">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--color-merlot)] hover:text-[var(--color-merlot-deep)] no-underline border-b border-[var(--color-merlot)]/40 hover:border-[var(--color-merlot-deep)]"
        title={`${author} (${year}): ${title}`}
      >
        {author.split(",")[0]} {year}
      </a>
    </sup>
  );
}

/* ------------------------------ Stat ------------------------------ */
export function Stat({
  number,
  label,
  source,
  sourceUrl,
}: {
  number: string;
  label: string;
  source?: string;
  sourceUrl?: string;
}) {
  return (
    <figure className="my-12 border-l-2 border-[var(--color-merlot)] pl-6 md:pl-8">
      <div className="font-display text-5xl md:text-6xl italic text-[var(--color-merlot)] leading-none">
        {number}
      </div>
      <figcaption className="mt-3 max-w-[36ch] text-[17px] leading-[1.55] text-[var(--color-ink-soft)]">
        {label}
        {source && (
          <span className="ml-2 font-mono text-xs uppercase tracking-[0.12em] text-[var(--color-ink-mute)]">
            {sourceUrl ? (
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-merlot)]">
                · {source}
              </a>
            ) : (
              <>· {source}</>
            )}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

/* ------------------------------ DefinitionBox ------------------------------ */
export function DefinitionBox({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="my-10 rounded-2xl border border-[var(--color-line-strong)] bg-[var(--color-paper)] px-7 py-6 md:px-9 md:py-7">
      <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-mute)]">
        Definition · {term}
      </div>
      <div className="font-display text-[22px] italic leading-[1.45] text-[var(--color-ink)]">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------ PullQuote ------------------------------ */
export function PullQuote({ children, attr }: { children: ReactNode; attr?: string }) {
  return (
    <blockquote className="my-16 mx-auto max-w-[24ch] text-center">
      <p className="font-display text-3xl md:text-4xl italic leading-[1.25] text-[var(--color-merlot)]">
        {children}
      </p>
      {attr && (
        <footer className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-mute)]">
          — {attr}
        </footer>
      )}
    </blockquote>
  );
}

/* ------------------------------ FAQBlock ------------------------------ */
export function FAQBlock({ items = [] }: { items?: { q: string; a: string }[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-16 border-t border-[var(--color-line)] pt-12">
      <h2 className="font-display text-3xl md:text-4xl text-[var(--color-ink)] mb-8">
        Frequently asked
      </h2>
      <dl className="space-y-8">
        {items.map((item, i) => (
          <div key={i} className="border-b border-[var(--color-line)] pb-8 last:border-b-0">
            <dt className="font-display text-xl md:text-2xl italic text-[var(--color-merlot)] mb-3">
              {item.q}
            </dt>
            <dd className="text-[17px] leading-[1.7] text-[var(--color-ink-soft)]">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ------------------------------ ArticleImage ------------------------------ */
export function ArticleHero({
  src,
  alt,
  caption,
  width = 1600,
  height = 900,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure className="my-10 -mx-4 md:-mx-12 lg:-mx-16">
      <div className="overflow-hidden rounded-2xl border border-[var(--color-line)]">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority
          className="h-auto w-full"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1100px"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-ink-mute)] text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function BodyImage({
  src,
  alt,
  caption,
  width = 1024,
  height = 1024,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure className="my-12">
      <div className="overflow-hidden rounded-xl border border-[var(--color-line)]">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full"
          sizes="(max-width: 768px) 100vw, 700px"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-ink-mute)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------ Comparison ------------------------------ */
export function Comparison({
  rows = [],
  leftLabel = "Most apps",
  rightLabel = "HerDay",
}: {
  rows?: { feature: string; left: string; right: string }[];
  leftLabel?: string;
  rightLabel?: string;
}) {
  if (!rows.length) return null;
  return (
    <div className="my-12 overflow-hidden rounded-2xl border border-[var(--color-line-strong)]">
      <table className="w-full text-left text-sm md:text-[15px]">
        <thead className="bg-[var(--color-paper)] border-b border-[var(--color-line)]">
          <tr>
            <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-ink-mute)] font-medium">
              &nbsp;
            </th>
            <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-ink-mute)] font-medium">
              {leftLabel}
            </th>
            <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-merlot)] font-medium">
              {rightLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-[var(--color-line)] last:border-b-0">
              <td className="px-5 py-4 font-medium text-[var(--color-ink)] align-top">{r.feature}</td>
              <td className="px-5 py-4 text-[var(--color-ink-soft)] align-top">{r.left}</td>
              <td className="px-5 py-4 text-[var(--color-ink)] align-top">{r.right}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------ AppCTA ------------------------------ */
export function AppCTA({
  variant = "hear-your-voice",
  utm,
}: {
  variant?: string;
  utm?: string;
}) {
  const headlines: Record<string, { eyebrow: string; title: ReactNode; body: string; href: string; cta: string }> = {
    "hear-your-voice": {
      eyebrow: "If this resonated",
      title: (
        <>
          Hear your own voice be <em className="italic font-light text-[var(--color-merlot)]">kind to you</em> tomorrow morning.
        </>
      ),
      body: "HerDay is a 30-second morning ritual built on your own cloned voice. Conditional when you need it, addressed by name, written for the season you're in. Join the waitlist for early access.",
      href: "/",
      cta: "Join the waitlist",
    },
    tool: {
      eyebrow: "Try it now",
      title: <>Try our free <em className="italic font-light text-[var(--color-merlot)]">affirmation generator</em>.</>,
      body: "No signup needed. Tells you whether to phrase yours declarative or conditional based on a 10-second check.",
      href: "/tools/affirmation-generator",
      cta: "Open the generator",
    },
    "letter-tool": {
      eyebrow: "Try it now",
      title: <>Write your <em className="italic font-light text-[var(--color-merlot)]">letter to your future self</em>, free.</>,
      body: "Answer a few quiet questions, get a personalized letter, and schedule it to arrive at a date you choose. No signup needed.",
      href: "/tools/future-self-letter",
      cta: "Write the letter",
    },
    "inner-critic-tool": {
      eyebrow: "Try it now",
      title: <>Translate your <em className="italic font-light text-[var(--color-merlot)]">inner critic</em>, free.</>,
      body: "Type what your inner critic just said. We'll show you the underlying concern and a kinder phrasing — based on the same conditional language model used inside HerDay.",
      href: "/tools/inner-critic-translator",
      cta: "Open the translator",
    },
  };
  const c = headlines[variant] ?? headlines["hear-your-voice"];
  const baseHref = c.href;
  const href = utm
    ? (baseHref.includes("?") ? `${baseHref}&${utm}` : `${baseHref}?${utm}`)
    : baseHref;

  return (
    <aside className="my-16 rounded-3xl border border-[var(--color-line-strong)] bg-[var(--color-pink-blush)] px-7 py-10 md:px-12 md:py-14">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-merlot)] mb-4">
        {c.eyebrow}
      </div>
      <h2 className="font-display text-3xl md:text-5xl leading-[1.1] text-[var(--color-ink)] mb-5 max-w-[20ch]">
        {c.title}
      </h2>
      <p className="text-[17px] leading-[1.65] text-[var(--color-ink-soft)] max-w-[58ch] mb-7">
        {c.body}
      </p>
      <Link href={href} className="btn-merlot">
        {c.cta}
      </Link>
    </aside>
  );
}

/* ------------------------------ RelatedArticles ------------------------------ */
export function RelatedArticles({
  articles,
}: {
  articles: { slug: string; title: string; description: string; category: string }[];
}) {
  if (!articles.length) return null;
  return (
    <section className="mt-20 border-t border-[var(--color-line)] pt-12">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-mute)] mb-8">
        Keep reading
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/blog/${a.slug}`}
            className="group block rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6 transition hover:border-[var(--color-merlot)]/30 hover:bg-white"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-merlot)] mb-2">
              {a.category}
            </div>
            <h3 className="font-display text-xl leading-[1.25] text-[var(--color-ink)] mb-2 group-hover:text-[var(--color-merlot)] transition">
              {a.title}
            </h3>
            <p className="text-sm leading-[1.55] text-[var(--color-ink-soft)] line-clamp-3">
              {a.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Inline link ------------------------------ */
export function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="link"
    >
      {children}
    </a>
  );
}

/* ------------------------------ MDX components map ------------------------------ */
export const mdxComponents = {
  Callout,
  Citation,
  Stat,
  DefinitionBox,
  PullQuote,
  FAQBlock,
  ArticleHero,
  BodyImage,
  Comparison,
  AppCTA,
  RelatedArticles,
  a: ({ href, children }: { href?: string; children?: ReactNode }) =>
    href ? <InlineLink href={href}>{children}</InlineLink> : <a>{children}</a>,
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="font-display text-3xl md:text-4xl text-[var(--color-ink)] mt-16 mb-5 leading-[1.15]">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="font-display text-2xl text-[var(--color-ink)] mt-10 mb-3 leading-[1.25]">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="text-[18px] md:text-[19px] leading-[1.75] text-[var(--color-ink-soft)] my-5">
      {children}
    </p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="my-6 space-y-2 pl-6 text-[18px] leading-[1.7] text-[var(--color-ink-soft)] list-disc marker:text-[var(--color-merlot)]/60">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="my-6 space-y-2 pl-6 text-[18px] leading-[1.7] text-[var(--color-ink-soft)] list-decimal marker:text-[var(--color-merlot)]/60 marker:font-mono marker:text-sm">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: ReactNode }) => <li className="pl-2">{children}</li>,
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-medium text-[var(--color-ink)]">{children}</strong>
  ),
  em: ({ children }: { children?: ReactNode }) => <em className="italic">{children}</em>,
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="my-8 border-l-2 border-[var(--color-merlot)] pl-6 italic text-[var(--color-ink-soft)] text-[19px] leading-[1.6]">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-16 border-t border-[var(--color-line)]" />,
};
