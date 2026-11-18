"use client";

import { useDiwali } from "./DiwaliProvider";

export default function DiwaliToggle({ className = "" }: { className?: string }) {
  const { active, toggle } = useDiwali();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={active}
      aria-label={active ? "Turn off Diwali mode" : "Celebrate Diwali"}
      title="Celebrate Diwali (Shift+D)"
      className={`dw-toggle grid h-10 w-10 place-items-center rounded-full border border-amber-500/30 transition hover:bg-amber-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="dw-pulse h-6 w-6 drop-shadow-[0_0_5px_rgba(255,176,32,.55)]" aria-hidden="true">
        <path d="M12 1.5c3 3.6 4.3 6 1.8 8.8-.4.4-1.2.4-1.6 0C9.7 7.5 9.8 5.1 12 1.5z" fill="#ffb020" />
        <path d="M3 13c3 1.4 15 1.4 18 0-.5 5.5-4 8.5-9 8.5S3.5 18.5 3 13z" fill="#c2410c" />
        <path d="M3 13c3 1.4 15 1.4 18 0" stroke="#ffcf5a" fill="none" strokeWidth="1.2" />
      </svg>
    </button>
  );
}
