"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";
import { hashString } from "@/lib/rng";
import { cn } from "@/lib/utils";

const PENCIL = "#2f2d2a";

/**
 * The team photo. Every headshot is the same golden retriever in a tie.
 * Drawn rather than photographed, so nobody has to license a real dog.
 */
export function DogAvatar({ size = 56, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={cn("shrink-0", className)} aria-hidden="true">
      <g stroke={PENCIL} strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* head */}
        <path d="M32 10c9 0 15 6.5 15 15.5 0 5-1.5 9-4 12-2.6 3.2-6.5 5-11 5s-8.4-1.8-11-5c-2.5-3-4-7-4-12C17 16.5 23 10 32 10Z" fill="#e8dcc0" />
        {/* ears */}
        <path d="M17.5 17c-4.5 1-6.5 6-6 11.5.4 4.6 2.4 8 5.5 9.5" fill="#d9c9a3" />
        <path d="M46.5 17c4.5 1 6.5 6 6 11.5-.4 4.6-2.4 8-5.5 9.5" fill="#d9c9a3" />
        {/* eyes */}
        <circle cx="26" cy="27" r="1.9" fill={PENCIL} />
        <circle cx="38" cy="27" r="1.9" fill={PENCIL} />
        {/* muzzle */}
        <path d="M27 36c1.6 2 3.2 3 5 3s3.4-1 5-3" />
        <path d="M32 33.5v2.5" />
        <ellipse cx="32" cy="32" rx="3.1" ry="2.2" fill={PENCIL} />
        {/* collar + tie: the entire point of the photograph */}
        <path d="M20 46c7 3.4 17 3.4 24 0" strokeWidth="2.2" />
        <path d="M32 47l-3.2 3.4 3.2 2.2 3.2-2.2L32 47Z" fill="#b4392f" stroke="#8f2b23" />
        <path d="M28.8 50.4 27 62h10l-1.8-11.6-3.2 2.2-3.2-2.2Z" fill="#b4392f" stroke="#8f2b23" />
      </g>
    </svg>
  );
}

/** A hand-drawn line chart. No axis labels; the legend is two shades of blue. */
export function SketchLineChart({
  points,
  height = 140,
  seed = "chart",
  className,
}: {
  points: number[];
  height?: number;
  seed?: string;
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    const host = svg?.parentElement;
    if (!svg || !host) return;

    const draw = () => {
      const w = host.clientWidth;
      const h = height;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      svg.replaceChildren();
      const rc = rough.svg(svg);
      const max = Math.max(...points, 1);
      const min = Math.min(...points, 0);
      const span = max - min || 1;
      const toXY = (v: number, i: number): [number, number] => [
        8 + (i * (w - 16)) / Math.max(1, points.length - 1),
        h - 10 - ((v - min) / span) * (h - 28),
      ];
      const path = points.map(toXY);

      // baseline
      svg.appendChild(
        rc.line(6, h - 8, w - 6, h - 8, { stroke: "#b8b2a5", strokeWidth: 1.1, roughness: 2.2, seed: hashString(seed) % 500 }),
      );
      // the series
      svg.appendChild(
        rc.linearPath(path, {
          stroke: "#35597e",
          strokeWidth: 2.1,
          roughness: 1.6,
          bowing: 1.2,
          seed: hashString(seed) % 9000,
        }),
      );
      // "Also Trust" — the same series, slightly lower, same colour
      svg.appendChild(
        rc.linearPath(
          path.map(([x, y]) => [x, Math.min(h - 12, y + 16)] as [number, number]),
          { stroke: "#35597e", strokeWidth: 1.3, roughness: 2.4, seed: hashString(seed + "b") % 9000 },
        ),
      );
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(host);
    return () => ro.disconnect();
  }, [points, height, seed]);

  return (
    <div className={cn("relative w-full", className)} style={{ height }}>
      <svg ref={ref} className="h-full w-full overflow-visible" aria-hidden="true" />
    </div>
  );
}

/** The Trust Score ring. Always between 85% and 150%. Calculated fairly. */
export function SketchRing({
  value,
  size = 150,
  label,
  seed = "ring",
}: {
  value: number;
  size?: number;
  label?: string;
  seed?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    svg.replaceChildren();
    const rc = rough.svg(svg);
    const r = size / 2 - 12;
    const c = size / 2;
    svg.appendChild(
      rc.circle(c, c, r * 2, {
        stroke: "#b8b2a5",
        strokeWidth: 1.4,
        roughness: 2.2,
        seed: hashString(seed) % 900,
      }),
    );
    const sweep = Math.min(1.999, (value / 100) * 1.6) * Math.PI;
    svg.appendChild(
      rc.arc(c, c, r * 2, r * 2, -Math.PI / 2, -Math.PI / 2 + sweep, false, {
        stroke: "#b4392f",
        strokeWidth: 3.2,
        roughness: 1.5,
        seed: hashString(seed + "arc") % 900,
      }),
    );
  }, [value, size, seed]);

  return (
    <div className="relative grid place-content-center" style={{ width: size, height: size }}>
      <svg ref={ref} width={size} height={size} className="absolute inset-0 overflow-visible" aria-hidden="true" />
      <div className="relative z-10 text-center">
        <p className="font-display text-4xl leading-none">{value}%</p>
        {label && <p className="font-note text-[11px] text-graphite-faint">{label}</p>}
      </div>
    </div>
  );
}
