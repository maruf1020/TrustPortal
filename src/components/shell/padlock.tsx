"use client";

import { cn } from "@/lib/utils";

/**
 * The padlock. It visibly locks tighter every time you interact with anything.
 * There is no explanation for this anywhere in the product, and never will be.
 */
export function Padlock({
  notches = 0,
  className,
  size = 28,
}: {
  notches?: number;
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 44"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {/* shackle — the part that tightens */}
      <g
        style={{
          transformOrigin: "20px 18px",
          transform: `rotate(${notches * 9}deg)`,
          transition: "transform 380ms cubic-bezier(.34,1.56,.64,1)",
        }}
      >
        <path
          d="M11 19v-6.5C11 7.9 15 5 20 5.2c4.6.2 8.4 3.4 8.6 7.6.1 2.2 0 4.2 0 6.2"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>
      {/* body — drawn twice, because nobody draws a box once */}
      <path
        d="M7.5 19.5c8-.6 17-.7 25 0 .8 5.6.9 12.3 0 18.2-8.4.9-16.9.8-25 0-.9-6-.8-12.4 0-18.2Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M9.4 21.4c7.2-.5 14.5-.6 21.2 0 .6 4.8.7 10.5 0 15.5-7 .7-14.2.6-21.2 0-.7-5.1-.6-10.7 0-15.5Z"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.35"
        fill="none"
      />
      <circle cx="20" cy="27.5" r="2.6" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <path d="M20 30v4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
