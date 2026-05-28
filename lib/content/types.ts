/**
 * Blog content type contracts. Keep these in sync with frontmatter
 * conventions in `_docs/content-plan.md` §3.3.
 *
 * MDX frontmatter is parsed by gray-matter; we then validate at load time.
 * If a required field is missing, loader throws at build — fail loud.
 */

export type Pillar = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Cohort = "A" | "B" | "C" | "D" | "E" | "F";

export type Category =
  | "science"
  | "inner-critic"
  | "situational"
  | "how-to"
  | "future-self"
  | "comparison"
  | "voice";

export type CtaVariant = "hear-your-voice" | "tool" | "newsletter" | "next-article";

export interface Citation {
  title: string;
  author: string;
  year: number;
  doi?: string;
  url?: string;
}

export interface ArticleImage {
  file: string;
  alt: string;
  prompt?: string;
  placement?: string;
}

export interface ArticleFrontmatter {
  slug: string;
  title: string;
  seoTitle?: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  category: Category;
  pillar: Pillar;
  cohort: Cohort;
  keywords: {
    primary: string;
    secondary?: string[];
  };
  wordCount?: number;
  readingTime?: number;
  schema?: {
    type: "Article" | "HowTo" | "FAQPage";
    faq?: boolean;
    howTo?: boolean;
    citations?: Citation[];
    faqItems?: { q: string; a: string }[];
  };
  images: {
    hero: ArticleImage;
    body?: ArticleImage[];
  };
  internalLinks?: string[];
  cta?: {
    primary: CtaVariant;
    variant?: string;
  };
}

export interface Article extends ArticleFrontmatter {
  body: string;
}

export interface AuthorFrontmatter {
  slug: string;
  name: string;
  role: string;
  credentials?: string;
  location?: string;
  avatar: string;
  bio: string;
  links?: {
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
  expertise?: string[];
  sameAs?: string[];
}

export interface Author extends AuthorFrontmatter {
  body: string;
}

export const CATEGORY_META: Record<Category, { label: string; description: string }> = {
  science: {
    label: "Science",
    description: "Research that holds up under replication.",
  },
  "inner-critic": {
    label: "Inner critic",
    description: "On the loudest voice in the room — and how to translate her.",
  },
  situational: {
    label: "For this moment",
    description: "Affirmations for the specific season you're in.",
  },
  "how-to": {
    label: "How to",
    description: "Practice notes from the research bench.",
  },
  "future-self": {
    label: "Future self",
    description: "Letters, scripting, and the year you're walking toward.",
  },
  comparison: {
    label: "App comparisons",
    description: "Honest reads on the apps in this category — ours included.",
  },
  voice: {
    label: "Voice & audio",
    description: "Why your own voice changes how self-talk lands.",
  },
};
