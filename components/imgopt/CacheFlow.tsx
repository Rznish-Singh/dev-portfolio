"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Kind = "idle" | "active" | "miss" | "ok";
type S = { kind: Kind; label: string };

const X = [70, 240, 410];
const NAMES = ["Browser", "CDN edge", "Origin (S3/R2)"];
const IDLE: S[] = NAMES.map(() => ({ kind: "idle", label: "Idle" }));
const GREEN = "#16c172";
const AMBER = "#f59e0b";
const BLUE = "#2c67c5";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* "Backing Up"-style status pill: coloured pill + pulsing outer ring + spinner / check / cross */
function Pill({ cx, y, s }: { cx: number; y: number; s: S }) {
  const w = 104, h = 24, x = cx - w / 2, cy = y + h / 2;
  const fill = s.kind === "miss" ? AMBER : GREEN;
  const idle = s.kind === "idle";
  return (
    <g>
      {!idle && (
        <rect key={s.kind + s.label} className={s.kind === "active" ? "ic-ring ic-loop" : "ic-ring"}
          x={x - 4} y={y - 4} width={w + 8} height={h + 8} rx={(h + 8) / 2} fill="none" stroke={fill} strokeWidth="2.5" />
      )}
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={idle ? undefined : fill}
        className={idle ? "fill-muted" : ""} style={{ transition: "fill .3s" }} />
      {idle ? (
        <text x={cx} y={cy + 3.5} textAnchor="middle" className="fill-muted-foreground text-[10px] font-semibold">{s.label}</text>
      ) : (
        <>
          <g transform={`translate(${x + 14} ${cy})`}>
            {s.kind === "active" && (
              <>
                <circle r="5.5" fill="none" stroke="white" strokeOpacity=".4" strokeWidth="2" />
                <circle r="5.5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="9 26" className="ic-spin" />
              </>
            )}
            {s.kind === "ok" && (
              <><circle r="6.5" fill="white" /><path d="M-3 .3 L-.8 2.7 L3.4 -2.3" fill="none" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></>
            )}
            {s.kind === "miss" && (
              <><circle r="6.5" fill="white" /><path d="M-2.4 -2.4L2.4 2.4M2.4 -2.4L-2.4 2.4" stroke={fill} strokeWidth="2" strokeLinecap="round" /></>
            )}
          </g>
          <text x={x + 28} y={cy + 3.5} className="text-[10px] font-semibold" fill="white">{s.label}</text>
        </>
      )}
    </g>
  );
}

