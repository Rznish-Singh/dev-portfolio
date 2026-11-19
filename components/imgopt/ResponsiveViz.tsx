"use client";
import { useState } from "react";
import { IoTheme } from "@/components/imgopt/theme";
import { bg } from "@/components/imgopt/images";

const C = [{ w: 400, kb: 28 }, { w: 800, kb: 90 }, { w: 1200, kb: 180 }, { w: 1600, kb: 300 }];
const ORIGINAL_KB = 520;

export function ResponsiveViz() {
  const [vw, setVw] = useState(375);
  const [dpr, setDpr] = useState(2);
  const need = vw * dpr;
  const pick = C.find((c) => c.w >= need) ?? C[C.length - 1];
  const saved = Math.round((1 - pick.kb / ORIGINAL_KB) * 100);
  return (
    <div className="io not-prose space-y-3 rounded-2xl border bg-[var(--io-card)] p-4">
      <IoTheme />
      <div><div className="text-sm font-semibold">srcset picker</div><div className="text-xs text-[var(--io-sub)]">Drag the slider. The browser picks the smallest candidate that is at least slot width × DPR.</div></div>
      <label className="flex items-center gap-3 text-xs">
        <span className="w-24 tabular-nums">Viewport {vw}px</span>
        <input type="range" min={320} max={800} value={vw} onChange={(e) => setVw(+e.target.value)} className="flex-1" style={{ accentColor: "var(--io-blue)" }} />
        <select value={dpr} onChange={(e) => setDpr(+e.target.value)} className="rounded-lg border bg-[var(--io-bg)] px-2 py-1 font-semibold">
          <option value={1}>1x</option><option value={2}>2x</option><option value={3}>3x</option>
        </select>
      </label>
      <svg viewBox="0 0 400 130" className="w-full">
        {C.map((c, i) => {
          const on = c.w === pick.w;
          return (
            <g key={c.w}>
              <rect x={10 + i * 95} y={100 - c.kb / 3.2} width={80} height={c.kb / 3.2} rx={8} style={{ fill: on ? "var(--io-blue)" : "var(--io-skel)", transition: "fill .25s" }} />
              <text x={50 + i * 95} y={120} textAnchor="middle" className="text-[9px]" style={{ fill: "var(--io-ink)" }}>{c.w}w · {c.kb}KB</text>
              {on && <text x={50 + i * 95} y={94 - c.kb / 3.2} textAnchor="middle" className="text-[10px] font-bold" style={{ fill: "var(--io-blue)" }}>✓ chosen</text>}
            </g>
          );
        })}
      </svg>
      <div className="h-28 overflow-hidden rounded-xl bg-[var(--io-skel)]" style={{ background: bg(pick.w, "webp") }} aria-hidden />
      <p className="text-xs">Needs <b>{need}px</b>, so it downloads <b style={{ color: "var(--io-blue)" }}>{pick.w}w ({pick.kb}KB)</b> instead of a {ORIGINAL_KB}KB original: <b style={{ color: "var(--io-green)" }}>{saved}% less data</b>. The photo above is that real size.</p>
    </div>
  );
}
