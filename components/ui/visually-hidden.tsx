import { cloneElement, isValidElement } from "react";
import { cn } from "@/lib/utils";

const srOnly = "sr-only";

export function VisuallyHidden({
  asChild = false,
  children,
}: {
  asChild?: boolean;
  children: React.ReactNode;
}) {
  if (asChild && isValidElement(children)) {
    return cloneElement(children as React.ReactElement<{ className?: string }>, {
      className: cn(
        srOnly,
        (children as React.ReactElement<{ className?: string }>).props.className
      ),
    });
  }
  return <span className={srOnly}>{children}</span>;
}
