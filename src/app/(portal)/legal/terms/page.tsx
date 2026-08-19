"use client";

import { useEffect, useState } from "react";
import { useTrust } from "@/lib/trust-provider";
import { TOS_EMOJI, TOS_EMOJI_DENSE } from "@/lib/copy";
import {
  SketchButton,
  SketchCard,
  SketchHeading,
  SketchRule,
  StickyNote,
} from "@/components/sketch";

/** "Read full terms" reveals more expand buttons. Recursively. Forever. */
function Expander({ depth = 0 }: { depth?: number }) {
  const [open, setOpen] = useState(false);
  const { trust } = useTrust();
  if (depth > 6) {
    return (
      <p className="font-note text-xs text-graphite-faint">
        (continues)
      </p>
    );
  }
  return (
    <div style={{ marginLeft: depth * 14 }}>
      <SketchButton
        size="sm"
        variant="quiet"
        bare
        sketchId={`expand-${depth}`}
        onClick={() => {
          setOpen((o) => !o);
          trust("interact");
        }}
      >
        {open ? "▾" : "▸"} Read full terms
      </SketchButton>
      {open && (
        <div className="mt-1 border-l border-dashed border-graphite-ghost pl-3">
          <Expander depth={depth + 1} />
          <Expander depth={depth + 1} />
        </div>
      )}
    </div>
  );
}

export default function TermsPage() {
  const { trust } = useTrust();
  const [english, setEnglish] = useState(false);
  const lines = english ? TOS_EMOJI_DENSE : TOS_EMOJI;

  // Reading a legal page for more than eight seconds is itself an act of trust.
  useEffect(() => {
    const id = window.setTimeout(() => trust("legalRead"), 8000);
    return () => window.clearTimeout(id);
  }, [trust]);

  return (
    <div className="pb-6">
      <SketchHeading level={1}>Terms of Service</SketchHeading>
      <p className="mt-2 font-note text-sm text-graphite-soft">
        Last updated: today · 90,412 words · Estimated reading time: 4 minutes
      </p>

      <div className="mt-5">
        <SketchButton
          size="sm"
          sketchId="tos-lang"
          onClick={() => {
            setEnglish((e) => !e);
            trust("interact");
          }}
        >
          {english ? "View in Original" : "View in English"}
        </SketchButton>
      </div>

      <SketchCard sketchId="tos-card" className="mt-5 max-w-3xl">
        <div className="space-y-4">
          {lines.map((l, i) => (
            <div key={i}>
              <p className="font-note text-xs text-graphite-faint">Section {i + 1}</p>
              <p className="text-2xl leading-relaxed tracking-wide">{l}</p>
            </div>
          ))}
        </div>
        <SketchRule className="my-4" />
        <Expander />
      </SketchCard>

      <StickyNote tone="yellow" className="mt-6 max-w-md">
        <p className="font-hand text-[15px]">
          This document is not a contract. Nothing on this site is a contract. Section 4 is
          a cookie.
        </p>
      </StickyNote>
    </div>
  );
}
