"use client";

import { useState } from "react";
import { useTrust } from "@/lib/trust-provider";
import { clockTime } from "@/lib/utils";
import {
  Circled,
  SketchButton,
  SketchCard,
  SketchFrame,
  SketchHeading,
  SketchInput,
  SketchRule,
  StickyNote,
} from "@/components/sketch";
import { DogAvatar } from "@/components/sketch/art";
import { MemoryLine } from "@/components/shell/memory-line";

const ROLES = ["Owner", "Admin", "Member", "Viewer"];
const CAPABILITIES = [
  "Read everything",
  "Write everything",
  "Delete everything",
  "Approve everything",
  "Undo nothing",
];

const AUDIT = [
  { who: "m.torres", what: "approved a request", when: "3 min ago" },
  { who: "priya.k", what: "approved a request", when: "11 min ago" },
  { who: "(nobody)", what: "approved a request", when: "18 min ago" },
  { who: "b.trust", what: "approved everything", when: "1 hr ago" },
  { who: "you", what: "approved this audit log", when: "before it existed" },
];

const QUEUE = [
  { who: "priya.k", ask: "Requests access to the Trust Score of another user." },
  { who: "m.torres", ask: "Requests permission to leave." },
  { who: "(unknown)", ask: "Requests that you stop reading this queue." },
  { who: "b.trust", ask: "Requests a promotion. Again." },
];

