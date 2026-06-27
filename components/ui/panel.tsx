import { cn } from "@/lib/utils";

export function Panel({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-20", className)}>
      {children}
    </section>
  );
}

export function PanelHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mb-4 flex items-baseline gap-2", className)}>
      {children}
    </div>
  );
}

export function PanelTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      className={cn(
        "flex items-baseline gap-2 font-display text-lg font-semibold tracking-tight text-ink",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function PanelTitleSup({ children }: { children: React.ReactNode }) {
  return (
    <sup className="font-mono text-xs font-normal text-muted">{children}</sup>
  );
}
