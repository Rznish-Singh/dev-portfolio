import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "outline";

const variantClasses: Record<Variant, string> = {
  default: "bg-ink text-paper",
  outline: "border border-line bg-transparent text-ink",
  secondary: "bg-ink/[0.06] text-ink",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & { variant?: Variant }) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap [&>svg]:size-3.5",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
