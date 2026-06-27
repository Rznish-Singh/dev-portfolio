"use client";

import { useTime, useWindowSize } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export default function Info({ show }: { show: string[] }) {
  const { width } = useWindowSize();

  if (width > 0 && width < 1024) {
    return null;
  }

  return (
    <>
      {show.includes("time") && <Time className="top-4 left-4" />}
      {/* {show.includes("screen") && <ScreenSize className="bottom-4 left-4" />} */}
    </>
  );
}

export function Time({ className }: { className?: string }) {
  const time = useTime();

  return (
    <div
      className={cn(
        "fixed z-50 animate-fade-up font-mono text-xs tracking-wider text-muted",
        className
      )}
    >
      {time || "--:--:--"}
    </div>
  );
}

export function ScreenSize({ className }: { className?: string }) {
  const { width, height } = useWindowSize();

  return (
    <div
      className={cn(
        "fixed z-50 animate-fade-up font-mono text-xs tracking-wider text-muted",
        className
      )}
    >
      {width} × {height}
    </div>
  );
}
