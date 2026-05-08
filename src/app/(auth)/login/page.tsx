import Link from "next/link";

import { AuthDivider } from "../divider";
import { GoogleButton } from "../google-button";
import { LoginForm } from "./login-form";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <>
      <h1 className="mb-1 font-display text-3xl font-medium tracking-tight">Entrar</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Bem-vindo de volta. Use seu email e senha para continuar.
      </p>

      <GoogleButton callbackUrl={callbackUrl} />
      {process.env.GOOGLE_CLIENT_ID ? <AuthDivider /> : null}

      <LoginForm callbackUrl={callbackUrl} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary transition hover:text-primary-dark"
        >
          Criar conta
        </Link>
      </p>
    </>
  );
}
