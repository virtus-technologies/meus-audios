import { Bell, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import { CommandPalette } from "@/components/search/command-palette";

type TopbarProps = {
  breadcrumbs?: ReadonlyArray<{ label: string; href?: string; current?: boolean }>;
  userInitials?: string;
};

export function Topbar({ breadcrumbs = [], userInitials = "MA" }: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-surface/70 px-7 backdrop-blur-md">
      <nav
        className="flex items-center gap-2 text-sm text-muted-foreground"
        aria-label="Breadcrumb"
      >
        {breadcrumbs.length === 0 ? (
          <span className="font-semibold text-foreground">Dashboard</span>
        ) : null}
        {breadcrumbs.map((crumb, idx) => (
          <span key={`${crumb.label}-${idx}`} className="flex items-center gap-2">
            {idx > 0 ? <span className="text-muted-foreground/60">/</span> : null}
            {crumb.href && !crumb.current ? (
              <a href={crumb.href} className="transition hover:text-foreground">
                {crumb.label}
              </a>
            ) : (
              <span className={cn(crumb.current && "font-semibold text-foreground")}>
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </nav>

      <div className="ml-6 hidden flex-1 md:block">
        <CommandPalette />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          aria-label="Notificações"
          className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Configurações"
          className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
        </button>
        <div
          className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground ring-2 ring-surface"
          aria-label="Avatar"
        >
          {userInitials}
        </div>
      </div>
    </header>
  );
}
