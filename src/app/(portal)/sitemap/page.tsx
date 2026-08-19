"use client";

import Link from "next/link";
import { SketchCard, SketchHeading, SketchRule, StickyNote } from "@/components/sketch";

export default function SitemapPage() {
  return (
    <div className="pb-6">
      <SketchHeading level={1}>Sitemap</SketchHeading>
      <p className="mt-2 font-note text-sm text-graphite-soft">
        A complete index of every page on TrustPortal.
      </p>

      <SketchCard sketchId="sitemap-card" className="mt-6 max-w-xl">
        <p className="font-display text-2xl">All pages</p>
        <SketchRule className="my-3" />
        <ul className="space-y-1">
          <li>
            <Link href="/sitemap" className="font-hand text-[17px] text-bluepencil sketch-underline">
              Sitemap
            </Link>
          </li>
        </ul>
      </SketchCard>

      <StickyNote tone="yellow" className="mt-6 max-w-sm">
        <p className="font-hand text-[15px]">
          The index is complete. The site is larger than the index. Both statements are
          maintained by the same team.
        </p>
      </StickyNote>
    </div>
  );
}
