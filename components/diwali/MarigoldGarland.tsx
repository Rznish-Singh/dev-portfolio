"use client";

import { useMemo } from "react";
import { useViewportWidth } from "./hooks";
import { LEAF, MG_ORANGE, MG_YELLOW, TASSEL } from "./Marigold";

const Y0 = 6;      // string height at the top edge
const SAG = 20;    // how far each swag drops
const R = 10;      // flower radius in px
const GAP = 21;    // distance between flowers along the swag

type Item = { x: number; y: number; id: string; rot?: number; s: number };

/** Top toran: swags of marigolds with mango leaves, plus hanging flower strands that sway when touched. */
export default function MarigoldGarland() {
  const w = useViewportWidth();

  const g = useMemo(() => {
    const spans = Math.max(2, Math.round(w / (w < 640 ? 200 : 340)));
    const sw = w / spans;
    const paths: string[] = [];
    const leaves: Item[] = [];
    const flowers: Item[] = [];

    for (let s = 0; s < spans; s++) {
      const x0 = s * sw, x1 = x0 + sw, cx = (x0 + x1) / 2, cy = Y0 + SAG * 2;
      paths.push(`M${x0} ${Y0} Q${cx} ${cy} ${x1} ${Y0}`);
      const n = Math.max(4, Math.round(sw / GAP));
      for (let i = 0; i <= n; i++) {
        if (i === n && s < spans - 1) continue;
        const t = i / n, u = 1 - t;
        const x = u * u * x0 + 2 * u * t * cx + t * t * x1;
        const y = u * u * Y0 + 2 * u * t * cy + t * t * Y0;
        if (i % 2 === 1) {
          leaves.push({ x, y, id: LEAF, rot: -28, s: 0.32 }, { x, y, id: LEAF, rot: 28, s: 0.32 });
        }
        flowers.push({ x, y, id: (i + s) % 2 ? MG_YELLOW : MG_ORANGE, s: R / 50 });
      }
    }

    const strands = Array.from({ length: spans + 1 }, (_, s) => {
      const x = Math.min(w - 12, Math.max(12, s * sw));
      const len = [78, 104, 64][s % 3];
      const fl: Item[] = [];
      for (let y = Y0 + R + 8; y < Y0 + len; y += R * 2 - 1) {
        fl.push({ x, y, id: fl.length % 2 ? MG_YELLOW : MG_ORANGE, s: (R - 1) / 50 });
      }
      return { x, len, fl, endY: (fl.length ? fl[fl.length - 1].y : Y0) + R + 2, delay: s * 0.45 };
    });

    return { paths, leaves, flowers, strands };
  }, [w]);

  return (
    <div className="dw-drop dw-top">
      <svg width={w} height={150} viewBox={`0 0 ${w} 150`} className="block overflow-visible" aria-hidden="true">
        {g.paths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#2f6b2a" strokeWidth="2" />
        ))}
        {g.leaves.map((l, i) => (
          <use key={`l${i}`} href={`#${l.id}`} transform={`translate(${l.x} ${l.y}) rotate(${l.rot}) scale(${l.s})`} />
        ))}
        {g.flowers.map((f, i) => (
          <use key={`f${i}`} href={`#${f.id}`} transform={`translate(${f.x} ${f.y}) scale(${f.s})`} />
        ))}

        {g.strands.map((st, i) => (
          <g
            key={`s${i}`}
            className="dw-strand"
            style={{ transformOrigin: `${st.x}px ${Y0}px`, animationDelay: `${st.delay}s`, pointerEvents: "auto" }}
            onPointerEnter={(e) => {
              // touch/hover swing (Web Animations API, works on touch screens too)
              e.currentTarget.animate(
                [
                  { transform: "rotate(0deg)" }, { transform: "rotate(9deg)" }, { transform: "rotate(-7deg)" },
                  { transform: "rotate(4deg)" }, { transform: "rotate(0deg)" },
                ],
                { duration: 1500, easing: "ease-out" },
              );
            }}
          >
            <rect x={st.x - 10} y={Y0} width={20} height={st.len + 36} fill="transparent" />
            <line x1={st.x} y1={Y0} x2={st.x} y2={st.endY} stroke="#2f6b2a" strokeWidth="1.5" />
            <use href={`#${LEAF}`} transform={`translate(${st.x} ${Y0 + 3}) rotate(-48) scale(0.34)`} />
            <use href={`#${LEAF}`} transform={`translate(${st.x} ${Y0 + 3}) rotate(48) scale(0.34)`} />
            {st.fl.map((f, j) => (
              <use key={j} href={`#${f.id}`} transform={`translate(${f.x} ${f.y}) scale(${f.s})`} />
            ))}
            <use href={`#${TASSEL}`} transform={`translate(${st.x} ${st.endY + 4})`} />
          </g>
        ))}
      </svg>
    </div>
  );
}
