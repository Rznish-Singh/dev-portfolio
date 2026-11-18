"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { isNightNow } from "@/lib/auto-theme";
import { META_THEME_COLORS } from "@/config/site";
import { useMetaColor } from "@/hooks/use-meta-color";

/** Sets dark from 6 pm to 6 am and light from 6 am to 6 pm. Renders nothing. */
export function AutoTheme() {
  const { setTheme } = useTheme();
  const { setMetaColor } = useMetaColor();

  useEffect(() => {
    const apply = () => {
      const night = isNightNow();
      setTheme(night ? "dark" : "light");
      setMetaColor(night ? META_THEME_COLORS.dark : META_THEME_COLORS.light);
    };

    apply();
    const timer = setInterval(apply, 60_000); // switches at 6 am / 6 pm while the page is open

    const onVisible = () => {
      if (document.visibilityState === "visible") apply(); // tab left open overnight
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [setTheme, setMetaColor]);

  return null;
}