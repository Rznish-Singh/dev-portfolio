"use client";
import { useEffect, useRef, useState } from "react";
import { IoTheme } from "@/components/imgopt/theme";
import { bg, imgUrl } from "@/components/imgopt/images";

// Simulated mode: latency = RTT + size / throughput. Real mode downloads the real files and times them.
const NETS = { "Slow 3G": { bps: 50_000, rtt: 400 }, "4G": { bps: 1_500_000, rtt: 100 }, "Wi-Fi": { bps: 5_000_000, rtt: 30 } } as const;
type Net = keyof typeof NETS;
const V = [
  { id: "raw", title: "Unoptimized", note: "3200px JPEG · no CDN · no placeholder", bytes: 4_200_000, rttMul: 1, lqip: false, real: () => imgUrl(3200, "jpg", 100) },
  { id: "opt", title: "Optimized", note: "800w AVIF · CDN hit · blur placeholder", bytes: 62_000, rttMul: 0.3, lqip: true, real: () => imgUrl(800, "avif", 60) },
] as const;
type Real = { ms: number; bytes: number; src: string };

const fmt = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`);
const size = (b: number) => (b >= 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.round(b / 1024) + " KB");
const chip = (on: boolean) => `rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${on ? "border-transparent bg-[var(--io-blue)] text-white" : "bg-[var(--io-card)] hover:bg-[var(--io-bg)]"}`;

export function LatencyDemo() {
  const [mode, setMode] = useState<"sim" | "real">("sim");
  const [net, setNet] = useState<Net>("4G");
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const [real, setReal] = useState<Record<string, Real | null>>({ raw: null, opt: null });
  const [rbusy, setRbusy] = useState(false);
  const [rerr, setRerr] = useState(false);
  const raf = useRef(0);

  const calc = (v: (typeof V)[number]) => {
    const { bps, rtt } = NETS[net];
    const wait = rtt * v.rttMul;
    return { wait, total: wait + (v.bytes / bps) * 1000 };
  };
  const slowest = Math.max(...V.map((v) => calc(v).total));

  const runSim = () => {
    cancelAnimationFrame(raf.current);
    const k = slowest / 4000, start = performance.now();
    setRunning(true);
    const tick = (now: number) => {
      const sim = (now - start) * k;
      setT(Math.min(sim, slowest));
      if (sim < slowest) raf.current = requestAnimationFrame(tick); else setRunning(false);
    };
    raf.current = requestAnimationFrame(tick);
  };
  const runReal = async () => {
    setRbusy(true); setRerr(false); setReal({ raw: null, opt: null });
    try {
      for (const v of V) {
        const t0 = performance.now();
        const r = await fetch(`${v.real()}&_=${Date.now()}`, { cache: "no-store" });
        if (!r.ok) throw new Error("bad response");
        const b = await r.blob();
        const item = { ms: Math.round(performance.now() - t0), bytes: b.size, src: URL.createObjectURL(b) };
        setReal((p) => ({ ...p, [v.id]: item }));
      }
    } catch { setRerr(true); }
    setRbusy(false);
  };
  useEffect(() => { setT(0); setRunning(false); return () => cancelAnimationFrame(raf.current); }, [net, mode]);

  const busy = mode === "sim" ? running : rbusy;
  return (
    <div className="io not-prose space-y-3">
      <IoTheme />
      <div className="flex flex-wrap items-center gap-2">
        <button className={chip(mode === "sim")} onClick={() => setMode("sim")}>Simulated</button>
        <button className={chip(mode === "real")} onClick={() => setMode("real")}>Real test</button>
        <span className="mx-1 h-4 w-px bg-[var(--io-line)]" />
        {mode === "sim" && (Object.keys(NETS) as Net[]).map((n) => <button key={n} className={chip(n === net)} onClick={() => setNet(n)}>{n}</button>)}
        <button disabled={busy} onClick={mode === "sim" ? runSim : runReal}
          className="rounded-full bg-[var(--io-ink)] px-3.5 py-1 text-xs font-semibold text-[var(--io-card)] disabled:opacity-50">{busy ? "Loading…" : "▶ Load images"}</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {V.map((v) => {
          const { wait, total } = calc(v);
          const p = t <= wait ? 0 : Math.min(1, (t - wait) / (total - wait));
          const done = t >= total && t > 0, started = t > 0;
          const r = real[v.id];
          return (
            <div key={v.id} className="space-y-2 rounded-2xl border bg-[var(--io-card)] p-3">
              <div><div className="text-sm font-semibold">{v.title}</div><div className="text-xs text-[var(--io-sub)]">{v.note}</div></div>
              <div className="relative aspect-video overflow-hidden rounded-xl bg-[var(--io-skel)]">
                {mode === "sim" ? (
                  <>
                    {v.lqip && started && t > wait && <div className="absolute inset-0 transition-[filter] duration-500" style={{ background: bg(done ? 800 : 24), filter: done ? "blur(0)" : "blur(18px)", transform: done ? "none" : "scale(1.1)" }} />}
                    {!v.lqip && started && <div className="absolute inset-0" style={{ background: bg(800), clipPath: `inset(0 0 ${100 - p * 100}% 0)` }} />}
                    {!done && started && p === 0 && <div className="absolute inset-0 grid place-items-center text-xs text-[var(--io-sub)]">waiting for first byte…</div>}
                  </>
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {r && <img src={r.src} alt="" className="absolute inset-0 size-full object-cover" />}
                    {!r && <div className="absolute inset-0 grid place-items-center text-xs text-[var(--io-sub)]">{rbusy ? "downloading…" : "press load"}</div>}
                  </>
                )}
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--io-skel)]"><div className="h-full rounded-full transition-[width]" style={{ width: `${(mode === "sim" ? p : r ? 1 : 0) * 100}%`, background: v.id === "raw" ? "var(--io-amber)" : "var(--io-green)" }} /></div>
              <div className="flex justify-between text-xs tabular-nums">
                {mode === "sim"
                  ? <><span>{size(v.bytes)}</span><span className="font-semibold">{done ? `done in ${fmt(total)}` : started ? fmt(Math.min(t, total)) : `~${fmt(total)}`}</span></>
                  : <><span>{r ? size(r.bytes) : "—"}</span><span className="font-semibold">{r ? `done in ${fmt(r.ms)}` : "—"}</span></>}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-[var(--io-sub)]">
        {rerr ? "The real test could not download the image (blocked or offline). Use the simulated mode." : mode === "sim" ? "Simulated: latency = RTT + size ÷ throughput." : "Real: your browser downloads both files now. The raw one can be several MB."}
      </p>
    </div>
  );
}
