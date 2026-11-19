import { USER } from "@/config/user";
import { cn } from "@/lib/utils";
import Info from "@/components/info";

// Change this string yourself whenever you update the site.
const LAST_UPDATED = "19 november 2026";

export function Footer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mt-12 flex flex-col gap-1 pt-2  font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        className,
      )}
    >  
     
      <span>Last updated {LAST_UPDATED}</span>
      <span>{USER.name}</span>
    </div>
  );
}