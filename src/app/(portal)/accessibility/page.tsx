import type { Metadata } from "next";

export const metadata: Metadata = { title: "Accessibility statement" };

/**
 * The one page on this site that tells the truth.
 * No gags, no voice, no bit. Everything below is accurate.
 */
export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-2xl pb-12 font-sans" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <h1 className="text-3xl font-semibold" style={{ fontFamily: "inherit" }}>
        Accessibility statement
      </h1>
      <p className="mt-4 leading-relaxed">
        TrustPortal is a satirical website. Every other page on it is written to be
        confidently wrong. This page is not. Everything below is accurate, and if any of it
        turns out to be false, that is a bug rather than a joke.
      </p>

      <h2 className="mt-8 text-xl font-semibold">What we do</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
        <li>
          <b>Reduced motion is respected.</b> If your system requests reduced motion, every
          animation on the site is disabled — including the button that runs away from your
          cursor. The jokes that depend on movement are replaced by jokes that depend on
          words.
        </li>
        <li>
          <b>Nothing is keyboard-inaccessible.</b> Every interactive element can be reached
          and operated with a keyboard. The dodging &ldquo;Delete My Data&rdquo; button
          stops dodging the moment it receives keyboard focus.
        </li>
        <li>
          <b>Nothing traps you.</b> Every gag resolves within three interactions at most.
          The CAPTCHA gives up. The confirmation flow completes. No dialog blocks Escape,
          and the browser Back button always works.
        </li>
        <li>
          <b>Screen readers get the real state.</b> Where a control lies visually, its
          accessible name and state describe what is actually true — for example, the
          pre-filled email field is announced as read-only.
        </li>
        <li>
          <b>Focus is always visible.</b> A dashed outline marks the focused element on
          every surface.
        </li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">The exit</h2>
      <p className="mt-3 leading-relaxed">
        Adding <code className="rounded bg-black/5 px-1">?sincere=1</code> to any URL on
        this site disables every joke, every animation and every piece of ambient
        behaviour, and renders the page in a plain, high-contrast, system-font layout. It
        works on every page, it is not hidden behind any interaction, and it persists for
        as long as the parameter is in the address bar.
      </p>

      <h2 className="mt-8 text-xl font-semibold">What we store</h2>
      <p className="mt-3 leading-relaxed">
        Your Trust Score, a randomly generated visitor seed, and a short local log of
        actions you took on this site — used so that later pages can quote them back to
        you. All of it is kept in your own browser&rsquo;s <code>localStorage</code>. None
        of it is transmitted anywhere; this site has no backend and makes no network
        requests after the page loads. Clearing site data deletes all of it permanently.
      </p>

      <h2 className="mt-8 text-xl font-semibold">What we never do</h2>
      <p className="mt-3 leading-relaxed">
        No real charges, no real payment fields, no real emails, no account creation. Text
        typed into the password field is never transmitted or stored. There are no fake
        virus warnings, no fake system dialogs, no clipboard interference, no forced
        fullscreen, no autoplaying audio, and no interference with browser history.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Known gaps</h2>
      <p className="mt-3 leading-relaxed">
        The hand-drawn borders are rendered as decorative SVG and are hidden from assistive
        technology, which is intended. Some deliberately absurd copy (an org chart in which
        you report to yourself, a slider that spans 9 to 10) will read as nonsense in a
        screen reader, because it is nonsense on screen too.
      </p>

      <p className="mt-8 leading-relaxed">
        If something here is inaccessible in a way this page doesn&rsquo;t describe, that
        is not part of the joke and we would like to fix it.
      </p>
    </div>
  );
}
