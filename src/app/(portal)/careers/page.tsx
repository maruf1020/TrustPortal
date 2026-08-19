"use client";

import { useEffect, useRef, useState } from "react";
import { useTrust } from "@/lib/trust-provider";
import { CAREER_REQUIREMENTS } from "@/lib/copy";
import {
  SketchButton,
  SketchCard,
  SketchFrame,
  SketchHeading,
  SketchRule,
  StickyNote,
} from "@/components/sketch";

export default function CareersPage() {
  const { trust } = useTrust();
  const [shown, setShown] = useState(4);
  const [applied, setApplied] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  // The requirements list grows by one line every time you scroll past it.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown((s) => Math.min(s + 1, CAREER_REQUIREMENTS.length));
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="pb-6">
      <div className="flex flex-wrap items-center gap-3">
        <SketchHeading level={1}>Careers</SketchHeading>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <div className="relative px-4 py-2">
          <SketchFrame id="hiring-banner" variant="box" stroke="#4a7c59" strokeWidth={1.4} />
          <p className="relative z-10 font-hand text-[15px] text-greenpencil">
            🎉 We&rsquo;re hiring!
          </p>
        </div>
        <div className="relative px-4 py-2">
          <SketchFrame id="freeze-banner" variant="box" stroke="#b4392f" strokeWidth={1.4} />
          <p className="relative z-10 font-hand text-[15px] text-redpencil">
            Hiring freeze in effect.
          </p>
        </div>
      </div>

      <SketchCard sketchId="job-card" className="mt-6 max-w-3xl">
        <p className="font-note text-xs uppercase tracking-widest text-graphite-faint">
          1 open role
        </p>
        <p className="font-display text-3xl">
          Trust Intern (Unpaid, Mandatory Belief Required)
        </p>
        <p className="font-note text-sm text-graphite-soft">
          The room · Full-time · Weekends, which do not exist
        </p>
        <SketchRule className="my-4" />

        <p className="font-display text-xl">What you&rsquo;ll do</p>
        <p className="mt-1 font-hand text-[15px]">
          You will trust. You will report to yourself. You will not ask what we do.
        </p>

        <p className="mt-4 font-display text-xl">Requirements</p>
        <ul className="mt-1 space-y-1">
          {CAREER_REQUIREMENTS.slice(0, shown).map((r) => (
            <li key={r} className="scribble-in font-hand text-[15px]">
              · {r}
            </li>
          ))}
        </ul>
        <div ref={sentinel} className="h-4" />
        {shown < CAREER_REQUIREMENTS.length && (
          <p className="font-note text-xs text-graphite-faint">
            More requirements load as you scroll. This is the whole list.
          </p>
        )}

        <SketchRule className="my-4" />
        <SketchButton
          variant="primary"
          sketchId="apply"
          onClick={() => {
            setApplied(true);
            trust("interact");
          }}
        >
          Apply now
        </SketchButton>
        {applied && (
          <p className="mt-2 font-hand text-[15px] highlighted">
            Application received. You started three weeks ago.
          </p>
        )}
      </SketchCard>

      <StickyNote tone="pink" className="mt-6 max-w-sm">
        <p className="font-hand text-[15px]">
          There is no job. Please do not apply. (You already did.)
        </p>
      </StickyNote>
    </div>
  );
}
