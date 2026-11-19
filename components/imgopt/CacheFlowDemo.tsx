"use client";
import { useEffect, useRef, useState } from "react";
import { IoTheme } from "@/components/imgopt/theme";
import { bg } from "@/components/imgopt/images";

// Stageshow-style demo: one browser window (the hero), CDN + origin as satellites, a cursor that causes every motion.
// Colours come from shadcn tokens (bg-[var(--io-card)], bg-[var(--io-skel)], border...) so dark mode is automatic; accents are --cf-* below.

type Kind = "idle" | "active" | "miss" | "ok";
type S = { kind: Kind; label: string };
const IDLE: S = { kind: "idle", label: "Idle" };
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const PHOTO = bg(800);

function Pill({ s }: { s: S }) {
  if (s.kind === "idle")
    return <span className="inline-flex h-6 items-center rounded-full bg-[var(--io-skel)] px-3 text-[10px] font-semibold text-[var(--io-sub)]">{s.label}</span>;
  const c = s.kind === "miss" ? "var(--cf-miss)" : "var(--cf-ok)";
  return (
    <span key={s.kind + s.label} className={`cf-pill ${s.kind === "active" ? "cf-loop" : ""} relative inline-flex h-6 items-center gap-1.5 rounded-full pl-1.5 pr-3 text-[10px] font-semibold text-white`}
      style={{ background: c, ["--c" as string]: c }}>
      {s.kind === "active" ? <span className="cf-spin" /> : (
        <svg viewBox="-7 -7 14 14" className="size-3.5">
          <circle r="6.5" fill="white" />
          <path d={s.kind === "ok" ? "M-3 .3L-.8 2.7 3.4-2.3" : "M-2.4-2.4L2.4 2.4M2.4-2.4L-2.4 2.4"} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: c }} />
        </svg>
      )}
      {s.label}
    </span>
  );
}

function Node({ r, title, sub, s, dim, icon, children }: { r: React.Ref<HTMLDivElement>; title: string; sub: string; s: S; dim: boolean; icon: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div ref={r} className="flex min-h-0 flex-col gap-2 rounded-lg border bg-[var(--io-card)] p-2.5 shadow-sm sm:p-3 transition-all duration-300"
      style={{ opacity: dim ? 0.45 : 1, boxShadow: s.kind === "idle" ? undefined : "0 0 0 2px var(--cf-blue)" }}>
      <div className="flex items-center gap-2">
        <span className="grid size-6 place-items-center rounded-md bg-[var(--io-skel)] text-[var(--io-sub)]">{icon}</span>
        <div className="leading-tight"><div className="text-[11px] font-semibold">{title}</div><div className="hidden text-[9px] text-[var(--io-sub)] sm:block">{sub}</div></div>
      </div>
      <Pill s={s} />
      {children}
    </div>
  );
}

const Globe = <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></svg>;
const Bucket = <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" /></svg>;

