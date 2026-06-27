"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { TechStackItem as TechStackItemType } from "@/config/tech-stack";

export type Variant = "list" | "grid";

interface TechStackItemProps {
  index: number;
  category: string;
  items: TechStackItemType[];
  variant?: Variant;
  className?: string;
}

export function TechStackItem({
  index,
  category,
  items,
  variant = "list",
  className,
}: TechStackItemProps) {
  const isGrid = variant === "grid";
  const categoryId = `stack-${category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

  return (
    <div
      className={cn(
        "grid items-start gap-y-3 py-4 sm:grid-cols-[10rem_1fr]",
        className
      )}
    >
      <div id={categoryId} className="text-sm text-muted">
        <span
          className="mr-1.5 select-none font-mono text-muted/60"
          aria-hidden
        >
          {(index + 1).toString().padStart(2, "0")}
        </span>
        {category}
      </div>

      <ul aria-labelledby={categoryId} className="flex flex-wrap gap-1.5 sm:pl-4">
        {items.map((item) => {
          const content = isGrid ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "flex size-10 select-none items-center justify-center rounded-md border border-line text-ink transition-colors [&_svg]:size-5",
                    item.href && "hover:border-signal hover:text-signal"
                  )}
                >
                  {item.icon}
                </div>
              </TooltipTrigger>
              <TooltipContent>{item.title}</TooltipContent>
            </Tooltip>
          ) : (
            <Badge
              variant="secondary"
              className={cn(
                "gap-1.5 font-mono transition-colors",
                item.href && "hover:bg-signal-dim hover:text-signal"
              )}
            >
              {item.icon}
              {item.title}
            </Badge>
          );

          return (
            <li key={item.key} className="flex">
              {item.href ? (
                <Link href={item.href} target="_blank" rel="noopener noreferrer">
                  {content}
                </Link>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
