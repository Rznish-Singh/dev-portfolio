"use client";

import { cn } from "@/lib/utils";
import { cloneElement, isValidElement, useId, useState } from "react";

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function TooltipTrigger({
  asChild = false,
  children,
}: {
  asChild?: boolean;
  children: React.ReactNode;
}) {
  // Rendering is handled by the parent group via CSS :hover/:focus-within,
  // so the trigger just needs to be a focusable, hoverable element.
  if (asChild && isValidElement(children)) {
    return cloneElement(children as React.ReactElement<{ className?: string }>, {
      className: cn(
        "group/tooltip relative",
        (children as React.ReactElement<{ className?: string }>).props.className
      ),
    });
  }
  return <span className="group/tooltip relative">{children}</span>;
}

export function TooltipContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <span
      id={id}
      role="tooltip"
      className={cn(
        "pointer-events-none absolute -top-2 left-1/2 z-50 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-line bg-ink px-2 py-1 text-xs text-paper opacity-0 shadow-sm transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100",
        className
      )}
    >
      {children}
    </span>
  );
}

export function useHover() {
  const [hovered, setHovered] = useState(false);
  return {
    hovered,
    bind: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
    },
  };
}
