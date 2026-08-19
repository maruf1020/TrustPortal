"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";
import { cn } from "@/lib/utils";
import { hashString } from "@/lib/rng";

export type SketchVariant =
  | "box"
  | "panel"
  | "button"
  | "tab"
  | "circle"
  | "ellipse"
  | "underline"
  | "strike"
  | "bracket";

const PENCIL = "#2f2d2a";

/**
 * Draws the shape. Everything on this site is hand-drawn, and stays hand-drawn:
 * the roughjs seed is derived from a stable string, so a re-render never
 * re-scribbles. (A joke that changes on every render reads as a bug.)
 */
function drawShape(
  svg: SVGSVGElement,
  variant: SketchVariant,
  w: number,
  h: number,
  seed: number,
  opts: Options,
) {
  const rc = rough.svg(svg);
  const nodes: SVGGElement[] = [];
  // Drop undefined keys before merging — an explicit `roughness: undefined`
  // overrides the default and roughjs then computes NaN coordinates.
  const given = Object.fromEntries(
    Object.entries(opts).filter(([, v]) => v !== undefined),
  ) as Options;
  const base: Options = { seed, stroke: PENCIL, strokeWidth: 1.6, roughness: 1.5, bowing: 1.4, ...given };
  // Enough inset that the stroke's wobble stays inside the element's own box.
  const pad = Math.min(2, w / 4, h / 4);

  switch (variant) {
    case "box":
    case "panel":
    case "button":
      nodes.push(rc.rectangle(pad, pad, Math.max(1, w - pad * 2), Math.max(1, h - pad * 2), base));
      // A second, fainter pass. Nobody draws a box once.
      if (variant !== "button") {
        nodes.push(
          rc.rectangle(pad + 1.5, pad + 1.5, Math.max(1, w - pad * 2 - 3), Math.max(1, h - pad * 2 - 3), {
            ...base,
            seed: seed + 7,
            strokeWidth: 0.9,
            roughness: 2.1,
            stroke: PENCIL,
          }),
        );
        (nodes[1] as SVGGElement).setAttribute("opacity", "0.32");
      }
      break;

    case "tab":
      nodes.push(
        rc.path(
          `M ${pad} ${h} L ${pad} ${pad + 6} Q ${pad} ${pad} ${pad + 8} ${pad} L ${w - pad - 8} ${pad} Q ${w - pad} ${pad} ${w - pad} ${pad + 6} L ${w - pad} ${h}`,
          base,
        ),
      );
      break;

    case "circle":
      nodes.push(rc.circle(w / 2, h / 2, Math.min(w, h) - pad * 2, base));
      break;

    case "ellipse":
      nodes.push(rc.ellipse(w / 2, h / 2, w - pad * 2, h - pad * 2, base));
      break;

    case "underline":
      nodes.push(rc.line(pad, h - 3, w - pad, h - 4, { ...base, roughness: 2.2 }));
      nodes.push(rc.line(pad + 3, h - 1, w - pad - 2, h - 2, { ...base, seed: seed + 3, strokeWidth: 1, roughness: 2.6 }));
      (nodes[1] as SVGGElement).setAttribute("opacity", "0.5");
      break;

    case "strike":
      nodes.push(rc.line(pad, h / 2, w - pad, h / 2 + 1, { ...base, stroke: "#b4392f", roughness: 2 }));
      break;

    case "bracket":
      nodes.push(rc.path(`M ${pad + 10} ${pad} L ${pad} ${pad} L ${pad} ${h - pad} L ${pad + 10} ${h - pad}`, base));
      nodes.push(
        rc.path(`M ${w - pad - 10} ${pad} L ${w - pad} ${pad} L ${w - pad} ${h - pad} L ${w - pad - 10} ${h - pad}`, {
          ...base,
          seed: seed + 11,
        }),
      );
      break;
  }

  nodes.forEach((n) => svg.appendChild(n));
}

export interface SketchFrameProps {
  variant?: SketchVariant;
  /** Stable identity for this shape. Same id → same wobble, forever. */
  id: string;
  className?: string;
  stroke?: string;
  strokeWidth?: number;
  roughness?: number;
  fill?: string;
  fillStyle?: Options["fillStyle"];
  fillWeight?: number;
  hachureAngle?: number;
}

export function SketchFrame({
  variant = "box",
  id,
  className,
  stroke,
  strokeWidth,
  roughness,
  fill,
  fillStyle = "hachure",
  fillWeight,
  hachureAngle,
}: SketchFrameProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const svg = svgRef.current;
    const host = svg?.parentElement;
    if (!svg || !host) return;
    // Border box, not content box: the frame is drawn around the whole element,
    // padding included, which is where a person would actually draw it.
    const measure = () => {
      const width = host.offsetWidth;
      const height = host.offsetHeight;
      setSize((prev) =>
        Math.abs(prev.w - width) < 1 && Math.abs(prev.h - height) < 1
          ? prev
          : { w: Math.round(width), h: Math.round(height) },
      );
    };
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    measure();
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || size.w < 2 || size.h < 2) return;
    svg.replaceChildren();
    drawShape(svg, variant, size.w, size.h, hashString(id) % 9973, {
      stroke,
      strokeWidth,
      roughness,
      fill,
      fillStyle,
      fillWeight,
      hachureAngle,
    });
  }, [size, variant, id, stroke, strokeWidth, roughness, fill, fillStyle, fillWeight, hachureAngle]);

  return (
    <svg
      ref={svgRef}
      className={cn("sketch-svg pointer-events-none absolute inset-0 h-full w-full overflow-visible", className)}
      width={size.w}
      height={size.h}
      aria-hidden="true"
      focusable="false"
    />
  );
}
