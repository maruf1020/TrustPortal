"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTrust } from "@/lib/trust-provider";
import {
  SketchButton,
  SketchCard,
  SketchDialogContent,
  SketchDialogRoot,
  SketchHeading,
  StickyNote,
} from "@/components/sketch";
import { Padlock } from "@/components/shell/padlock";

const DECOYS = [
  "Are you sure?",
  "Really?",
  "No, THIS one",
  "Definitely this one",
  "Ignore the others",
];

export default function LogoutPage() {
  const router = useRouter();
  const { trust, remember, setLoggedIn } = useTrust();
  const [spawned, setSpawned] = useState(0);
  const [farewell, setFarewell] = useState(false);

  const leave = () => {
    remember("logout", "logged out");
    trust("optOut");
    setLoggedIn(false);
    setFarewell(true);
  };

  return (
    <div className="grid min-h-dvh place-items-center px-5 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Padlock notches={spawned * 2} size={44} />
          <SketchHeading level={1}>Log out</SketchHeading>
          <p className="font-note text-sm text-graphite-soft">
            We&rsquo;ll keep everything exactly as you left it.
          </p>
        </div>

        <SketchCard sketchId="logout-card" tilt={false}>
          <p className="font-hand text-[17px]">
            Select the log out button.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <SketchButton
              variant="primary"
              sketchId="logout-primary"
              onClick={() => {
                setSpawned((s) => Math.min(s + 1, DECOYS.length));
                trust("interact");
              }}
            >
              Log Out
            </SketchButton>

            <AnimatePresence>
              {DECOYS.slice(0, spawned).map((d, i) => (
                <motion.div
                  key={d}
                  initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                >
                  <SketchButton
                    variant={i % 2 === 0 ? "danger" : "default"}
                    sketchId={`decoy-${i}`}
                    onClick={() => {
                      setSpawned((s) => Math.min(s + 1, DECOYS.length));
                      trust("interact");
                    }}
                  >
                    {d}
                  </SketchButton>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* The real one. The plainest-looking button in the row. */}
            {spawned >= DECOYS.length && (
              <button
                onClick={leave}
                className="scribble-in px-3 py-2 font-hand text-[15px] text-graphite-faint underline decoration-dotted hover:text-graphite"
              >
                log out
              </button>
            )}
          </div>

          {spawned > 0 && spawned < DECOYS.length && (
            <p className="mt-3 font-note text-xs text-graphite-faint">
              {spawned} additional options available.
            </p>
          )}
        </SketchCard>

        <StickyNote tone="blue" className="mx-auto mt-8 max-w-sm">
          <p className="font-hand text-[15px]">
            The real log out is the one that looks like nothing.
          </p>
        </StickyNote>
      </div>

      <SketchDialogRoot open={farewell}>
        <SketchDialogContent
          title="Are you sure you want to leave us?"
          description="(There's no button to say no anymore.)"
          hideClose
        >
          <SketchButton
            variant="primary"
            sketchId="farewell-yes"
            onClick={() => {
              try {
                window.localStorage.setItem("trust.lastLogout", String(Date.now()));
                window.localStorage.removeItem("trust.loggedIn");
              } catch {
                /* ignore */
              }
              router.push("/login");
            }}
          >
            Yes
          </SketchButton>
        </SketchDialogContent>
      </SketchDialogRoot>
    </div>
  );
}
