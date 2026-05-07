export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-display text-4xl font-medium tracking-tight">
        Bom dia, <em className="italic not-italic text-primary">explorador</em>
      </h1>
      <p className="max-w-xl text-muted-foreground">
        Esta tela é placeholder do AppShell ([#07]). Métricas e widgets virão em VIR-52 / VIR-53
        (`[#44]` / `[#45]`).
      </p>
    </div>
  );
}
