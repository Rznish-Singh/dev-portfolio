"use client";
import { useEffect, useState } from "react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { IoTheme } from "@/components/imgopt/theme";
import { bg, imgUrl } from "@/components/imgopt/images";

// CSS-only "videos". Every demo loops by itself. Colours come from the Apple palette in theme.tsx.
const css = `
.io-bar{width:0;animation:ioBar 5s ease-out infinite}
@keyframes ioBar{0%{width:0}18%,85%{width:var(--w)}100%{width:0}}
.io-scroll{animation:ioScroll 9s ease-in-out infinite}
@keyframes ioScroll{0%,30%{transform:translateY(0)}50%,90%{transform:translateY(-64px)}100%{transform:translateY(0)}}
.io-f1,.io-f2,.io-f3{opacity:0}
.io-f1{animation:ioF1 9s infinite}.io-f2{animation:ioF2 9s infinite}.io-f3{animation:ioF3 9s infinite}
@keyframes ioF1{0%,4%{opacity:0}10%,94%{opacity:1}100%{opacity:0}}
@keyframes ioF2{0%,22%{opacity:0}30%,94%{opacity:1}100%{opacity:0}}
@keyframes ioF3{0%,55%{opacity:0}63%,94%{opacity:1}100%{opacity:0}}
.io-step{animation:ioStep 4.5s infinite}
@keyframes ioStep{0%,16%{background:var(--c);color:#fff;border-color:var(--c)}20%,100%{background:var(--io-card);color:var(--io-ink)}}
.io-pulse{animation:ioPulse 3s infinite}
@keyframes ioPulse{0%,30%,100%{box-shadow:0 0 0 0 transparent}8%{box-shadow:0 0 0 3px var(--io-blue)}}
.io-ring{animation:ioRing 4s infinite}
@keyframes ioRing{0%,25%{box-shadow:0 0 0 3px var(--io-blue)}33%,100%{box-shadow:0 0 0 0 transparent}}
.io-grow{animation:ioGrow 4s ease-out infinite;overflow:hidden}
@keyframes ioGrow{0%,35%{height:0}45%,90%{height:64px}100%{height:0}}
.io-fade{animation:ioFade 4s ease-out infinite}
@keyframes ioFade{0%,35%{opacity:0}45%,90%{opacity:1}100%{opacity:0}}
.io-win{animation:ioWin 4s ease-in-out infinite alternate}
@keyframes ioWin{from{transform:translateY(0)}to{transform:translateY(166%)}}
`;

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="io not-prose">
      <IoTheme /><style>{css}</style>
      <div className="relative overflow-hidden rounded-2xl border bg-[var(--io-bg)] p-4">{children}</div>
    </div>
  );
}
const card = "rounded-xl border bg-[var(--io-card)]";
const legend = "mt-3 text-center text-xs text-[var(--io-sub)]";

/* 1. Same photo, three formats (real sizes when the image can be fetched) */
export function FormatDemo() {
  const [kb, setKb] = useState<number[] | null>(null);
  useEffect(() => {
    let ok = true;
    Promise.all((["jpg", "webp", "avif"] as const).map(async (f) => (await (await fetch(imgUrl(1200, f, 75))).blob()).size / 1024))
      .then((s) => ok && setKb(s)).catch(() => {});
    return () => { ok = false; };
  }, []);
  const val = kb ?? [520, 310, 190];
  const max = Math.max(...val);
  const rows = [["JPEG", "var(--io-amber)"], ["WebP", "var(--io-blue)"], ["AVIF", "var(--io-green)"]];
  return (
    <Stage>
      <div className="space-y-3">
        {rows.map(([n, c], i) => (
          <div key={n} className="flex items-center gap-3 text-xs">
            <span className="w-11 font-semibold">{n}</span>
            <div className="h-5 flex-1 overflow-hidden rounded-full bg-[var(--io-skel)]"><div className="io-bar h-full rounded-full" style={{ ["--w" as string]: `${(val[i] / max) * 100}%`, background: c, animationDelay: `${i * 0.35}s` }} /></div>
            <span className="w-16 text-right tabular-nums">{Math.round(val[i])} KB</span>
          </div>
        ))}
      </div>
      <p className={legend}>{kb ? "Real sizes, measured from the photo on this page." : "Example sizes."} Same look, far fewer bytes with AVIF.</p>
    </Stage>
  );
}

