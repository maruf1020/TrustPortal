"use client";

import { useState } from "react";
import { useTrust } from "@/lib/trust-provider";
import {
  SketchButton,
  SketchCard,
  SketchFrame,
  SketchHeading,
  SketchInput,
  SketchRule,
  StickyNote,
} from "@/components/sketch";

const INTEGRATIONS = [
  { name: "Slack", note: "Posts nothing, everywhere.", icon: "💬" },
  { name: "Google Calendar", note: "Adds one meeting. Every day. Forever.", icon: "📅" },
  { name: "Jira", note: "Reads your tickets. Writes its own.", icon: "🎫" },
  { name: "Your Other Tabs", note: "Connected since before you installed it.", icon: "🗂️" },
  { name: "Notion", note: "Syncing. Always syncing.", icon: "📓" },
  { name: "Zoom", note: "Attends on your behalf.", icon: "🎥" },
  { name: "Salesforce", note: "We don't know what it does either.", icon: "☁️" },
  { name: "The Dog", note: "Read-only.", icon: "🐕" },
];

export default function IntegrationsPage() {
  const { trust, remember } = useTrust();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [request, setRequest] = useState("");
  const [requested, setRequested] = useState(false);

  return (
    <div className="pb-6">
      <SketchHeading level={1}>Integrations</SketchHeading>
      <p className="mt-2 font-note text-sm text-graphite-soft">
        Everything is already connected. It always was.
      </p>

      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {INTEGRATIONS.map((i) => (
          <SketchCard key={i.name} sketchId={`int-${i.name}`}>
            <div className="flex items-start gap-3">
              <span className="text-3xl">{i.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-display text-xl">{i.name}</p>
                  <span className="relative px-2 py-0.5 font-note text-[11px] text-greenpencil">
                    <SketchFrame
                      id={`badge-${i.name}`}
                      variant="box"
                      stroke="#4a7c59"
                      strokeWidth={1.1}
                      roughness={2.4}
                    />
                    <span className="relative z-10">Connected</span>
                  </span>
                </div>
                <p className="font-note text-sm text-graphite-soft">{i.note}</p>
                {notes[i.name] && (
                  <p className="mt-1 font-hand text-[15px] highlighted">{notes[i.name]}</p>
                )}
                <SketchButton
                  size="sm"
                  variant="quiet"
                  className="mt-2"
                  sketchId={`disc-${i.name}`}
                  onClick={() => {
                    setNotes((n) => ({ ...n, [i.name]: "Disconnected." }));
                    trust("optOut");
                    remember("deny", `disconnected ${i.name}`);
                  }}
                >
                  Disconnect
                </SketchButton>
              </div>
            </div>
          </SketchCard>
        ))}

        <SketchCard sketchId="int-competitor" className="opacity-60">
          <div className="flex items-start gap-3">
            <span className="text-3xl grayscale">🚫</span>
            <div>
              <p className="font-display text-xl">MistrustPortal</p>
              <p className="font-note text-sm text-graphite-soft">
                Unavailable in your region.
              </p>
              <p className="mt-1 font-note text-xs text-graphite-faint">
                Your region is defined as: wherever you are.
              </p>
            </div>
          </div>
        </SketchCard>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <SketchCard sketchId="automation-card">
          <p className="font-display text-2xl">Automation builder</p>
          <SketchRule className="mb-3" />
          <div className="space-y-3">
            <div>
              <p className="font-note text-xs uppercase tracking-widest text-graphite-faint">
                When
              </p>
              <div className="relative px-4 py-2.5">
                <SketchFrame id="auto-when" variant="box" strokeWidth={1.4} />
                <span className="relative z-10 font-hand">Trust</span>
              </div>
            </div>
            <p className="text-center font-display text-2xl">↓</p>
            <div>
              <p className="font-note text-xs uppercase tracking-widest text-graphite-faint">
                Then
              </p>
              <div className="relative px-4 py-2.5">
                <SketchFrame id="auto-then" variant="box" strokeWidth={1.4} />
                <span className="relative z-10 font-hand">Trust</span>
              </div>
            </div>
            <SketchButton
              size="sm"
              variant="primary"
              sketchId="auto-save"
              onClick={() => trust("interact")}
            >
              Activate automation
            </SketchButton>
            <p className="font-note text-xs text-graphite-faint">
              This automation has been running since before you built it.
            </p>
          </div>
        </SketchCard>

        <div className="space-y-5">
          <SketchCard sketchId="request-card">
            <p className="font-display text-2xl">Request an integration</p>
            <SketchRule className="mb-3" />
            <div className="flex gap-2">
              <SketchInput
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="What would you like connected?"
                aria-label="Integration request"
                sketchId="request-input"
              />
              <SketchButton
                size="sm"
                sketchId="request-submit"
                onClick={() => {
                  setRequested(true);
                  setRequest("");
                  trust("interact");
                }}
              >
                Request
              </SketchButton>
            </div>
            {requested && (
              <p className="mt-2 font-hand text-[15px] highlighted">Already built.</p>
            )}
          </SketchCard>

          <StickyNote tone="yellow">
            <p className="font-hand text-[15px]">
              None of these connect to anything. There is no network layer. The badges are
              green because green is reassuring.
            </p>
          </StickyNote>
        </div>
      </div>
    </div>
  );
}
