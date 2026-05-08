import Link from "next/link";

import { AuthDivider } from "../divider";
import { GoogleButton } from "../google-button";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <>
      <h1 className="mb-1 font-display text-3xl font-medium tracking-tight">Criar conta</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Em segundos seu workspace está pronto para receber áudios.
      </p>

      <GoogleButton label="Cadastrar com Google" />
      {process.env.GOOGLE_CLIENT_ID ? <AuthDivider /> : null}

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary transition hover:text-primary-dark"
        >
          Entrar
        </Link>
      </p>
    </>
  );
}