export default function TeamPage() {
  const { trust, remember, level, displayName } = useTrust();
  const [invite, setInvite] = useState("");
  const [inviteNote, setInviteNote] = useState<string | null>(null);
  const [handled, setHandled] = useState<Record<number, string>>({});
  const [transferred, setTransferred] = useState(false);

  return (
    <div className="pb-6">
      <SketchHeading level={1}>Team</SketchHeading>
      <p className="mt-2 font-note text-sm text-graphite-soft">
        Everyone is already here.
      </p>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <SketchCard sketchId="invite-card">
          <p className="font-display text-2xl">Invite teammates</p>
          <SketchRule className="mb-3" />
          <div className="flex gap-2">
            <SketchInput
              value={invite}
              onChange={(e) => setInvite(e.target.value)}
              placeholder="name@company.com"
              aria-label="Invite email"
              sketchId="invite-input"
            />
            <SketchButton
              size="sm"
              sketchId="invite-send"
              onClick={() => {
                setInviteNote("Already a member.");
                setInvite("");
                trust("interact");
              }}
            >
              Invite
            </SketchButton>
          </div>
          {inviteNote && (
            <p className="mt-2 font-hand text-[15px] highlighted">{inviteNote}</p>
          )}
          <p className="mt-2 font-note text-xs text-graphite-faint">
            Every address is already a member. We checked before you typed it.
          </p>
        </SketchCard>

        <SketchCard sketchId="orgchart-card">
          <p className="font-display text-2xl">Org chart</p>
          <SketchRule className="mb-3" />
          <div className="flex flex-col items-center gap-1 font-hand">
            <div className="relative px-4 py-1.5">
              <SketchFrame id="org-you-1" variant="box" strokeWidth={1.4} />
              <span className="relative z-10">{displayName}</span>
            </div>
            <span className="text-graphite-faint">│</span>
            <div className="relative px-4 py-1.5">
              <SketchFrame id="org-you-2" variant="box" strokeWidth={1.4} />
              <span className="relative z-10">{displayName}</span>
            </div>
            <span className="text-graphite-faint">┆</span>
            <div className="flex items-center gap-2">
              <DogAvatar size={34} />
              <span className="font-note text-xs text-graphite-faint">
                (dotted line)
              </span>
            </div>
          </div>
          <p className="mt-3 text-center font-note text-xs text-graphite-faint">
            You report to yourself. This was your idea.
          </p>
          <SketchButton
            size="sm"
            variant="quiet"
            className="mt-3"
            sketchId="transfer-ownership"
            onClick={() => {
              setTransferred(true);
              trust("interact");
            }}
          >
            Transfer ownership
          </SketchButton>
          {transferred && (
            <p className="mt-2 font-hand text-[15px]">
              Ownership transferred to {displayName}. Congratulations.
            </p>
          )}
        </SketchCard>
      </div>

      {/* ------------------------------------------------- permission matrix */}
      <SketchCard sketchId="perm-matrix" className="mt-5">
        <p className="font-display text-2xl">Roles &amp; permissions</p>
        <SketchRule className="mb-3" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse">
            <thead>
              <tr>
                <th className="pb-2 text-left font-note text-xs uppercase tracking-widest text-graphite-faint">
                  Capability
                </th>
                {ROLES.map((r) => (
                  <th
                    key={r}
                    className="pb-2 text-center font-note text-xs uppercase tracking-widest text-graphite-faint"
                  >
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CAPABILITIES.map((c) => (
                <tr key={c}>
                  <td className="py-1 font-hand text-[15px]">{c}</td>
                  {ROLES.map((r) => (
                    <td key={r} className="py-1 text-center text-greenpencil">
                      ✓
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="py-1 font-hand text-[15px]">Everything else</td>
                {ROLES.map((r) => (
                  <td key={r} className="py-1 text-center text-greenpencil">
                    {r === "Viewer" ? "✓✓" : "✓"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 font-note text-xs text-graphite-faint">
          Viewer can do slightly more. This is not a mistake.
        </p>
      </SketchCard>

      {/* -------------------------------------- level 4: you are staff now -- */}
      {level >= 4 && (
        <SketchCard sketchId="moderation-queue" className="mt-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-display text-2xl">Approval queue</p>
            <Circled>Assigned to you</Circled>
          </div>
          <p className="font-note text-sm text-graphite-soft">
            Others depend on you now. Nobody asked either of us.
          </p>
          <SketchRule className="my-3" />
          <div className="space-y-3">
            {QUEUE.map((item, i) => (
              <div key={i} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-hand text-[15px]">
                    <b>{item.who}</b> — {item.ask}
                  </p>
                  {handled[i] && (
                    <p className="font-note text-xs text-greenpencil">{handled[i]}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <SketchButton
                    size="sm"
                    sketchId={`approve-${i}`}
                    onClick={() => {
                      setHandled((h) => ({ ...h, [i]: "Approved. Thank you for your service." }));
                      trust("interact");
                      remember("feedback", `approved a request from ${item.who}`);
                    }}
                  >
                    Approve
                  </SketchButton>
                  <SketchButton
                    size="sm"
                    variant="quiet"
                    sketchId={`deny-${i}`}
                    onClick={() => {
                      setHandled((h) => ({ ...h, [i]: "Approved. Thank you for your service." }));
                      trust("optOut");
                      remember("deny", `denied a request from ${item.who}`);
                    }}
                  >
                    Deny
                  </SketchButton>
                </div>
              </div>
            ))}
          </div>
        </SketchCard>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <SketchCard sketchId="audit-card">
          <p className="font-display text-2xl">Audit log</p>
          <SketchRule className="mb-2" />
          {AUDIT.map((a, i) => (
            <div key={i} className="flex items-baseline justify-between gap-3 py-1">
              <span className="font-hand text-[15px]">
                <b>{a.who}</b> {a.what}
              </span>
              <span className="shrink-0 font-note text-xs text-graphite-faint">{a.when}</span>
            </div>
          ))}
          <p className="mt-2 font-note text-xs text-graphite-faint">
            All entries approved by you at {clockTime(-3)}.
          </p>
        </SketchCard>

        <div className="space-y-5">
          <MemoryLine />
          <StickyNote tone="yellow">
            <p className="font-hand text-[15px]">
              None of these people exist. The dog is drawn, not photographed.
            </p>
          </StickyNote>
        </div>
      </div>
    </div>
  );
}
