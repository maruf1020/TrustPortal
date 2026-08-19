"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { jitter } from "@/lib/rng";
import { SketchFrame, type SketchVariant } from "./sketch-frame";

export function SketchCard({
  children,
  className,
  sketchId,
  variant = "panel",
  tilt = true,
  fill,
  fillStyle,
  as: Tag = "div",
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  sketchId?: string;
  variant?: SketchVariant;
  tilt?: boolean;
  fill?: string;
  fillStyle?: "hachure" | "solid" | "cross-hatch" | "zigzag" | "dots";
  as?: React.ElementType;
}) {
  const autoId = useId();
  const id = sketchId ?? autoId;
  const rot = tilt ? jitter(id + ":tilt", -0.55, 0.55) : 0;
  return (
    <Tag
      className={cn("paper-card relative p-5", className)}
      style={{ transform: `rotate(${rot}deg)` }}
      {...rest}
    >
      <SketchFrame id={id} variant={variant} fill={fill} fillStyle={fillStyle} />
      <div className="relative z-10">{children}</div>
    </Tag>
  );
}

/** A torn-off sticky note. Used where the site wants to seem casual about it. */
export function StickyNote({
  children,
  className,
  tone = "yellow",
  rotate,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "yellow" | "blue" | "pink";
  rotate?: number;
}) {
  const autoId = useId();
  const bg =
    tone === "yellow" ? "#f7e9a8" : tone === "blue" ? "#d6e4f0" : "#f2d7d9";
  const rot = rotate ?? jitter(autoId + ":note", -2.4, 2.4);
  return (
    <div
      className={cn("sticky-note relative px-5 py-4 font-note text-graphite shadow-[3px_4px_0_rgba(47,45,42,0.12)]", className)}
      style={{ background: bg, transform: `rotate(${rot}deg)` }}
    >
      <SketchFrame id={autoId} variant="box" strokeWidth={1.2} roughness={2.4} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/** Hand-ruled divider. */
export function SketchRule({ className, id }: { className?: string; id?: string }) {
  const autoId = useId();
  return (
    <div className={cn("relative h-3 w-full", className)}>
      <SketchFrame id={id ?? autoId} variant="underline" strokeWidth={1.2} roughness={2.4} />
    </div>
  );
}

export function SketchHeading({
  children,
  className,
  level = 2,
  underline = true,
}: {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3;
  underline?: boolean;
}) {
  const autoId = useId();
  const Tag = (`h${level}` as unknown) as React.ElementType;
  const size =
    level === 1 ? "text-4xl sm:text-5xl" : level === 2 ? "text-2xl sm:text-3xl" : "text-xl";
  return (
    <div className="relative inline-block">
      <Tag className={cn("font-display", size, className)}>{children}</Tag>
      {underline && (
        <div className="relative -mt-1 h-3 w-full">
          <SketchFrame id={autoId} variant="underline" strokeWidth={1.4} roughness={2.6} />
        </div>
      )}
    </div>
  );
}

/** Small circled annotation, the way you'd ring something on a printout. */
export function Circled({ children, className }: { children: React.ReactNode; className?: string }) {
  const autoId = useId();
  return (
    <span className={cn("relative inline-block px-3 py-1", className)}>
      <SketchFrame id={autoId} variant="ellipse" stroke="#b4392f" strokeWidth={1.4} roughness={2.2} />
      <span className="relative z-10">{children}</span>
    </span>
  );
}
