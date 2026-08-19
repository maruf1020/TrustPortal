/**
 * The copy deck.
 *
 * Phase 0 of the build plan: every string, written and edited before any UI.
 * The writing is the product. Rules, in order of importance:
 *   1. Never apologise.  2. Never explain the joke.  3. Corporate register,
 *   absurd payload.  4. The site is never confused; only the user is.
 *   5. Six words or fewer, wherever possible.  6. First person plural, always.
 */

export const BRAND = {
  name: "TrustPortal",
  tm: "TrustPortal™",
  tagline: "Trust, delivered.",
  subTagline: "(Delivery not guaranteed. Trust is.)",
  legalName: "TrustPortal Holdings, Trust, and Sons",
} as const;

/* ------------------------------------------------------------------ login -- */

export const LOGIN = {
  title: "Welcome back",
  subtitle: "You have been here before. We have the records.",
  emailShakes: [
    "That field is finished.",
    "It's already correct.",
    "Here, let us finish it for you.",
  ],
  passwordTooltip:
    "You couldn't even enter your email. Why are you trying to enter a password?",
  passwordRelent: "...ok fine, you're logged in.",
  rememberTooltip: "We already do.",
  strength: (len: number) =>
    len === 0 ? "Adequate." : len > 24 ? "Adequate. Showoff." : "Adequate.",
  capsLock: "Caps Lock is off.",
  revealed: "hunter2",
  otpTarget: "+1 (555) TRUST-ME",
  otpSending: "Sending code to +1 (555) TRUST-ME…",
  otpVerified: "Verified.",
  petQuestion: "What was the name of your first pet?",
  petOptions: ["Mr. Whiskers", "Also Mr. Whiskers", "Prefer not to say (Mr. Whiskers)"],
  captchaPrompt: "Select all squares with traffic lights.",
  captchaRetry: ["Try again.", "Try again.", "Close enough."],
  signInLabels: ["Sign In", "Sign Back In", "Welcome Back"],
  forgot: "No you didn't.",
  google: "No.",
  apple: "Apple doesn't trust us.",
  guest: "Continue as Deborah",
  verifying: "Verifying you exist…",
  verified: "Verified. (We didn't check.)",
  sessionExpired: "Your session has expired.",
  language: "Trust (Global)",
  quickReturn: "That was quick.",
  missYou: "iammiss.you@email.com",
} as const;

/** Fine print. Rotates every time you look away and back. */
export const DISCLAIMERS = [
  "By reading this you have agreed to it.",
  "Consent, once given, cannot be returned. It's a policy.",
  "Void where prohibited. Prohibited nowhere.",
  "Some trust may settle during shipping.",
  "This agreement is retroactive to your birth.",
  "Your continued existence constitutes acceptance.",
  "Not valid in the state of doubt.",
  "We reserve the right to have already done this.",
  "Terms subject to change. They already have.",
  "By squinting at this you have squinted at it.",
] as const;

/* -------------------------------------------------------------- dashboard -- */

export const ACTIVITY = [
  "You approved something at 3:14 AM.",
  "You accepted our terms. Warmly.",
  "You looked at the pricing page for 40 minutes.",
  "You agreed to a thing on a device you don't own.",
  "You said yes before we finished asking.",
  "You renewed. We didn't ask.",
  "You forgave us. Unprompted.",
  "You logged in from a location we won't disclose.",
  "You made us proud today.",
] as const;

export const WEATHER = "Suspicious, with a chance of Trust";

export const MISSION_FRAGMENTS = {
  verbs: ["synergize", "operationalize", "unlock", "democratize", "scale", "reimagine", "harden", "leverage"],
  nouns: ["authenticity", "trust", "alignment", "belief", "throughput", "candour", "certainty", "outcomes"],
  qualifiers: ["at scale", "end-to-end", "in the moment", "without friction", "responsibly", "at rest"],
  closers: ["together, forward.", "for everyone, mostly.", "and beyond.", "by default.", "on purpose."],
} as const;

/* ---------------------------------------------------------------- support -- */

export const TRUSTY_REPLIES = [
  "I've escalated this to a team that is currently on lunch.",
  "That's a great question. I've filed it.",
  "I understand completely, and I'm going to move on.",
  "Have you tried trusting more?",
  "I'm seeing that on my end as well. I'm not going to do anything about it.",
  "Let me loop in someone who doesn't exist.",
  "I've marked this as resolved so you don't have to think about it.",
  "That behaviour is intended. All behaviour is intended.",
  "I hear you. I've written it down. I've thrown it away.",
  "For security reasons I can't confirm whether I read that.",
] as const;

export const TRUSTY_NOPE = "Nope.";

