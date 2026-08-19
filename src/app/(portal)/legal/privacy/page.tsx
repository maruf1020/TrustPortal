"use client";

import { useEffect, useState } from "react";
import { useTrust } from "@/lib/trust-provider";
import { PRIVACY_HIGHLIGHT } from "@/lib/copy";
import {
  SketchButton,
  SketchCard,
  SketchHeading,
  SketchRule,
  SketchTextarea,
  StickyNote,
} from "@/components/sketch";

const SECTIONS = [
  {
    h: "What we collect",
    p: "Everything you give us, everything you nearly gave us, and the things you decided against. Decisions are data too.",
  },
  {
    h: "How we use it",
    p: "To improve your experience. Your experience is improving. You may not be able to feel it yet.",
  },
  {
    h: "Who we share it with",
    p: "Partners, sub-partners, sub-sub-partners, and one individual who is not affiliated with us but is very interested.",
  },
  {
    h: "How long we keep it",
    p: "Data is retained for as long as necessary. It has been necessary so far.",
  },
  {
    h: "Your rights",
    p: "You have every right. Exercising a right constitutes consent to us noting that you exercised it.",
  },
];

export default function PrivacyPage() {
  const { trust, remember } = useTrust();
  const [forgetText, setForgetText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => trust("legalRead"), 8000);
    return () => window.clearTimeout(id);
  }, [trust]);

  return (
    <div className="pb-6">
      <SketchHeading level={1}>Privacy Policy</SketchHeading>
      <p className="mt-2 font-note text-sm text-graphite-soft">
        Version 1,842 · changed today · previous 1,841 versions also changed today
      </p>

      <SketchCard sketchId="privacy-card" className="mt-6 max-w-3xl">
        <p className="font-hand text-2xl leading-relaxed">
          <span className="highlighted">{PRIVACY_HIGHLIGHT}</span>
        </p>
        <SketchRule className="my-4" />
        <div className="space-y-4">
          {SECTIONS.map((s) => (
            <div key={s.h}>
              <p className="font-display text-xl">{s.h}</p>
              <p className="font-hand text-[15px] text-graphite-soft">{s.p}</p>
            </div>
          ))}
        </div>
      </SketchCard>

      <SketchCard sketchId="forget-card" className="mt-5 max-w-3xl">
        <p className="font-display text-2xl">Right to be forgotten</p>
        <p className="font-note text-sm text-graphite-soft">
          To be forgotten, please provide your complete history.
        </p>
        <SketchRule className="my-3" />
        <SketchTextarea
          rows={5}
          value={forgetText}
          onChange={(e) => setForgetText(e.target.value)}
          placeholder="Begin at the beginning."
          aria-label="Your complete history"
          sketchId="forget-input"
        />
        <SketchButton
          size="sm"
          className="mt-3"
          sketchId="forget-submit"
          onClick={() => {
            setSubmitted(true);
            trust("optOut");
            remember("deny", "requested to be forgotten");
          }}
        >
          Submit request
        </SketchButton>
        {submitted && (
          <p className="mt-2 font-hand text-[15px] highlighted">
            Request received. We&rsquo;ve added it to your history.
          </p>
        )}
      </SketchCard>

      <StickyNote tone="blue" className="mt-6 max-w-md">
        <p className="font-hand text-[15px]">
          Everything this site stores about you lives in your own browser and is deleted
          the moment you clear site data. That part is true.
        </p>
      </StickyNote>
    </div>
  );
}
