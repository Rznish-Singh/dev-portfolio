import { useEffect, useState } from "react";

/** Viewport width, debounced. Only used by components that are mounted client-side after activation. */
export function useViewportWidth() {
  const [w, setW] = useState(() => (typeof window === "undefined" ? 1200 : window.innerWidth));
  useEffect(() => {
    let t = 0;
    const on = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => setW(window.innerWidth), 150);
    };
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("resize", on);
      window.clearTimeout(t);
    };
  }, []);
  return w;
}
