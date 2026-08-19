"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useTrust } from "@/lib/trust-provider";
import { TRUSTY_NOPE, TRUSTY_REPLIES } from "@/lib/copy";
import { TRUSTY_TYPING, TRUSTY_TYPING_SHORT } from "@/lib/timing";
import { pickAt } from "@/lib/rng";
import { cn } from "@/lib/utils";
import { SketchButton, SketchFrame, SketchInput } from "@/components/sketch";

interface Msg {
  from: "you" | "trusty";
  text: string;
}

export function TrustyWidget() {
  const { trust, remember, sincere } = useTrust();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "trusty", text: "Hi! I'm Trusty. How can I not help you today?" },
  ]);
  const [typing, setTyping] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [draft, setDraft] = useState("");
  const [hat, setHat] = useState(false);
  const [rated, setRated] = useState<null | "asked" | "done">(null);
  const turn = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [msgs, typing]);

  // The 45-second typing indicator, counted honestly so you can watch it happen.
  useEffect(() => {
    if (!typing) return;
    setElapsed(0);
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(id);
  }, [typing]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMsgs((m) => [...m, { from: "you", text }]);
    setDraft("");
    trust("interact");
    remember("feedback", `asked Trusty: "${text.slice(0, 48)}"`);

    const first = turn.current === 0;
    turn.current += 1;
    setTyping(true);
    window.setTimeout(
      () => {
        setTyping(false);
        setMsgs((m) => [
          ...m,
          {
            from: "trusty",
            text: first ? TRUSTY_NOPE : pickAt("trusty", TRUSTY_REPLIES, turn.current),
          },
        ]);
        if (turn.current >= 3 && rated === null) setRated("asked");
      },
      first ? TRUSTY_TYPING : TRUSTY_TYPING_SHORT,
    );
  };

  if (sincere) return null;

  return (
    <>
      <button
        onClick={() => {
          setOpen((o) => !o);
          trust("interact");
        }}
        className="fixed bottom-6 right-6 z-40 grid h-16 w-16 place-content-center bg-paper shadow-[3px_4px_0_rgba(47,45,42,0.18)] transition-transform hover:-rotate-3"
        aria-label="Chat with Trusty"
      >
        <SketchFrame id="trusty-fab" variant="circle" strokeWidth={2} />
        <span className="relative z-10 text-2xl">{open ? "×" : "🤖"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, rotate: -0.6 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-26 right-6 z-40 flex h-[28rem] w-[min(92vw,22rem)] flex-col bg-paper shadow-[4px_6px_0_rgba(47,45,42,0.16)]"
            style={{ bottom: "6.5rem" }}
          >
            <SketchFrame id="trusty-panel" variant="panel" strokeWidth={1.8} />

            <div className="relative z-10 flex items-center gap-2 border-b border-dashed border-graphite-ghost px-4 py-3">
              <span className="text-xl">{hat ? "🤖🎩" : "🤖"}</span>
              <div className="leading-tight">
                <p className="font-display text-lg">Trusty{hat ? " (Human)" : ""}</p>
                <p className="font-note text-[11px] text-graphite-faint">
                  {typing ? `typing… ${elapsed}s` : "Online. Allegedly."}
                </p>
              </div>
              <button
                className="ml-auto text-graphite-faint hover:text-redpencil"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="relative z-10 flex-1 space-y-2.5 overflow-y-auto px-4 py-3">
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "relative max-w-[85%] px-3 py-2 font-hand text-[15px]",
                    m.from === "you" ? "ml-auto" : "",
                  )}
                >
                  <SketchFrame
                    id={`msg-${i}`}
                    variant="box"
                    strokeWidth={1.2}
                    roughness={2.3}
                    stroke={m.from === "you" ? "#35597e" : undefined}
                  />
                  <span className="relative z-10">{m.text}</span>
                </div>
              ))}
              {typing && (
                <p className="font-note text-sm text-graphite-faint">Trusty is typing…</p>
              )}

              {rated === "asked" && (
                <div className="relative mt-3 px-3 py-2">
                  <SketchFrame id="trusty-rating" variant="box" strokeWidth={1.2} roughness={2.4} />
                  <p className="relative z-10 font-note text-sm">Rate this conversation:</p>
                  <button
                    className="relative z-10 mt-1 text-lg tracking-widest"
                    onClick={() => {
                      if (window.confirm("Are you sure? That's very generous of you.")) {
                        setRated("done");
                      } else {
                        setRated("done");
                      }
                      trust("interact");
                    }}
                  >
                    ★★★★★
                  </button>
                </div>
              )}
              {rated === "done" && (
                <p className="font-note text-xs text-graphite-faint">
                  Thank you. 5 stars recorded.
                </p>
              )}
            </div>

            <div className="relative z-10 space-y-2 border-t border-dashed border-graphite-ghost px-4 py-3">
              <div className="flex gap-2">
                <SketchInput
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Describe your issue…"
                  aria-label="Message Trusty"
                  sketchId="trusty-input"
                />
                <SketchButton size="sm" onClick={send} sketchId="trusty-send">
                  Send
                </SketchButton>
              </div>
              <button
                className="font-note text-xs text-graphite-faint underline decoration-dotted hover:text-redpencil"
                onClick={() => {
                  setHat(true);
                  setMsgs((m) => [
                    ...m,
                    { from: "trusty", text: "Connecting you to a human…" },
                    { from: "trusty", text: "Hi! I'm Trusty. I'm a human." },
                  ]);
                  trust("optOut");
                }}
              >
                Talk to a human
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { MessageCircle };
