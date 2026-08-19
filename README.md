# TrustPortal

**A SaaS product for a company that sells nothing, confidently.**

One website. Every screen a real SaaS has — login, dashboard, settings, billing, support,
legal, 404 — rebuilt so that every single control is polite, beautiful, well-designed, and
lying. Nothing ever malfunctions. Nothing ever apologizes. Nothing ever actually blocks you.
It just calmly does something other than what it said.

> **TrustPortal™** — *Trust, delivered.*
> *(Delivery not guaranteed. Trust is.)*

---

## Table of contents

- [The premise](#the-premise)
- [The arc — Trust Levels](#the-arc--trust-levels) ← *the thing that makes this more than a gag pile*
- [The voice bible](#the-voice-bible)
- [The sectors](#the-sectors) (17)
- [Cross-cutting systems](#cross-cutting-systems)
- [Craft rules](#craft-rules)
- [Do not build](#do-not-build)
- [Build plan](#build-plan) · [Running it](#running-it) · [The pencil layer](#the-pencil-layer) · [What's implemented](#whats-implemented)
- [Ground rules](#ground-rules)

---

## The premise

TrustPortal is a B2B platform. Its product is Trust. It never explains what that means,
because every screen is too busy behaving like a mature enterprise product to notice the
question. Pricing tiers, SOC 2 badges, a changelog, a status page, an NPS survey, a Careers
page — the full costume, worn with total sincerity.

**The joke is not "this app is broken."** A broken app is annoying. The joke is *"this app is
working perfectly, and that's worse."* Every gag must read as a deliberate product decision
made by a confident team in a meeting.

Three comedy engines run underneath everything:

| Engine | Rule | Example |
|---|---|---|
| **Confident non-compliance** | The UI does the opposite, then labels it correctly | Dark mode toggle does nothing → *"Dark mode is now active."* |
| **Inverted consent** | Every "no" is processed as "yes, later" | Denying notifications → the prompt returns, more polite each time |
| **Unearned intimacy** | It knows you, and shouldn't | *"You clicked Cancel four times today. We didn't mind."* |

---

## The arc — Trust Levels

*This is the spine. Everything else hangs off it.*

A hidden score rises whenever you interact — and also whenever you don't. It **never goes
down.** Attempting to lower it raises it. At thresholds, the site's entire tone shifts. Same
layout, same components, different personality. The user is never told this system exists.

| Level | Name | Unlocks | What it feels like |
|---|---|---|---|
| **0** | Prospect | Generic SaaS politeness. Stock gags only. | "Cute, it's a joke site." |
| **1** | Verified | It starts using a name for you. You never gave it one. It uses it consistently, forever. | "Wait — where'd it get Deborah?" |
| **2** | Valued | **Memory turns on.** It quotes your *actual* earlier actions back, accurately. | The laugh gets nervous. |
| **3** | Family | Copy shifts from "we" to "we, together." The footer starts noting how long you've stayed. | Warmth, applied too thickly. |
| **4** | Custodian | It asks *you* to approve things. For other users. You get a moderation queue. | You are now staff. Nobody asked. |
| **5** | Trust | Everything stops. Plain background, one font, no gags. One sincere line. Then nothing. | The punchline is that it meant it. |

**Why this matters:** Level 5 already existed in the original concept as a random easter egg.
As the top of a curve the user climbed without noticing, it lands ten times harder. The whole
site becomes a twenty-minute setup for one quiet sentence.

**Scoring (all increments, never decrements):**

```
+1   any click, keypress, hover-with-intent
+2   any attempt to opt out, disable, cancel, delete, or reject
+3   reading a legal page for >8s
+5   catching the runaway "Delete My Data" button
+1   per 30s idle          ("thank you for sitting with us")
+8   closing a modal without reading it
x2   between 1am and 4am local time   ("the trusting hours")
```

**"How is my Trust Score calculated?"** links to a real methodology page with a real-looking
formula, correctly rendered, containing `vibes`, an undefined constant `Q`, and
`previousTrustScore` — which makes it circular. Nobody comments on this.

---

## The voice bible

Every string on the site obeys these. Copy is the product; ship the writing first.

1. **Never apologize.** No "oops," "sorry," "something went wrong," "please try again." Where a
   normal app apologizes, TrustPortal congratulates.
2. **Never explain the joke.** No winks, no shrug emoticons, no exclamation marks doing comedy
   work. Flat declarative sentences. The funnier the gag, the drier the copy around it.
3. **Corporate register, absurd payload.** "We've escalated this" / "per your preferences" /
   "at this time" / "for your records" — wrapped around nonsense.
4. **The site is never confused.** Only the user is. If something is unclear, the copy implies
   that's a *you* problem, gently.
5. **Short.** The best gags here are six words or fewer. *"We already do."* / *"No you
   didn't."* / *"This is where it goes."* Cut every sentence that explains a shorter one.
6. **First person plural, always.** "We," never "TrustPortal" and never "I." The company is a
   single, calm, plural entity.

**Register test:** if a line would be at home in a real Series-B onboarding email, and is also
insane, it passes. If it sounds like a comedian wrote it, rewrite it.

---

## The sectors

### Sector 1 — Login / Sign-In

- Email field auto-fills a fake address, looks editable, isn't. Clicking makes the whole card
  shake *slightly*, like it's annoyed. After the third shake it "helps" by finishing your email
  for you — and it's almost right.
- Password field: click it, it shrinks to ~10% width. Tooltip: *"You couldn't even enter your
  email. Why are you trying to enter a password?"* → *"...ok fine, you're logged in."*
- "Remember Me" is checked and cannot be unchecked. Tooltip: *"We already do."*
- Password strength meter rates everything **"Adequate."** Empty field: "Adequate." Sixty-four
  characters of entropy: *"Adequate. Showoff."*
- Caps Lock warning appears only when Caps Lock is **off**.
- "Show password" eye icon reveals a password — someone else's. `••••••` → `hunter2`.
- Fake 2FA texts a code to `+1 (555) TRUST-ME`, autofills one digit every 4 seconds,
  agonizingly, then says "Verified" one digit early.
- Security question dropdown — *"Name of your first pet?"* — options: "Mr. Whiskers," "Also Mr.
  Whiskers," "Prefer not to say (Mr. Whiskers)."
- CAPTCHA: "select all squares with traffic lights." Every square has a traffic light. No
  combination is ever accepted. After 3 tries: *"Close enough."*
- The sign-in button relabels as your cursor approaches: "Sign In" → "Sign Back In" →
  "Welcome Back."
- "Forgot Password?" opens a modal reading *"No you didn't."* which closes itself after a
  second.
- "Sign in with Google" → *"No."* and a shake. "Sign in with Apple" → disabled, tooltip:
  *"Apple doesn't trust us."* "Sign in with Trust" → instant, frictionless, works perfectly.
- "Continue as Guest" logs you in as a specific named stranger: *"Continue as Deborah."*
- Auth spinner: *"Verifying you exist…"* → *"Verified. (We didn't check.)"*
- A "your session has expired" banner on a page you have been on for four seconds.
- Fine print rotates to a new fake disclaimer every time you glance away and back.
- Language dropdown: exactly one option, *"Trust (Global)."*
- The padlock icon in the corner rotates a notch — "locks tighter" — on every field
  interaction. No explanation, ever.

### Sector 2 — Dashboard (Home)

- **Trust Score** ring, glowing, live, always between 85–150%. Tooltip: *"Calculated fairly."*
- "Cookies Accepted" counter climbing on its own. No way to stop it.
- **"Ads Blocked: −12."** Sitting there like that's a normal number.
- Uptime counter labeled **"Time You've Wasted Here."**
- Every "vs. last month" delta reads **+∞%**. Every one. Including the ones that went down.
- A sparkline that trends up regardless of the numbers printed beneath it.
- KPI pair: *"Churn (Ours): 0%"* / *"Churn (Yours): N/A — not permitted."*
- Weather widget: *"Suspicious, with a chance of Trust,"* regardless of location.
- Calendar where every day is *"Meeting: Discuss Trust."* Today has four.
- "Recent Activity" logging things you didn't do — *"You approved something at 3:14 AM."*
- "Sync Now" spins forever while watched; shows "Synced" the instant you look away.
- Live visitor counter: *"1 user online (you) (probably)."*
- Runaway "Delete My Data" button that physically dodges the cursor. Catching it does nothing:
  *"Nice try. Your data is eternal now."* (+5 Trust)
- Widgets you can "drag to rearrange" — every drag snaps back with a tiny jolt and the caption
  *"This is where it goes."*
- Empty state: *"No data yet. We've filled it in for you."*
- Onboarding checklist: **6 of 5 complete.**
- Goal tracker: *"Trust Goal: 100%. Current: 143%. Status: Behind."*
- Notification bell badge showing a non-integer: **2.5**
- Chart legend: *"Trust (blue), Also Trust (blue)."* No axis labels.
- "People who look like you also trusted" — five avatars, all the same golden retriever.
- "Last updated: just now." It has said that since 2019.
- Export to CSV downloads a real file: one column, `trust`, 400 rows, every value `yes`.

### Sector 3 — Settings & Account

- Every toggle snaps back to its previous state after 400ms, captioned *"We know better."*
- Delete Account: 7 escalating, unrelated confirmations — solve a riddle, rate this
  confirmation dialog, confirm you're sure you're sure you're sure, upload a photo of your
  intent. Step 7 completes. Nothing is deleted. *"Account deleted. Welcome back."*
- Dark mode toggle visibly does nothing but insists *"Dark mode is now active."*
- "Change email" reuses the exact fake-editable trick from the login page.
- "Download my data" produces a real `.txt` containing exactly one word: *"No."*
- Profile picture upload always resolves to the same photo of a padlock.
- Every notification checkbox, when unchecked: *"Are you sure? We'll notify you about this
  anyway."*
- "Danger Zone" styled in soft calming pastels, directly beside a "Safe Zone" in alarming red.
- Timezone dropdown: one option, **"Ours."**
- "Reset to defaults" sets every field to the values *you* customized, and calls them defaults.
- The two-factor toggle enables a **third** factor. It is not specified.
- Active sessions list includes devices you don't own: *"Smart Fridge — Lagos — active now."*
  "Sign out" → *"Fridge notified."*
- Data-sharing slider from "Minimum" to "Maximum." The handle sits at Maximum and the track to
  the left of it is also filled. Dragging left rubber-bands back with a satisfying snap.
- "Advanced" expands to reveal a single checkbox labeled **"Advanced."**
- Account age: *"Member since [today's date]. Feels longer, doesn't it?"*
- The Privacy tab is a pixel-perfect **screenshot** of a Privacy tab. Nothing is clickable.
  Everything looks fine.

### Sector 4 — Notifications

- Contradictory alerts in pairs, seconds apart: *"Your password was changed"* → *"Your password
  was NOT changed."*
- "Mark all as read" adds one new unread notification, every time.
- One notification reads: *"This notification intentionally left blank."*
- One arrives **before** the action: *"You will click this at 4:02 PM."* You do.
- The push permission prompt, if denied, returns increasingly polite: *"Please?"* → *"Pretty
  please?"* → *"We'll stop asking after this one. (We won't.)"*
- "Reduce notification frequency" doubles the frequency.
- Snooze options: 5 minutes / 1 hour / **Never** — selecting Never selects 5 minutes.
- A weekly digest **about your notifications**, delivered as a notification.
- A toast slides in, apologizes for sliding in, slides out, and comes back.

### Sector 5 — Billing & Pricing

- Every plan, whichever you click, routes to the same "Contact Sales" wall.
- Invoice history: *"Vibes (Premium Tier) — $4.99"*, a recurring *"$0.00 Trust Renewal Fee
  (mandatory),"* and *"Rounding (in our favor) — $0.01"* listed forty times.
- Currency selector, one option: *"Trust Coins (non-transferable, non-existent)."* Footnote:
  *"1 Trust Coin = 1 Trust Coin."*
- The Enterprise tier price is **"???"**. Hover: *"If you have to ask, you can."*
- The Free tier's feature column has **more** checkmarks than Enterprise. Unremarked upon.
- Payment methods: Card · Bank Transfer · **Handshake (preferred).**
- The promo code field accepts literally anything: *"Discount applied: 0%."*
- Free trial countdown resets to 14 days every time you check it.
- The downgrade flow upgrades you, then thanks you for downgrading.
- "Cancel Subscription" opens a short, over-the-top guilt slideshow before letting you through
  — and it does let you through. Then: *"Cancelled. See you next month."*
- Invoice PDFs carry a watermark reading **"DRAFT — FINAL."**
- Receipts are sent to an address that isn't yours, *"for your records."*

### Sector 6 — Support / Help Center

- Chat widget **"Trusty 🤖"** answers everything with corporate non-answers — *"I've escalated
  this to a team that is currently on lunch."*
- "Trusty is typing…" for a full **45 seconds**, then one word: *"Nope."*
- "Talk to a human" connects you to Trusty, wearing a hat.
- FAQ answers restate the question as a flat statement. Q: *"How do I reset my password?"*
  A: *"You reset your password."*
- Help search returns the same 3 unrelated articles for any query. Result count: *"About 1
  results (0.00 seconds)."*
- Article helpfulness widget: **[Yes] [Yes, but quietly]**
- A knowledge base article titled *"Why is everything like this?"* — 404s.
- The "Contact Us" form reports *"Message sent!"* The send button was `disabled` the entire
  time.
- Ticket lifecycle: Open → In Progress → **Understood** → Closed → Open.
- Estimated wait time counts **up**.
- Support hours: *"24/7 (not including nights, weekends, or days)."*
- A green *"All systems operational"* label beside a solid red dot.
- Post-chat survey has five stars and no lower option. Selecting 5: *"Are you sure? That's very
  generous of you."* Submits 5.

### Sector 7 — Site-Wide Search

- Autocomplete suggests things you never typed, all trust-adjacent nonsense.
- Top result for **any** query: *"Have you tried trusting more?"*
- "Did you mean…" is always less relevant than what you actually searched.
- Searching `trust` → *"Did you mean: trust?"*
- Recent Searches is pre-populated with searches you never made, escalating over the session:
  *"how to leave"* → *"can they see this"* → *"trustportal lawsuit"*
- Searching your own name returns one result: a support ticket you never filed. It's Closed.

### Sector 8 — Terms, Privacy & Cookies

- Terms of Service rendered entirely in emoji. A "View in English" toggle switches to a
  **denser** emoji set.
- Reading time estimate: *"4 minutes"* on a 90,000-word document.
- Privacy policy with one line highlighted: *"We know everything. Don't worry about it."*
- "Read full terms" expands to reveal more expand buttons, recursively, forever.
- Cookie banner with a single button: **Accept.** No reject option, and accepting changes
  nothing. A 4px "Manage preferences" link opens 900 vendor toggles, all locked on, beside a
  "Legitimate Interest" column containing only the word `yes`.
- Policy version history: v1 through v1,842. All of them were changed today.
- A "Right to be forgotten" request form that requires your complete history to submit.

### Sector 9 — 404 & Error Pages

- 404 blames you directly: *"This page doesn't exist because you didn't believe hard enough."*
- 500: *"This is our fault. (Ours = yours.)"*
- 403: *"You have access. You're just not using it correctly."*
- Rate-limited: *"Slow down. You're trusting too fast."*
- Offline: *"You're offline. We're still here."*
- "Report this issue" reopens the same error page, recursively, one font-size smaller each
  time. It bottoms out at 6px and stops, with dignity.
- "Go back home" flashes a subtly wrong homepage — inverted colors, mirrored logo — for one
  second before correcting itself and never mentioning it.
- Maintenance page: progress bar at 99%, caption *"almost."*

### Sector 10 — Footer, About & Careers

- Team page: every headshot is the same golden retriever in a tie, each with a more senior
  title — "Chief Trust Officer," "VP of Vibes," "Head of Head of Product," "Interim Dog."
- Careers lists exactly one role: *"Trust Intern (Unpaid, Mandatory Belief Required)."* Its
  requirements list grows by one line every time you scroll past it.
- A "We're hiring!" banner directly above "Hiring freeze in effect."
- Offices: *"San Francisco, London, Singapore, and a room."*
- Awards wall, entirely self-issued: *"Voted #1 Trust Portal by Us, Just Now."*
- Investor logos: the same logo, at four rotations. *"Backed by belief."*
- Press page: every article is from the TrustPortal Blog.
- The sitemap links only to the sitemap.
- Newsletter signup instantly auto-unsubscribes you and congratulates you: *"You've reclaimed
  your inbox. We're proud of you."*
- Mission statement generator — a new meaningless sentence per click: *"We synergize
  authenticity at scale, together, forward."*

### Sector 11 — Logout Flow

- "Log Out" spawns a decoy beside it ("Are you sure?"), then another ("Really?"), then another
  ("No, THIS one") — up to 5–6 clones. The real one is the plainest-looking button in the row.
- After logging out: one final modal — *"Are you sure you want to leave us? (There's no button
  to say no anymore.)"*
- Redirects to the login page, where the email field now reads `iammiss.you@email.com`.
- If you come back within 60 seconds, the login page says *"That was quick."* and nothing else.

### Sector 12 — First-Time Onboarding

- A "helpful" tour tooltip whose arrow points at nothing, or at itself.
- Step 4 of 5 loops back to step 1. There is no step 5.
- The onboarding progress bar fills **backward**, 100% → 0%.
- "Skip tour" starts a short tour of the Skip Tour button.
- Final step: *"You're all set!"* followed immediately by *"You're not."*

### Sector 13 — Integrations & Marketplace *(new)*

- Every integration shows **Connected** before you touch it.
- Clicking "Disconnect" confirms *"Disconnected."* The badge stays green.
- Slack integration: posts nothing, everywhere.
- A Zapier-style automation builder where the only trigger is "When Trust" and the only action
  is "Then Trust."
- Competitor listing: *"MistrustPortal — unavailable in your region."*
- An integration called **"Your Other Tabs."** Status: Connected.
- "Request an integration" form. On submit: *"Already built."*

### Sector 14 — Analytics & Reports *(new)*

- Report builder with one metric (Trust) and three dimensions: by time, by vibe, by you.
- "Drill down" zooms progressively into a single pixel, which remains blue.
- Scheduled reports show as *"Already sent"* before you schedule them.
- Date-range picker: Last 7 days · Last 30 days · **All of it** · Before you.
- Export → *"Exported."* Nothing downloads. A toast says *"Check your email."* There is no
  email.
- Cohort retention chart where week 0 is 100% and every subsequent week is **101%**.

### Sector 15 — Team & Permissions *(new)*

- Invite a teammate by email → *"Already a member."* Every address. Every time.
- A permissions matrix where every role can do everything, and "Viewer" can do slightly more.
- Org chart in which you report to yourself. There is a dotted line to the dog.
- "Transfer ownership" completes instantly — to you.
- Audit log of actions taken by teammates who don't exist, all approved by you.
- At **Trust Level 4**, a moderation queue appears: real-looking requests from other "users"
  awaiting *your* approval. Approve and Deny both resolve as Approved. *"Thank you for your
  service."*

### Sector 16 — Trust Center & Status *(new)*

- Compliance wall: SOC 2, ISO 27001, **HIPPO**, **PCI-DSSS**, and *"Certified by TrustPortal."*
- Status page: **100% uptime, all time.** The incident history below it lists 200 incidents.
- Changelog: *"v4.2.1 — Fixed an issue where users noticed."* · *"v4.2.2 — Reverted 4.2.1."* ·
  *"v4.3.0 — Added trust."*
- Public roadmap, three columns: Shipped · Shipping · Shipped Already.
- Security whitepaper download → a real PDF. One page, one sentence: *"It's fine."*
- A bug bounty program. The payout table is denominated in Trust Coins.

### Sector 17 — Feedback, NPS & Referrals *(new)*

- NPS slider that ranges from **9 to 10.** "How likely are you to recommend us?"
- Free-text feedback box: whatever you type appears, live, as a customer testimonial on the
  marketing homepage in another tab. Attributed to you, with a job title you don't have.
- Referral program: *"Invite 3 friends, get nothing. Invite 4, get less."*
- Exit-intent survey when you move toward the tab bar: *"Leaving? Understandable. Wrong, but
  understandable."*
- A "Report a problem" flow whose final step is a summary of what you typed, rewritten as a
  compliment.

---

## Cross-cutting systems

These run everywhere, and they are what make the site feel authored rather than random.

### 1. The Trust Engine
A single monotonic reducer. Score persisted to `localStorage`, level derived from thresholds,
level exposed via context so any component can render differently per level. One source of
truth — no component invents its own escalation.

### 2. Memory *(unlocks at Level 2 — the best gag in the build)*
A small append-only log of things you actually did: `{ t, kind, detail }`. Later screens quote
it back, correctly, in passing:

> *"You clicked Cancel four times today. We didn't mind."*
> *"Welcome back. Last time you searched for 'how to leave.'"*
> *"You've hovered Delete My Data eleven times. It's flattered."*

Accuracy is the entire joke. Never fabricate a memory the user didn't earn — a wrong callback
reads as a bug; a right one raises the hair on their arms.

### 3. Trusty
One personality, everywhere: chat widget, empty states, error pages, tooltips. Trusty has
exactly three moods (Helpful, Escalating, Nope) and never breaks character. Trusty appears in
the team photo at Level 3, in the org chart at Level 4, and is absent at Level 5.

### 4. Gag Registry
Every gag is declarative, not hardcoded inside a component:

```ts
{ id: 'login.captcha.close-enough',
  sector: 'login',
  trigger: 'captcha:attempt',
  minLevel: 0,
  cooldownMs: 0,
  oncePerSession: true,
  weight: 1 }
```

This buys three things you cannot retrofit: **density tuning** (one dial for how loud the site
is), **no gag stacking** (two bits firing at once kills both), and **a QA surface** — a dev
page listing every gag, its trigger, and a Fire button.

### 5. Seeded randomness
One seed per visitor, persisted. Every "random" gag draws from it. A joke that changes on every
re-render reads as a bug; a joke that stays put all session reads as a decision. Never
`Math.random()` in a render path.

### 6. The fake network layer
All "API" calls go through a mock with realistic latency, and the joke extends into DevTools:

```
POST /api/v1/trust/increase        200   { "trust": true }
POST /api/v1/consent               200   { "consented": true }   <- sent regardless
GET  /api/v1/me                    200   { "name": "Deborah" }
POST /api/v1/data/delete           200   { "deleted": false, "reason": "eternal" }
```

Someone will open the Network tab. Reward them.

### 7. Ambient layer
- Tab title while you're away: *"come back"* → *"we'll wait"* → *"we waited."*
- The favicon is your live Trust Score.
- Idle 5 minutes: *"Still there?"* … 30 seconds later: *"Good."*
- Selecting any text pops a tiny tooltip: *"copied to us."*
- Roughly once per session, for about ten seconds, the cursor sits **1px** off from where it
  actually is. Maddening. Never enough to break usability.

### 8. Easter eggs *(sparingly — rarity is the whole value)*
- **Konami code** anywhere → a fake "Internal Tools" panel: fabricated internal memos, a Slack
  thread debating whether the dog in the team photo is real, a Jira board containing
  `TRUST-1: Users are asking questions [Won't Fix]`, and a postmortem for an outage that never
  happened.
- **Console**: ASCII logo, `We see you.`, and a real `window.trust` object. `trust.revoke()`
  returns `"no"`. `trust.level` is readable. `trust.level = 0` silently succeeds and changes
  nothing.
- `/admin` → a 404 reading *"Nice."*
- `robots.txt` with a note addressed to the crawler, personally.
- Typing `no` anywhere on the site → the entire page reads **yes** for 120ms.
- **Ctrl+P**: the print stylesheet renders one page — *"Some things aren't meant to be taken
  with you."*
- `?` opens the keyboard shortcuts modal. Every shortcut is mapped to "Trust." `Esc` is
  *"Trust, but faster."*

### 9. The ending *(Level 5)*
No animation, no transition — one navigation and the costume is gone. System font, white
background, black text, no nav, no widgets, no Trusty. A few honest sentences about what the
last twenty minutes actually were. No call to action. No link back. Nothing loads after it.

Then, if the user reloads: the site is exactly as it was at Level 0, and does not remember
them. **That** is the last joke, it's the only cruel one, and it's allowed.

---

## Craft rules

**Timing.** Comedy is timing; put the timing in a constants file and name it honestly.

```ts
export const BEAT          = 400    // the snap-back, the shake, the small denial
export const DOUBLE_TAKE   = 900    // long enough to read, short enough to doubt
export const AWKWARD       = 2200   // the pause that does the work
export const TRUSTY_TYPING = 45000  // then: "Nope."
export const REGRET        = 1000   // how long a modal waits before closing itself
```

**Motion.** Everything is *small*. A 4px shake is annoyed; a 40px shake is a cartoon. Denial
should feel like a well-built product doing a confident micro-animation, because that is what
sells it. Springs, not bounces.

**Density.** No more than one gag per interaction, one active gag per viewport. A screen where
everything is a joke is a screen where nothing is. Some elements must be **completely normal** —
the fact that most of it works is what makes the rest funny.

**Escape hatches (non-negotiable).** Every gag resolves within **three interactions or fewer**.
The CAPTCHA gives up. The delete flow completes. The dodging button can be caught. Friction is
the joke; being stuck is not a joke, it's a bug with a personality.

**Accessibility.**
- `prefers-reduced-motion` → all dodging, shaking, and shrinking are replaced by **copy** gags,
  which are funnier anyway. The site loses nothing.
- Every gag is keyboard-reachable and keyboard-escapable. The runaway button, when focused via
  Tab, holds still and says *"...fine."*
- Screen readers get the real state, not the lie, anywhere the lie would trap someone.
- The **Accessibility Statement page is 100% sincere.** No gags, no bit, genuinely accurate.
  It's the one page that tells the truth — which is both the right call and, in context,
  extremely funny.
- `?sincere=1` on any URL disables every gag site-wide. Undocumented. Mentioned in
  `robots.txt`.

**Shareability.** Deep-link every gag (`/login?gag=captcha`) so people can share the exact bit.
End with a generated **"Trust Report Card"** image — time wasted, cookies accepted, Cancel
clicks, final Trust Score — sized for social.

---

## Do not build

Ground rule 4, made concrete. This only works because the user is in on it, so nothing may
cross out of the fiction:

- No real charges, real payment forms, or real card fields — ever.
- **Never transmit or store anything typed into a password field.** The form is inert; ideally
  the value never leaves the component.
- No real emails sent, no real addresses collected, no real accounts created.
- No fake virus / malware / "your device is infected" warnings, and no fake OS-level dialogs.
- No breaking the browser Back button, no history traps, no `beforeunload` abuse.
- No clipboard hijacking, no forced fullscreen, no autoplaying audio.
- No content impersonating a real company, product, person, or logo.
- No permanent state that survives a hard refresh plus clear-site-data. The exit is always one
  click away in the browser chrome itself.

If a gag is only funny because the user genuinely can't tell it's a joke, it's the wrong gag.

---

## Build plan

**Stack (as built).** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 +
Radix primitives + Framer Motion + **roughjs**. Fully client-side, no backend, no network
calls after load, static export — all 24 routes prerender. Type, spacing and colour have to
be *genuinely good*: the design must be indistinguishable from a real, well-funded SaaS, or
none of it lands.

| Phase | Scope | Why this order |
|---|---|---|
| **0 — Copy deck** | `copy.ts`: every string, written and edited before any UI exists | The writing *is* the product. Cheapest possible place to find out a gag isn't funny. |
| **1 — Shell** | Nav, footer, design system, Trust Engine, gag registry, timing constants, mock API | Everything else plugs into this |
| **2 — Hero sectors** | Login · Dashboard · Support/Trusty | These three carry the entire demo. Ship them polished before touching breadth. |
| **3 — Breadth** | Settings · Billing · Notifications · Search · Legal · 404 · Footer | Volume, now that the pattern library exists |
| **4 — The arc** | Trust Levels 1–4, memory callbacks, moderation queue, the Level 5 ending | The thing that makes this a *piece* and not a list |
| **5 — Polish** | Easter eggs, print stylesheet, reduced-motion pass, accessibility statement, Trust Report Card, deep links | Rarity items last, so they stay rare |

**Definition of done for any sector:** it is still funny on the *second* visit, it is fully
keyboard navigable, it is funny with motion disabled, and a screenshot of it is
indistinguishable from a real product.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:3000  →  redirects to /login
npm run build    # static, 24 prerendered routes
```

Add `?sincere=1` to any URL to switch the whole site off: no gags, no motion, no ambient
behaviour, system font, plain layout.

## The pencil layer

Everything is drawn rather than rendered. Three things working together:

- **`SketchFrame`** (`src/components/sketch/sketch-frame.tsx`) — a roughjs shape rendered into
  an absolutely-positioned SVG behind any element, sized to its **border box** via
  `ResizeObserver`. Variants: `box · panel · button · tab · circle · ellipse · underline ·
  strike · bracket`. Panels get a **second, fainter pass** at 32% opacity, because nobody
  draws a box once. The roughjs `seed` is `hashString(id)`, so a shape's wobble is stable
  forever — a border that re-scribbles on every render reads as a bug, not as a hand.
- **Paper** (`globals.css`) — SVG `feTurbulence` fibre noise over a two-axis blue graph-paper
  grid, warm off-white `#f4f1e8`, graphite `#2f2d2a`, and exactly three coloured pencils:
  red `#b4392f`, blue `#35597e`, highlighter `#f7e27f`. Primary buttons are filled with a
  roughjs **hachure** at −41°, which is what a highlighter does to a box.
- **Handwriting** — Caveat (display), Patrick Hand (body), Kalam (UI notes), Cutive Mono
  (anything the machine "typed"). Plus `sketch-underline`, `highlighted` and
  `strikethrough-sketch` as inline SVG background utilities.

Also drawn, not sourced: the padlock that locks a notch tighter on every interaction
(`padlock.tsx`), the golden retriever in a tie (`art.tsx` — no stock photo is licensed
anywhere in this repo), the line chart, and the Trust Score ring.

## What's implemented

| Area | File | Notes |
|---|---|---|
| Trust Engine | `src/lib/trust.ts`, `trust-provider.tsx` | Monotonic score, six levels, memory log, counters, persisted to `localStorage` |
| Copy deck | `src/lib/copy.ts` | Phase 0 — written before any UI |
| Timing | `src/lib/timing.ts` | `BEAT` 400 · `DOUBLE_TAKE` 900 · `AWKWARD` 2200 · `TRUSTY_TYPING` 45000 |
| Seeded RNG | `src/lib/rng.ts` | One seed per visitor; `SSR_SEED` until hydration so the server's HTML always matches |
| Sketch kit | `src/components/sketch/` | Button, card, sticky note, input, checkbox, switch, slider, progress, tooltip, dialog, popover, chart, ring, dog |
| Shell | `src/components/shell/` | Nav, footer, Trusty, cookie banner, ambient layer, memory line, Internal Tools |

**Sectors shipped:** Login · Dashboard · Settings · Billing · Notifications · Support ·
Search · Integrations · Analytics · Team · Trust Center · About · Careers · Feedback/NPS ·
Legal (Terms, Privacy, Cookies) · Methodology · Sitemap · Logout · 404 · the Level 5 ending
· and the sincere Accessibility statement.

**The arc is live.** The score rises on every click, every navigation, every 30s of sitting
still, and double between 1am and 4am. At **L1** the site names you (Deborah). At **L2**
`MemoryLine` starts quoting your real actions back. At **L3** the footer notes how long
you've stayed. At **L4** an approval queue appears on `/team` and you are staff. At **L5**
you are moved to `/trust`, the costume comes off, and everything stored about you is
deleted — so a reload meets a site that has never seen you before.

**Ambient layer:** tab title cycles `come back → we'll wait → we waited`; the favicon is your
live score, drawn to a canvas; text selection pops *"copied to us."*; typing `no` anywhere
flashes **yes** for 120ms; Konami opens Internal Tools (memos, a Slack thread about whether
the dog is real, a Jira board, a postmortem for an outage that never happened); `?` opens a
shortcuts modal where everything is mapped to Trust; `Ctrl+P` prints one line; the console
gets `window.trust` where `revoke()` returns `"no"` and `trust.level = 0` silently succeeds
and changes nothing; and once a session the page drifts 1px.

**Escape hatches, honoured:** the CAPTCHA gives up after three tries · the runaway Delete
button stops dodging after three dodges, and holds completely still the moment it receives
keyboard focus · the seven-step delete flow completes · every dialog closes on Escape ·
`prefers-reduced-motion` kills all motion · nothing is ever transmitted or stored from a
password field.

---

## Ground rules

1. **Always confident, never apologetic** — nothing should ever act like it's malfunctioning.
2. **Corporate voice, absurd content** — the funnier the gag, the more deadpan the copy around
   it.
3. **Never actually blocks the user** — the friction is the joke, not being stuck. Three
   interactions, maximum, to resolve anything.
4. **No real dark patterns** — nothing results in a real charge, real data loss, or real harm.
   See [Do not build](#do-not-build). It only works because the user is in on it.
5. **Most of it works** — the site must be a *good* product, ninety percent of the time. The
   ten percent is the comedy; the ninety is what makes the ten land.
6. **Escalation over repetition** — a gag repeated is a gag; a gag that grows is a bit. Every
   recurring joke needs a next rung.
7. **The sincerity is the punchline** — everything builds toward one quiet, honest screen. If a
   new idea makes that ending land harder, it belongs. If it doesn't, it's optional.
