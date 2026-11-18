"use client";

import { useEffect, useRef } from "react";
import { useDiwali } from "./DiwaliProvider";

const COLORS = ["#ffd25a", "#ff9a2e", "#ff5fa2", "#ffe9a8", "#ff7a3a", "#c58bff"];
const H = 130;      // canvas height
const BASE = 50;    // wire height
const SAG = 16;     // swag depth
const REACH = 80;   // cursor influence radius

type Bulb = { ax: number; ay: number; ox: number; vx: number; lvl: number; c: string; i: number };

/**
 * String lights drawn on a canvas. They turn on one by one, and react to the cursor / finger:
 * bulbs near the pointer flare up and the string swings away from it.
 */
export default function FairyLights() {
  const { lights, reducedMotion, paused } = useDiwali();
  const ref = useRef<HTMLCanvasElement>(null);
  const live = useRef({ lights, reducedMotion, paused, onAt: performance.now() });
  const kick = useRef<() => void>(() => {});

  live.current.lights = lights;
  live.current.reducedMotion = reducedMotion;
  live.current.paused = paused;

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    let w = 0, raf = 0, mx = -999, my = -999, resetT = 0;
    let bulbs: Bulb[] = [];

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      cv.width = w * dpr; cv.height = H * dpr;
      cv.style.width = `${w}px`; cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(8, Math.round(w / 36));
      const swags = Math.max(3, Math.round(w / 320));
      bulbs = Array.from({ length: n + 1 }, (_, i) => ({
        ax: (i / n) * w,
        ay: BASE + SAG * Math.abs(Math.sin((i / n) * Math.PI * swags)),
        ox: 0, vx: 0, lvl: 0, c: COLORS[i % COLORS.length], i,
      }));
    };

    const update = (t: number, snap: boolean) => {
      const L = live.current;
      for (const b of bulbs) {
        const bx = b.ax + b.ox, by = b.ay + 13;
        let target = 0;
        if (L.lights && (snap || t - L.onAt > b.i * 55)) target = 0.8 + 0.12 * Math.sin(t * 0.003 + b.i * 1.7);
        if (!snap && !L.reducedMotion) {
          const dx = bx - mx, dy = by - my, d = Math.hypot(dx, dy);
          if (L.lights && d < REACH) {
            const f = 1 - d / REACH;
            target = Math.max(target, 0.9 + f * 0.9);
            b.vx += (dx / (d || 1)) * f * 1.1;
          }
          b.vx += -b.ox * 0.06;
          b.vx *= 0.94;
          b.ox = Math.max(-16, Math.min(16, b.ox + b.vx));
        }
        b.lvl = snap ? target : b.lvl + (target - b.lvl) * 0.12;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, H);
      // wire
      ctx.strokeStyle = "#2b2118"; ctx.lineWidth = 1.5; ctx.beginPath();
      bulbs.forEach((b, i) => {
        if (i === 0) ctx.moveTo(b.ax, b.ay);
        else { const p = bulbs[i - 1]; ctx.quadraticCurveTo(p.ax, p.ay, (p.ax + b.ax) / 2, (p.ay + b.ay) / 2); }
      });
      ctx.stroke();
      // bulbs
      for (const b of bulbs) {
        const bx = b.ax + b.ox, by = b.ay + 13;
        ctx.strokeStyle = "#2b2118"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(b.ax, b.ay); ctx.lineTo(bx, by - 5); ctx.stroke();
        ctx.fillStyle = "#4b3a2c"; ctx.beginPath(); ctx.ellipse(bx, by, 4.2, 6, 0, 0, 6.283); ctx.fill();
        if (b.lvl > 0.01) {
          ctx.globalAlpha = Math.min(1, b.lvl);
          ctx.fillStyle = b.c; ctx.beginPath(); ctx.ellipse(bx, by, 4.2, 6, 0, 0, 6.283); ctx.fill();
          ctx.globalCompositeOperation = "lighter";
          const r = 14 + b.lvl * 16;
          const g = ctx.createRadialGradient(bx, by, 0, bx, by, r);
          g.addColorStop(0, b.c); g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.globalAlpha = Math.min(0.7, b.lvl * 0.5);
          ctx.fillStyle = g; ctx.fillRect(bx - r, by - r, r * 2, r * 2);
          ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
        }
      }
    };

    const tick = (t: number) => {
      raf = 0;
      if (document.hidden) return;
      const L = live.current;
      if (L.reducedMotion) { update(t, true); draw(); return; }   // static, no loop
      if (L.paused) { draw(); return; }                            // frozen
      update(t, false); draw();
      raf = requestAnimationFrame(tick);
    };
    kick.current = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const move = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; window.clearTimeout(resetT); };
    const up = (e: PointerEvent) => {
      if (e.pointerType === "touch") { window.clearTimeout(resetT); resetT = window.setTimeout(() => { mx = my = -999; }, 500); }
    };
    const out = (e: MouseEvent) => { if (!e.relatedTarget) mx = my = -999; };
    const vis = () => { if (!document.hidden) kick.current(); };
    let rt = 0;
    const resize = () => { window.clearTimeout(rt); rt = window.setTimeout(() => { build(); kick.current(); }, 150); };

    build();
    kick.current();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("mouseout", out);
    document.addEventListener("visibilitychange", vis);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(rt); window.clearTimeout(resetT);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("mouseout", out);
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // react to toggles: replay the one-by-one turn-on when lights come back on
  useEffect(() => {
    if (lights) live.current.onAt = performance.now();
    kick.current();
  }, [lights, paused, reducedMotion]);

  return <canvas ref={ref} aria-hidden="true" className="dw-lights" />;
}
