"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CANDIDATES = [{ w: 400, kb: 28 }, { w: 800, kb: 90 }, { w: 1200, kb: 180 }, { w: 1600, kb: 300 }];
const ORIGINAL_KB = 520;

export function ResponsiveViz() {
  const [vw, setVw] = useState(375);
  const [dpr, setDpr] = useState(2);
  const need = vw * dpr;
  const pick = CANDIDATES.find((c) => c.w >= need) ?? CANDIDATES[CANDIDATES.length - 1];
  const saved = Math.round((1 - pick.kb / ORIGINAL_KB) * 100);

  return (
    <Card className="not-prose">
      <CardHeader>
        <CardTitle>srcset picker</CardTitle>
        <CardDescription>Drag the slider. The browser picks the smallest candidate ≥ slot width × DPR.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <label className="flex items-center gap-3 text-xs">
          Viewport {vw}px
          <input type="range" min={320} max={800} value={vw} onChange={(e) => setVw(+e.target.value)} className="flex-1" />
          <select value={dpr} onChange={(e) => setDpr(+e.target.value)} className="rounded border bg-background px-1 py-0.5">
            <option value={1}>1x</option><option value={2}>2x</option><option value={3}>3x</option>
          </select>
        </label>
        <svg viewBox="0 0 400 130" className="w-full">
          {CANDIDATES.map((c, i) => {
            const active = c.w === pick.w;
            return (
              <g key={c.w}>
                <rect x={10 + i * 95} y={100 - c.kb / 3.2} width={80} height={c.kb / 3.2} rx={6}
                  className={active ? "fill-primary" : "fill-muted"} />
                <text x={50 + i * 95} y={120} textAnchor="middle" className="fill-foreground text-[9px]">{c.w}w · {c.kb}KB</text>
                {active && <text x={50 + i * 95} y={94 - c.kb / 3.2} textAnchor="middle" className="fill-primary text-[10px] font-bold">✓ chosen</text>}
              </g>
            );
          })}
        </svg>
        <p className="text-xs">Needs <b>{need}px</b> → downloads <b>{pick.w}w ({pick.kb}KB)</b> instead of a {ORIGINAL_KB}KB original: <b>{saved}% less data</b>.</p>
      </CardContent>
    </Card>
  );
}
