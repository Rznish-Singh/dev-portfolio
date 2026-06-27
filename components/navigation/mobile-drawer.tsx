"use client";

import { ArrowUpRightIcon, CommandIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { USER } from "@/config/user";
import { DockConfig, type NavLink } from "@/config/site";
import { cn, isExternalLink } from "@/lib/utils";

export function MobileDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" title="Toggle menu">
          <CommandIcon size={16} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-4/5">
        <VisuallyHidden asChild>
          <DrawerTitle>Navigation Menu</DrawerTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DrawerDescription>
            Navigate through the site sections and social links
          </DrawerDescription>
        </VisuallyHidden>

        <div className="overflow-y-auto p-4">
          <div className="flex w-full flex-col space-y-4 text-sm">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-3 rounded-xl border border-line p-2"
                onClick={() => setOpen(false)}
              >
                <img
                  src={USER.image.profile}
                  alt={USER.name}
                  width={40}
                  height={40}
                  loading="lazy"
                  className="rounded-full border border-line"
                />
                <div className="flex flex-col">
                  <span className="font-display font-semibold tracking-tight">
                    {USER.name}
                  </span>
                  <span className="text-muted">{USER.tagline}</span>
                </div>
              </Link>

              <div className="flex flex-col gap-1">
                {DockConfig.navbar.map((link) => (
                  <NavigationLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    icon={<link.icon className="h-4 w-4" />}
                    onClose={() => setOpen(false)}
                  />
                ))}
              </div>
            </div>

            <hr className="border-line" />

            <div className="flex flex-col gap-2 text-sm">
              <span className="px-2 font-mono text-xs leading-relaxed text-muted">
                Social
              </span>
              <div className="flex flex-col gap-1">
                {Object.values(DockConfig.social).map((profile) => (
                  <NavigationLink
                    key={profile.href}
                    href={profile.href}
                    label={profile.label}
                    icon={<profile.icon className="h-4 w-4" />}
                    onClose={() => setOpen(false)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export const NavigationLink = memo(
  ({
    href,
    label,
    icon,
    onClose,
  }: {
    href: NavLink["href"];
    label: string;
    icon: React.ReactNode;
    onClose: () => void;
  }) => {
    const pathname = usePathname();
    const external = isExternalLink(href);

    if (external) {
      return (
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 rounded-lg p-2 hover:bg-ink/[0.06]"
          onClick={onClose}
        >
          <span className="inline-flex items-center gap-2 font-medium">
            {icon}
            {label}
          </span>
          <ArrowUpRightIcon size={16} className="text-muted" />
        </Link>
      );
    }

    const isActive = pathname.split("/")[1] === href.split("/")[1];

    return (
      <Link
        href={href}
        className={cn(
          "group flex items-center justify-between rounded-lg p-2",
          isActive ? "bg-ink text-paper" : "hover:bg-ink/[0.06]"
        )}
        onClick={onClose}
      >
        <span className="flex items-center gap-2 font-medium">
          {icon}
          {label}
        </span>
      </Link>
    );
  }
);

NavigationLink.displayName = "NavigationLink";
