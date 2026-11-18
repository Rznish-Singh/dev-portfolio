"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";

export interface PixelSwipeTextProps {
  children?: React.ReactNode;
  className?: string;
  textClassName?: string;
  /** Colour of the leading wipe band */
  wipeColor?: string;
  /** Leading band colour in dark mode (falls back to wipeColor) */
  wipeColorDark?: string;
  /** Colour of the trailing band. "currentColor" uses the text colour. */
  trailWipeColor?: string;
  /** Trailing band colour in dark mode (falls back to trailWipeColor) */
  trailWipeColorDark?: string;
  /** Animation speed multiplier (lower = faster) */
  speed?: number;
  /** "mount": play as soon as the page loads. "view": play when scrolled into view. */
  trigger?: "mount" | "view";
  /** Only for trigger="view": play once, or every time it enters the screen */
  playOnce?: boolean;
  /** Wait this many ms before starting (use it to stagger several texts) */
  delay?: number;
  /** Replay the wipe when the text is clicked */
  replayOnClick?: boolean;
  onComplete?: () => void;
  onClick?: () => void;
}

export function PixelSwipeText({
  children = "Pixel Swipe Text Animation",
  className = "",
  textClassName = "",
  wipeColor = "#e6e6e4",
  wipeColorDark = "#2e2e2e",
  trailWipeColor = "#f4f4f2",
  trailWipeColorDark = "#1f1f1f",
  speed = 0.7,
  trigger = "mount",
  playOnce = true,
  delay = 0,
  replayOnClick = false,
  onComplete,
  onClick,
}: PixelSwipeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playCount, setPlayCount] = useState(0);
  // The text starts hidden (also in the server HTML), so it never shows before the wipe
  const [show, setShow] = useState(false);

  const isInView = useInView(containerRef, { once: playOnce, amount: 0.2 });

  const parsedSpeed =
    typeof speed === "number" ? speed : parseFloat(String(speed)) || 0.7;

  // Start: on mount (every load / reload) or when scrolled into view
  useEffect(() => {
    if (trigger === "mount") {
      setPlayCount((prev) => prev + 1);
      return;
    }
    if (isInView) setPlayCount((prev) => prev + 1);
  }, [trigger, isInView]);

  useEffect(() => {
    if (playCount === 0) return;

    // Respect "reduce motion": just show the text
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(true);
      return;
    }

    const el = containerRef.current;
    const txt = textRef.current;
    const cv = canvasRef.current;
    if (!el || !txt || !cv) {
      setShow(true);
      return;
    }

    const ctx = cv.getContext("2d");
    if (!ctx) {
      setShow(true);
      return;
    }

    let animFrameId = 0;
    let stopped = false;

    // Hidden at the start of every run (first play, replay, delay)
    setShow(false);

    const r = el.getBoundingClientRect();
    const W = Math.max(1, Math.ceil(r.width));
    const H = Math.max(1, Math.ceil(r.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Pick colours for the current theme
    const isDark = document.documentElement.classList.contains("dark");

    const leadColor =
      (isDark && wipeColorDark ? wipeColorDark : wipeColor) || "#e6e6e4";

    const trailBase =
      isDark && trailWipeColorDark ? trailWipeColorDark : trailWipeColor;

    const trailColor =
      !trailBase || trailBase === "currentColor"
        ? getComputedStyle(txt).color || "#000000"
        : trailBase;

    const CELL = 7;
    const BAND = 52;
    const FLICK = 0.34;
    const OVER = 0.8;
    const OFFSET = 150;
    const DCOVER = 760;
    const HOLD = 50;
    const DREVEAL = 760;

    const cubicBezier = (p1x: number, p1y: number, p2x: number, p2y: number) => {
      const cx = 3 * p1x;
      const bx = 3 * (p2x - p1x) - cx;
      const ax = 1 - cx - bx;
      const cy = 3 * p1y;
      const by = 3 * (p2y - p1y) - cy;
      const ay = 1 - cy - by;
      const fx = (t: number) => ((ax * t + bx) * t + cx) * t;
      const fy = (t: number) => ((ay * t + by) * t + cy) * t;
      const dfx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
      return (x: number) => {
        if (x <= 0) return 0;
        if (x >= 1) return 1;
        let t = x;
        for (let i = 0; i < 8; i++) {
          const e = fx(t) - x;
          const d = dfx(t);
          if (Math.abs(e) < 1e-4 || Math.abs(d) < 1e-6) break;
          t -= e / d;
        }
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        return fy(t);
      };
    };

    const ease = cubicBezier(0.85, 0, 0.15, 1);

    const hash = (x: number, y: number, s: number) => {
      let h = (x * 374761393) ^ (y * 668265263) ^ (s * 2246822519);
      h = Math.imul(h ^ (h >>> 13), 1274126177);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
    };

    const o = OFFSET * parsedSpeed;
    const dc = DCOVER * parsedSpeed;
    const h = HOLD * parsedSpeed;
    const dr = DREVEAL * parsedSpeed;
    const RS = o + dc + h; // moment the text is fully covered
    const RSg = RS + o;
    const END = RSg + dr;

    let revealed = false;
    const t0 = performance.now() + delay;

    const seg = (t: number, a: number, b: number) => {
      if (t <= a) return 0;
      if (t >= b) return 1;
      return ease((t - a) / (b - a));
    };

    const edge = (edgeX: number, dir: number, seed: number) => {
      const g0 = Math.floor((edgeX - BAND) / CELL);
      const g1 = Math.ceil((edgeX + BAND) / CELL);
      for (let gx = g0; gx <= g1; gx++) {
        const cx = gx * CELL + CELL / 2;
        if (cx < 0 || cx > W) continue;
        const dist = dir * (cx - edgeX);
        for (let gy = 0; gy * CELL < H; gy++) {
          const p = (dist / BAND) * 0.5 + 0.5 + (Math.random() - 0.5) * FLICK;
          if (p > hash(gx, gy, seed)) {
            ctx.fillRect(gx * CELL, gy * CELL, CELL + OVER, CELL + OVER);
          }
        }
      }
    };

    const bar = (fr: number, color: string, seed: number) => {
      const L = fr * W;
      const R = L + W;
      ctx.fillStyle = color;
      const cl = Math.max(0, L + BAND);
      const cr = Math.min(W, R - BAND);
      if (cr > cl) ctx.fillRect(cl, 0, cr - cl, H);
      edge(L, 1, seed);
      edge(R, -1, seed);
    };

    const tick = (now: number) => {
      if (stopped) return;
      const t = now - t0;

      // Still waiting for the start delay: text stays hidden, nothing drawn
      if (t < 0) {
        animFrameId = requestAnimationFrame(tick);
        return;
      }

      ctx.clearRect(0, 0, W, H);

      const gF = seg(t, 0, dc) - 1 + seg(t, RSg, RSg + dr);
      const tF = seg(t, o, o + dc) - 1 + seg(t, RS, RS + dr);

      // Reveal the text while the bands fully cover it
      if (!revealed && t >= RS) {
        setShow(true);
        revealed = true;
      }

      bar(gF, leadColor, 0);
      bar(tF, trailColor, 91);

      if (t < END + 80) {
        animFrameId = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, W, H);
        onComplete?.();
      }
    };

    animFrameId = requestAnimationFrame(tick);

    return () => {
      stopped = true;
      cancelAnimationFrame(animFrameId);
      ctx.clearRect(0, 0, W, H);
      setShow(true); // never leave the text hidden if the effect is interrupted
    };
  }, [
    playCount,
    wipeColor,
    wipeColorDark,
    trailWipeColor,
    trailWipeColorDark,
    parsedSpeed,
    delay,
    onComplete,
  ]);

  const handleClick = () => {
    if (replayOnClick) setPlayCount((prev) => prev + 1);
    onClick?.();
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={cn(
        "relative -mb-[0.14em] inline-block overflow-hidden pb-[0.14em]",
        replayOnClick && "cursor-pointer select-none",
        className,
      )}
    >
      <span
        ref={textRef}
        style={{ visibility: show ? "visible" : "hidden" }}
        className={cn("font-sans", textClassName)}
      >
        {children}
      </span>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  );
}

export const PixelSwipeTextAnimation = PixelSwipeText;
export default PixelSwipeText;