"use client";

import { useId } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { SketchFrame } from "./sketch-frame";

/* ---------------------------------------------------------------- tooltip -- */

export const TooltipProvider = TooltipPrimitive.Provider;

export function SketchTooltip({
  children,
  content,
  side = "top",
  open,
  defaultOpen,
  delay = 120,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  open?: boolean;
  defaultOpen?: boolean;
  delay?: number;
}) {
  const autoId = useId();
  if (!content) return <>{children}</>;
  return (
    <TooltipPrimitive.Root delayDuration={delay} open={open} defaultOpen={defaultOpen}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={10}
          className="z-50 max-w-xs scribble-in"
        >
          <div className="relative bg-paper px-4 py-2 font-note text-sm text-graphite shadow-[2px_3px_0_rgba(47,45,42,0.15)]">
            <SketchFrame id={autoId} variant="box" strokeWidth={1.3} roughness={2} />
            <span className="relative z-10">{content}</span>
          </div>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

/* ----------------------------------------------------------------- dialog -- */

export const SketchDialogRoot = DialogPrimitive.Root;
export const SketchDialogTrigger = DialogPrimitive.Trigger;
export const SketchDialogClose = DialogPrimitive.Close;

export function SketchDialogContent({
  children,
  className,
  title,
  description,
  hideClose,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
  description?: string;
  hideClose?: boolean;
}) {
  const autoId = useId();
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[rgba(47,45,42,0.28)] backdrop-blur-[1px] data-[state=open]:animate-[scribble-in_0.2s_ease-out]" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[min(94vw,34rem)] -translate-x-1/2 -translate-y-1/2 scribble-in",
          className,
        )}
      >
        <div className="relative bg-paper p-7 shadow-[5px_7px_0_rgba(47,45,42,0.16)]">
          <SketchFrame id={autoId} variant="panel" strokeWidth={1.9} />
          <div className="relative z-10">
            <DialogPrimitive.Title className="font-display text-2xl">{title}</DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description className="mt-1 font-note text-sm text-graphite-soft">
                {description}
              </DialogPrimitive.Description>
            ) : (
              <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
            )}
            <div className="mt-4">{children}</div>
            {!hideClose && (
              <DialogPrimitive.Close
                className="absolute -right-2 -top-2 font-display text-2xl leading-none text-graphite-faint hover:text-redpencil"
                aria-label="Close"
              >
                ×
              </DialogPrimitive.Close>
            )}
          </div>
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/* ---------------------------------------------------------------- popover -- */

export const SketchPopoverRoot = PopoverPrimitive.Root;
export const SketchPopoverTrigger = PopoverPrimitive.Trigger;

export function SketchPopoverContent({
  children,
  className,
  align = "end",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
}) {
  const autoId = useId();
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={12}
        className={cn("z-50 w-[min(92vw,22rem)] scribble-in", className)}
      >
        <div className="relative bg-paper p-4 shadow-[4px_5px_0_rgba(47,45,42,0.14)]">
          <SketchFrame id={autoId} variant="panel" strokeWidth={1.6} />
          <div className="relative z-10">{children}</div>
        </div>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}
