"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NODES = [{ id: "Browser", x: 50 }, { id: "CDN edge", x: 200 }, { id: "Origin (S3/R2)", x: 350 }];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function CacheFlow() {
  const [lit, setLit] = useState<number[]>([]);
  const [msg, setMsg] = useState("Pick a scenario");
  const [busy, setBusy] = useState(false);

  const go = async (repeat: boolean) => {
    if (busy) return;
    setBusy(true);
    const path = repeat ? [0] : [0, 1, 2, 1, 0];
    setMsg("Requesting…");
    for (const n of path) { setLit([n]); await sleep(550); }
    setMsg(repeat ? "Browser cache HIT · ~0ms, no network" : "Browser MISS → CDN MISS → origin · slow once, then the CDN has it");
    setBusy(false);
  };

  return (
    <Card className="not-prose">
      <CardHeader>
        <CardTitle>Cache journey</CardTitle>
        <CardDescription>Browser cache and CDN cache are separate layers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Button size="sm" disabled={busy} onClick={() => go(false)}>First visit</Button>
          <Button size="sm" variant="outline" disabled={busy} onClick={() => go(true)}>Repeat visit</Button>
        </div>
        <svg viewBox="0 0 400 80" className="w-full">
          <line x1="50" y1="35" x2="350" y2="35" className="stroke-border" strokeWidth="2" strokeDasharray="4 4" />
          {NODES.map((n, i) => (
            <g key={n.id}>
              <circle cx={n.x} cy="35" r={lit.includes(i) ? 20 : 16} className={lit.includes(i) ? "fill-primary" : "fill-muted"} style={{ transition: "all .3s" }} />
              <text x={n.x} y="72" textAnchor="middle" className="fill-foreground text-[9px]">{n.id}</text>
            </g>
          ))}
        </svg>
        <p className="text-xs">{msg}</p>
      </CardContent>
    </Card>
  );
}
