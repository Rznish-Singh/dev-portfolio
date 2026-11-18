"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Liveline } from "liveline";
import type { LivelinePoint } from "liveline";
import { cn } from "@/lib/utils";
import type { Activity } from "@/lib/get-cached-contributions";

const DAY = 86_400;
const POLL_MS = 60_000; // re-fetch GitHub data
const TICK_MS = 1_000;  // keeps the chart moving

const WINDOWS = [
  
    { label: "1m", secs: 1  * 60 },
    { label: "2d", secs: 2  * DAY },
    { label: "7d", secs: 7 * DAY },
  { label: "30d", secs: 30 * DAY },
  // { label: "5m", secs: 5 * 60 },  
  { label: "90d", secs: 90 * DAY },
  { label: "1y", secs: 365 * DAY },
];

const toPoints = (activities: Activity[]): LivelinePoint[] =>
  activities
    .map((a) => ({
      time: Date.parse(`${a.date}T00:00:00Z`) / 1000,
      value: a.count,
    }))
    .sort((a, b) => a.time - b.time);

export function GitHubActivity({
  className,
  theme = "light",
  color = "#3b82f6",
}: {
  githubProfileUrl?: string; // unused, kept so the section doesn't break
  className?: string;
  theme?: "light" | "dark";
  color?: string;
}) {
  const [history, setHistory] = useState<LivelinePoint[]>([]);
  const [live, setLive] = useState<LivelinePoint[]>([]);
 const [windowSecs, setWindowSecs] = useState(30 * DAY);
  const [visible, setVisible] = useState(true);

  // latest known contribution count (today's value)
  const latest = useRef(0);

  // Fetch GitHub data, then poll
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch("/api/github-contributions", { cache: "no-store" });
        if (!res.ok) return;
        const json: Activity[] = await res.json();
        if (cancelled || !json.length) return;
        const pts = toPoints(json);
        latest.current = pts[pts.length - 1].value;
        setHistory(pts);
      } catch {
        /* keep previous data */
      }
    };

    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Push a point every second so the line always moves
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now() / 1000;
      setLive((prev) => [...prev.slice(-5000), { time: now, value: latest.current }]);
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  // Pause while the tab is hidden
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const data = useMemo(() => {
    const lastHistoryTime = history.length ? history[history.length - 1].time : 0;
    return [...history, ...live.filter((p) => p.time > lastHistoryTime)];
  }, [history, live]);

  const value = data.length ? data[data.length - 1].value : 0;

  // Dotted reference line = average in the selected window
  const average = useMemo(() => {
    const cutoff = Date.now() / 1000 - windowSecs;
    const inWindow = history.filter((p) => p.time >= cutoff);
    if (!inWindow.length) return latest.current;
    return inWindow.reduce((s, p) => s + p.value, 0) / inWindow.length;
  }, [history, windowSecs]);

  const formatTime = (t: number) => {
    const d = new Date(t * 1000);
    if (windowSecs <= 5 * 60) {
      return d.toLocaleTimeString("en-GB", { hour12: false }); // 23:18:30
    }
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }); // Oct 2
  };

  return (
    <div className={cn("w-100%", className)}>
      <div style={{ height: 240 }}>
        <Liveline
          data={data}
          value={value}
          paused={!visible}
          theme={theme}
          color={color}
          window={windowSecs}
          windows={WINDOWS}
          windowStyle="rounded"
          onWindowChange={setWindowSecs}
          referenceLine={{ value: average, label: `avg ${average.toFixed(1)}` }}
          formatValue={(v) => Math.round(v).toString()}
          formatTime={formatTime}
          tooltipOutline={true}
          momentum
          badge
          pulse
          exaggerate
        />
      </div>
    </div>
  );
}