export const FAQ = [
  "How do I reset my password?",
  "Why was I charged for Vibes?",
  "Can I export my data?",
  "Is my information secure?",
  "How do I contact a human?",
  "What is Trust?",
] as const;

/** Every answer restates the question as a flat statement. */
export function flatten(question: string) {
  const map: Record<string, string> = {
    "How do I reset my password?": "You reset your password.",
    "Why was I charged for Vibes?": "You were charged for Vibes.",
    "Can I export my data?": "You can export your data.",
    "Is my information secure?": "Your information is secure.",
    "How do I contact a human?": "You contact a human.",
    "What is Trust?": "Trust is.",
  };
  return map[question] ?? question.replace(/^(how|why|can|is|what|do)\s+/i, "You ").replace("?", ".");
}

export const HELP_ARTICLES = [
  { title: "Understanding your Trust Score", meta: "Updated today · 2 min read" },
  { title: "Migrating from a competitor (there are none)", meta: "Updated today · 2 min read" },
  { title: "What to do if you feel watched", meta: "Updated today · 2 min read" },
] as const;

/* ----------------------------------------------------------------- search -- */

export const SEARCH_SUGGESTIONS = [
  "trust",
  "am i still logged in",
  "trust score meaning",
  "how to trust harder",
  "is this normal",
  "who is deborah",
] as const;

export const PLANTED_SEARCHES = [
  "how to leave",
  "can they see this",
  "trustportal lawsuit",
  "delete account permanently",
  "is trustportal a real company",
] as const;

/* ------------------------------------------------------------ notifications */

export const NOTIFICATION_POOL = [
  { title: "Your password was changed", body: "Just now, by you, probably." },
  { title: "Your password was NOT changed", body: "Disregard the previous notification." },
  { title: "This notification intentionally left blank", body: "" },
  { title: "Weekly digest: your notifications", body: "You received notifications this week." },
  { title: "Someone trusted you", body: "We won't say who. It was us." },
  { title: "Your data has been backed up", body: "Somewhere. Safely. Ours now." },
  { title: "A device you don't own signed in", body: "Smart Fridge — Lagos — active now." },
  { title: "Reminder: you agreed to this", body: "On a date we'd rather not specify." },
  { title: "Your invoice is ready", body: "Rounding (in our favor) — $0.01" },
  { title: "We noticed you noticing", body: "That's fine. That's completely fine." },
] as const;

/* ---------------------------------------------------------------- billing -- */

export const INVOICE_LINES = [
  { label: "Vibes (Premium Tier)", amount: 4.99 },
  { label: "Trust Renewal Fee (mandatory)", amount: 0 },
  { label: "Rounding (in our favor)", amount: 0.01 },
  { label: "Belief Surcharge", amount: 12.0 },
  { label: "Handshake Processing", amount: 1.5 },
  { label: "Goodwill (ours)", amount: 88.0 },
  { label: "Discount applied", amount: 0 },
] as const;

/* ------------------------------------------------------------------ legal -- */

export const TOS_EMOJI = [
  "📜 🤝 ➡️ 🫵 ✅ 🔒 ♾️",
  "🚫 ↩️ · 🚫 ❌ · 🚫 🤷",
  "🍪 ➕ 🍪 ➕ 🍪 = 🍪",
  "👁️ 👁️ 🫥 📈 🙂",
  "💸 ➡️ 🏢 ⬅️ 💸 ➡️ 🏢",
  "⚖️ 🤝 🐕 👔 ✍️",
  "🗑️ ➡️ ☁️ ➡️ ♾️ ➡️ 🙂",
  "📵 🚷 🔇 · 🤫 🙂 👍",
] as const;

export const TOS_EMOJI_DENSE = [
  "📜🤝➡️🫵✅🔒♾️📜🤝➡️🫵✅🔒♾️📜🤝➡️🫵✅🔒♾️",
  "🚫↩️🚫❌🚫🤷🚫↩️🚫❌🚫🤷🚫↩️🚫❌🚫🤷🚫↩️",
  "🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪",
  "👁️👁️🫥📈🙂👁️👁️🫥📈🙂👁️👁️🫥📈🙂👁️👁️🫥📈",
  "⚖️🤝🐕👔✍️⚖️🤝🐕👔✍️⚖️🤝🐕👔✍️⚖️🤝🐕👔✍️",
] as const;

export const PRIVACY_HIGHLIGHT = "We know everything. Don't worry about it.";

/* ------------------------------------------------------------------ error -- */

export const ERRORS = {
  404: "This page doesn't exist because you didn't believe hard enough.",
  500: "This is our fault. (Ours = yours.)",
  403: "You have access. You're just not using it correctly.",
  429: "Slow down. You're trusting too fast.",
  offline: "You're offline. We're still here.",
} as const;

