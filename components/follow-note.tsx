import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const hand = {
  fontFamily: "var(--font-family-hand), 'Comic Sans MS', cursive",
} as const;

/**
 * "Follow me ——[" note in the left margin. Desktop only (xl and up).
 * Put it inside a `relative` element: the bracket stretches to that element's height.
 */
export function FollowNote({
  children = "Follow me",
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-y-0 right-full mr-3 hidden items-center gap-1 text-neutral-500 dark:text-neutral-400 xl:flex",
        className,
      )}
    >
      <span
        style={hand}
        className="-rotate-6 whitespace-nowrap text-[1.7rem] leading-none"
      >
        {children}
      </span>

      {/* Connector line + bracket, stretched to the height of the parent */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-full w-20 shrink-0"
      >
        {/* line from the text to the bracket */}
        <path
          d="M2 50 C22 49 42 51 62 50"
          vectorEffect="non-scaling-stroke"
        />
        {/* bracket: top arm, spine, bottom arm */}
        <path
          d="M90 4 C76 2 64 2 62 12 C60 36 63 64 62 88 C64 98 76 98 90 96"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}