/* 2. Which images load first */
const Tile = ({ cls, h, text, w, pos }: { cls: string; h: string; text?: string; w: number; pos: string }) => (
  <div className={`relative overflow-hidden rounded-md bg-[var(--io-skel)] ${h}`}>
    <div className={`absolute inset-0 ${cls}`} style={{ background: bg(w, "webp", 70, pos) }} />
    {text && <span className="absolute left-2 top-1.5 rounded bg-black/55 px-1.5 text-[9px] font-semibold text-white">{text}</span>}
  </div>
);
export function PriorityDemo() {
  const pos = ["left top", "center", "right bottom"];
  const row = (cls: string) => <div className="grid grid-cols-3 gap-2">{pos.map((p) => <Tile key={p} cls={cls} h="h-10" w={300} pos={p} />)}</div>;
  return (
    <Stage>
      <div className={`mx-auto h-[190px] w-full max-w-sm overflow-hidden p-2 ${card}`}>
        <div className="io-scroll space-y-2">
          <Tile cls="io-f1" h="h-16" w={800} pos="center 35%" text="hero · eager · high priority" />
          {row("io-f2")}{row("io-f2")}{row("io-f3")}
        </div>
      </div>
      <p className={legend}>The hero loads first. Images below load only when you scroll close to them.</p>
    </Stage>
  );
}

/* 3. Image CDN */
export function CdnDemo() {
  const outs = [["Mobile", "400 × 267", "AVIF", "var(--io-green)"], ["Tablet", "800 × 533", "WebP", "var(--io-blue)"], ["Desktop", "1400 × 933", "AVIF", "var(--io-green)"]];
  return (
    <Stage>
      <div className="flex flex-col items-center gap-3 text-[11px] sm:flex-row sm:justify-between">
        <div className={`p-3 text-center ${card}`}><div className="mx-auto mb-2 h-10 w-16 rounded-md" style={{ background: bg(160) }} /><b>product.jpg</b><div className="text-[var(--io-sub)]">3000 × 2000 · 2.5 MB</div></div>
        <span className="rotate-90 text-[var(--io-sub)] sm:rotate-0">→</span>
        <div className="io-pulse rounded-xl border-2 bg-[var(--io-card)] p-3 text-center" style={{ borderColor: "var(--io-blue)" }}><b style={{ color: "var(--io-blue)" }}>Image CDN</b><div className="text-[var(--io-sub)]">resize · convert · compress · cache</div></div>
        <span className="rotate-90 text-[var(--io-sub)] sm:rotate-0">→</span>
        <div className="space-y-2">
          {outs.map(([n, d, f, c], i) => (
            <div key={n} className={`io-pulse flex items-center gap-2 px-3 py-1.5 ${card}`} style={{ animationDelay: `${0.5 + i * 0.5}s` }}>
              <b className="w-14">{n}</b><span className="whitespace-nowrap text-[var(--io-sub)]">{d}</span>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ background: c }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
      <p className={legend}>One original goes in. The CDN makes the right size and format for each device.</p>
    </Stage>
  );
}

/* 4. Blur-up placeholder (real tiny preview of the real image) */
export function BlurUpDemo() {
  const steps: [string, number, string, string][] = [["1. Placeholder", 24, "blur(14px)", "scale(1.08)"], ["2. Transition", 160, "blur(4px)", "scale(1.02)"], ["3. Final image", 700, "blur(0)", "none"]];
  return (
    <Stage>
      <div className="grid grid-cols-3 gap-3 text-center text-[11px]">
        {steps.map(([t, w, f, s], i) => (
          <div key={t} className="space-y-2">
            <div className="io-ring overflow-hidden rounded-xl border bg-[var(--io-skel)]" style={{ animationDelay: `${i * 1.33}s` }}>
              <div className="h-20" style={{ background: bg(w), filter: f, transform: s }} />
            </div>
            <b>{t}</b>
          </div>
        ))}
      </div>
      <p className={legend}>A tiny blurred preview shows at once, then the real image fades in. It feels faster.</p>
    </Stage>
  );
}

/* 5. Layout shift */
export function ShiftDemo() {
  const lines = <div className="space-y-1.5"><div className="h-2 rounded-full bg-[var(--io-skel)]" /><div className="h-2 w-4/5 rounded-full bg-[var(--io-skel)]" /><div className="h-2 w-3/5 rounded-full bg-[var(--io-skel)]" /></div>;
  const head = <div className="h-2.5 w-1/3 rounded-full bg-[var(--io-skel)]" />;
  return (
    <Stage>
      <div className="grid grid-cols-2 gap-3 text-center text-[11px]">
        <div className="space-y-2">
          <div className={`h-[150px] space-y-2 p-2 text-left ${card}`}>{head}<div className="io-grow rounded-md" style={{ background: bg(400) }} />{lines}</div>
          <b>No space reserved</b><div className="font-semibold" style={{ color: "var(--io-red)" }}>CLS 0.24 · text jumps</div>
        </div>
        <div className="space-y-2">
          <div className={`h-[150px] space-y-2 p-2 text-left ${card}`}>{head}<div className="h-16 overflow-hidden rounded-md bg-[var(--io-skel)]"><div className="io-fade h-full" style={{ background: bg(400) }} /></div>{lines}</div>
          <b>Space reserved</b><div className="font-semibold" style={{ color: "var(--io-green)" }}>CLS 0.00 · nothing moves</div>
        </div>
      </div>
    </Stage>
  );
}

/* 6. Virtualization, with rolling counters */
export function VirtualDemo() {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 600); return () => clearTimeout(t); }, []);
  const cells = Array.from({ length: 48 });
  return (
    <Stage>
      <div className="grid grid-cols-2 gap-4 text-center text-[11px]">
        <div className="space-y-2">
          <div className="grid grid-cols-6 gap-1">{cells.map((_, i) => <i key={i} className="aspect-square rounded-md" style={{ background: "var(--io-amber)", opacity: 0.85 }} />)}</div>
          <b>Everything in the DOM</b>
          <div className="text-lg font-semibold" style={{ color: "var(--io-amber)" }}><AnimatedCounter value={on ? 500 : 0} /> <span className="text-xs font-normal text-[var(--io-sub)]">items</span></div>
        </div>
        <div className="space-y-2">
          <div className="relative">
            <div className="grid grid-cols-6 gap-1">{cells.map((_, i) => <i key={i} className="aspect-square rounded-md bg-[var(--io-skel)]" />)}</div>
            <div className="io-win absolute left-0 right-0 top-0 rounded-md" style={{ height: "calc(37.5% - 2px)", outline: "2px solid var(--io-green)", background: "color-mix(in oklab,var(--io-green) 30%,transparent)" }} />
          </div>
          <b>Only what you see</b>
          <div className="text-lg font-semibold" style={{ color: "var(--io-green)" }}><AnimatedCounter value={on ? 12 : 0} /> <span className="text-xs font-normal text-[var(--io-sub)]">items</span></div>
        </div>
      </div>
    </Stage>
  );
}

