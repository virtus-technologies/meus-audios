import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  current?: boolean;
};

type BreadcrumbProps = {
  items: ReadonlyArray<BreadcrumbItem>;
  className?: string;
};

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1.5 text-sm text-muted-foreground", className)}
    >
      {items.map((item, idx) => (
        <span key={`${item.label}-${idx}`} className="flex items-center gap-1.5">
          {idx > 0 ? (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden />
          ) : null}
          {item.href && !item.current ? (
            <Link href={item.href} className="transition hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className={cn(item.current && "font-semibold text-foreground")}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

/**
 * Constrói breadcrumbs a partir do `path` e `name` da pasta atual + uma
 * lista de ancestrais. Pasta na raiz vira `[Biblioteca, currentFolder]`.
 */
export function buildFolderBreadcrumb(params: {
  current: { id: string; name: string };
  ancestors: ReadonlyArray<{ id: string; name: string }>;
}): BreadcrumbItem[] {
  return [
    { label: "Biblioteca", href: "/audios" },
    ...params.ancestors.map((ancestor) => ({
      label: ancestor.name,
      href: `/folders/${ancestor.id}`,
    })),
    { label: params.current.name, current: true },
  ];
}
