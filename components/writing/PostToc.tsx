"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Item = { id: string; title: string };

function useActive(items: Item[]) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el);

    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActive(top.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return [active, setActive] as const;
}

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M13 3v4a2 2 0 0 1-2 2H3m0 0 3-3M3 9l3 3"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Large screens: lives inside the left-margin <aside> */
export function PostSidebar({ title, items }: { title: string; items: Item[] }) {
  const [active, setActive] = useActive(items);

  return (
    <nav aria-label="Post navigation" className="text-[0.95rem]">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-muted transition-colors hover:text-ink"
      >
        <BackIcon /> Index
      </Link>

      <p className="mt-12 text-muted">{title}</p>

      <div className="mt-4 flex flex-col gap-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setActive(item.id)}
            className={cn(
              "transition-colors duration-200 hover:text-ink",
              active === item.id ? "text-ink" : "text-muted",
            )}
          >
            {item.title}
          </a>
        ))}
      </div>
    </nav>
  );
}

/** Small screens: sticky bar with Index link + scrollable section chips */
export function PostBar({ items }: { items: Item[] }) {
  const [active, setActive] = useActive(items);

  return (
    <nav
      aria-label="Post navigation"
      className="sticky top-0 z-30 -mx-5 mb-8 flex items-center gap-4 border-b border-line bg-white/90 px-5 py-3 text-sm backdrop-blur dark:bg-neutral-950/90 xl:hidden"
    >
      <Link
        href="/"
        className="inline-flex shrink-0 items-center gap-1.5 text-muted transition-colors hover:text-ink"
      >
        <BackIcon /> Index
      </Link>

      <span className="h-4 w-px shrink-0 bg-line" aria-hidden />

      <div className="flex min-w-0 gap-4 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setActive(item.id)}
            className={cn(
              "transition-colors duration-200",
              active === item.id ? "text-ink" : "text-muted",
            )}
          >
            {item.title}
          </a>
        ))}
      </div>
    </nav>
  );
}