"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";

const delay = (d: number) => ({ "--d": `${d}s` }) as CSSProperties;

/** Starburst sparkler: alternating long/short rays with dots on the long ones. */
function Spark({ x, y, r, d }: { x: number; y: number; r: number; d: number }) {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2, long = i % 2 === 0, len = long ? r : r * 0.55;
    return { c: Math.cos(a), s: Math.sin(a), len, long };
  });
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="dw-p-spark" style={delay(d)}>
        {rays.map((q, i) => (
          <g key={i}>
            <line x1={q.c * r * 0.2} y1={q.s * r * 0.2} x2={q.c * q.len} y2={q.s * q.len} stroke="#ffd9a0" strokeWidth="1.3" strokeLinecap="round" />
            {q.long && <circle cx={q.c * (q.len + 3.5)} cy={q.s * (q.len + 3.5)} r="1.6" fill="#ffd9a0" />}
          </g>
        ))}
        <circle r="2.2" fill="#fff3d6" />
      </g>
    </g>
  );
}

/** Line that draws outward, optionally ending in a triangle head. */
function Arrow({ x1, y1, x2, y2, color, head, d }: { x1: number; y1: number; x2: number; y2: number; color: string; head?: string; d: number }) {
  const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g style={delay(d)}>
      <line className="dw-p-line" pathLength={1} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      {head && <polygon className="dw-p-head" points="0,-6 11,0 0,6" fill={head} transform={`translate(${x2} ${y2}) rotate(${ang})`} />}
    </g>
  );
}

/** Firework rocket pointing up in local space; rotated into place by the wrapper. */
function Rocket({ x, y, rot, d }: { x: number; y: number; rot: number; d: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <g className="dw-p-rocket" style={delay(d)}>
        <line x1="0" y1="24" x2="0" y2="54" stroke="#e8a45a" strokeWidth="1.5" opacity=".7" />
        <polygon points="-9,20 -18,34 -9,28" fill="#e8336d" />
        <polygon points="9,20 18,34 9,28" fill="#e8336d" />
        <rect x="-9" y="-16" width="18" height="40" rx="2" fill="#f6a02a" />
        <path d="M-9 -16L0 -8L9 -16V-10L0 -2L-9 -10Z" fill="#ffd25a" />
        <path d="M-9 -4L0 4L9 -4V2L0 10L-9 2Z" fill="#e8541e" />
        <path d="M-9 8L0 16L9 8V14L0 22L-9 14Z" fill="#ffd25a" />
        <polygon points="0,-38 9,-16 -9,-16" fill="#e8336d" />
      </g>
    </g>
  );
}

/**
 * Pop-up scene shown when a diya is lit: big diya, rockets, sparklers and radiating arrows.
 * Closes on the X button, backdrop click, Esc (without closing Diwali mode), or after 9 seconds.
 */
export default function DiyaPopup({ onClose }: { onClose: () => void }) {
  const id = useId().replace(/:/g, "");
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    closeRef.current?.focus();
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopImmediatePropagation(); onCloseRef.current(); }
    };
    window.addEventListener("keydown", onKey, true); // capture: runs before the provider's Esc handler
    const t = window.setTimeout(() => onCloseRef.current(), 9000);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.clearTimeout(t);
      root.style.overflow = prev;
    };
  }, []);

  return (
    <div className="dw-pop" data-dw-ui onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true" aria-label="Diya lit">
      <div className="dw-pop-card">
        <button ref={closeRef} type="button" className="dw-pop-x" aria-label="Close" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        <svg viewBox="0 0 400 260" className="dw-pop-svg" aria-hidden="true">
          <defs>
            <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f0642a" />
              <stop offset="1" stopColor="#b8330f" />
            </linearGradient>
            <radialGradient id={`${id}h`}>
              <stop offset="0" stopColor="#ffd47a" stopOpacity=".6" />
              <stop offset="1" stopColor="#ffd47a" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle className="dw-p-glow" cx="200" cy="146" r="60" fill={`url(#${id}h)`} />

          {/* radiating lines + arrow heads */}
          <Arrow x1={200} y1={96} x2={200} y2={48} color="#2fb5b0" d={1.15} />
          <Arrow x1={70} y1={106} x2={116} y2={128} color="#2fb5b0" d={1.25} />
          <Arrow x1={330} y1={106} x2={284} y2={128} color="#2fb5b0" d={1.25} />
          <Arrow x1={170} y1={104} x2={150} y2={62} color="#ffe1b8" head="#e8336d" d={1.3} />
          <Arrow x1={230} y1={104} x2={250} y2={62} color="#ffe1b8" head="#e8336d" d={1.3} />
          <Arrow x1={126} y1={170} x2={86} y2={170} color="#ffe1b8" head="#e8336d" d={1.4} />
          <Arrow x1={274} y1={170} x2={314} y2={170} color="#ffe1b8" head="#e8336d" d={1.4} />

          <Rocket x={122} y={86} rot={-35} d={0.9} />
          <Rocket x={278} y={86} rot={35} d={0.9} />

          <Spark x={200} y={34} r={22} d={1.0} />
          <Spark x={68} y={98} r={18} d={1.1} />
          <Spark x={332} y={98} r={18} d={1.1} />
          <Spark x={58} y={60} r={8} d={1.2} />
          <Spark x={342} y={60} r={8} d={1.25} />
          <Spark x={36} y={140} r={10} d={1.3} />
          <Spark x={364} y={140} r={10} d={1.35} />
          <Spark x={150} y={22} r={9} d={1.2} />
          <Spark x={252} y={22} r={9} d={1.25} />

          <ellipse cx="200" cy="240" rx="88" ry="8" fill="#000" opacity=".25" />
          <g className="dw-p-diya">
            <path d="M114 166Q128 184 160 183L240 183Q272 184 286 166Q286 200 264 216Q234 232 200 232Q166 232 136 216Q114 200 114 166Z" fill={`url(#${id}b)`} />
            <path d="M114 166Q128 184 160 183L240 183Q272 184 286 166Q248 178 200 178Q152 178 114 166Z" fill="#ffb12e" />
            <path d="M134 204Q200 222 266 204" stroke="#ffd25a" strokeWidth="2.5" fill="none" strokeDasharray="1 7" strokeLinecap="round" />
            <path d="M146 192Q200 206 254 192" stroke="#ff9a3a" strokeWidth="1.6" fill="none" />
            <g fill="#ffd25a"><circle cx="156" cy="197" r="2.2" /><circle cx="244" cy="197" r="2.2" /></g>
            <circle cx="200" cy="203" r="3.2" fill="#e8336d" />
          </g>
          <rect x="198" y="171" width="4" height="9" rx="1.5" fill="#3a1a14" />
          <g className="dw-p-flame">
            <path d="M200 112C217 134 225 154 200 178C175 154 183 134 200 112Z" fill="#ffcf5e" />
            <path d="M200 138C208 150 211 162 200 174C189 162 192 150 200 138Z" fill="#fff8e1" />
          </g>
        </svg>
      </div>
    </div>
  );
}
