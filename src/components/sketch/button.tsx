"use client";

import { forwardRef, useId } from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { SketchFrame } from "./sketch-frame";

const buttonStyles = cva(
  "relative inline-flex select-none items-center justify-center gap-2 font-hand transition-transform duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45",
  {
    variants: {
      variant: {
        default: "text-graphite hover:-rotate-[0.4deg]",
        primary: "text-graphite font-note font-bold hover:-rotate-[0.5deg]",
        danger: "text-redpencil hover:rotate-[0.4deg]",
        quiet: "text-graphite-soft hover:text-graphite",
        link: "text-graphite underline decoration-dotted underline-offset-4 hover:text-redpencil",
      },
      size: {
        sm: "px-3 py-1 text-sm",
        md: "px-5 py-2 text-base",
        lg: "px-7 py-3 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface SketchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  asChild?: boolean;
  sketchId?: string;
  /** Renders without the drawn frame — for the plainest-looking button in a row. */
  bare?: boolean;
}

export const SketchButton = forwardRef<HTMLButtonElement, SketchButtonProps>(
  function SketchButton(
    { className, variant, size, asChild, sketchId, bare, children, ...props },
    ref,
  ) {
    const autoId = useId();
    const frame = !bare && variant !== "link" && (
      <SketchFrame
        id={sketchId ?? autoId}
        variant="button"
        strokeWidth={variant === "primary" ? 2.2 : 1.6}
        stroke={variant === "danger" ? "#b4392f" : undefined}
        fill={variant === "primary" ? "#f7e27f" : undefined}
        fillStyle="hachure"
        fillWeight={1.1}
        hachureAngle={-41}
      />
    );
    const classes = cn(buttonStyles({ variant, size }), className);

    // asChild: the consumer's element becomes the button and the drawn frame is
    // rendered inside it, so Slot still only ever sees one slottable child.
    if (asChild) {
      return (
        <Slot ref={ref} className={classes} {...props}>
          <Slottable>{children}</Slottable>
          {frame}
        </Slot>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {frame}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  },
);
