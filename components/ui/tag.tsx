import { cn } from "@/lib/utils";

export function Tag({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-paper-raised px-2.5 py-1 font-mono text-[0.7rem] tracking-tight text-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
