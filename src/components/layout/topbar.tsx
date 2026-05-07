import { Bell, Search, Settings } from "lucide-react";

import { cn } from "@/lib/utils";

type TopbarProps = {
  breadcrumbs?: ReadonlyArray<{ label: string; href?: string; current?: boolean }>;
  userInitials?: string;
};

export function Topbar({ breadcrumbs = [], userInitials = "MA" }: TopbarProps) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-surface/70 px-7 backdrop-blur-md">
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

      <div className="relative ml-6 hidden max-w-xl flex-1 md:block">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          placeholder="Buscar em todos os áudios, transcrições e análises..."
          className="focus:ring-primary/12 h-10 w-full rounded-xl border border-border bg-surface-muted pl-10 pr-14 text-sm outline-none transition focus:border-primary focus:bg-surface focus:ring-4"
          aria-label="Busca global"
        />
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
          ⌘K
        </span>
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
