import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: string;
};

export function AuthField({ label, name, error, className, ...rest }: AuthFieldProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <input
        name={name}
        className={cn(
          "h-11 rounded-xl border bg-surface px-3.5 text-sm outline-none transition focus:ring-4",
          error
            ? "border-destructive focus:border-destructive focus:ring-destructive/20"
            : "border-border focus:border-primary focus:ring-primary/20",
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        {...rest}
      />
      {error ? (
        <span id={`${name}-error`} className="text-xs text-destructive-dark">
          {error}
        </span>
      ) : null}
    </label>
  );
}
