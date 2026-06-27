"use client";

import { ArrowLeftIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { MOBILE_SCROLL_THRESHOLD, SCROLL_AREA_ID } from "@/config/site";

const MobileDrawer = dynamic(() =>
  import("@/components/navigation/mobile-drawer").then((mod) => mod.MobileDrawer)
);

export const FloatingHeader = memo(
  ({ scrollTitle, title }: { scrollTitle?: string; title?: string }) => {
    const [transform, setTransform] = useState({ translateY: 0, opacity: 0 });
    const pathname = usePathname();
    const goBack = pathname.split("/").filter(Boolean).length > 1;
    const goBackLink = pathname.split("/").slice(0, -1).join("/") || "/";

    useEffect(() => {
      if (!scrollTitle) return;
      const scrollAreaElem = document.querySelector(`#${SCROLL_AREA_ID}`);

      const onScroll = (e: Event) => {
        const scrollY = (e.target as HTMLElement).scrollTop;
        const translateY = Math.max(100 - scrollY, 0);
        const opacity = Math.min(
          Math.max((scrollY - MOBILE_SCROLL_THRESHOLD) / 60, 0),
          1
        );
        setTransform({ translateY, opacity });
      };

      scrollAreaElem?.addEventListener("scroll", onScroll, { passive: true });
      return () => scrollAreaElem?.removeEventListener("scroll", onScroll);
    }, [scrollTitle]);

    return (
      <header className="sticky inset-x-0 top-0 z-40 mx-auto flex h-12 w-full shrink-0 items-center overflow-hidden border-b border-line bg-paper font-medium text-sm lg:hidden">
        <div className="flex size-full items-center px-3">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex flex-1 items-center gap-1">
              {goBack ? (
                <Button variant="ghost" size="icon" asChild>
                  <Link href={goBackLink} title="Go back">
                    <ArrowLeftIcon size={16} />
                  </Link>
                </Button>
              ) : (
                <MobileDrawer />
              )}

              <div className="flex flex-1 items-center justify-between">
                {scrollTitle && (
                  <span
                    className="line-clamp-2 font-display font-semibold tracking-tight"
                    style={{
                      transform: `translateY(${transform.translateY}%)`,
                      opacity: transform.opacity,
                    }}
                  >
                    {scrollTitle}
                  </span>
                )}
                {title && (
                  <span className="line-clamp-2 font-display font-semibold tracking-tight">
                    {title}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
);

FloatingHeader.displayName = "FloatingHeader";