/* 7. The whole pipeline */
export function PipelineDemo() {
  const steps = [["Storage", "S3 / R2 originals", "var(--io-blue)"], ["Optimize", "resize · AVIF · WebP", "var(--io-purple)"], ["CDN edge", "cache · HTTP/2/3", "var(--io-teal)"], ["Browser", "sizes · priority · lazy", "var(--io-amber)"], ["Fast visual", "placeholder · no shift", "var(--io-green)"]];
  return (
    <Stage>
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        {steps.map(([t, s, c], i) => (
          <div key={t} className="flex flex-1 items-center gap-2">
            <div className="io-step flex-1 rounded-xl border bg-[var(--io-card)] px-2 py-2.5 text-center text-[11px]" style={{ animationDelay: `${i * 0.9}s`, ["--c" as string]: c }}>
              <b className="block">{t}</b><span className="text-[9px] opacity-80">{s}</span>
            </div>
            {i < steps.length - 1 && <span className="hidden text-[var(--io-sub)] sm:block">→</span>}
          </div>
        ))}
      </div>
    </Stage>
  );
}

/* Doc table, rounded with a light header like the Apple colour table */
export function DocTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="io not-prose overflow-x-auto rounded-2xl border bg-[var(--io-card)]">
      <IoTheme />
      <table className="w-full text-left text-[13px]">
        <thead className="bg-[var(--io-bg)]"><tr>{head.map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={`border-t px-4 py-3 ${j ? "text-[var(--io-sub)]" : "font-medium"}`}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}