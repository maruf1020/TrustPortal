"use client";

import { useEffect, useState } from "react";
import { useTrust } from "@/lib/trust-provider";
import {
  SketchButton,
  SketchCard,
  SketchHeading,
  SketchRule,
  SketchSwitch,
  StickyNote,
} from "@/components/sketch";

const CATEGORIES = [
  { name: "Strictly necessary", note: "Necessary for us." },
  { name: "Functional", note: "Functions." },
  { name: "Performance", note: "Performs." },
  { name: "Targeting", note: "Targets." },
  { name: "Optional", note: "Not optional." },
  { name: "Cookies about cookies", note: "Meta-necessary." },
];

export default function CookiesPage() {
  const { trust } = useTrust();
  const [count, setCount] = useState(1_204_811);

  useEffect(() => {
    const id = window.setInterval(() => setCount((c) => c + Math.ceil(Math.random() * 6)), 700);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => trust("legalRead"), 8000);
    return () => window.clearTimeout(id);
  }, [trust]);

  return (
    <div className="pb-6">
      <SketchHeading level={1}>Cookie Policy</SketchHeading>
      <p className="mt-2 font-note text-sm text-graphite-soft">
        Cookies accepted on your behalf so far: <b>{count.toLocaleString()}</b>
      </p>

      <SketchCard sketchId="cookie-policy" className="mt-6 max-w-3xl">
        <p className="font-hand text-[17px]">
          We use cookies to remember you. We used them before you arrived, which is how we
          knew to expect you.
        </p>
        <SketchRule className="my-4" />
        {CATEGORIES.map((c) => (
          <div key={c.name} className="flex items-center justify-between gap-4 py-2">
            <div>
              <p className="font-hand text-[15px]">{c.name}</p>
              <p className="font-note text-xs text-graphite-faint">{c.note}</p>
            </div>
            <SketchSwitch checked disabled aria-label={c.name} />
          </div>
        ))}
        <SketchRule className="my-4" />
        <p className="font-note text-sm text-graphite-soft">
          900 vendors are listed in the preferences dialog. A further 886 are not listed,
          for readability.
        </p>
        <SketchButton size="sm" className="mt-3" variant="primary" sketchId="cookie-accept-page">
          Accept
        </SketchButton>
        <p className="mt-2 font-note text-xs text-graphite-faint">
          There is no reject button. Accepting changes nothing.
        </p>
      </SketchCard>

      <StickyNote tone="yellow" className="mt-6 max-w-md">
        <p className="font-hand text-[15px]">
          This site sets no cookies at all. It uses localStorage, which is worse in every
          way except legally.
        </p>
      </StickyNote>
    </div>
  );
}