export function CacheFlow() {
  const [st, setSt] = useState<S[]>(IDLE);
  const [pk, setPk] = useState({ x: X[0], show: false });
  const [msg, setMsg] = useState("Pick a scenario");
  const [busy, setBusy] = useState(false);

  const set = (i: number, s: S) => setSt((p) => p.map((v, j) => (j === i ? s : v)));
  const move = (i: number) => setPk({ x: X[i], show: true });
  const stroke = (i: number) => (st[i].kind === "idle" ? "currentColor" : BLUE);

  const go = async (repeat: boolean) => {
    if (busy) return;
    setBusy(true); setSt(IDLE); move(0); setMsg("Requesting image…");
    set(0, { kind: "active", label: "Requesting" }); await sleep(800);
    if (repeat) {
      set(0, { kind: "ok", label: "Cache HIT" });
      setPk((p) => ({ ...p, show: false }));
      setMsg("Browser cache HIT · ~0ms, no network request at all");
    } else {
      set(0, { kind: "miss", label: "Cache MISS" }); move(1); await sleep(750);
      set(1, { kind: "active", label: "Checking" }); await sleep(650);
      set(1, { kind: "miss", label: "Cache MISS" }); move(2); await sleep(750);
      set(2, { kind: "active", label: "Reading" }); await sleep(1000);
      set(2, { kind: "ok", label: "Sent" }); move(1); await sleep(750);
      set(1, { kind: "ok", label: "Cached" }); move(0); await sleep(750);
      set(0, { kind: "ok", label: "Stored" });
      setPk((p) => ({ ...p, show: false }));
      setMsg("Slow once. The CDN and the browser both keep a copy now.");
    }
    setBusy(false);
  };

  const imgShown = st[0].kind === "ok";

  return (
    <Card className="not-prose">
      <style>{`
        .ic-ring{transform-box:fill-box;transform-origin:center;animation:icPulse 1.1s ease-out forwards}
        .ic-loop{animation-iteration-count:infinite}
        @keyframes icPulse{0%{opacity:.8;transform:scale(.92)}100%{opacity:.15;transform:scale(1.08)}}
        .ic-spin{transform-box:fill-box;transform-origin:center;animation:icSpin .8s linear infinite}
        @keyframes icSpin{to{transform:rotate(360deg)}}
      `}</style>
      <CardHeader>
        <CardTitle>Cache journey</CardTitle>
        <CardDescription>Browser cache and CDN cache are separate layers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Button size="sm" disabled={busy} onClick={() => go(false)}>First visit</Button>
          <Button size="sm" variant="outline" disabled={busy} onClick={() => go(true)}>Repeat visit</Button>
        </div>

        <svg viewBox="0 0 480 150" className="w-full">
          <line x1={X[0] + 40} y1="47" x2={X[2] - 40} y2="47" className="stroke-border" strokeWidth="2" strokeDasharray="4 4" />

          {/* Browser window */}
          <g className="text-muted-foreground" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" stroke={stroke(0)}>
            <rect x={X[0] - 38} y="16" width="76" height="62" rx="7" className="fill-background" />
            <line x1={X[0] - 38} y1="30" x2={X[0] + 38} y2="30" />
            <circle cx={X[0] - 30} cy="23" r="1.3" fill="currentColor" /><circle cx={X[0] - 24} cy="23" r="1.3" fill="currentColor" /><circle cx={X[0] - 18} cy="23" r="1.3" fill="currentColor" />
            <g style={{ opacity: imgShown ? 1 : 0, transition: "opacity .4s" }} stroke={BLUE}>
              <rect x={X[0] - 24} y="38" width="48" height="30" rx="3" />
              <path d={`M${X[0] - 20} 63 l11 -11 l8 8 l5 -5 l10 10`} />
            </g>
          </g>

          {/* CDN globe */}
          <g className="text-muted-foreground" fill="none" strokeWidth="2.5" strokeLinecap="round" stroke={stroke(1)}>
            <circle cx={X[1]} cy="47" r="30" className="fill-background" />
            <ellipse cx={X[1]} cy="47" rx="12" ry="30" />
            <line x1={X[1] - 30} y1="47" x2={X[1] + 30} y2="47" />
            <path d={`M${X[1] - 26} 33 Q${X[1]} 40 ${X[1] + 26} 33M${X[1] - 26} 61 Q${X[1]} 54 ${X[1] + 26} 61`} />
          </g>

          {/* Origin bucket (S3/R2) */}
          <g className="text-muted-foreground" fill="none" strokeWidth="2.5" strokeLinecap="round" stroke={stroke(2)}>
            <path d={`M${X[2] - 30} 26 V68 a30 10 0 0 0 60 0 V26`} className="fill-background" />
            <ellipse cx={X[2]} cy="26" rx="30" ry="10" className="fill-background" />
            <path d={`M${X[2] - 30} 47 a30 10 0 0 0 60 0`} />
          </g>

          {/* packet */}
          <circle cy="47" r="5.5" fill={BLUE}
            style={{ transform: `translateX(${pk.x}px)`, opacity: pk.show ? 1 : 0, transition: "transform .7s cubic-bezier(.4,0,.2,1), opacity .3s" }} />

          {NAMES.map((n, i) => (
            <g key={n}>
              <text x={X[i]} y="98" textAnchor="middle" className="fill-foreground text-[10px] font-medium">{n}</text>
              <Pill cx={X[i]} y={108} s={st[i]} />
            </g>
          ))}
        </svg>
        <p className="text-xs">{msg}</p>
      </CardContent>
    </Card>
  );
}