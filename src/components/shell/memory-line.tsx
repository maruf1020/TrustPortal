"use client";

import { useTrust } from "@/lib/trust-provider";
import { MEMORY_LINES } from "@/lib/copy";
import { StickyNote } from "@/components/sketch";

/**
 * Level 2 unlocks Memory.
 *
 * The rule: never fabricate. Only ever quote back something the visitor
 * actually did. A wrong callback reads as a bug; a right one raises the hair
 * on their arms, which is the entire point of the feature.
 */
export function MemoryLine({ className }: { className?: string }) {
  const { level, counters, memory, displayName } = useTrust();
  if (level < 2) return null;

  const candidates = Object.entries(MEMORY_LINES)
    .map(([kind, fn]) => ({ kind, n: counters[kind] ?? 0, fn }))
    .filter((c) => c.n > 0)
    .sort((a, b) => b.n - a.n);

  const search = [...memory].reverse().find((m) => m.kind === "search");

  const lines: string[] = [];
  if (candidates[0]) lines.push(candidates[0].fn(candidates[0].n));
  if (search) lines.push(`Last time you searched for “${search.detail}.”`);
  if (!lines.length) return null;

  return (
    <StickyNote tone="blue" className={className}>
      <p className="font-note text-[11px] uppercase tracking-widest text-graphite-faint">
        A note we kept
      </p>
      {lines.slice(0, 2).map((l) => (
        <p key={l} className="mt-1 font-hand text-[15px]">
          {l}
        </p>
      ))}
      {level >= 3 && (
        <p className="mt-1 font-hand text-[15px]">
          We like having you here, {displayName}.
        </p>
      )}
    </StickyNote>
  );
}
