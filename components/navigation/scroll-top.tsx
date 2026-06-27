"use client";

import { ArrowUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { SCROLL_AREA_ID } from "@/config/site";
import { cn } from "@/lib/utils";

export function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const scrollAreaElem = document.querySelector(`#${SCROLL_AREA_ID}`);
    const onScroll = (e: Event) => {
      setVisible((e.target as HTMLElement).scrollTop > 400);
    };
    scrollAreaElem?.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollAreaElem?.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    document
      .querySelector(`#${SCROLL_AREA_ID}`)
      ?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        "fixed bottom-6 right-6 z-40 flex size-9 items-center justify-center rounded-full border border-line bg-paper-raised/90 text-muted shadow-sm backdrop-blur-md transition-all duration-200 hover:text-ink",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      )}
    >
      <ArrowUpIcon className="size-4" />
    </button>
  );
}
