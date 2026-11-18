"use client";

import "./diwali.css";
import dynamic from "next/dynamic";
import {
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from "react";

export type DiwaliFlags = { lights: boolean; petals: boolean; fireworks: boolean; sound: boolean; paused: boolean };

type DiwaliContextValue = DiwaliFlags & {
  active: boolean;
  reducedMotion: boolean;
  /** increments on reset so stateful pieces (diyas) can remount */
  resetKey: number;
  open(): void;
  close(): void;
  toggle(): void;
  setFlag(key: keyof DiwaliFlags, value: boolean): void;
  reset(): void;
};

const DEFAULT_FLAGS: DiwaliFlags = { lights: true, petals: true, fireworks: true, sound: false, paused: false };
// Browser-only, code-split: loads the first time Diwali mode is switched on.
const DiwaliLayer = dynamic(() => import("./DiwaliLayer"), { ssr: false });

const Ctx = createContext<DiwaliContextValue | null>(null);

export function useDiwali() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useDiwali must be used inside <DiwaliProvider>");
  return c;
}

/**
 * darkClass: the class your Tailwind dark mode uses on <html> (default "dark").
 * Diwali mode adds it for the night look and removes it again on close if it wasn't already there.
 * Pass null to skip this and keep your current theme.
 */
export function DiwaliProvider({ children, darkClass = "dark" }: { children: ReactNode; darkClass?: string | null }) {
  const [active, setActive] = useState(false);
  const [flags, setFlags] = useState<DiwaliFlags>(DEFAULT_FLAGS);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const open = useCallback(() => { setFlags(DEFAULT_FLAGS); setResetKey(0); setActive(true); }, []);
  const close = useCallback(() => { setActive(false); setFlags(DEFAULT_FLAGS); }, []);
  const toggle = useCallback(() => setActive((a) => { if (!a) { setFlags(DEFAULT_FLAGS); setResetKey(0); } return !a; }), []);
  const setFlag = useCallback((k: keyof DiwaliFlags, v: boolean) => setFlags((f) => ({ ...f, [k]: v })), []);
  const reset = useCallback(() => { setFlags(DEFAULT_FLAGS); setResetKey((n) => n + 1); }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const on = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Night theme: scoped to this mode, fully restored on close.
  useEffect(() => {
    if (!active) return;
    const el = document.documentElement;
    el.dataset.diwali = "on";
    const had = darkClass ? el.classList.contains(darkClass) : true;
    if (darkClass) el.classList.add(darkClass);
    return () => {
      delete el.dataset.diwali;
      if (darkClass && !had) el.classList.remove(darkClass);
    };
  }, [active, darkClass]);

  // Shift+D toggles, Esc closes. Ignored while typing and when Ctrl/Cmd/Alt are held, so no browser shortcut is hijacked.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
      if (e.key === "Escape" && active) { close(); return; }
      if (e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === "d" && !typing) toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, toggle]);

  const value = useMemo(
    () => ({ ...flags, active, reducedMotion, resetKey, open, close, toggle, setFlag, reset }),
    [flags, active, reducedMotion, resetKey, open, close, toggle, setFlag, reset],
  );
  return (
    <Ctx.Provider value={value}>
      {children}
      {active && <DiwaliLayer />}
    </Ctx.Provider>
  );
}
