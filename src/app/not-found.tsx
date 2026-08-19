"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ERRORS } from "@/lib/copy";
import { SketchButton, SketchCard, SketchHeading, StickyNote } from "@/components/sketch";

export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter();
  const [depth, setDepth] = useState(0);
  const [wrongHome, setWrongHome] = useState(false);

  // "Nice." — for the people who try /admin.
  const admin = pathname?.startsWith("/admin");

  return (
    <div className="grid min-h-dvh place-items-center px-5 py-10">
      <div
        className="w-full max-w-xl"
        style={{ fontSize: `${Math.max(0.35, 1 - depth * 0.09)}em` }}
      >
        <SketchHeading level={1}>{admin ? "Nice." : "404"}</SketchHeading>

        <SketchCard sketchId={`nf-${depth}`} className="mt-5">
          <p className="font-hand text-[17px]">
            {admin
              ? "There is no admin panel. There is no admin. There is a dog."
              : ERRORS[404]}
          </p>
          <p className="mt-2 font-note text-sm text-graphite-faint">
            Requested: <span className="font-typed">{pathname}</span>
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <SketchButton
              sketchId={`report-${depth}`}
              onClick={() => setDepth((d) => Math.min(d + 1, 7))}
            >
              Report this issue
            </SketchButton>
            <SketchButton
              variant="quiet"
              sketchId={`home-${depth}`}
              onClick={() => {
                // A subtly wrong homepage, for one second, before it corrects itself.
                setWrongHome(true);
                window.setTimeout(() => {
                  setWrongHome(false);
                  router.push("/dashboard");
                }, 1000);
              }}
            >
              Go back home
            </SketchButton>
          </div>

          {depth > 0 && (
            <p className="mt-3 font-note text-xs text-graphite-faint">
              Report filed {depth} {depth === 1 ? "time" : "times"}. Each report opens this
              page.
            </p>
          )}
        </SketchCard>

        <StickyNote tone="yellow" className="mt-6 max-w-sm">
          <p className="font-hand text-[15px]">
            Or don&rsquo;t report it.{" "}
            <Link href="/dashboard" className="sketch-underline">
              This link works.
            </Link>
          </p>
        </StickyNote>
      </div>

      {wrongHome && (
        <div
          className="fixed inset-0 z-[90] grid place-content-center bg-paper"
          style={{ filter: "invert(1)", transform: "scaleX(-1)" }}
          aria-hidden="true"
        >
          <p className="font-display text-6xl">TrustPortal</p>
          <p className="text-center font-note">Trust, delivered.</p>
        </div>
      )}
    </div>
  );
}
