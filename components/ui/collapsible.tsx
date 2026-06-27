"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { createContext, useContext, useState } from "react";

const CollapsibleContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

function useCollapsible() {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) {
    throw new Error("Collapsible components must be used within a Collapsible");
  }
  return ctx;
}

export function useCollapsibleState() {
  return useCollapsible();
}

export function CollapsibleWithContext({
  defaultOpen = false,
  children,
}: {
  defaultOpen?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      {children}
    </CollapsibleContext.Provider>
  );
}

export function CollapsibleTrigger({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open, setOpen } = useCollapsible();

  return (
    <button
      type="button"
      data-state={open ? "open" : "closed"}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className={cn(className)}
    >
      {children}
    </button>
  );
}

export function CollapsibleContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useCollapsible();

  return (
    <div
      data-state={open ? "open" : "closed"}
      className="group/collapsible grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
    >
      <div className={cn("overflow-hidden", className)}>{children}</div>
    </div>
  );
}

export function CollapsibleChevronsIcon() {
  const { open } = useCollapsible();
  return (
    <ChevronDownIcon
      className={cn(
        "size-4 transition-transform duration-300",
        open && "rotate-180"
      )}
    />
  );
}
