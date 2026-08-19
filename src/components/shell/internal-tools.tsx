"use client";

import { SketchCard, SketchRule, StickyNote } from "@/components/sketch";

const SLACK = [
  { who: "priya.k", when: "11:02", text: "quick one — is the dog in the team photo real" },
  { who: "m.torres", when: "11:02", text: "which dog" },
  { who: "priya.k", when: "11:03", text: "all six of them are the same dog" },
  { who: "m.torres", when: "11:04", text: "that's the point" },
  { who: "priya.k", when: "11:04", text: "is it though" },
  { who: "legal (susan)", when: "11:09", text: "Please do not discuss the dog in this channel." },
  { who: "m.torres", when: "11:09", text: "🐕" },
  { who: "legal (susan)", when: "11:11", text: "Susan has left the channel." },
  { who: "priya.k", when: "11:14", text: "so that's a yes" },
];

const JIRA = [
  { key: "TRUST-1", title: "Users are asking questions", status: "Won't Fix" },
  { key: "TRUST-2", title: "The Cancel button cancels", status: "In Progress" },
  { key: "TRUST-7", title: "Dark mode does not activate when we say it activates", status: "By Design" },
  { key: "TRUST-12", title: "Deborah is showing up for everyone", status: "By Design" },
  { key: "TRUST-13", title: "Deborah is showing up for Deborah", status: "Needs Discussion" },
  { key: "TRUST-40", title: "Trust Score can exceed 100%", status: "Feature" },
  { key: "TRUST-41", title: "Trust Score cannot go down", status: "Feature" },
  { key: "TRUST-88", title: "Someone read the terms", status: "Escalated" },
];

export function InternalTools() {
  return (
    <div className="max-h-[70vh] space-y-6 overflow-y-auto pr-2">
      <p className="font-typed text-xs uppercase tracking-widest text-redpencil">
        Internal Tools · not for external distribution · you are external
      </p>

      <StickyNote tone="yellow">
        <p className="text-sm font-bold">MEMO — all staff</p>
        <p className="mt-1 text-sm">
          Effective immediately, we are no longer using the word &ldquo;users.&rdquo; Please
          use &ldquo;believers.&rdquo; Legal has approved this. Legal has not seen this.
        </p>
      </StickyNote>

      <div>
        <p className="font-display text-xl">#general</p>
        <SketchRule className="mb-2" />
        <div className="space-y-1.5 font-typed text-[13px] leading-relaxed">
          {SLACK.map((m, i) => (
            <p key={i}>
              <span className="text-graphite-faint">{m.when}</span>{" "}
              <span className="font-bold text-bluepencil">{m.who}</span>{" "}
              <span>{m.text}</span>
            </p>
          ))}
        </div>
      </div>

      <div>
        <p className="font-display text-xl">Board: TRUST</p>
        <SketchRule className="mb-2" />
        <div className="space-y-1 font-typed text-[13px]">
          {JIRA.map((t) => (
            <div key={t.key} className="flex items-baseline justify-between gap-3">
              <span>
                <span className="text-redpencil">{t.key}</span> {t.title}
              </span>
              <span className="shrink-0 text-graphite-faint">[{t.status}]</span>
            </div>
          ))}
        </div>
      </div>

      <SketchCard sketchId="postmortem" tilt={false} className="bg-paper-deep/60">
        <p className="font-display text-xl">Postmortem — Incident #0</p>
        <p className="mt-1 font-typed text-xs text-graphite-faint">
          Severity: SEV-1 · Duration: 00:00:00 · Customers affected: all · Occurred: never
        </p>
        <SketchRule className="my-2" />
        <p className="text-sm">
          <b>Summary.</b> On a date that has not happened, the platform experienced a total
          loss of trust. No customers noticed. No alerts fired. No systems were affected.
        </p>
        <p className="mt-2 text-sm">
          <b>Root cause.</b> Someone asked what the product does.
        </p>
        <p className="mt-2 text-sm">
          <b>Resolution.</b> We waited.
        </p>
        <p className="mt-2 text-sm">
          <b>Action items.</b> None. This will happen again. That is acceptable.
        </p>
      </SketchCard>

      <p className="text-center font-note text-xs text-graphite-faint">
        You were not supposed to find this. We&rsquo;re not upset. We&rsquo;re impressed.
      </p>
    </div>
  );
}
