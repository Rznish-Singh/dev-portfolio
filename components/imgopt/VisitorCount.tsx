"use client";
import { useEffect, useState } from "react";

export function VisitorCount() {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    // count once per browser session
    const counted = sessionStorage.getItem("imgopt-counted");
    fetch("/api/visits", { method: counted ? "GET" : "POST" })
      .then((r) => r.json())
      .then((d) => { setN(d.count); sessionStorage.setItem("imgopt-counted", "1"); })
      .catch(() => {});
  }, []);
  return (
    <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
      <span className="size-2 animate-pulse rounded-full bg-green-500" />
      {n === null ? "…" : n.toLocaleString()} visitors
    </div>
  );
}
