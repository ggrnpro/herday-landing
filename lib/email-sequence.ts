/**
 * HerDay onboarding email sequence — single source of truth.
 *
 * Copy lives here (not in Resend's dashboard) so it stays version-controlled,
 * reviewable, and humanizable, matching the repo's "copy in code" discipline.
 *
 * The drip is driven by our own daily Vercel cron (see app/api/cron/send-sequence),
 * NOT Resend Automations. Resend is delivery + contact storage only.
 *
 * Voice = Lena Hartwell, HerDay's editorial lead (see content/authors/lena-hartwell.mdx):
 *   - Lead with the named study, not "research shows."
 *   - Conditional phrasing for vulnerable claims.
 *   - No toxic positivity, no diet-culture echoes.
 *   - Write to a smart reader, not at her.
 *   - No em dashes (repo rule). Periods, commas, colons.
 *
 * Step 0 (welcome) is sent transactionally the moment someone subscribes.
 * Steps 1..N are sent by the cron when `created_at + delayDays` comes due.
 * The launch email is a MANUAL broadcast (date unknown), not part of this drip.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://getherday.app";

/** Sender persona. Lena is a real author on the site, so this is consistent. */
export const SENDER = {
  name: "Lena from HerDay",
  // EMAIL_FROM is the verified domain sender; Lena's public address is lena@getherday.app.
  // We send from EMAIL_FROM and set Reply-To to Lena so replies reach a real inbox.
  replyTo: "lena@getherday.app",
} as const;

export type SequenceCta = {
  label: string;
  /** Path on the site (absolute URL is built in the template). */
  href: string;
  note?: string;
};

export type SequenceStep = {
  key: string;
  /** Days after signup this step is due. Step 0 = 0 (immediate). */
  delayDays: number;
  /** Image slug -> public/email/<slug>.jpg */
  image: string;
  imageAlt: string;
  eyebrow: string;
  subject: string;
  /** Inbox preview text. */
  preview: string;
  headline: string;
  paragraphs: string[];
  cta?: SequenceCta;
  signoff: string;
};

