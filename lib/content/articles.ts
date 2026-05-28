import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  Article,
  ArticleFrontmatter,
  Author,
  AuthorFrontmatter,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const BLOG_DIR = path.join(CONTENT_DIR, "blog");
const AUTHORS_DIR = path.join(CONTENT_DIR, "authors");

function readDirSafe(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
}

function estimateReadingTime(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function getAllArticles(): Article[] {
  const files = readDirSafe(BLOG_DIR);
  const articles = files.map((file) => {
    const filePath = path.join(BLOG_DIR, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const fm = data as ArticleFrontmatter;
    if (!fm.slug || !fm.title || !fm.publishedAt) {
      throw new Error(`Article ${file}: missing required frontmatter (slug/title/publishedAt)`);
    }
    return {
      ...fm,
      body: content,
      readingTime: fm.readingTime ?? estimateReadingTime(content),
      wordCount: fm.wordCount ?? content.split(/\s+/).filter(Boolean).length,
    } as Article;
  });
  return articles.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getArticleBySlug(slug: string): Article | null {
  const all = getAllArticles();
  return all.find((a) => a.slug === slug) ?? null;
}

export function getRelatedArticles(slug: string, ids: string[] = [], limit = 3): Article[] {
  const all = getAllArticles();
  const current = all.find((a) => a.slug === slug);
  if (!current) return [];

  const byId = ids
    .map((id) => all.find((a) => a.slug === id))
    .filter((a): a is Article => !!a && a.slug !== slug);

  if (byId.length >= limit) return byId.slice(0, limit);

  const sameCategory = all
    .filter((a) => a.slug !== slug && a.category === current.category && !byId.some((b) => b.slug === a.slug))
    .slice(0, limit - byId.length);

  return [...byId, ...sameCategory].slice(0, limit);
}

export function getAuthor(slug: string): Author | null {
  const filePath = path.join(AUTHORS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as AuthorFrontmatter;
  return { ...fm, body: content } as Author;
}

export function getAllAuthors(): Author[] {
  const files = readDirSafe(AUTHORS_DIR);
  return files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const author = getAuthor(slug);
    if (!author) throw new Error(`Author ${slug} unreadable`);
    return author;
  });
}
