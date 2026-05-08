"use client";

import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Toast = {
  id: string;
  message: string;
  variant: "success" | "error" | "info";
};

type ToastContextValue = {
  toasts: Toast[];
  push: (message: string, variant?: Toast["variant"]) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 4000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message: string, variant: Toast["variant"] = "info") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toasts, push, dismiss }}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de ToastProvider.");
  return ctx;
}

function ToastViewport() {
  const ctx = useContext(ToastContext);
  if (!ctx) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {ctx.toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => ctx.dismiss(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const Icon = toast.variant === "error" ? AlertCircle : CheckCircle2;
  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex min-w-[280px] max-w-md items-start gap-3 rounded-xl border bg-surface p-3 shadow-lg",
        toast.variant === "success" && "border-success-light",
        toast.variant === "error" && "border-destructive-light",
        toast.variant === "info" && "border-border",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 flex-shrink-0",
          toast.variant === "success" && "text-success",
          toast.variant === "error" && "text-destructive",
          toast.variant === "info" && "text-info",
        )}
      />
      <p className="flex-1 text-sm">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Fechar"
        className="rounded p-0.5 text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/**
 * Hook auto-dismiss para chamadas em `useEffect` quando flags de sucesso
 * vêm via props.
 */
export function useAutoToast(message: string | null, variant: Toast["variant"] = "info") {
  const ctx = useContext(ToastContext);
  useEffect(() => {
    if (message && ctx) ctx.push(message, variant);
  }, [message, variant, ctx]);
}