export const SEQUENCE: SequenceStep[] = [
  // ── 0 · Welcome (immediate, transactional) ──────────────────────────────
  {
    key: "welcome",
    delayDays: 0,
    image: "welcome",
    imageAlt: "A watercolour peony just beginning to open.",
    eyebrow: "You're on the list",
    subject: "You're in. Here's the first small thing.",
    preview: "A note from Lena, and one thing you can try in the next minute.",
    headline: "You're in.",
    paragraphs: [
      "I'm Lena. I edit most of what HerDay publishes, and I'll be the one writing to you while we build toward launch.",
      "Here is what to expect: a short note every few days about the actual research on self-talk. What holds up, what quietly doesn't, and what it means for being a little kinder to yourself on an ordinary Tuesday. No daily-affirmation spam. When HerDay opens to your wave, you'll be among the first to hear.",
      "While you wait, one thing you can do right now. We built a small free tool that writes you five affirmations grounded in real psychology, not the 'I am a money magnet' kind. It takes about a minute.",
    ],
    cta: {
      label: "Try the affirmation generator",
      href: "/tools/affirmation-generator",
      note: "Free. No sign-up.",
    },
    signoff: "More soon,\nLena",
  },

  // ── 1 · The Wood 2009 paradox (delay 2d) ────────────────────────────────
  {
    key: "science-affirmations",
    delayDays: 2,
    image: "science",
    imageAlt: "A watercolour sprig of sage with a soft sound-wave threading through it.",
    eyebrow: "The science of self-talk · 01",
    subject: "Why “I am enough” can backfire",
    preview: "A 2009 study found positive affirmations made some people feel worse. Here is the fix.",
    headline: "When “I am loved” makes it worse",
    paragraphs: [
      "In 2009, a team led by Joanne Wood ran a study that is quietly inconvenient for the whole affirmation industry. People repeated 'I am a lovable person.' The ones who already felt good about themselves felt a little better. The ones who didn't, the people the phrase was meant to help, felt worse.",
      "The reason is simple once you see it. A flat declaration your mind doesn't believe gets rejected on contact. You say 'I am confident,' and some quiet part of you files the rebuttal before you have finished the sentence.",
      "What held up better in later work was conditional language. Not 'I am calm,' but 'I'm learning to steady myself.' Not 'I am enough,' but 'I'm allowed to take up space today.' The door stays open. Your mind has somewhere to walk through.",
      "It is a small shift in grammar that turns out to matter a lot. It is also why every affirmation HerDay writes is phrased as movement, not verdict.",
    ],
    cta: {
      label: "See your inner critic, rephrased",
      href: "/tools/inner-critic-translator",
      note: "Free tool. Paste a harsh thought, get it back in kinder, truer words.",
    },
    signoff: "Lena",
  },

  // ── 2 · Self-distancing + common humanity (delay 5d) ─────────────────────
  {
    key: "science-inner-voice",
    delayDays: 5,
    image: "innervoice",
    imageAlt: "Two watercolour stems intertwined, one bare, one in bloom.",
    eyebrow: "The science of self-talk · 02",
    subject: "The voice that narrates your worst mornings",
    preview: "On self-distancing, and why using your own name can help.",
    headline: "You'd never talk to a friend like that",
    paragraphs: [
      "You know the voice. The one with a full editorial on your character ready before your feet hit the floor. Here is the part worth sitting with: almost everyone has a version of it. Kristin Neff's research on self-compassion keeps landing on the same finding. What helps is not pretending the voice is wrong. It is remembering you are not the only one who hears it.",
      "There is a second move, and it is almost too simple. Ethan Kross found that people who talk to themselves in the second person, using their own name, handle stress measurably better. 'You can do this, Sarah' lands differently than 'I can do this.' The small distance gives you the same steadiness you would offer a friend.",
      "Put the two together and you get something quietly powerful: a kinder voice, in the second person, that sounds like someone who is on your side. Which, it turns out, is a thing you can build.",
    ],
    cta: {
      label: "Write a letter from your future self",
      href: "/tools/future-self-letter",
      note: "Free. She writes back in second person. Stranger and warmer than it sounds.",
    },
    signoff: "Lena",
  },

  // ── 3 · The voice hook + soft product reveal (delay 9d) ──────────────────
  {
    key: "your-own-voice",
    delayDays: 9,
    image: "voice",
    imageAlt: "A watercolour flowering branch whose petals dissolve into a sound wave.",
    eyebrow: "What we're building",
    subject: "What changes when the voice is yours",
    preview: "The last piece of the research, and what HerDay actually does.",
    headline: "In your own voice",
    paragraphs: [
      "One more finding, and it is the one HerDay is built on. We process our own recorded voice differently than a stranger's. It is more familiar, harder to dismiss, and it reaches parts of us that a polished narrator voice slides right past. Hearing a kind sentence in your own voice is not the same as reading it.",
      "So here is what we made. HerDay clones your voice from about thirty seconds of speech, then writes you a short morning passage tuned to what is actually going on in your life, phrased the way the research says works: conditional, second-person, kind. The first thing you hear each day is you, being the friend you would be to anyone else.",
      "It stays on your device. You choose bold or gentle. And it is coming to iPhone soon. You are already on the list, so you will get the invite the day it opens to your wave. I just wanted you to know what you said yes to.",
    ],
    cta: {
      label: "See how it works",
      href: "/#how-it-works",
      note: "No app to download yet. This is just the tour.",
    },
    signoff: "Talk soon,\nLena",
  },
];

/** Highest step index the drip will auto-send. */
export const LAST_STEP = SEQUENCE.length - 1;

export function stepByIndex(i: number): SequenceStep | undefined {
  return SEQUENCE[i];
}

/** Absolute URL for a site path. */
export function url(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Optional override map (JSON in EMAIL_IMAGE_URLS) so assets can be served from
 * a public CDN before the site is deployed (e.g. for inbox testing). Falls back
 * to `${SITE_URL}/email/<slug>.jpg` once the site ships those files.
 */
let IMAGE_OVERRIDES: Record<string, string> = {};
try {
  if (process.env.EMAIL_IMAGE_URLS) IMAGE_OVERRIDES = JSON.parse(process.env.EMAIL_IMAGE_URLS);
} catch {
  IMAGE_OVERRIDES = {};
}

/** Public URL for an email illustration. */
export function imageUrl(slug: string): string {
  return IMAGE_OVERRIDES[slug] || `${SITE_URL}/email/${slug}.jpg`;
}

/** Public URL for Lena's signature avatar. */
export function avatarUrl(): string {
  return IMAGE_OVERRIDES["lena"] || `${SITE_URL}/email/lena.jpg`;
}

export function unsubscribeUrl(token: string): string {
  return `${SITE_URL}/api/unsubscribe?t=${encodeURIComponent(token)}`;
}
