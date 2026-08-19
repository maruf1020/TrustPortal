"use client";

import { forwardRef, useId } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SketchFrame } from "./sketch-frame";

/* ------------------------------------------------------------------ input -- */

export const SketchInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { sketchId?: string; wrapperClassName?: string }
>(function SketchInput({ className, sketchId, wrapperClassName, ...props }, ref) {
  const autoId = useId();
  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <SketchFrame id={sketchId ?? autoId} variant="box" strokeWidth={1.4} roughness={1.7} />
      <input
        ref={ref}
        className={cn(
          "relative z-10 w-full bg-transparent px-4 py-2.5 font-hand text-graphite outline-none placeholder:text-graphite-ghost",
          className,
        )}
        {...props}
      />
    </div>
  );
});

export function SketchLabel({
  children,
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("mb-1.5 block font-note text-sm text-graphite-soft", className)} {...props}>
      {children}
    </label>
  );
}

export function SketchTextarea({
  className,
  sketchId,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { sketchId?: string }) {
  const autoId = useId();
  return (
    <div className="relative w-full">
      <SketchFrame id={sketchId ?? autoId} variant="box" strokeWidth={1.4} roughness={1.7} />
      <textarea
        className={cn(
          "relative z-10 w-full resize-none bg-transparent px-4 py-3 font-hand text-graphite outline-none placeholder:text-graphite-ghost",
          className,
        )}
        {...props}
      />
    </div>
  );
}

/* --------------------------------------------------------------- checkbox -- */

export function SketchCheckbox({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>) {
  const autoId = useId();
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "relative grid h-6 w-6 shrink-0 place-content-center transition-transform active:scale-95",
        className,
      )}
      {...props}
    >
      <SketchFrame id={autoId} variant="box" strokeWidth={1.5} roughness={2.1} />
      <CheckboxPrimitive.Indicator className="relative z-10">
        <Check className="h-4 w-4 stroke-[3] text-redpencil" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

/* ----------------------------------------------------------------- switch -- */

export function SketchSwitch({
  className,
  checked,
  ...props
}: React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>) {
  const autoId = useId();
  return (
    <SwitchPrimitive.Root
      checked={checked}
      className={cn("relative h-7 w-14 shrink-0 cursor-pointer", className)}
      {...props}
    >
      <SketchFrame id={autoId} variant="ellipse" strokeWidth={1.5} roughness={1.8} />
      <SwitchPrimitive.Thumb asChild>
        <span className="relative z-10 block h-5 w-5 translate-x-1.5 transition-transform duration-200 data-[state=checked]:translate-x-[30px]">
          <SketchFrame
            id={autoId + ":thumb"}
            variant="circle"
            strokeWidth={1.6}
            roughness={1.4}
            fill={checked ? "#b4392f" : "#2f2d2a"}
            fillStyle="hachure"
            fillWeight={1.4}
          />
        </span>
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

/* ----------------------------------------------------------------- slider -- */

export function SketchSlider({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>) {
  const autoId = useId();
  return (
    <SliderPrimitive.Root
      className={cn("relative flex w-full touch-none select-none items-center py-3", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-3 w-full grow">
        <SketchFrame id={autoId} variant="box" strokeWidth={1.3} roughness={2.2} />
        <SliderPrimitive.Range className="absolute h-full">
          <span className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent_0_3px,rgba(47,45,42,0.35)_3px_4px)]" />
        </SliderPrimitive.Range>
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label="value"
        className="relative block h-6 w-6 cursor-grab active:cursor-grabbing"
      >
        <SketchFrame id={autoId + ":thumb"} variant="circle" strokeWidth={1.8} fill="#2f2d2a" fillStyle="hachure" />
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
}

/* --------------------------------------------------------------- progress -- */

export function SketchProgress({
  value,
  className,
  tone = "graphite",
}: {
  value: number;
  className?: string;
  tone?: "graphite" | "red";
}) {
  const autoId = useId();
  return (
    <div className={cn("relative h-4 w-full", className)}>
      <SketchFrame id={autoId} variant="box" strokeWidth={1.3} roughness={2.2} />
      <div
        className="absolute inset-y-[3px] left-[3px] z-10 transition-[width] duration-500"
        style={{
          width: `calc(${Math.max(0, Math.min(100, value))}% - 6px)`,
          backgroundImage:
            tone === "red"
              ? "repeating-linear-gradient(-45deg,transparent 0 3px,rgba(180,57,47,0.55) 3px 5px)"
              : "repeating-linear-gradient(-45deg,transparent 0 3px,rgba(47,45,42,0.4) 3px 5px)",
        }}
      />
    </div>
  );
}
