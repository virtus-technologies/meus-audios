import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-soft px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow">
        <h1 className="mb-2 font-display text-3xl font-medium tracking-tight">Entrar</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Tela completa será implementada em VIR-12 (<code className="font-mono">[#08]</code>). Por
          enquanto este placeholder serve de destino para o middleware.
        </p>
        <Link
          href="/"
          className="text-sm font-semibold text-primary transition hover:text-primary-dark"
        >
          ← Voltar para a landing
        </Link>
      </div>
    </main>
  );
}
