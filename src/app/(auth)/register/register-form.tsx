"use client";

import { useActionState } from "react";

import { registerAction, type AuthFormState } from "../actions";
import { AuthField } from "../field";

const INITIAL: AuthFormState = {};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, INITIAL);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <AuthField
        label="Nome"
        name="name"
        type="text"
        autoComplete="name"
        error={state.fieldErrors?.name}
        required
      />

      <AuthField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        error={state.fieldErrors?.email}
        required
      />

      <AuthField
        label="Senha"
        name="password"
        type="password"
        autoComplete="new-password"
        error={state.fieldErrors?.password}
        required
      />

      <AuthField
        label="Confirmar senha"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        error={state.fieldErrors?.confirmPassword}
        required
      />

      {state.error ? (
        <p
          className="rounded-md bg-destructive-light px-3 py-2 text-sm text-destructive-dark"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5 hover:shadow-glow-lg disabled:cursor-wait disabled:opacity-70"
      >
        {isPending ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}
