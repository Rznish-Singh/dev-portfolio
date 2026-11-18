"use client";

import { useEffect, useRef } from "react";
import { Flower2, Lightbulb, Pause, RotateCcw, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import { useDiwali } from "./DiwaliProvider";
import { unlockAudio } from "./effects";
import { GlassTooltipToolbar, type ToolbarItem } from "./GlassTooltipToolbar";

const ICON = "h-full w-full";

/** Diwali controls rendered as a vertical liquid-glass toolbar with a sliding tooltip. */
export default function DiwaliControls() {
  const d = useDiwali();

  const items: ToolbarItem[] = [
    { id: "lights", label: "Decorative lights", keys: ["L"], icon: <Lightbulb className={ICON} />, pressed: d.lights, onSelect: () => d.setFlag("lights", !d.lights) },
    { id: "petals", label: "Falling flowers", keys: ["F"], icon: <Flower2 className={ICON} />, pressed: d.petals, onSelect: () => d.setFlag("petals", !d.petals) },
    { id: "fireworks", label: "Fireworks", keys: ["W"], icon: <Sparkles className={ICON} />, pressed: d.fireworks, onSelect: () => d.setFlag("fireworks", !d.fireworks) },
    {
      id: "sound", label: "Sound", keys: ["S"], pressed: d.sound,
      icon: d.sound ? <Volume2 className={ICON} /> : <VolumeX className={ICON} />,
      onSelect: () => { if (!d.sound) unlockAudio(); d.setFlag("sound", !d.sound); },
    },
    { id: "paused", label: "Pause motion", keys: ["P"], icon: <Pause className={ICON} />, pressed: d.paused, onSelect: () => d.setFlag("paused", !d.paused) },
    { id: "reset", label: "Reset experience", keys: ["R"], icon: <RotateCcw className={ICON} />, onSelect: d.reset },
    { id: "close", label: "Close Diwali mode", keys: ["Esc"], icon: <X className={ICON} />, onSelect: d.close },
  ];

  // Single-key shortcuts, active only while Diwali mode is open. Ignored while typing or with Ctrl/Cmd/Alt/Shift held.
  const latest = useRef(items);
  latest.current = items;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const hit = latest.current.find((i) => i.keys?.[0].toLowerCase() === e.key.toLowerCase() && i.keys[0].length === 1);
      if (hit) { e.preventDefault(); hit.onSelect(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return <GlassTooltipToolbar items={items} label="Diwali controls" />;
}