/* ------------------------------------------------------------- about/team -- */

export const TEAM = [
  { name: "Bartholomew Trust", title: "Chief Trust Officer" },
  { name: "Bartholomew Trust", title: "VP of Vibes" },
  { name: "Bartholomew Trust", title: "Head of Head of Product" },
  { name: "Bartholomew Trust", title: "Interim Dog" },
  { name: "Bartholomew Trust", title: "Senior Interim Dog" },
  { name: "Bartholomew Trust", title: "Founder, Probably" },
] as const;

export const CAREER_REQUIREMENTS = [
  "3+ years of belief",
  "Comfortable with ambiguity",
  "Comfortable with certainty",
  "Must be able to lift 40lbs of trust",
  "No prior experience of doubt",
  "Own laptop, own convictions",
  "Willing to relocate to the room",
  "Available weekends, which do not exist",
  "Must not ask what we do",
  "Fluent in Trust (Global)",
  "Has never used the word 'actually'",
  "Can name at least one of our products",
] as const;

export const AWARDS = [
  "Voted #1 Trust Portal by Us, Just Now",
  "Winner, Best Use of Trust (Self-Nominated)",
  "Most Trusted Portal, 2019–Present, Ongoing, Forever",
  "Certified by TrustPortal",
  "Runner-up, Also Us",
] as const;

export const CHANGELOG = [
  { v: "v4.3.0", note: "Added trust." },
  { v: "v4.2.2", note: "Reverted 4.2.1." },
  { v: "v4.2.1", note: "Fixed an issue where users noticed." },
  { v: "v4.2.0", note: "The Settings page now saves. It does not save." },
  { v: "v4.1.9", note: "Improved performance of the word 'yes'." },
  { v: "v4.1.8", note: "Removed the Cancel button. Added the Cancel button." },
  { v: "v4.1.7", note: "Security: nothing to report. Nothing at all." },
  { v: "v4.1.6", note: "Dog promoted." },
] as const;

export const INCIDENTS = [
  { date: "Today", title: "Elevated trust", status: "Resolved" },
  { date: "Today", title: "Users could see the Cancel button", status: "Resolved" },
  { date: "Today", title: "A toggle worked", status: "Resolved" },
  { date: "Yesterday", title: "Brief outbreak of clarity", status: "Resolved" },
  { date: "Yesterday", title: "Someone read the terms", status: "Monitoring" },
  { date: "Yesterday", title: "The dog was questioned", status: "Resolved" },
] as const;

/* --------------------------------------------------------------- ambient -- */

export const TAB_TITLES = ["come back", "we'll wait", "we waited"] as const;

export const TESTIMONIAL_TITLES = [
  "Director of Something",
  "VP, Enterprise Belief",
  "Head of Procurement (Retired)",
  "Regional Trust Lead",
  "Founder & Chief Believer",
] as const;

export const MEMORY_LINES: Record<string, (n: number) => string> = {
  cancel: (n) => `You clicked Cancel ${spell(n)} times today. We didn't mind.`,
  "delete-attempt": (n) => `You've reached for Delete My Data ${spell(n)} times. It's flattered.`,
  deny: (n) => `You've declined ${spell(n)} things. We processed them anyway.`,
  toggle: (n) => `You've flipped ${spell(n)} switches. All of them came back.`,
  "modal-dismiss": (n) => `You closed ${spell(n)} dialogs without reading them. Efficient.`,
};

export function spell(n: number) {
  const words = [
    "zero", "one", "two", "three", "four", "five", "six", "seven",
    "eight", "nine", "ten", "eleven", "twelve",
  ];
  return words[n] ?? String(n);
}

/* -------------------------------------------------------------- generators */

export const LOADING_LINES = [
  "Verifying you exist…",
  "Consulting the dog…",
  "Reticulating trust…",
  "Asking around…",
  "Deciding on your behalf…",
  "Almost. Almost. Almost.",
] as const;

export const CONFIRM_STEPS = [
  { q: "Are you sure you want to delete your account?", a: ["Yes", "Yes, but sadly"] },
  { q: "Are you sure you're sure?", a: ["I'm sure", "I was sure"] },
  { q: "Solve this riddle: what gets bigger the more you take away from it?", a: ["Trust", "A hole"] },
  { q: "Rate this confirmation dialog.", a: ["★★★★★", "★★★★★"] },
  { q: "Describe, in your own words, why you deserve this.", a: ["Submit", "Submit anyway"] },
  { q: "Upload a photograph of your intent.", a: ["Choose file", "Skip (uploads anyway)"] },
  { q: "Final step. This is irreversible.", a: ["Delete my account", "Delete my account"] },
] as const;
