"use client";
import { useEffect, useState } from "react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { SummaryButton } from "@/components/imgopt/Summary";

/** Live visitor count. Counts you once per session, then re-checks every 15s so the digits roll when it changes. */
export function LiveVisitors() {
  const [n, setN] = useState(0);
  useEffect(() => {
    let alive = true;
    const pull = (method: "GET" | "POST") =>
      fetch("/api/visits", { method, cache: "no-store" })
        .then((r) => r.json())
        .then((d) => alive && setN(d.count))
        .catch(() => {});
    pull(sessionStorage.getItem("io-counted") ? "GET" : "POST");
    sessionStorage.setItem("io-counted", "1");
    const t = setInterval(() => pull("GET"), 15000);
    return () => { alive = false; clearInterval(t); };
  }, []);
  return (
    <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-60" />
        <span className="relative inline-flex size-2 rounded-full bg-green-500" />
      </span>
      <AnimatedCounter value={n} className="font-semibold" />
      <span className="text-muted-foreground">visitors</span>
    </div>
  );
}

/** Drop this next to the page's main heading: live counter + one copy button. */
export function HeadingActions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <LiveVisitors />
      <SummaryButton />
    </div>
  );
}
