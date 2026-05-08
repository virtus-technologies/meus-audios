"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type NavItemProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  count?: number;
};

export function NavItem({ href, icon: Icon, label, count }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary-light text-primary-dark"
          : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={1.75} />
      <span className="flex-1">{label}</span>
      {count !== undefined ? (
        <span
          className={cn(
            "rounded-md px-1.5 py-px font-mono text-[11px]",
            isActive ? "bg-surface text-primary" : "bg-surface-muted text-muted-foreground",
          )}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}
