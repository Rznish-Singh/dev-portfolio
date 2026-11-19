// Hand-drawn "New" with a scribbled pink loop around it. It draws itself, holds, then repeats.
// Use it right after a post title in the writing list:  {post.title}<NewBadge date={post.date} />
// It hides itself when the post is older than `days` (default 14). Pass `force` to always show it.

export function isRecent(date: string, days = 14) {
  const diff = Date.now() - new Date(date).getTime();
  return Number.isFinite(diff) && diff <= days * 86_400_000;
}

export function NewBadge({ date, days = 14, force = false, className = "" }: { date?: string; days?: number; force?: boolean; className?: string }) {
  if (!force && date && !isRecent(date, days)) return null;
  return (
    <span className={`ml-2 inline-block align-middle ${className}`} aria-label="New">
      <style>{`
        .nb-loop{stroke-dasharray:1;stroke-dashoffset:1;animation:nbDraw 5s ease-in-out infinite}
        @keyframes nbDraw{0%{stroke-dashoffset:1;opacity:1}18%,88%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:0;opacity:0}}
        @media (prefers-reduced-motion:reduce){.nb-loop{animation:none;stroke-dashoffset:0}}
      `}</style>
      <svg viewBox="0 0 64 30" className="h-6 w-[3.2rem] -rotate-3 text-[#FF2D55] dark:text-[#FF6482]" fill="none" aria-hidden>
        <path className="nb-loop" pathLength={1} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          d="M12 6C26 0 54 2 60 12C64 22 38 29 20 26C4 23 -1 11 10 6C22 1 48 3 57 8" />
        <text x="32" y="19.5" textAnchor="middle" fontSize="13" fontWeight="600" fill="currentColor" style={{ fontFamily: "inherit" }}>New</text>
      </svg>
    </span>
  );
}
