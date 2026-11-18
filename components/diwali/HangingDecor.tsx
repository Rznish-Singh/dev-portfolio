"use client";

import type { CSSProperties } from "react";
import { useDiwali } from "./DiwaliProvider";
import { playDing } from "./effects";

type Pal = [string, string, string];

function Lantern({ pal }: { pal: Pal }) {
  return (
    <svg viewBox="0 0 44 116" width="44" height="116" aria-hidden="true">
      <line x1="22" y1="0" x2="22" y2="22" stroke="#8a6a3a" strokeWidth="1.5" />
      <rect x="16" y="20" width="12" height="6" rx="2" fill="#d4a017" />
      <path d="M22 26L38 46L22 66L6 46Z" fill={pal[0]} />
      <path d="M22 26L38 46L22 66Z" fill={pal[1]} opacity=".55" />
      <path d="M6 46H38M13 36L31 56M31 36L13 56" stroke="#fff" strokeOpacity=".5" strokeWidth="1" />
      <rect x="18" y="66" width="8" height="4" rx="1" fill="#d4a017" />
      <g strokeWidth="3" strokeLinecap="round">
        <line x1="17" y1="72" x2="17" y2="108" stroke={pal[0]} />
        <line x1="22" y1="72" x2="22" y2="112" stroke={pal[1]} />
        <line x1="27" y1="72" x2="27" y2="108" stroke={pal[2]} />
      </g>
    </svg>
  );
}

function Bell() {
  return (
    <svg viewBox="0 0 44 96" width="40" height="88" aria-hidden="true">
      <line x1="22" y1="0" x2="22" y2="8" stroke="#8a6a3a" strokeWidth="1.5" />
      <circle cx="22" cy="14" r="6" fill="none" stroke="#c9922e" strokeWidth="3" />
      <path d="M9 64C9 42 14 28 22 28C30 28 35 42 35 64L40 70H4Z" fill="#c9922e" />
      <path d="M22 28C30 28 35 42 35 64L40 70H22Z" fill="#e0b04a" opacity=".6" />
      <path d="M12 52Q22 58 32 52" stroke="#8a5f12" strokeWidth="1.5" fill="none" />
      <circle cx="22" cy="76" r="4.5" fill="#a8741a" />
    </svg>
  );
}

const ITEMS: { x: string; xm?: string; kind: "lantern" | "bell"; pal?: Pal; md?: boolean }[] = [
  { x: "9%", xm: "14%", kind: "lantern", pal: ["#e91e8c", "#ffc928", "#1fb5a5"] },
  { x: "24%", kind: "bell", md: true },
  { x: "70%", kind: "bell", md: true },
  { x: "82%", xm: "42%", kind: "lantern", pal: ["#1fb5a5", "#e91e8c", "#ffc928"] },
];

/** Lanterns and brass bells that swing when the cursor touches them (or on tap / Enter). */
export default function HangingDecor() {
  const { sound } = useDiwali();

  const swing = (el: HTMLElement, bell: boolean) => {
    el.animate(
      [
        { transform: "rotate(0deg)" }, { transform: "rotate(15deg)" }, { transform: "rotate(-11deg)" },
        { transform: "rotate(6deg)" }, { transform: "rotate(-2deg)" }, { transform: "rotate(0deg)" },
      ],
      { duration: 1800, easing: "ease-out" },
    );
    if (bell && sound) playDing();
  };

  return (
    <div className="dw-fadein dw-hanging">
      {ITEMS.map((it, i) => (
        <div key={i} className={`dw-hang-item${it.md ? " dw-md" : ""}`} style={{ "--x": it.x, "--xm": it.xm ?? it.x } as CSSProperties}>
          <button
            type="button"
            aria-label={it.kind === "bell" ? "Ring the bell" : "Swing the lantern"}
            className="dw-hang pointer-events-auto block cursor-pointer rounded-md outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
            style={{ animationDelay: `${i * 0.7}s` }}
            onPointerEnter={(e) => swing(e.currentTarget, it.kind === "bell")}
            onClick={(e) => swing(e.currentTarget, it.kind === "bell")}
          >
            {it.kind === "bell" ? <Bell /> : <Lantern pal={it.pal!} />}
          </button>
        </div>
      ))}
    </div>
  );
}
