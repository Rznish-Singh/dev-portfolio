"use client";

import { cn } from "@/lib/utils";
import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
} from "react";

const DrawerContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("Drawer components must be used within a Drawer");
  return ctx;
}

export function Drawer({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  return (
    <DrawerContext.Provider value={{ open, setOpen: onOpenChange }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function DrawerTrigger({
  asChild = false,
  children,
}: {
  asChild?: boolean;
  children: React.ReactNode;
}) {
  const { setOpen } = useDrawer();
  if (asChild && isValidElement(children)) {
    return cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: () => setOpen(true),
    });
  }
  return <button onClick={() => setOpen(true)}>{children}</button>;
}

export function DrawerContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open, setOpen } = useDrawer();

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50 transition-opacity duration-300",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div
        className="absolute inset-0 bg-ink/40"
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        className={cn(
          "absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-line bg-paper-raised shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "translate-y-0" : "translate-y-full",
          className
        )}
      >
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-line" />
        {children}
      </div>
    </div>
  );
}

export function DrawerTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <h2 className={className}>{children}</h2>;
}

export function DrawerDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <p className={className}>{children}</p>;
}
