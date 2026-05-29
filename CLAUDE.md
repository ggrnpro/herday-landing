@AGENTS.md

# HerDay landing — project context

Marketing site + blog for **HerDay** iOS app (AI affirmations + voice cloning targeted at women). Site = acquisition funnel for App Store install. No web monetization.

Production: https://getherday.app/
Repo: `ggrnpro/herday-landing` (GitHub) → Vercel
Local: `c:\IVM3\Code\ggrn-ios-herday-landing`

## Stack

- **Next.js 16.2.6** (App Router, Turbopack) — see AGENTS.md: read `node_modules/next/dist/docs/` before assuming API
- **React 19.2.4**, TypeScript 5
- **Tailwind CSS v4** (`@theme` directive in `globals.css`, no separate config file)
- **Motion 12** (Framer Motion successor) — `useInView` + custom `<Reveal>` wrapper
- **next/font/google** — Fraunces (variable, `axes: ["opsz"]`, no `weight`), Inter, JetBrains Mono
- **next/og** — dynamic OG image via `app/opengraph-image.tsx` (edge)
- **MDX blog** — `next-mdx-remote` + `gray-matter` frontmatter
- **Vercel hosting**, no CLI installed locally

## Repo layout

```
app/
  layout.tsx           root: fonts, metadata, favicon link rels, JsonLd
  page.tsx             home: composes 16 sections
  globals.css          design tokens + fog/flower/shimmer keyframes
  robots.ts            allows GPTBot, ClaudeBot, PerplexityBot, etc.
  sitemap.ts           home + blog + categories + authors
  opengraph-image.tsx  edge ImageResponse
  blog/                /blog list + [slug] + author/ + category/
  tools/               /tools/future-self-letter (first free tool)
components/            Nav, Reveal, AnimatedBackground, FlowerField, PhoneMockup, JsonLd, Flower, blog/
sections/              Hero, SocialProof, Problem, HowItWorks, Voice, InnerCritic,
                       VoiceDemo, Letter, Garden, Science, Compare, Pricing,
                       BlogPreview, Tools, FAQ, CTA, Footer
messages/en.ts         ALL copy. i18n-ready (English only now)
lib/content/           articles.ts, types.ts, schema.ts — MDX article loader
content/blog/*.mdx     articles (frontmatter + body)
content/authors/*.mdx  author bios
public/                favicons (RealFaviconGenerator), blog/, authors/
```

## Design system (in `app/globals.css`)

- Palette: cream `#FEF7DF`, merlot `#8A3556` / deep `#6B1923`, pink `#FFB5D2`, lilac
- Type: Fraunces display (italic + opsz axis for shimmer), Inter body, JetBrains Mono for eyebrows
- Glass: `.glass`, `.glass-strong`, `.glass-dark` — backdrop-filter blur + saturate
- Buttons: `.btn-merlot` (solid pill), `.btn-ghost` (outline)
- Animated bg: `.fog-layer` + 7 `.fog-blob` w/ `drift-1..7` keyframes, mouse-reactive via `--mx/--my/--scroll` CSS vars set by `AnimatedBackground.tsx` (RAF lerp)
- Flowers: `.flower-spin`, `.flower-spin-rev`, `.flower-drifter` (cross-screen drift)
- Italic shimmer: `.shimmer-italic` — subtle background-clip:text within brand colors
- Container: `.container-wide` + `.container-narrow`, padding 20px mobile / 32px desktop. **Do NOT add horizontal padding on `.section`** (causes mobile overflow with nav CTA)

## Critical patterns

### Reveal component
`<Reveal>` wraps Motion `useInView`. Has **mount-fallback timer (1200ms)** so headless screenshots / SSR see content visible without scroll trigger. Pattern: `const visible = inView || forceVisible || !mounted`. Don't remove the fallback.

### Mobile vs desktop forms (CTA section)
**Two separate forms** gated by `sm:hidden` / `hidden sm:flex`. Mobile = stacked pills, desktop = combined glass capsule w/ mail icon + inline input + merlot button. Tailwind preflight conflicts made CSS-class-only approach fragile. Keep them separate.

### Nav CTA
Collapses to "Waitlist" on mobile (`sm:hidden`) and "Get the app" on desktop (`hidden sm:inline`). Has `shrink-0 whitespace-nowrap` to prevent horizontal scroll on small viewports.

### Favicon (don't regress)
Source = `public/` (RealFaviconGenerator: 7 files). **Never put `favicon.ico` in `app/`** — Next.js auto-injects it into `<head>` with cache-busting hash that overrides `public/favicon.ico`. Link rels are declared explicitly in `app/layout.tsx` `<head>`.

### Fraunces variable font
Use `axes: ["opsz"]` + `style: ["normal", "italic"]`. **Do NOT add `weight`** — variable fonts error: "Axes can only be defined for variable fonts when the weight property is nonexistent or set to `variable`".

### Container padding rule
- `.container-wide` / `.container-narrow` own horizontal padding
- `.section` owns vertical padding only
- If you add horizontal padding to `.section`, expect mobile overflow

## Analytics

- **Yandex.Metrika** counter `109491579` — webvisor + clickmap + ecommerce dataLayer + accurateTrackBounce + trackLinks
- Wired in `app/layout.tsx` via `next/script` (`strategy="afterInteractive"`) → fires on every route (static, SSG, dynamic)
- `<noscript>` fallback img included for non-JS visitors
- Adding more 3rd-party tags: same pattern (`next/script` in root layout, `afterInteractive` for analytics, `beforeInteractive` only for consent/bot-detection per Next.js docs)

## SEO

- JSON-LD: Organization, MobileApplication, FAQPage, WebSite — wired in `<JsonLd>` (in `<head>`)
- `robots.ts` explicitly allows AI bots (GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, anthropic-ai, Applebot-Extended)
- `sitemap.ts` includes home, blog index, articles, authors, categories
- OG image: `app/opengraph-image.tsx` (dynamic, edge runtime)
- `metadataBase` from `NEXT_PUBLIC_SITE_URL` env (defaults to `https://herday.app`)

## Free-tools strategy

8 tools planned (P1/P2/P3 across 6 sprints). 3-use anonymous limit per tool. Goal = App Store install. No paywall. Voice provider TBD. All text gen via OpenRouter. See `MEMORY.md` for full plan.

First tool live: `/tools/future-self-letter`.

## Ops / dev workflow

- Dev: `npm run dev` (port 3000). If port stuck: `Get-Process node | Stop-Process -Force` then restart.
- Build: `npm run build` (Turbopack)
- **Always clean QA screenshots** (`d-*.png`, `m-*.png`, `og-image-*.png`, `desktop-*.png`) after testing. User rule.
- `.gitignore` covers QA artifacts + `/_docs/`, `/PRODUCT.md`, `/DESIGN.md`, `/.claude/`
- **Don't pipe long-running commands through `head`** — hangs the shell. Use Read tool instead.

## Language

English only currently. Architected i18n-ready (`messages/en.ts` is the single copy source). Don't hardcode strings in components.

## Update discipline

This file is the durable handoff. Update it when:
- Stack version jumps (Next.js, React, Tailwind)
- New section/route/tool added
- Design system token or pattern changes
- A non-obvious bug-fix becomes a "don't regress" rule
- Repo layout shifts
