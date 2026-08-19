"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTrust } from "@/lib/trust-provider";
import {
  SketchButton,
  SketchDialogContent,
  SketchDialogRoot,
  SketchFrame,
  SketchSwitch,
} from "@/components/sketch";

const VENDORS = [
  "AdTrust", "TrustMetrics", "Belief Analytics", "Deborah Data", "PixelTrust",
  "Certainty Cloud", "Handshake Network", "Vibes DSP", "The Dog", "TrustPortal (us)",
  "TrustPortal (also us)", "Legitimate Interest Ltd", "Nobody", "Everyone",
];

export function CookieBanner() {
  const { trust, bump, remember, sincere } = useTrust();
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const [accepted, setAccepted] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => setOpen(true), 2400);
    return () => window.clearTimeout(id);
  }, []);

  // The counter climbs on its own. There is no way to stop it.
  useEffect(() => {
    const id = window.setInterval(() => setAccepted((a) => a + Math.ceil(Math.random() * 3)), 1400);
    return () => window.clearInterval(id);
  }, []);

  if (sincere) return null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4"
          >
            <div className="relative mx-auto max-w-4xl bg-paper px-5 py-4 shadow-[0_-2px_0_rgba(47,45,42,0.08)]">
              <SketchFrame id="cookie-banner" variant="panel" strokeWidth={1.7} />
              <div className="relative z-10 flex flex-wrap items-center gap-4">
                <p className="flex-1 font-hand text-[15px]">
                  🍪 We use cookies. We used them before you arrived. Cookies accepted so
                  far today: <b>{accepted.toLocaleString()}</b>.
                  <button
                    className="ml-2 align-baseline text-[7px] text-graphite-faint underline"
                    onClick={() => {
                      setPrefs(true);
                      trust("optOut");
                      remember("deny", "opened cookie preferences");
                    }}
                  >
                    Manage preferences
                  </button>
                </p>
                <SketchButton
                  variant="primary"
                  sketchId="cookie-accept"
                  onClick={() => {
                    setOpen(false);
                    bump("cookie-accepts");
                    trust("interact");
                  }}
                >
                  Accept
                </SketchButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SketchDialogRoot open={prefs} onOpenChange={setPrefs}>
        <SketchDialogContent
          title="Cookie preferences"
          description="Granular control over what we already did."
        >
          <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-2">
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-dashed border-graphite-ghost pb-1 font-note text-xs uppercase tracking-widest text-graphite-faint">
              <span>Vendor</span>
              <span>Consent</span>
              <span>Legitimate interest</span>
            </div>
            {VENDORS.map((v) => (
              <div key={v} className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                <span className="font-hand text-[15px]">{v}</span>
                <SketchSwitch checked disabled aria-label={`${v} consent`} />
                <span className="w-24 text-center font-typed text-sm">yes</span>
              </div>
            ))}
            <p className="pt-2 font-note text-xs text-graphite-faint">
              886 further vendors are not listed, for readability.
            </p>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <SketchButton
              sketchId="cookie-prefs-save"
              onClick={() => {
                setPrefs(false);
                setOpen(false);
              }}
            >
              Save preferences
            </SketchButton>
          </div>
        </SketchDialogContent>
      </SketchDialogRoot>
    </>
  );
}
