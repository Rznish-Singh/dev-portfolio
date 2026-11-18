"use client"

import { useTheme } from "next-themes"
import { useHotkeys } from "react-hotkeys-hook"

import { cn } from "@/lib/utils"
import { META_THEME_COLORS } from "@/config/site"
import { useClickSound } from "@/hooks/soundcn/use-click-sound"
import { useMetaColor } from "@/hooks/use-meta-color"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Button } from "./theme-button/button"
import { Kbd } from "./ui/kbd"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const { setMetaColor } = useMetaColor()
  const [click] = useClickSound()

  const switchTheme = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark"

    click()

    // Actually change the theme
    setTheme(nextTheme)

    // Change browser theme color
    setMetaColor(
      nextTheme === "dark"
        ? META_THEME_COLORS.dark
        : META_THEME_COLORS.light
    )
  }

  useHotkeys("d", switchTheme)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          className="relative size-8 shrink-0 touch-manipulation border-none p-0"
          variant="ghost"
          size="icon-sm"
          aria-label="Toggle mode"
          onClick={switchTheme}
        >
          <span
            className="pointer-events-none absolute size-12 pointer-fine:hidden"
            aria-hidden="true"
          />

          <DarkSideIcon />
        </Button>
      </TooltipTrigger>

      <TooltipContent className="pr-2 pl-3">
        <div className="flex items-center gap-3">
          <span>Toggle mode</span>
          <Kbd>D</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

function DarkSideIcon({ className }: { className?: string }) {
  return (
    <svg
      width={18}
      height={18}
      className={cn(
        "pointer-events-none size-[18px] shrink-0",
        className
      )}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M16 .5C7.4.5.5 7.4.5 16S7.4 31.5 16 31.5 31.5 24.6 31.5 16 24.6.5 16 .5zm0 28.1V3.4C23 3.4 28.6 9 28.6 16S23 28.6 16 28.6z"
        className="
          origin-center
          [transform-box:view-box]
          motion-safe:transition-transform!
          motion-safe:duration-500
          motion-safe:ease-[ease]
          dark:rotate-180
        "
      />
    </svg>
  )
}