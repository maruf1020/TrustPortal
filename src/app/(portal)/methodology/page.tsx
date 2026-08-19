"use client";

import { useTrust } from "@/lib/trust-provider";
import { LEVEL_BLURB, LEVEL_NAMES, LEVEL_THRESHOLDS, type TrustLevel } from "@/lib/trust";
import {
  SketchCard,
  SketchHeading,
  SketchProgress,
  SketchRule,
  StickyNote,
} from "@/components/sketch";

const FACTORS = [
  ["Engagement", "Every interaction. Also every non-interaction."],
  ["Reluctance", "Attempts to opt out are weighted more heavily than participation."],
  ["Diligence", "Time spent on legal pages, which we consider a compliment."],
  ["Vibes", "vibes"],
  ["Q", "—"],
  ["previousTrustScore", "Your previous Trust Score."],
];

export default function MethodologyPage() {
  const { score, level, progress } = useTrust();

  return (
    <div className="pb-6">
      <SketchHeading level={1}>How your Trust Score is calculated</SketchHeading>
      <p className="mt-2 font-note text-sm text-graphite-soft">
        Transparency is one of our four values. The others are unavailable.
      </p>

      <SketchCard sketchId="formula-card" className="mt-6 max-w-3xl">
        <p className="font-display text-2xl">The formula</p>
        <SketchRule className="my-3" />
        <pre className="overflow-x-auto whitespace-pre font-typed text-[13px] leading-relaxed">
{`                 ( engagement + reluctance² + diligence )
TrustScore  =  ───────────────────────────────────────────  ×  vibes  ×  Q
                        previousTrustScore

where   Q          is a constant
        vibes      is vibes
        reluctance is how firmly you said no
        previousTrustScore is your previous TrustScore`}
        </pre>
        <p className="mt-3 font-note text-sm text-graphite-soft">
          The formula is self-referential. This has been reviewed and approved.
        </p>
      </SketchCard>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <SketchCard sketchId="factors-card">
          <p className="font-display text-2xl">Factors</p>
          <SketchRule className="my-3" />
          {FACTORS.map(([k, v]) => (
            <div key={k} className="py-1.5">
              <p className="font-hand text-[15px]">
                <b>{k}</b> — {v}
              </p>
            </div>
          ))}
          <p className="mt-2 font-note text-xs text-graphite-faint">
            Your score cannot decrease. There is no mechanism for it. We looked.
          </p>
        </SketchCard>

        <SketchCard sketchId="yours-card">
          <p className="font-display text-2xl">Your score</p>
          <SketchRule className="my-3" />
          <p className="font-display text-5xl">{score}</p>
          <p className="font-note text-sm text-graphite-soft">
            Standing: <b>{LEVEL_NAMES[level]}</b> — {LEVEL_BLURB[level]}
          </p>
          <SketchProgress value={progress * 100} className="mt-3" />
          <p className="mt-2 font-note text-xs text-graphite-faint">
            {level < 5
              ? `Progress toward ${LEVEL_NAMES[(level + 1) as TrustLevel]}.`
              : "There is nothing after this."}
          </p>
          <SketchRule className="my-3" />
          <div className="space-y-1">
            {(Object.keys(LEVEL_THRESHOLDS) as unknown as TrustLevel[]).map((l) => (
              <div
                key={l}
                className={
                  Number(l) === level
                    ? "flex justify-between font-hand text-[15px]"
                    : "flex justify-between font-hand text-[15px] text-graphite-faint"
                }
              >
                <span>
                  {Number(l) <= level ? "●" : "○"} {LEVEL_NAMES[l]}
                </span>
                <span className="font-typed text-xs">{LEVEL_THRESHOLDS[l]}</span>
              </div>
            ))}
          </div>
        </SketchCard>
      </div>

      <StickyNote tone="blue" className="mt-6 max-w-md">
        <p className="font-hand text-[15px]">
          The score is real, it is stored in your browser, and it genuinely changes what
          this site says to you. That is the only honest number on the platform.
        </p>
      </StickyNote>
    </div>
  );
}
