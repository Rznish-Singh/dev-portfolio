import { USER } from "@/config/user";
import { cn } from "@/lib/utils";

// Evaluated once at build time for static pages, so this naturally reflects
// your last deploy date. Swap for a hardcoded string if you'd rather control
// it manually, e.g. `const LAST_UPDATED = "June 2026";`
const LAST_UPDATED = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
}).format(new Date());

export function Footer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mt-12 flex items-center justify-between gap-4 border-t border-dashed border-line pt-6 font-mono text-xs text-muted",
        className
      )}
    >
      <span>Last updated {LAST_UPDATED}</span>
      <span>{USER.name}</span>
    </div>
  );
}
