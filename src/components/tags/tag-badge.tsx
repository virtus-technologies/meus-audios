import Link from "next/link";

import { cn } from "@/lib/utils";

type TagBadgeProps = {
  name: string;
  href?: string;
  className?: string;
};

export function TagBadge({ name, href, className }: TagBadgeProps) {
  const classes = cn(
    "inline-flex items-center rounded-md bg-surface-muted px-2 py-0.5 text-xs font-medium text-muted-foreground",
    href ? "transition hover:bg-primary-light hover:text-primary-dark" : null,
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        #{name}
      </Link>
    );
  }
  return <span className={classes}>#{name}</span>;
}
