"use client";

import { useState } from "react";

export function Counter() {
  const [n, setN] = useState(0);
  return (
    <button
      onClick={() => setN((v) => v + 1)}
      className="rounded-full border border-line px-4 py-2 font-mono text-sm text-ink transition-colors hover:bg-black/[0.04]"
    >
      Clicked {n} times
    </button>
  );
}