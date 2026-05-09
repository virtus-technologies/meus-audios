import Link from "next/link";

import { MarkLogo } from "@/components/layout/mark-logo";
import { cn } from "@/lib/utils";

type BrandProps = {
  className?: string;
  showSubtitle?: boolean;
};

export function Brand({ className, showSubtitle = false }: BrandProps) {
  return (
    <Link href="/dashboard" className={cn("flex items-center gap-3", className)}>
      <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl shadow-glow">
        <MarkLogo idSuffix="brand-sidebar" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-lg font-semibold tracking-tight">
          Meus<em className="font-medium italic not-italic text-primary">Áudios</em>
        </span>
        {showSubtitle ? (
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Workspace pessoal
          </span>
        ) : null}
      </span>
    </Link>
  );
}
