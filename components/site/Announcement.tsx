"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ANNOUNCEMENT as A } from "@/config/announcement";

const KEY = `announcement:${A.id}`;

// Pass onAction for anything that isn't a link (open a modal, copy email, etc.)
export function Announcement({ onAction }: { onAction?: () => void }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!A.enabled) return;
    try {
      if (localStorage.getItem(KEY)) return;
    } catch {}
    const t = setTimeout(() => setOpen(true), A.delayMs);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
  };

  const external = A.action?.href.startsWith("http");
  const actionClass =
    "shrink-0 rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[60] mx-auto flex w-fit max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border border-line bg-white py-2 pl-3 pr-2 text-sm shadow-[0_12px_40px_-12px_rgba(0,0,0,0.3)] max-sm:rounded-2xl dark:bg-neutral-950 sm:gap-3"
        >
          {A.badge && (
            <span className="shrink-0 rounded-full bg-yellow-300 px-2 py-0.5 font-mono text-[0.65rem] uppercase text-black">
              {A.badge}
            </span>
          )}
          <span className="min-w-0 text-ink/85">{A.message}</span>

          {A.action && onAction ? (
            <button onClick={() => { onAction(); dismiss(); }} className={actionClass}>
              {A.action.label}
            </button>
          ) : A.action ? (
            external ? (
              <a href={A.action.href} target="_blank" rel="noopener noreferrer" onClick={dismiss} className={actionClass}>
                {A.action.label}
              </a>
            ) : (
              <Link href={A.action.href} onClick={dismiss} className={actionClass}>
                {A.action.label}
              </Link>
            )
          ) : null}

          <button onClick={dismiss} aria-label="Dismiss" className="shrink-0 px-2 py-1 text-muted hover:text-ink">
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}