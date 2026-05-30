/**
 * HerDay landing copy. Single source for English.
 * Structured for i18n: when adding locales, copy this file and translate values.
 *
 * Voice & tone:
 *  - Intimate, not clinical. Warm, not saccharine.
 *  - Speaks TO her, not AT her. Never marketing-speak.
 *  - Conditional language for vulnerable claims ("learning to" not "you are").
 *  - Specific over abstract. No "elevate your wellness journey."
 *  - No em dashes. Periods, commas, colons, semicolons.
 */

export const copy = {
  brand: {
    name: "HerDay",
    tagline: "The other voice. Yours, but kind.",
    domain: "getherday.app",
  },

  nav: {
    voice: "Your voice",
    letters: "Letters",
    science: "Science",
    reading: "Journal",
    tools: "Tools",
    pricing: "Pricing",
    faq: "FAQ",
    download: "Get the app",
  },

  hero: {
    eyebrow: "Coming soon · for iPhone",
    title: {
      pre_before_rotor: "You already have a voice inside that says",
      rotor: ["cruel things", "mean lies", "quiet doubts", "old stories"],
      pre_after_rotor: ".",
      em: "HerDay is the other one.",
    },
    deck:
      "A morning ritual built on your own voice. Softened, steadied, and written by an AI that learned what matters to you, so the first thing you hear each day is yourself, being kind.",
    cta_primary: "Join the waitlist",
    cta_secondary: "Hear a sample",
    meta: [
      { label: "Voice", value: "Cloned in 30 seconds" },
      { label: "Tone", value: "Bold or gentle" },
      { label: "Privacy", value: "Stays on your device" },
      { label: "Built on", value: "Real psychology" },
    ],
  },

  socialProof: {
    eyebrow: "Built on what already works for women like you",
    items: [
      "Self-affirmation theory · Claude Steele, Stanford",
      "Future-self continuity · Hal Hershfield, UCLA",
      "Self-distancing · Ethan Kross, Michigan",
      "Conditional language · Wood, Perunovic & Lee",
      "Self-compassion · Kristin Neff",
    ],
  },

  problem: {
    eyebrow: "Why most affirmation apps don't land",
    title: { pre: "If saying ", em: "“I am enough”", post: " worked, you'd already be done." },
    body:
      "For women carrying a loud inner critic, generic affirmations often backfire. The brain hears the gap between the claim and the felt truth, and the critic wins louder. Wood, Perunovic & Lee (2009) called this paradox out fifteen years ago. Most apps still ignore it.",
    points: [
      {
        title: "One library for everyone",
        body: "A thousand quotes by category isn't a ritual. It's a vending machine.",
      },
      {
        title: "Declarative when you can't believe it",
        body: "“I am lovable” becomes evidence you aren't, when self-esteem is already low.",
      },
      {
        title: "Strangers' voices",
        body: "Recorded actors and TTS narrators are pleasant. They aren't you.",
      },
    ],
  },

  howItWorks: {
    eyebrow: "How HerDay works",
    title: { pre: "Three quiet things, ", em: "every morning" },
    deck:
      "We took the parts of the science that hold up under scrutiny, and built one short ritual around them. No streak shame. No 1,000-quote library. No notification noise.",
    steps: [
      {
        n: "01",
        title: "We listen first",
        body:
          "A six-question intake asks what you care about, not just what's wrong. You read a short paragraph aloud. That's all we need to clone your voice through ElevenLabs.",
        why: "Self-affirmation theory: affirmations work when they touch a core value, not when they're abstract.",
      },
      {
        n: "02",
        title: "A letter, in your voice",
        body:
          "Each morning you receive a 30-second message written for the specific season you're in. Voiced by you, addressed by name, conditional when you need it.",
        why: "Self-distancing: hearing yourself addressed by name lowers anxiety and improves performance.",
      },
      {
        n: "03",
        title: "It grows with you",
        body:
          "On Fridays, a longer letter arrives from yourself a year from now, looking back at the week you just had. The garden behind your home screen blooms as the weeks go.",
        why: "Future-self continuity: the more connected you feel to her, the more you invest in becoming her.",
      },
    ],
  },

  voice: {
    eyebrow: "Your voice, softened",
    title: { pre: "The strongest thing your morning can hear is ", em: "you, being patient with you." },
    body:
      "We record about thirty seconds of you reading a short paragraph aloud. ElevenLabs builds a voice model that sounds like you on a steady day. Then the morning letter is rendered in that voice: slower, warmer, never imitating distress.",
    points: [
      "Cloned only with your consent, on-device storage by default.",
      "Delete the clone in one tap. No copies retained.",
      "Choose tone: bold, gentle, or steady. Switch any morning.",
      "Skip the clone entirely. Eight curated voices included.",
    ],
    quote: {
      text: "I didn't think I could be moved by my own voice. The first morning I forgot it was me.",
      attr: "Beta listener · 28, marketing",
    },
  },

  innerCritic: {
    eyebrow: "Against the loudest voice in the room",
    title: { pre: "Most apps decorate the critic. ", em: "We translate her." },
    body:
      "Every HerDay morning runs through what we call a conditional pass. If the intake suggests a heavy inner critic, the language softens automatically: “you are kind” becomes “you are learning to be kinder to yourself.” It's a small change. The research behind it isn't.",
    citation: {
      label: "Source",
      text: "Wood, Perunovic & Lee, “Positive Self-Statements: Power for Some, Peril for Others” (2009).",
    },
  },

  letter: {
    eyebrow: "Friday letters",
    title: { pre: "A note from you, ", em: "one year from now." },
    body:
      "On Fridays, HerDay writes a longer letter from a future version of you, looking back at the week you just had. She remembers the specific Thursday. She knows what you didn't get. She is generous with you because she's already lived through it.",
    sample: {
      label: "Sample letter · week 6",
      text: "Hi, Maddie. I know this week felt like waiting for nothing. But I'm writing from the other side of it. The job you didn't get, it cleared the path for the one you did. Keep showing up softly. I'm proud of how you held this week.",
    },
  },

  garden: {
    eyebrow: "What grows when you keep showing up",
    title: { pre: "Not a pet. Not a streak. ", em: "A garden." },
    body:
      "Most habit apps shame you with broken streaks or guilt you with cute pets that ask if you're okay. We chose a quieter metaphor. Listen to your morning, and something grows behind your home screen. Skip a week, and it waits for you. Nothing dies.",
    points: [
      "Eight blooms unlock as you build the practice.",
      "No streak counters. No red numbers. No begging.",
      "Your garden is private. You choose what to share.",
    ],
  },

  science: {
    eyebrow: "Built on research that actually replicated",
    title: { pre: "We took ", em: "the science seriously" },
    deck:
      "Most wellness apps decorate their pages with the word “neuroscience.” We built the product around four findings that survived replication and meta-review.",
    studies: [
      {
        title: "Affirmations work when they touch a value, not when they're abstract",
        attr: "Claude Steele · Stanford · 1988",
        body:
          "Steele's self-affirmation theory: writing about a core value (relationships, growth, faith) before a threat reduces defensiveness and changes behavior. Cascio et al. (2016) confirmed activation in vmPFC and ventral striatum via fMRI.",
      },
      {
        title: "We invest in our future selves in proportion to how connected we feel to her",
        attr: "Hal Hershfield · UCLA · 2011",
        body:
          "Participants shown an aged image of themselves allocated 30% more to retirement. We use the same mechanism with audio: hearing your own voice from a year ahead is the strongest version of this lever ever built into a consumer app.",
      },
      {
        title: "Talking to yourself by name lowers anxiety and improves performance",
        attr: "Ethan Kross · Michigan · 2014",
        body:
          "Second-person self-talk creates psychological distance from distress. “You'll be okay, Maddie” works measurably better than “I'll be okay.” Our letters are always addressed.",
      },
      {
        title: "For low self-esteem, declarative affirmations backfire",
        attr: "Wood, Perunovic & Lee · 2009",
        body:
          "“I am loved” can deepen rumination if you can't yet believe it. We use conditional phrasing (“I am learning to”) for users whose intake suggests the critic is loud. Two-thirds of our copy is conditional by default.",
      },
    ],
  },

  compare: {
    eyebrow: "How HerDay is different",
    title: { pre: "Not another quote app. ", em: "Not another habit pet." },
    rows: [
      { feature: "Voice you hear", herday: "Yours, cloned", others: "Actors, TTS, or your raw recording" },
      { feature: "Personalisation", herday: "Written for today, against your values", others: "Pick from a category" },
      { feature: "Tone when you're fragile", herday: "Conditional, automatic", others: "Declarative by default" },
      { feature: "Retention metaphor", herday: "Garden that waits", others: "Streaks, pets, badges" },
      { feature: "Paywall behaviour", herday: "Once, never again", others: "Every screen" },
      { feature: "What lives where", herday: "Audio on-device by default", others: "Cloud, often opaque" },
    ],
  },

  pricing: {
    eyebrow: "Honest pricing",
    title: { pre: "One subscription. ", em: "No upsells." },
    body:
      "We don't sell coaching add-ons, premium tiers, or sleep-story bundles. One price, two ways to pay. Cancel inside the app. No email, no chatbot.",
    plans: [
      { name: "Monthly", price: "$9.99", period: "per month", note: "Try it for a week, free." },
      { name: "Yearly", price: "$59.99", period: "per year", note: "Most people choose this.", featured: true },
      { name: "Lifetime", price: "$149", period: "one time", note: "For when you know." },
    ],
    fineprint:
      "Trial reminder lands 48 hours before charge. Notifications stop the day you uninstall. Your voice clone deletes with one tap.",
  },

  faq: {
    eyebrow: "Honest answers",
    title: { pre: "Things you might ", em: "be wondering" },
    items: [
      {
        q: "Will my voice ever be used to train other models?",
        a: "No. Your voice clone is generated, stored, and used only for you. We don't pool it. You can delete it from your device at any moment, and the cloud copy goes with it.",
      },
      {
        q: "What if I sound exhausted on the recording?",
        a: "We ask you to read one calm paragraph at a moment of your choosing. The model learns your timbre, not your mood. The morning voice is steadier than the source recording, by design.",
      },
      {
        q: "Why audio instead of just text?",
        a: "Hearing your own voice from a year ahead is the strongest version of future-self continuity ever built into a consumer app. Text helps. Audio lands.",
      },
      {
        q: "Is this therapy?",
        a: "No. HerDay is a daily ritual, not clinical care. If you're carrying something heavy, please also speak with a therapist. We list a few we trust in the app.",
      },
      {
        q: "Is the AI-written copy generic?",
        a: "Every morning letter is generated against your intake answers, your tone preference, and the season you're in. You can rate any morning's letter, and we use that signal to tune yours, not anyone else's.",
      },
      {
        q: "When does it launch?",
        a: "We're in private beta. Waitlist members get first access in Q3, with a free month of voice cloning included.",
      },
    ],
  },

  cta: {
    eyebrow: "Quiet thing for noisy mornings",
    title: { pre: "Hear yourself ", em: "being kind tomorrow." },
    body:
      "Join the waitlist. You'll get the science weekly read (short, no spam) and an invite the day HerDay opens to your wave.",
    placeholder: "your@email.com",
    button: "Join the waitlist",
    fineprint: "We email about HerDay only. Unsubscribe in one click.",
  },

  footer: {
    tagline: "The other voice. Yours, but kind.",
    nav: {
      product: { label: "Product", items: ["How it works", "Voice cloning", "Letters", "The garden"] },
      science: { label: "Science", items: ["Why affirmations work", "Conditional language", "Future-self research", "Self-compassion"] },
      company: { label: "Company", items: ["About", "Privacy", "Terms", "Press"] },
      tools: { label: "Free tools", items: ["Affirmation generator", "Letter from future self", "Inner critic translator", "Morning mantra builder"] },
    },
    copyright: "© 2026 HerDay. Made carefully.",
  },
} as const;

export type Copy = typeof copy;
