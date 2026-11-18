import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------- hand-drawn SVGs (stroke only, colour comes from text-*) ---------- */

const svgProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Ghost = () => (
  <svg viewBox="0 0 64 80" {...svgProps}>
    <path d="M10 70C8 40 10 12 32 10c22-2 24 28 22 58-4-4-7 4-11-2-4 6-7-2-11 4-4-6-7 2-11-4-4 6-7-2-11 4Z" />
    <path d="M24 32v4M40 32v4" />
    <path d="M27 45q5 5 10 0" />
  </svg>
);

const Star = () => (
  <svg viewBox="0 0 64 64" {...svgProps}>
    <path d="M32 6l7 18 19 1-15 12 5 19-16-11-16 11 5-19L6 25l19-1Z" />
    <path d="M27 30v3M37 30v3" />
    <path d="M28 39q4 4 8 0" />
  </svg>
);

const Wand = () => (
  <svg viewBox="0 0 64 64" {...svgProps}>
    <path d="M8 54 34 28" strokeWidth={5} />
    <path d="M46 6l3 8 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z" />
    <path d="M56 36v6M53 39h6M10 20v5M8 22.5h5" />
  </svg>
);

const Hat = () => (
  <svg viewBox="0 0 90 70" {...svgProps}>
    <path d="M6 52c0-6 24-10 42-8 18-2 36 4 36 9 0 6-24 9-40 8-18 1-38-2-38-9Z" />
    <path d="M28 44 30 14c8-4 24-4 32 0l2 30" />
    <path d="M30 14c2 5 30 5 32 0" />
    <path d="M29 34c11 4 23 4 34 0" />
  </svg>
);

const Cat = () => (
  <svg viewBox="0 0 100 90" {...svgProps}>
    <path d="M20 40C20 22 36 16 50 16c16 0 30 8 30 26 0 20-14 30-30 30-16 0-30-12-30-32Z" />
    <path d="M24 30 22 8l18 12M76 30l4-22-20 12" />
    <path d="M14 44 2 42M14 50 4 54M86 44l12-2M86 50l10 4" />
    <path d="M38 40v3M62 40v3" />
    <path d="M44 54q3 4 6 0 3 4 6 0" />
  </svg>
);

/* ---------- placement: edit this list to add, move or remove doodles ---------- */

type Doodle = {
  id: string;
  icon: ReactNode;
  /** Tailwind position + size + colour. Keep left/right under ~8% so it stays in the margin. */
  className: string;
  rotate: number; // degrees
  delay: number; // seconds, so they don't float in sync
};

const doodles: Doodle[] = [
  { id: "cat",   icon: <Cat />,   className: "left-[4%] top-[14%] w-14 xl:w-20 text-blue-500",       rotate: -6, delay: 0 },
  { id: "hat",   icon: <Hat />,   className: "left-[5%] top-[52%] w-14 xl:w-20 text-neutral-600 dark:text-neutral-300", rotate: -8, delay: 0.8 },
  { id: "star",  icon: <Star />,  className: "left-[7%] top-[78%] w-10 xl:w-14 text-amber-400",      rotate: 10, delay: 1.4 },
  { id: "ghost", icon: <Ghost />, className: "right-[5%] top-[18%] w-10 xl:w-14 text-red-400",       rotate: 6,  delay: 0.4 },
  { id: "wand",  icon: <Wand />,  className: "right-[4%] top-[48%] w-12 xl:w-16 text-pink-500",      rotate: 0,  delay: 1.1 },
];

/** Fixed layer in the side margins. Place it next to <Info />. */
export function Doodles() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-10 hidden overflow-hidden lg:block"
    >
      {doodles.map((d) => (
        <div
          key={d.id}
          className={cn("doodle absolute", d.className)}
          style={
            { "--r": `${d.rotate}deg`, animationDelay: `${d.delay}s` } as CSSProperties
          }
        >
          {d.icon}
        </div>
      ))}
    </div>
  );
}