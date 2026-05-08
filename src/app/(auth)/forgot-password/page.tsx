import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="mb-1 font-display text-3xl font-medium tracking-tight">Recuperar senha</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Em breve. Por enquanto, contate o administrador para resetar manualmente.
      </p>
      <Link href="/login" className="text-sm font-semibold text-primary hover:text-primary-dark">
        ← Voltar para login
      </Link>
    </>
  );
}
