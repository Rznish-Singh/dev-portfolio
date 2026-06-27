"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DockConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Dock({ className }: { className?: string }) {
  const pathname = usePathname();

  const items = [
    ...DockConfig.navbar.map((link) => ({ ...link, external: false })),
    ...Object.values(DockConfig.social).map((link) => ({
      ...link,
      external: true,
    })),
  ];

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-6 z-40 flex justify-center",
        className
      )}
    >
      <div className="flex items-center gap-1 rounded-full border border-line bg-paper-raised/90 p-1.5 shadow-sm backdrop-blur-md">
        {items.map((item, index) => {
          const isActive = !item.external && pathname === item.href;
          const Icon = item.icon;

          return (
            <Tooltip key={item.href + index}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-ink/[0.06] hover:text-ink",
                    isActive && "bg-ink text-paper hover:bg-ink hover:text-paper"
                  )}
                >
                  <Icon className="size-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </nav>
  );
}
