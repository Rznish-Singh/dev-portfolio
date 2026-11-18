"use client";

import { useCallback, useId, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { smallBurst } from "./effects";
import DiyaPopup from "./DiyaPopup";

const DIYAS = [
  { pos: { left: 12 }, size: 96, variant: "clay", md: false },
  { pos: { left: 120 }, size: 70, variant: "brass", md: true },
  { pos: { right: 120 }, size: 70, variant: "brass", md: true },
  { pos: { right: 12 }, size: 96, variant: "clay", md: false },
] as const;

function Diya({ lit, variant }: { lit: boolean; variant: "clay" | "brass" }) {
  const id = useId();
  const clay = variant === "clay";
  return (
    <svg viewBox="0 0 100 92" className="relative block h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={clay ? "#d9531a" : "#e8b44e"} />
          <stop offset="1" stopColor={clay ? "#7c2d12" : "#a8741a"} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="24" r="22" fill="#ffd98a" opacity={lit ? 0.35 : 0} style={{ transition: "opacity .5s" }} />
      <g style={{ transform: lit ? "scale(1)" : "scale(0)", opacity: lit ? 1 : 0, transformOrigin: "50px 40px", transition: "transform .35s cubic-bezier(.3,1.6,.5,1), opacity .3s" }}>
        <g className={lit ? "dw-flame" : undefined}>
          <path d="M50 4C60 17 64 28 50 41C36 28 40 17 50 4Z" fill="#ffb020" />
          <path d="M50 18C55.5 25 57 30 50 38C43 30 44.500 25 50 18Z" fill="#fff4b0" />
        </g>
      </g>
      <rect x="48.5" y="36" width="3" height="7" rx="1.500" fill="#2b1a10" />
      {clay ? (
        <>
          <path d="M5 46Q50 32 95 46Q89 82 50 84Q11 82 5 46Z" fill={`url(#${id}b)`} />
          <path d="M5 46Q50 38 95 46Q50 54 5 46Z" fill="#f08a3c" />
          <path d="M16 62Q50 70 84 62" stroke="#ffcf5a" strokeWidth="2" fill="none" />
          <g fill="#ffcf5a"><circle cx="30" cy="70" r="2" /><circle cx="50" cy="75" r="2" /><circle cx="70" cy="70" r="2" /></g>
        </>
      ) : (
        <>
          <path d="M10 46Q50 34 90 46Q84 68 50 70Q16 68 10 46Z" fill={`url(#${id}b)`} />
          <path d="M10 46Q50 40 90 46Q50 52 10 46Z" fill="#f6d27a" />
          <rect x="43" y="68" width="14" height="10" fill="#c9922e" />
          <path d="M26 90L74 90Q68 76 50 76Q32 76 26 90Z" fill={`url(#${id}b)`} />
        </>
      )}
    </svg>
  );
}

/** Four clickable diyas. First light of each one fires a small confetti burst. */
export default function InteractiveDiyas() {
  const [lit, setLit] = useState<boolean[]>(() => DIYAS.map(() => false));
  const [popup, setPopup] = useState(false);
  const closePopup = useCallback(() => setPopup(false), []);
  const seen = useRef<boolean[]>(DIYAS.map(() => false));

  const toggle = (i: number, e: MouseEvent<HTMLButtonElement>) => {
    const on = !lit[i];
    setLit((l) => l.map((v, j) => (j === i ? on : v)));
    if (on) setPopup(true);
    if (on && !seen.current[i]) {
      seen.current[i] = true;
      const r = e.currentTarget.getBoundingClientRect();
      smallBurst(r.left + r.width / 2, r.top + 8);
    }
  };

  return (
    <>
      {DIYAS.map((d, i) => (
        <button
          key={i}
          type="button"
          aria-pressed={lit[i]}
          aria-label={lit[i] ? "Put out the diya" : "Light the diya"}
          onClick={(e) => toggle(i, e)}
          className={`dw-rise dw-diya${d.md ? " dw-diya-md" : ""}`}
          style={{ ...d.pos, "--w": `${d.size}px` } as CSSProperties}
        >
          <span
            aria-hidden="true"
            style={{
              position: "absolute", left: "50%", top: "8%", width: 256, height: 256, marginLeft: -128, marginTop: -128,
              borderRadius: "50%", pointerEvents: "none", transition: "all .5s",
              background: "radial-gradient(rgba(255,180,60,.4), rgba(255,140,40,.13) 45%, transparent 70%)",
              opacity: lit[i] ? 1 : 0, transform: `scale(${lit[i] ? 1 : 0.4})`,
            }}
          />
          <Diya lit={lit[i]} variant={d.variant} />
        </button>
      ))}
      {popup && <DiyaPopup onClose={closePopup} />}
    </>
  );
}
