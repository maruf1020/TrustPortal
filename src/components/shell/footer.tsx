"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTrust } from "@/lib/trust-provider";
import { AWARDS, BRAND, DISCLAIMERS, MISSION_FRAGMENTS } from "@/lib/copy";
import { dwellPhrase } from "@/lib/trust";
import { pickAt } from "@/lib/rng";
import {
  SketchButton,
  SketchFrame,
  SketchInput,
  SketchRule,
} from "@/components/sketch";

const COLUMNS = [
  {
    title: "Product",
    links: [
      ["Dashboard", "/dashboard"],
      ["Analytics", "/analytics"],
      ["Integrations", "/integrations"],
      ["Team", "/team"],
      ["Pricing", "/billing"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Careers", "/careers"],
      ["Trust Center", "/trust-center"],
      ["Changelog", "/trust-center#changelog"],
      ["Sitemap", "/sitemap"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Terms of Service", "/legal/terms"],
      ["Privacy Policy", "/legal/privacy"],
      ["Cookies", "/legal/cookies"],
      ["Accessibility", "/accessibility"],
      ["Trust Score methodology", "/methodology"],
    ],
  },
] as const;

function mission(n: number) {
  const { verbs, nouns, qualifiers, closers } = MISSION_FRAGMENTS;
  return `We ${pickAt("m-v", verbs, n)} ${pickAt("m-n", nouns, n)} ${pickAt(
    "m-q",
    qualifiers,
    n,
  )}, ${pickAt("m-c", closers, n)}`;
}

export function Footer() {
  const { level, dwellMs, trust, remember } = useTrust();
  const [disclaimerIndex, setDisclaimerIndex] = useState(0);
  const [missionIndex, setMissionIndex] = useState(0);
  const [newsletter, setNewsletter] = useState<string | null>(null);

  // The fine print changes every time you glance away and back.
  useEffect(() => {
    const onFocus = () => setDisclaimerIndex((i) => (i + 1) % DISCLAIMERS.length);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return (
    <footer className="relative mt-20 px-5 pb-16">
      <div className="mx-auto max-w-7xl">
        <SketchRule className="mb-8" id="footer-rule" />

        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="font-display text-3xl">{BRAND.tm}</p>
            <p className="font-note text-sm text-graphite-soft">{BRAND.tagline}</p>
            <p className="font-note text-xs text-graphite-faint">{BRAND.subTagline}</p>

            <div className="relative mt-5 max-w-sm">
              <p className="font-note text-sm text-graphite-soft">Our mission</p>
              <p className="mt-1 min-h-[3rem] font-hand text-[15px] italic">
                &ldquo;{mission(missionIndex)}&rdquo;
              </p>
              <SketchButton
                size="sm"
                variant="quiet"
                sketchId="mission-btn"
                onClick={() => {
                  setMissionIndex((i) => i + 1);
                  trust("interact");
                }}
              >
                Generate another
              </SketchButton>
            </div>

            <div className="mt-6 max-w-sm">
              <p className="font-note text-sm text-graphite-soft">Newsletter</p>
              {newsletter ? (
                <p className="mt-1 font-hand text-[15px] highlighted">{newsletter}</p>
              ) : (
                <form
                  className="mt-1 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setNewsletter(
                      "You've reclaimed your inbox. We're proud of you.",
                    );
                    remember("deny", "unsubscribed from a newsletter they never joined");
                    trust("optOut");
                  }}
                >
                  <SketchInput
                    type="email"
                    placeholder="you@work.email"
                    aria-label="Email address"
                    sketchId="newsletter-input"
                  />
                  <SketchButton size="sm" type="submit" sketchId="newsletter-btn">
                    Join
                  </SketchButton>
                </form>
              )}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-display text-xl">{col.title}</p>
              <ul className="mt-2 space-y-1.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-hand text-[15px] text-graphite-soft transition-colors hover:text-redpencil"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="relative p-4">
            <SketchFrame id="awards-box" variant="box" strokeWidth={1.2} roughness={2.4} />
            <p className="relative z-10 font-note text-xs uppercase tracking-widest text-graphite-faint">
              Awards
            </p>
            <ul className="relative z-10 mt-1 space-y-0.5">
              {AWARDS.map((a) => (
                <li key={a} className="font-hand text-sm">
                  🏆 {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative p-4">
            <SketchFrame id="offices-box" variant="box" strokeWidth={1.2} roughness={2.4} />
            <p className="relative z-10 font-note text-xs uppercase tracking-widest text-graphite-faint">
              Offices
            </p>
            <p className="relative z-10 mt-1 font-hand text-sm">
              San Francisco · London · Singapore · and a room
            </p>
            <p className="relative z-10 mt-2 font-note text-xs text-graphite-faint">
              Backed by belief.
            </p>
          </div>
        </div>

        <SketchRule className="my-8" id="footer-rule-2" />

        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <p className="font-note text-xs text-graphite-faint">
            © {new Date().getFullYear()} {BRAND.legalName}. All rights reserved, including
            yours.
          </p>
          <p key={disclaimerIndex} className="scribble-in font-note text-xs text-graphite-faint">
            {DISCLAIMERS[disclaimerIndex]}
          </p>
        </div>

        {level >= 3 && (
          <p className="mt-5 text-center font-hand text-[15px] text-graphite-soft">
            You&rsquo;ve been here {dwellPhrase(dwellMs)}. That&rsquo;s longer than most.
          </p>
        )}
        {level >= 4 && (
          <p className="mt-1 text-center font-hand text-[15px] text-graphite-soft">
            We&rsquo;re not saying that to make you leave.
          </p>
        )}
      </div>
    </footer>
  );
}
