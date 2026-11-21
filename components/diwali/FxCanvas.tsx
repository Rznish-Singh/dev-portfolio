"use client";

import { useEffect, useRef } from "react";
import { useDiwali } from "./DiwaliProvider";
import { PALETTE, playPop } from "./effects";

type Spark = { x: number; y: number; px: number; py: number; vx: number; vy: number; a: number; dec: number; c: string; r: number; g: number };
type Rocket = { x: number; y: number; ty: number };

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(a: T[]) => a[(Math.random() * a.length) | 0];
const IGNORE = "a,button,input,textarea,select,label,[role=switch],[data-dw-ui]";

/**
 * One canvas, one requestAnimationFrame loop: click-to-launch fireworks,
 * subtle auto fireworks, and a gold sparkle trail.
 * All simulation state lives in refs/closures, so React never re-renders per frame.
 */
export default function FxCanvas() {
  const { fireworks, sound, paused, reducedMotion } = useDiwali();
  const ref = useRef<HTMLCanvasElement>(null);
  const live = useRef({ fireworks, sound, paused, reducedMotion });
  const api = useRef({ kick: () => {} });
  live.current = { fireworks, sound, paused, reducedMotion };

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    let W = 0, H = 0, raf = 0, last = 0, nextAuto = performance.now() + 1500;
    let mx = -999, my = -999, lsx = 0, lsy = 0, lastTap = 0;
    const sparks: Spark[] = [];
    const rockets: Rocket[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const launch = (x: number, y: number) => { if (rockets.length < 6) rockets.push({ x, y: H, ty: y }); };
    const explode = (x: number, y: number) => {
      if (sparks.length > 650) return;
      const n = W < 640 ? 34 : 58, c1 = pick(PALETTE), c2 = pick(PALETTE), ring = Math.random() < 0.35;
      if (live.current.sound) playPop();
      for (let i = 0; i < n; i++) {
        const a = (i / n) * 6.283 + rnd(0, 0.1), sp = ring ? 3.8 : rnd(1.2, 4.8);
        sparks.push({ x, y, px: x, py: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, a: 1, dec: rnd(0.009, 0.017), c: i % 3 ? c1 : c2, r: rnd(1, 2.2), g: 1 });
      }
    };

    const frame = (t: number) => {
      raf = 0;
      const L = live.current;
      if (document.hidden || L.paused) return;
      const dt = Math.min(40, t - last) / 16.67; last = t;
      ctx.clearRect(0, 0, W, H);

      if (L.fireworks && !L.reducedMotion && t > nextAuto) { launch(rnd(W * 0.15, W * 0.85), rnd(H * 0.12, H * 0.4)); nextAuto = t + rnd(3000, 5500); }
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y -= Math.max(2.5, (r.y - r.ty) * 0.07) * dt;
        sparks.push({ x: r.x, y: r.y, px: r.x, py: r.y + 4, vx: rnd(-0.3, 0.3), vy: rnd(0.2, 0.8), a: 0.7, dec: 0.05, c: "#ffd27a", r: 1, g: 1 });
        if (r.y - r.ty < 8) { explode(r.x, r.y); rockets.splice(i, 1); }
      }

      ctx.globalCompositeOperation = "lighter"; ctx.lineCap = "round";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const q = sparks[i];
        q.px = q.x; q.py = q.y; q.vx *= 0.985; q.vy = q.vy * 0.985 + 0.04 * q.g * dt;
        q.x += q.vx * dt; q.y += q.vy * dt; q.a -= q.dec * dt;
        if (q.a <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = q.a; ctx.strokeStyle = q.c; ctx.lineWidth = q.r;
        ctx.beginPath(); ctx.moveTo(q.px, q.py); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";

      const needs = (L.fireworks && !L.reducedMotion) || sparks.length > 0 || rockets.length > 0;
      if (needs) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, W, H);
    };

    const kick = () => {
      if (!raf && !document.hidden && !live.current.paused) { last = performance.now(); raf = requestAnimationFrame(frame); }
    };
    api.current = { kick };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX; my = e.clientY;
      const L = live.current;
      if (L.fireworks && !L.reducedMotion && !L.paused && Math.hypot(mx - lsx, my - lsy) > 16 && sparks.length < 500) {
        lsx = mx; lsy = my;
        for (let i = 0; i < 2; i++) sparks.push({ x: mx, y: my, px: mx, py: my, vx: rnd(-0.6, 0.6), vy: rnd(-0.3, 0.6), a: 0.9, dec: 0.03, c: pick(["#ffd25a", "#ff9a2e", "#ffe9a8"]), r: rnd(1, 2), g: 0.4 });
        kick();
      }
    };
    const onDown = (e: PointerEvent) => {
      const L = live.current;
      if (!L.fireworks || L.paused || (e.target as Element | null)?.closest?.(IGNORE)) return;
      const n = performance.now();
      if (n - lastTap < 120) return;
      lastTap = n; launch(e.clientX, e.clientY); kick();
    };
    const onVis = () => { if (!document.hidden) kick(); };
    let rt = 0;
    const onResize = () => { window.clearTimeout(rt); rt = window.setTimeout(() => { resize(); kick(); }, 150); };

    resize(); kick();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(rt);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      ctx.clearRect(0, 0, W, H);
    };
  }, []);

  useEffect(() => {
    api.current.kick();
  }, [fireworks, paused, reducedMotion]);

  return <canvas ref={ref} aria-hidden="true" className="dw-fx" />;
}