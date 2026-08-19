"use client";

import Link from "next/link";
import { useState } from "react";
import { useTrust } from "@/lib/trust-provider";
import { AWARDS, TEAM } from "@/lib/copy";
import {
  SketchButton,
  SketchCard,
  SketchFrame,
  SketchHeading,
  SketchRule,
  StickyNote,
} from "@/components/sketch";
import { DogAvatar } from "@/components/sketch/art";

const PRESS = [
  { headline: "TrustPortal Named Most Trusted Portal", outlet: "The TrustPortal Blog" },
  { headline: "Why Everyone Is Talking About TrustPortal", outlet: "The TrustPortal Blog" },
  { headline: "TrustPortal: A Retrospective", outlet: "The TrustPortal Blog" },
  { headline: "Is TrustPortal The Future?", outlet: "The TrustPortal Blog" },
];

export default function AboutPage() {
  const { trust } = useTrust();
  const [investorSpin, setInvestorSpin] = useState(0);

  return (
    <div className="pb-6">
      <SketchHeading level={1}>About us</SketchHeading>
      <p className="mt-3 max-w-2xl font-hand text-lg">
        We were founded on a simple belief: that trust is the most valuable thing a company
        can hold, and that it should be held by the company.
      </p>

      <SketchCard sketchId="team-card" className="mt-7">
        <p className="font-display text-2xl">Leadership</p>
        <SketchRule className="my-3" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m, i) => (
            <div key={i} className="flex items-center gap-3">
              <DogAvatar size={64} />
              <div>
                <p className="font-hand text-[17px]">{m.name}</p>
                <p className="font-note text-sm text-graphite-soft">{m.title}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 font-note text-xs text-graphite-faint">
          Photography by us. Subject: also us.
        </p>
      </SketchCard>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <SketchCard sketchId="awards-about">
          <p className="font-display text-2xl">Awards</p>
          <SketchRule className="my-3" />
          <ul className="space-y-1.5">
            {AWARDS.map((a) => (
              <li key={a} className="font-hand text-[15px]">
                🏆 {a}
              </li>
            ))}
          </ul>
        </SketchCard>

        <SketchCard sketchId="press-about">
          <p className="font-display text-2xl">Press</p>
          <SketchRule className="my-3" />
          <ul className="space-y-2">
            {PRESS.map((p) => (
              <li key={p.headline}>
                <p className="font-hand text-[15px] sketch-underline">{p.headline}</p>
                <p className="font-note text-xs text-graphite-faint">{p.outlet}</p>
              </li>
            ))}
          </ul>
        </SketchCard>

        <SketchCard sketchId="investors-about">
          <p className="font-display text-2xl">Investors</p>
          <SketchRule className="my-3" />
          <div className="flex flex-wrap gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative grid h-16 w-16 place-content-center"
                style={{ transform: `rotate(${i * 90 + investorSpin}deg)` }}
              >
                <SketchFrame id={`inv-${i}`} variant="box" strokeWidth={1.3} />
                <span className="relative z-10 font-display text-lg">TP</span>
              </div>
            ))}
          </div>
          <SketchButton
            size="sm"
            variant="quiet"
            className="mt-3"
            sketchId="spin-investors"
            onClick={() => {
              setInvestorSpin((s) => s + 90);
              trust("interact");
            }}
          >
            View all investors
          </SketchButton>
          <p className="mt-2 font-note text-xs text-graphite-faint">Backed by belief.</p>
        </SketchCard>
      </div>

      <div className="mt-6 flex flex-wrap items-start gap-5">
        <StickyNote tone="yellow" className="max-w-sm">
          <p className="font-hand text-[15px]">
            Bartholomew is a drawing. He has been promoted five times.
          </p>
        </StickyNote>
        <SketchButton asChild sketchId="to-careers">
          <Link href="/careers">We&rsquo;re hiring →</Link>
        </SketchButton>
      </div>
    </div>
  );
}
