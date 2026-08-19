"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTrust } from "@/lib/trust-provider";
import { NOTIFICATION_POOL } from "@/lib/copy";
import { AWKWARD, DOUBLE_TAKE } from "@/lib/timing";
import { clockTime } from "@/lib/utils";
import { pickAt } from "@/lib/rng";
import {
  SketchButton,
  SketchCard,
  SketchFrame,
  SketchHeading,
  SketchRule,
  StickyNote,
} from "@/components/sketch";
import { MemoryLine } from "@/components/shell/memory-line";

const PERMISSION_LADDER = [
  "TrustPortal would like to send you notifications.",
  "Please?",
  "Pretty please?",
  "We'll stop asking after this one. (We won't.)",
  "We said we'd stop asking.",
];

interface Note {
  id: number;
  title: string;
  body: string;
  unread: boolean;
  when: string;
}

let nextId = 100;

export default function NotificationsPage() {
  const { trust, remember, bump } = useTrust();

  const [notes, setNotes] = useState<Note[]>(() =>
    NOTIFICATION_POOL.slice(0, 6).map((n, i) => ({
      id: i,
      title: n.title,
      body: n.body,
      unread: i < 4,
      when: clockTime(-i * 7),
    })),
  );
  const [permStep, setPermStep] = useState(0);
  const [permOpen, setPermOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [snooze, setSnooze] = useState<string | null>(null);

  const unread = notes.filter((n) => n.unread).length;

  /* The prompt returns, more polite each time. */
  useEffect(() => {
    const id = window.setTimeout(() => setPermOpen(true), 3000);
    return () => window.clearTimeout(id);
  }, []);

  /* A notification that arrives before the action. */
  useEffect(() => {
    const id = window.setTimeout(() => {
      setNotes((n) => [
        {
          id: nextId++,
          title: `You will click this at ${clockTime(1)}`,
          body: "No action is required. You will take it anyway.",
          unread: true,
          when: "in a moment",
        },
        ...n,
      ]);
    }, 6500);
    return () => window.clearTimeout(id);
  }, []);

  /* The toast that apologises for sliding in, slides out, and comes back. */
  useEffect(() => {
    const show = (msg: string, delay: number) =>
      window.setTimeout(() => {
        setToast(msg);
        window.setTimeout(() => setToast(null), 3000);
      }, delay);
    const a = show("Sorry to interrupt.", 9000);
    const b = show("Sorry about that interruption.", 14_000);
    const c = show("Us again.", 19_000);
    return () => [a, b, c].forEach(window.clearTimeout);
  }, []);

  const markAllRead = () => {
    trust("optOut");
    remember("deny", "marked everything as read");
    setNotes((n) => [
      {
        id: nextId++,
        title: "You marked everything as read",
        body: "So we made you a new one.",
        unread: true,
        when: "just now",
      },
      ...n.map((x) => ({ ...x, unread: false })),
    ]);
  };

  return (
    <div className="pb-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SketchHeading level={1}>Notifications</SketchHeading>
          <p className="mt-2 font-note text-sm text-graphite-soft">
            {unread === 4 ? "2.5 unread" : `${unread} unread`} · all of them important
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SketchButton size="sm" sketchId="mark-read" onClick={markAllRead}>
            Mark all as read
          </SketchButton>
          <SketchButton
            size="sm"
            variant="quiet"
            sketchId="snooze"
            onClick={() => {
              setSnooze("Snoozed for 5 minutes.");
              trust("optOut");
              window.setTimeout(() => setSnooze(null), 3200);
            }}
          >
            Snooze · Never
          </SketchButton>
        </div>
      </div>

      {snooze && <p className="mt-3 font-hand text-[15px] highlighted">{snooze}</p>}

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {notes.map((n) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="relative px-5 py-3.5">
                  <SketchFrame
                    id={`note-${n.id}`}
                    variant="box"
                    strokeWidth={n.unread ? 1.8 : 1.1}
                    roughness={1.9}
                  />
                  <div className="relative z-10">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-hand text-[17px]">
                        {n.unread && <span className="text-redpencil">● </span>}
                        {n.title}
                      </p>
                      <span className="shrink-0 font-note text-xs text-graphite-faint">
                        {n.when}
                      </span>
                    </div>
                    {n.body ? (
                      <p className="font-note text-sm text-graphite-soft">{n.body}</p>
                    ) : (
                      <p className="font-note text-sm text-graphite-ghost italic">
                        &nbsp;
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <SketchButton
            variant="quiet"
            size="sm"
            sketchId="load-more-notes"
            onClick={() => {
              setNotes((n) => [
                ...n,
                ...Array.from({ length: 3 }, (_, i) => {
                  const src = pickAt("notif", NOTIFICATION_POOL, n.length + i);
                  return {
                    id: nextId++,
                    title: src.title,
                    body: src.body,
                    unread: false,
                    when: clockTime(-(n.length + i) * 11),
                  };
                }),
              ]);
              trust("interact");
            }}
          >
            Load older
          </SketchButton>
        </div>

        <div className="space-y-5">
          <SketchCard sketchId="notif-prefs">
            <p className="font-display text-2xl">Delivery</p>
            <SketchRule className="mb-3" />
            <p className="font-hand text-[15px]">
              Push notifications:{" "}
              <b>{permStep > 0 ? "Denied (pending)" : "Not yet decided"}</b>
            </p>
            <p className="mt-1 font-note text-xs text-graphite-faint">
              Declined {permStep} times. We&rsquo;re keeping count, not score.
            </p>
            <SketchRule className="my-3" />
            <p className="font-hand text-[15px]">
              Frequency: <b>Doubled</b>
            </p>
            <p className="font-note text-xs text-graphite-faint">
              You reduced this earlier.
            </p>
          </SketchCard>

          <MemoryLine />

          <StickyNote tone="pink" className="max-w-sm">
            <p className="font-hand text-[15px]">
              This sticky note is not a notification. It is a note. There is a
              difference and we will not be explaining it.
            </p>
          </StickyNote>
        </div>
      </div>

      {/* ----------------------------------------- the permission ladder --- */}
      <AnimatePresence>
        {permOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed left-1/2 top-6 z-50 w-[min(92vw,26rem)] -translate-x-1/2"
          >
            <div className="relative bg-paper px-5 py-4 shadow-[3px_5px_0_rgba(47,45,42,0.16)]">
              <SketchFrame id="perm-prompt" variant="panel" strokeWidth={1.7} />
              <div className="relative z-10">
                <p className="font-hand text-[16px]">
                  {PERMISSION_LADDER[Math.min(permStep, PERMISSION_LADDER.length - 1)]}
                </p>
                <div className="mt-3 flex gap-2">
                  <SketchButton
                    size="sm"
                    variant="primary"
                    sketchId="perm-allow"
                    onClick={() => {
                      setPermOpen(false);
                      trust("interact");
                    }}
                  >
                    Allow
                  </SketchButton>
                  <SketchButton
                    size="sm"
                    variant="quiet"
                    sketchId="perm-deny"
                    onClick={() => {
                      setPermOpen(false);
                      setPermStep((s) => s + 1);
                      bump("push-denials");
                      remember("deny", "declined push notifications");
                      trust("optOut");
                      window.setTimeout(() => setPermOpen(true), AWKWARD + DOUBLE_TAKE);
                    }}
                  >
                    Not now
                  </SketchButton>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            className="fixed bottom-28 right-6 z-40"
          >
            <div className="relative bg-paper px-4 py-2.5">
              <SketchFrame id="apology-toast" variant="box" strokeWidth={1.4} />
              <p className="relative z-10 font-hand text-[15px]">{toast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
