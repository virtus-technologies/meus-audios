export function AuthDivider({ label = "ou" }: { label?: string }) {
  return (
    <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.12em] text-muted-foreground">
      <span className="h-px flex-1 bg-border" aria-hidden />
      <span>{label}</span>
      <span className="h-px flex-1 bg-border" aria-hidden />
    </div>
  );
}
