import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const hand = {
  fontFamily: "var(--font-family-hand), 'Comic Sans MS', cursive",
} as const;

/**
 * Handwritten note with an arrow. Big screens only (xl and up).
 * Put it inside a `relative` section.
 */
export function HandNote({
  children,
  side = "right",
  className,
}: {
  children: ReactNode;
  side?: "left" | "right";
  className?: string;
}) {
  const right = side === "right";

  return (
    <div
      aria-hidden
      style={hand}
      className={cn(
        "pointer-events-none absolute top-6 hidden w-44 text-neutral-500 dark:text-neutral-400 xl:block",
        right ? "left-full ml-6 text-left" : "right-full mr-6 text-right",
        className,
      )}
    >
      <svg
        viewBox="0 0 80 70"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("mb-1 h-14 w-16", !right && "ml-auto -scale-x-100")}
      >
        <path d="M62 64C60 32 38 14 9 10" />
        <path d="M9 10 21 3M9 10 20 20" />
      </svg>

      <p className="-rotate-3 text-[1.7rem] leading-7">{children}</p>
    </div>
  );
}