export function CacheFlowDemo() {
  const [br, setBr] = useState<S>(IDLE);
  const [cdn, setCdn] = useState<S>(IDLE);
  const [org, setOrg] = useState<S>(IDLE);
  const [img, setImg] = useState<"empty" | "loading" | "shown">("empty");
  const [ms, setMs] = useState<number | null>(null);
  const [cdnHas, setCdnHas] = useState(false);
  const [prog, setProg] = useState(0);
  const [dim, setDim] = useState(false);
  const [pk, setPk] = useState({ x: 0, y: 0, show: false });
  const [cur, setCur] = useState({ x: 420, y: 280 });
  const [press, setPress] = useState<"reload" | "clear" | null>(null);
  const [cap, setCap] = useState("First time: the browser has no image yet.");
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(true);

  const stage = useRef<HTMLDivElement>(null);
  const reloadR = useRef<HTMLSpanElement>(null);
  const clearR = useRef<HTMLSpanElement>(null);
  const imgR = useRef<HTMLDivElement>(null);
  const cdnR = useRef<HTMLDivElement>(null);
  const orgR = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const a = () => setReduced(m.matches), b = () => setVisible(document.visibilityState === "visible");
    a(); b(); m.addEventListener("change", a); document.addEventListener("visibilitychange", b);
    return () => { m.removeEventListener("change", a); document.removeEventListener("visibilitychange", b); };
  }, []);

  useEffect(() => {
    let dead = false;
    const w = async (ms: number) => { await sleep(ms); if (dead) throw 0; };
    const pos = (el: HTMLElement | null) => {
      const a = el?.getBoundingClientRect(), b = stage.current?.getBoundingClientRect();
      return a && b ? { x: a.left - b.left + a.width / 2, y: a.top - b.top + a.height / 2 } : { x: 200, y: 150 };
    };
    const fly = (el: HTMLElement | null) => setPk({ ...pos(el), show: true });
    const click = async (el: HTMLElement | null, which: "reload" | "clear") => {
      setCur(pos(el)); await w(900); setPress(which); await w(170); setPress(null);
    };
    const reset = () => {
      setBr(IDLE); setCdn(IDLE); setOrg(IDLE); setImg("empty"); setMs(null); setCdnHas(false); setProg(0); setDim(false);
      setPk((p) => ({ ...p, show: false })); setCap("First time: the browser has no image yet.");
    };
    const poster = () => { // the result stays on screen: repeat visit, cache HIT
      setBr({ kind: "ok", label: "Cache HIT" }); setCdn({ kind: "ok", label: "Cached" }); setOrg(IDLE);
      setImg("shown"); setMs(0); setCdnHas(true); setDim(true); setPk((p) => ({ ...p, show: false }));
      setCap("Second time: browser cache HIT. No network request at all. 0 ms.");
    };
    if (reduced) { poster(); return; }
    if (!visible) return;

    const run = async () => {
      reset(); await w(1100);
      // 1. first visit
      await click(reloadR.current, "reload");
      setBr({ kind: "active", label: "Requesting" }); setImg("loading"); setCap("The browser asks for the image…"); fly(imgR.current); await w(800);
      setBr({ kind: "miss", label: "Cache MISS" }); setCap("Not in the browser cache (MISS). Ask the CDN next."); fly(cdnR.current); await w(800);
      setCdn({ kind: "active", label: "Checking" }); await w(600);
      setCdn({ kind: "miss", label: "Cache MISS" }); setCap("The CDN does not have it either. Fetch it from the origin (R2)."); fly(orgR.current); await w(800);
      setOrg({ kind: "active", label: "Reading" });
      for (let i = 1; i <= 8; i++) { setProg(i * 12.5); await w(110); }
      setOrg({ kind: "ok", label: "Sent" }); setCap("The origin sends the original file. A bit slow, but only once."); fly(cdnR.current); await w(800);
      setCdn({ kind: "ok", label: "Cached" }); setCdnHas(true); setCap("The CDN keeps a copy."); fly(imgR.current); await w(800);
      setBr({ kind: "ok", label: "Stored" }); setImg("shown"); setMs(320); setPk((p) => ({ ...p, show: false }));
      setCap("The browser keeps a copy too. Image shown in 320 ms."); await w(1500);
      // 2. repeat visit
      await click(reloadR.current, "reload");
      setBr({ kind: "active", label: "Requesting" }); setImg("loading"); setMs(null); setCdn(IDLE); setOrg(IDLE); setProg(0); await w(450);
      setBr({ kind: "ok", label: "Cache HIT" }); setImg("shown"); setMs(0); setDim(true); setCdn({ kind: "ok", label: "Cached" });
      setCap("Second time: browser cache HIT. No network request at all. 0 ms."); await w(3200);
      // 3. clear cache: the visible cause of the loop reset
      await click(clearR.current, "clear");
      reset(); setCap("Cache cleared. Back to the first visit."); await w(900);
    };
    (async () => { try { while (!dead) await run(); } catch {} })();
    return () => { dead = true; };
  }, [reduced, visible]);

  const btn = (on: boolean) => `rounded-md border px-2 py-0.5 text-[10px] font-semibold transition-transform ${on ? "scale-90 bg-[var(--io-skel)]" : "bg-[var(--io-card)]"}`;

  return (
    <div className="io cf not-prose">
      <IoTheme /><style>{css}</style>
      <div ref={stage} aria-hidden className="relative h-[440px] overflow-hidden rounded-xl border bg-[var(--io-bg)] p-3 sm:h-[340px] sm:p-4">
        <div className="grid h-full grid-cols-1 grid-rows-[1.5fr_1fr] gap-3 sm:grid-cols-[1.4fr_1fr] sm:grid-rows-1 sm:gap-4">
          {/* hero: the browser */}
          <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border bg-[var(--io-card)] shadow-sm">
            <div className="flex h-9 items-center gap-2 border-b px-3">
              <i className="size-2 rounded-full bg-[#ff5f57]" /><i className="size-2 rounded-full bg-[#febc2e]" /><i className="size-2 rounded-full bg-[#28c840]" />
              <span className="ml-1 hidden flex-1 truncate rounded-md bg-[var(--io-skel)] px-2 py-0.5 text-[9px] text-[var(--io-sub)] sm:block">photos.app</span>
              <span ref={reloadR} className={`${btn(press === "reload")} max-sm:ml-auto`}>Reload</span>
              <span ref={clearR} className={btn(press === "clear")}>Clear</span>
            </div>
            <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
              <div className="h-2.5 w-24 rounded bg-[var(--io-skel)]" />
              <div ref={imgR} className="relative min-h-0 flex-1 overflow-hidden rounded-md bg-[var(--io-skel)]">
                <div className="absolute inset-0 transition-opacity duration-300" style={{ background: PHOTO, opacity: img === "shown" ? 1 : 0 }} />
                {img === "loading" && <div className="cf-shimmer absolute inset-0" />}
              </div>
              <div className="flex items-center justify-between">
                <div className="h-2 w-16 rounded bg-[var(--io-skel)]" />
                <span className="text-[10px] font-semibold tabular-nums" style={{ color: ms === 0 ? "var(--cf-ok)" : undefined }}>{ms === null ? "— ms" : `${ms} ms`}</span>
              </div>
            </div>
          </div>
          {/* satellites */}
          <div className="grid min-h-0 grid-cols-2 grid-rows-1 gap-3 sm:grid-cols-1 sm:grid-rows-2 sm:gap-4">
            <Node r={cdnR} title="CDN edge" sub="nearby server" s={cdn} dim={dim} icon={Globe}>
              <div className="flex h-5 items-center rounded bg-[var(--io-skel)] px-2 text-[9px] text-[var(--io-sub)]">{cdnHas ? "photo.avif · 62 KB" : ""}</div>
            </Node>
            <Node r={orgR} title="Origin · R2" sub="original file lives here" s={org} dim={dim} icon={Bucket}>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--io-skel)]"><div className="h-full rounded-full transition-[width] duration-100" style={{ width: `${prog}%`, background: "var(--cf-blue)" }} /></div>
            </Node>
          </div>
        </div>
        <div className="pointer-events-none absolute z-20 size-3 rounded-full" style={{ left: pk.x, top: pk.y, background: "var(--cf-blue)", opacity: pk.show ? 1 : 0, transform: "translate(-50%,-50%)", transition: "left .7s cubic-bezier(.4,0,.2,1), top .7s cubic-bezier(.4,0,.2,1), opacity .3s" }} />
        <div className="pointer-events-none absolute z-30" style={{ left: cur.x, top: cur.y, transition: "left .8s cubic-bezier(.4,0,.2,1), top .8s cubic-bezier(.4,0,.2,1)" }}>
          <svg height="24" width="24" viewBox="0 0 32 32" style={{ margin: "-4px 0 0 -4px", filter: "drop-shadow(0 1px 2px rgba(0,0,0,.35))" }}>
            <g fill="none" fillRule="evenodd" transform="translate(10 7)">
              <path d="m6.148 18.473 1.863-1.003 1.615-.839-2.568-4.816h4.332l-11.379-11.408v16.015l3.316-3.221z" fill="#fff" />
              <path d="m6.431 17 1.765-.941-2.775-5.202h3.604l-8.025-8.043v11.188l2.53-2.442z" fill="#000" />
            </g>
          </svg>
        </div>
      </div>
      <p className="mt-3 min-h-5 text-center text-[13px] text-[var(--io-sub)]" aria-live="polite">{cap}</p>
    </div>
  );
}

const css = `
.cf{--cf-ok:var(--io-green);--cf-miss:var(--io-amber);--cf-blue:var(--io-blue)}
.cf-pill::before{content:"";position:absolute;inset:-4px;border-radius:999px;border:2.5px solid var(--c);animation:cfPulse 1.1s ease-out forwards}
.cf-loop::before{animation-iteration-count:infinite}
@keyframes cfPulse{0%{opacity:.8;transform:scale(.94)}100%{opacity:.15;transform:scale(1.06)}}
.cf-spin{width:12px;height:12px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:cfSpin .8s linear infinite}
@keyframes cfSpin{to{transform:rotate(360deg)}}
.cf-shimmer{background:linear-gradient(100deg,transparent 30%,color-mix(in oklab,var(--cf-blue) 25%,transparent) 50%,transparent 70%);background-size:200% 100%;animation:cfSh 1.1s linear infinite}
@keyframes cfSh{from{background-position:200% 0}to{background-position:-200% 0}}
`;