"use client";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Simulated: time = RTT + bytes / throughput. Both cards share one clock so the gap is visible.
const NETS = {
  "Slow 3G": { bps: 50_000, rtt: 400 },
  "4G": { bps: 1_500_000, rtt: 100 },
  "Wi-Fi": { bps: 5_000_000, rtt: 30 },
} as const;
type Net = keyof typeof NETS;

const VARIANTS = [
  { id: "raw", title: "Unoptimized", note: "4000px JPEG · no CDN · no placeholder", bytes: 4_200_000, rttMul: 1, lqip: false },
  { id: "opt", title: "Optimized", note: "800w AVIF · CDN hit · blur placeholder", bytes: 62_000, rttMul: 0.3, lqip: true },
];

const PHOTO = "linear-gradient(160deg,#f97316,#ec4899 45%,#6366f1 80%,#0f172a)";

export function LatencyDemo() {
  const [net, setNet] = useState<Net>("4G");
  const [t, setT] = useState(0); // simulated ms
  const [running, setRunning] = useState(false);
  const raf = useRef(0);

  const calc = (v: (typeof VARIANTS)[number]) => {
    const { bps, rtt } = NETS[net];
    const wait = rtt * v.rttMul;
    const xfer = (v.bytes / bps) * 1000;
    return { wait, total: wait + xfer };
  };
  const slowest = Math.max(...VARIANTS.map((v) => calc(v).total));

  const run = () => {
    cancelAnimationFrame(raf.current);
    const k = slowest / 4000; // whole demo takes ~4s real time
    const start = performance.now();
    setRunning(true);
    const tick = (now: number) => {
      const sim = (now - start) * k;
      setT(Math.min(sim, slowest));
      if (sim < slowest) raf.current = requestAnimationFrame(tick);
      else setRunning(false);
    };
    raf.current = requestAnimationFrame(tick);
  };
  useEffect(() => { setT(0); setRunning(false); return () => cancelAnimationFrame(raf.current); }, [net]);

  const fmt = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`);
  const size = (b: number) => (b >= 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.round(b / 1024) + " KB");

  return (
    <div className="not-prose space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(NETS) as Net[]).map((n) => (
          <Button key={n} size="sm" variant={n === net ? "default" : "outline"} onClick={() => setNet(n)}>{n}</Button>
        ))}
        <Button size="sm" onClick={run} disabled={running}>{running ? "Loading…" : "▶ Load images"}</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {VARIANTS.map((v) => {
          const { wait, total } = calc(v);
          const p = t <= wait ? 0 : Math.min(1, (t - wait) / (total - wait));
          const done = t >= total && t > 0;
          const started = t > 0;
          return (
            <Card key={v.id} size="sm">
              <CardHeader>
                <CardTitle>{v.title}</CardTitle>
                <CardDescription>{v.note}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                  {/* LQIP: appears right after the first byte, then sharpens */}
                  {v.lqip && started && t > wait && (
                    <div className="absolute inset-0 transition-[filter] duration-500"
                      style={{ background: PHOTO, filter: done ? "blur(0)" : "blur(18px)", transform: done ? "none" : "scale(1.1)" }} />
                  )}
                  {/* Raw: JPEG paints top-to-bottom as bytes arrive */}
                  {!v.lqip && started && (
                    <div className="absolute inset-0" style={{ background: PHOTO, clipPath: `inset(0 0 ${100 - p * 100}% 0)` }} />
                  )}
                  {!done && started && p === 0 && <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">waiting for first byte…</div>}
                </div>
                <div className="h-1.5 overflow-hidden rounded bg-muted"><div className="h-full bg-primary" style={{ width: `${p * 100}%` }} /></div>
                <div className="flex justify-between text-xs tabular-nums">
                  <span>{size(v.bytes)}</span>
                  <span className="font-medium">{done ? `done in ${fmt(total)}` : started ? fmt(Math.min(t, total)) : `~${fmt(total)}`}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">Simulated: latency = RTT + size ÷ throughput. Test real numbers in DevTools → Network.</p>
    </div>
  );
}
