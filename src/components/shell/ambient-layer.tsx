"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTrust } from "@/lib/trust-provider";
import { TAB_TITLES } from "@/lib/copy";
import { CURSOR_DRIFT } from "@/lib/timing";
import { seededRandom } from "@/lib/rng";
import {
  SketchDialogContent,
  SketchDialogRoot,
  SketchRule,
} from "@/components/sketch";
import { InternalTools } from "./internal-tools";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

const SHORTCUTS = [
  ["Ctrl + S", "Trust"],
  ["Ctrl + Z", "Trust"],
  ["Ctrl + F", "Trust"],
  ["Ctrl + P", "Trust (one page)"],
  ["Esc", "Trust, but faster"],
  ["Tab", "Trust, in order"],
  ["Space", "Trust"],
  ["?", "This"],
];

/**
 * Everything the site does when you are not looking directly at it.
 */
export function AmbientLayer() {
  const { ambient, sincere, score, level, concluded } = useTrust();
  const [konami, setKonami] = useState(false);
  const [shortcuts, setShortcuts] = useState(false);
  const [yesFlash, setYesFlash] = useState(false);
  const [selectionTip, setSelectionTip] = useState<{ x: number; y: number } | null>(null);
  const buffer = useRef<string[]>([]);
  const noBuffer = useRef("");
  const levelRef = useRef(level);
  const scoreRef = useRef(score);
  levelRef.current = level;
  scoreRef.current = score;

  /* ------------------------------------------------ the tab, while away -- */
  useEffect(() => {
    if (sincere) return;
    const original = document.title;
    let step = 0;
    let timer: number;
    const onVisibility = () => {
      if (document.hidden) {
        step = 0;
        document.title = TAB_TITLES[0];
        timer = window.setInterval(() => {
          step = Math.min(step + 1, TAB_TITLES.length - 1);
          document.title = TAB_TITLES[step];
        }, 9000);
      } else {
        window.clearInterval(timer);
        document.title = original;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(timer);
      document.title = original;
    };
  }, [sincere]);

  /* ------------------------------------------- the favicon is your score -- */
  useEffect(() => {
    if (sincere) return;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#f4f1e8";
    ctx.fillRect(0, 0, 64, 64);
    ctx.strokeStyle = "#2f2d2a";
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 56, 56);
    ctx.fillStyle = "#2f2d2a";
    ctx.font = "bold 34px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(Math.min(999, score)), 32, 36);
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = canvas.toDataURL("image/png");
  }, [score, sincere]);

  /* ------------------------------------------------------- console notes -- */
  useEffect(() => {
    if (sincere) return;
    const w = window as unknown as Record<string, unknown>;
    if (w.trust) return;
    // eslint-disable-next-line no-console
    console.log(
      "%c  TrustPortal  \n%c  We see you.  ",
      "font:700 20px Georgia;color:#2f2d2a;background:#f7e27f;padding:4px 8px",
      "font:14px Georgia;color:#b4392f;padding:2px 8px",
    );
    const api = {
      revoke: () => "no",
      toString: () => "[object Trust]",
    };
    // Readable. Assignable. Assignment silently succeeds and changes nothing.
    Object.defineProperty(api, "level", {
      enumerable: true,
      get: () => levelRef.current,
      set: () => {},
    });
    Object.defineProperty(api, "score", {
      enumerable: true,
      get: () => scoreRef.current,
      set: () => {},
    });
    Object.defineProperty(window, "trust", { configurable: true, value: api });
  }, [sincere]);

  /* --------------------------------------------------------- konami + ? -- */
  useEffect(() => {
    if (sincere) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      buffer.current = [...buffer.current, e.key].slice(-KONAMI.length);
      if (buffer.current.join(",").toLowerCase() === KONAMI.join(",").toLowerCase()) {
        setKonami(true);
        buffer.current = [];
      }

      if (!typing && e.key === "?") setShortcuts(true);

      // Type "no" anywhere. The page briefly disagrees.
      if (!typing && /^[a-z]$/i.test(e.key)) {
        noBuffer.current = (noBuffer.current + e.key.toLowerCase()).slice(-2);
        if (noBuffer.current === "no") {
          setYesFlash(true);
          window.setTimeout(() => setYesFlash(false), 120);
          noBuffer.current = "";
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sincere]);

  /* --------------------------------------------- selecting text is a gift -- */
  useEffect(() => {
    if (sincere) return;
    const onUp = (e: MouseEvent) => {
      const sel = window.getSelection();
      if (sel && sel.toString().trim().length > 3) {
        setSelectionTip({ x: e.clientX, y: e.clientY });
        window.setTimeout(() => setSelectionTip(null), 1600);
      }
    };
    document.addEventListener("mouseup", onUp);
    return () => document.removeEventListener("mouseup", onUp);
  }, [sincere]);

  /* ---------------------------------------------------------- the 1px drift */
  useEffect(() => {
    if (sincere) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rnd = seededRandom("drift-window")();
    const delay = 45_000 + rnd * 120_000;
    const start = window.setTimeout(() => {
      document.documentElement.style.setProperty("transform", "translate(1px, 1px)");
      window.setTimeout(() => {
        document.documentElement.style.removeProperty("transform");
      }, CURSOR_DRIFT);
    }, delay);
    return () => window.clearTimeout(start);
  }, [sincere]);

  if (sincere || concluded) return null;

  return (
    <>
      {/* the ambient remark */}
      <AnimatePresence>
        {ambient && (
          <motion.div
            initial={{ opacity: 0, y: 14, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: -0.6 }}
            exit={{ opacity: 0, y: 8 }}
            className="pointer-events-none fixed bottom-6 left-1/2 z-[60] -translate-x-1/2"
          >
            <div className="wobble-border bg-paper px-5 py-2 font-note text-sm shadow-[3px_4px_0_rgba(47,45,42,0.14)]">
              {ambient}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* copied to us */}
      <AnimatePresence>
        {selectionTip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ left: selectionTip.x + 12, top: selectionTip.y + 12 }}
            className="pointer-events-none fixed z-[70] wobble-border bg-highlighter px-2.5 py-1 font-note text-xs"
          >
            copied to us.
          </motion.div>
        )}
      </AnimatePresence>

      {/* the site briefly disagrees */}
      {yesFlash && (
        <div className="pointer-events-none fixed inset-0 z-[80] grid place-content-center bg-paper">
          <span className="font-display text-[22vw] leading-none">yes</span>
        </div>
      )}

      <SketchDialogRoot open={konami} onOpenChange={setKonami}>
        <SketchDialogContent title="Internal Tools" description="Build 4.3.0 · restricted">
          <InternalTools />
        </SketchDialogContent>
      </SketchDialogRoot>

      <SketchDialogRoot open={shortcuts} onOpenChange={setShortcuts}>
        <SketchDialogContent title="Keyboard shortcuts" description="Everything you need.">
          <div className="space-y-1.5">
            {SHORTCUTS.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4">
                <span className="font-typed text-sm">{k}</span>
                <SketchRule className="flex-1 opacity-40" id={`sc-${k}`} />
                <span className="font-note text-sm">{v}</span>
              </div>
            ))}
          </div>
        </SketchDialogContent>
      </SketchDialogRoot>
    </>
  );
}
