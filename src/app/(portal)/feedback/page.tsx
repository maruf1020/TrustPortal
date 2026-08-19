"use client";

import { useState } from "react";
import { useTrust } from "@/lib/trust-provider";
import { TESTIMONIAL_TITLES } from "@/lib/copy";
import { pick } from "@/lib/rng";
import {
  SketchButton,
  SketchCard,
  SketchHeading,
  SketchRule,
  SketchSlider,
  SketchTextarea,
  StickyNote,
} from "@/components/sketch";

export default function FeedbackPage() {
  const { trust, remember, displayName } = useTrust();
  const [nps, setNps] = useState([10]);
  const [text, setText] = useState("");
  const [compliment, setCompliment] = useState<string | null>(null);
  const [referrals, setReferrals] = useState(0);

  const title = pick("testimonial-title", TESTIMONIAL_TITLES);

  return (
    <div className="pb-6">
      <SketchHeading level={1}>Feedback</SketchHeading>
      <p className="mt-2 font-note text-sm text-graphite-soft">
        Your opinion matters, within the available range.
      </p>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <SketchCard sketchId="nps-card">
          <p className="font-display text-2xl">
            How likely are you to recommend us?
          </p>
          <SketchRule className="my-3" />
          <SketchSlider
            value={nps}
            onValueChange={(v) => {
              setNps(v);
              trust("interact");
            }}
            min={9}
            max={10}
            step={1}
            aria-label="Net promoter score"
          />
          <div className="flex justify-between font-note text-xs text-graphite-faint">
            <span>9 — Not likely</span>
            <span>10 — Extremely likely</span>
          </div>
          <p className="mt-3 font-hand text-[15px]">
            Your score: <b>{nps[0]}</b>. Thank you for your honesty.
          </p>
        </SketchCard>

        <SketchCard sketchId="testimonial-card">
          <p className="font-display text-2xl">Tell us what you think</p>
          <SketchRule className="my-3" />
          <SketchTextarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Be candid. We can take it."
            aria-label="Your feedback"
            sketchId="feedback-input"
          />
          <p className="mt-3 font-note text-xs uppercase tracking-widest text-graphite-faint">
            Live preview — homepage testimonials
          </p>
          <div className="mt-1 border-l-2 border-graphite-ghost pl-3">
            <p className="font-hand text-[17px] italic">
              &ldquo;{text.trim() || "…"}&rdquo;
            </p>
            <p className="font-note text-xs text-graphite-faint">
              — {displayName}, {title}
            </p>
          </div>
          <SketchButton
            size="sm"
            className="mt-3"
            sketchId="feedback-submit"
            onClick={() => {
              setCompliment(
                text.trim()
                  ? `Summary of your report: “${text.trim().slice(0, 60)}” — which we have recorded as high praise.`
                  : "Summary of your report: nothing but kind words.",
              );
              remember("feedback", text.trim().slice(0, 48) || "said nothing");
              trust("interact");
            }}
          >
            Submit
          </SketchButton>
          {compliment && (
            <p className="mt-2 font-hand text-[15px] highlighted">{compliment}</p>
          )}
        </SketchCard>
      </div>

      <SketchCard sketchId="referral-card" className="mt-5 max-w-2xl">
        <p className="font-display text-2xl">Referral programme</p>
        <SketchRule className="my-3" />
        <p className="font-hand text-[15px]">
          Invite 3 friends, get nothing. Invite 4, get less.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <SketchButton
            size="sm"
            sketchId="refer"
            onClick={() => {
              setReferrals((r) => r + 1);
              trust("interact");
            }}
          >
            Invite a friend
          </SketchButton>
          <p className="font-note text-sm text-graphite-faint">
            Invited: {referrals} ·{" "}
            {referrals < 3
              ? "Reward: nothing"
              : referrals === 3
                ? "Reward: nothing"
                : "Reward: less"}
          </p>
        </div>
      </SketchCard>

      <StickyNote tone="pink" className="mt-6 max-w-md">
        <p className="font-hand text-[15px]">
          Nothing you type here is sent anywhere. The homepage testimonial is a preview of
          a homepage that does not exist.
        </p>
      </StickyNote>
    </div>
  );
}
