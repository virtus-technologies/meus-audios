import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

/**
 * Componente reutilizável para empty states polidos. Use em listas
 * vazias, transcrição ausente, sem análises etc. Mantém a tipografia
 * (Fraunces no título) consistente com o restante do app.
 */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "grid place-items-center gap-3 rounded-2xl border border-dashed border-border bg-surface-muted p-10 text-center",
        className,
      )}
    >
      {Icon ? (
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-surface text-primary">
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </span>
      ) : null}
      <p className="font-display text-lg font-medium tracking-tight">{title}</p>
      {description ? <p className="max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
