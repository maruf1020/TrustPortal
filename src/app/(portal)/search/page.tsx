"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTrust } from "@/lib/trust-provider";
import { PLANTED_SEARCHES, SEARCH_SUGGESTIONS } from "@/lib/copy";
import { pickAt } from "@/lib/rng";
import {
  SketchButton,
  SketchCard,
  SketchFrame,
  SketchHeading,
  SketchInput,
  SketchRule,
  StickyNote,
} from "@/components/sketch";

const FILLER_RESULTS = [
  { title: "Understanding your Trust Score", url: "trustportal.example › help › trust" },
  { title: "Migrating from a competitor (there are none)", url: "trustportal.example › help › migrate" },
  { title: "What to do if you feel watched", url: "trustportal.example › help › watched" },
];

function SearchInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { trust, remember, displayName, level } = useTrust();
  const q = params.get("q") ?? "";
  const [draft, setDraft] = useState(q);
  const [focused, setFocused] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => setDraft(q), [q]);

  // Recent Searches is pre-populated, and escalates the longer you stay.
  useEffect(() => {
    setRecent(PLANTED_SEARCHES.slice(0, 2));
    const id = window.setInterval(() => {
      setRecent((r) =>
        r.length >= PLANTED_SEARCHES.length ? r : PLANTED_SEARCHES.slice(0, r.length + 1),
      );
    }, 25_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (q) remember("search", q);
  }, [q, remember]);

  const didYouMean = useMemo(() => {
    if (!q) return null;
    if (q.trim().toLowerCase() === "trust") return "trust";
    return pickAt("dym", ["trust", "trusts", "trusting", "trustworthy", "thrust", "rust"], q.length);
  }, [q]);

  const isSelfSearch =
    q.trim().length > 2 &&
    (displayName.toLowerCase().includes(q.trim().toLowerCase()) ||
      q.trim().toLowerCase().includes(displayName.toLowerCase()));

  const submit = (value: string) => {
    trust("interact");
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  return (
    <div className="pb-6">
      <SketchHeading level={1}>Search</SketchHeading>

      <div className="relative mt-6 max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(draft);
          }}
          className="flex gap-2"
        >
          <SketchInput
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 180)}
            placeholder="Search everything…"
            aria-label="Search"
            sketchId="search-main"
          />
          <SketchButton variant="primary" type="submit" sketchId="search-go">
            Search
          </SketchButton>
        </form>

        {focused && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1 scribble-in bg-paper p-2">
            <SketchFrame id="search-suggest" variant="box" strokeWidth={1.3} />
            <div className="relative z-10">
              <p className="px-2 font-note text-[11px] uppercase tracking-widest text-graphite-faint">
                Suggestions
              </p>
              {SEARCH_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className="block w-full px-2 py-1 text-left font-hand hover:text-redpencil"
                  onMouseDown={() => submit(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {q && (
        <div className="mt-7 max-w-2xl">
          <p className="font-note text-xs text-graphite-faint">
            About 1 results (0.00 seconds)
          </p>
          {didYouMean && (
            <p className="mt-1 font-hand text-[15px]">
              Did you mean:{" "}
              <button
                className="text-bluepencil sketch-underline"
                onClick={() => submit(didYouMean)}
              >
                {didYouMean}
              </button>
              ?
            </p>
          )}

          <SketchRule className="my-4" />

          {/* The top result, for any query ever entered. */}
          <div className="relative px-5 py-4">
            <SketchFrame id="top-result" variant="box" strokeWidth={1.8} />
            <div className="relative z-10">
              <p className="font-note text-[11px] uppercase tracking-widest text-graphite-faint">
                Top result
              </p>
              <p className="font-display text-3xl">Have you tried trusting more?</p>
              <p className="font-note text-xs text-graphite-faint">
                trustportal.example › answers › yes
              </p>
            </div>
          </div>

          {isSelfSearch && (
            <div className="relative mt-4 px-5 py-4">
              <SketchFrame id="self-result" variant="box" stroke="#b4392f" strokeWidth={1.5} />
              <div className="relative z-10">
                <p className="font-note text-[11px] uppercase tracking-widest text-redpencil">
                  1 record
                </p>
                <p className="font-hand text-[17px]">
                  Support ticket <span className="font-typed text-sm">TP-0000</span> —
                  filed by {displayName}
                </p>
                <p className="font-note text-sm text-graphite-soft">
                  Subject: (none). Status: Closed. Filed: before your account existed.
                </p>
              </div>
            </div>
          )}

          <div className="mt-5 space-y-4">
            {FILLER_RESULTS.map((r) => (
              <div key={r.title}>
                <p className="font-hand text-[17px] text-bluepencil sketch-underline">{r.title}</p>
                <p className="font-note text-xs text-graphite-faint">{r.url}</p>
                <p className="font-hand text-[15px] text-graphite-soft">
                  This result is not related to your search. It is related to us.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid max-w-4xl gap-5 md:grid-cols-2">
        <SketchCard sketchId="recent-searches">
          <p className="font-display text-2xl">Recent searches</p>
          <SketchRule className="mb-2" />
          <ul className="space-y-1">
            {recent.map((r) => (
              <li key={r}>
                <button
                  className="font-hand text-[15px] text-graphite-soft hover:text-redpencil"
                  onClick={() => submit(r)}
                >
                  ↩ {r}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 font-note text-xs text-graphite-faint">
            Synced across your devices.
          </p>
        </SketchCard>

        {level >= 2 && (
          <StickyNote tone="blue">
            <p className="font-hand text-[15px]">
              You have searched {recent.length} things you don&rsquo;t remember searching.
              We remember all of them.
            </p>
          </StickyNote>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="font-hand">Searching…</p>}>
      <SearchInner />
    </Suspense>
  );
}
