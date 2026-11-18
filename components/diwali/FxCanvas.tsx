"use client";

import { useEffect, useRef } from "react";
import { useDiwali } from "./DiwaliProvider";
import { PALETTE, playPop } from "./effects";

type Petal = {
  x: number; y: number; s: number; vy: number; vx: number; ph: number; sw: number;
  rot: number; vr: number; flip: number; vf: number; type: 0 | 1 | 2 | 3; col: string;
};
type Spark = { x: number; y: number; px: number; py: number; vx: number; vy: number; a: number; dec: number; c: string; r: number; g: number };
type Rocket = { x: number; y: number; ty: number };

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(a: T[]) => a[(Math.random() * a.length) | 0];
const IGNORE = "a,button,input,textarea,select,label,[role=switch],[data-dw-ui]";

/**
 * One canvas, one requestAnimationFrame loop: falling marigold petals / roses / blooms / leaves
 * (they drift away from the cursor), click-to-launch fireworks, subtle auto fireworks, and a gold sparkle trail.
 * All simulation state lives in refs/closures, so React never re-renders per frame.
 */
export default function FxCanvas() {
  const { petals, fireworks, sound, paused, reducedMotion } = useDiwali();
  const ref = useRef<HTMLCanvasElement>(null);
  const live = useRef({ petals, fireworks, sound, paused, reducedMotion });
  const api = useRef({ kick: () => {}, spawn: () => {} });
  live.current = { petals, fireworks, sound, paused, reducedMotion };

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    let W = 0, H = 0, raf = 0, last = 0, nextAuto = performance.now() + 1500;
    let mx = -999, my = -999, lsx = 0, lsy = 0, lastTap = 0;
    let list: Petal[] = [];
    const sparks: Spark[] = [];
    const rockets: Rocket[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = () => {
      list = [];
      if (live.current.reducedMotion) return;
      const n = W < 640 ? 16 : 32;
      for (let i = 0; i < n; i++) {
        const k = Math.random();
        const type = (k < 0.4 ? 0 : k < 0.6 ? 1 : k < 0.85 ? 2 : 3) as Petal["type"];
        list.push({
          x: rnd(0, W), y: -rnd(0, H), s: type === 2 ? rnd(6, 10) : rnd(7, 13),
          vy: rnd(0.6, 1.6), vx: rnd(-0.2, 0.2), ph: rnd(0, 6), sw: rnd(0.8, 1.8),
          rot: rnd(0, 6), vr: rnd(-0.03, 0.03), flip: rnd(0, 6), vf: rnd(0.02, 0.06), type,
          col: type === 0 ? pick(["#f5a623", "#ff8c1a", "#ffb703"])
            : type === 1 ? pick(["#e0457b", "#ff6b9d", "#c92a64"])
            : type === 2 ? pick(["#ff8c1a", "#ffb703"]) : "#3f9a42",
        });
      }
    };

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.scale(1, Math.max(0.25, Math.abs(Math.cos(p.flip))));
      ctx.fillStyle = p.col; ctx.globalAlpha = 0.92; ctx.beginPath();
      const s = p.s;
      if (p.type === 0) ctx.ellipse(0, 0, s, s * 0.45, 0, 0, 6.283);
      else if (p.type === 1) {
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo(s, -s * 0.6, s * 0.8, s * 0.8, 0, s * 0.9);
        ctx.bezierCurveTo(-s * 0.8, s * 0.8, -s, -s * 0.6, 0, -s);
      } else if (p.type === 3) {
        ctx.moveTo(0, -s); ctx.quadraticCurveTo(s * 0.7, 0, 0, s); ctx.quadraticCurveTo(-s * 0.7, 0, 0, -s);
      } else {
        for (let k = 0; k < 7; k++) {
          const a = (k / 7) * 6.283, cx = Math.cos(a) * s * 0.55, cy = Math.sin(a) * s * 0.55;
          ctx.moveTo(cx + s * 0.38, cy); ctx.arc(cx, cy, s * 0.38, 0, 6.283);
        }
        ctx.fill();
        ctx.fillStyle = "#c25a05"; ctx.beginPath(); ctx.arc(0, 0, s * 0.3, 0, 6.283);
      }
      ctx.fill();
      ctx.restore();
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

      if (L.petals && !L.reducedMotion) {
        for (const p of list) {
          p.y += p.vy * dt;
          p.x += (Math.sin((t / 1000) * p.sw + p.ph) * 0.7 + p.vx) * dt;
          p.rot += p.vr * dt; p.flip += p.vf * dt;
          const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
          if (d < 110) { const f = 1 - d / 110; p.x += (dx / (d || 1)) * f * 3.5 * dt; p.y += (dy / (d || 1)) * f * 1.5 * dt; p.rot += f * 0.1; }
          if (p.y > H + 20) { p.y = -20; p.x = rnd(0, W); }
          drawPetal(p);
        }
        ctx.globalAlpha = 1;
      }

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

      const needs = (L.petals && !L.reducedMotion) || (L.fireworks && !L.reducedMotion) || sparks.length > 0 || rockets.length > 0;
      if (needs) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, W, H);
    };

    const kick = () => {
      if (!raf && !document.hidden && !live.current.paused) { last = performance.now(); raf = requestAnimationFrame(frame); }
    };
    api.current = { kick, spawn };

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
    const onOut = (e: MouseEvent) => { if (!e.relatedTarget) mx = my = -999; };
    const onVis = () => { if (!document.hidden) kick(); };
    let rt = 0;
    const onResize = () => { window.clearTimeout(rt); rt = window.setTimeout(() => { resize(); kick(); }, 150); };

    resize(); spawn(); kick();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("mouseout", onOut);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(rt);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      ctx.clearRect(0, 0, W, H);
    };
  }, []);

  useEffect(() => {
    if (petals) api.current.spawn();
    api.current.kick();
  }, [petals, fireworks, paused, reducedMotion]);

  return <canvas ref={ref} aria-hidden="true" className="dw-fx" />;
}
