"use client";

import { useActionState } from "react";

import { loginAction, type AuthFormState } from "../actions";
import { AuthField } from "../field";

const INITIAL: AuthFormState = {};

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, INITIAL);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {callbackUrl ? <input type="hidden" name="callbackUrl" value={callbackUrl} /> : null}

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
        autoComplete="current-password"
        error={state.fieldErrors?.password}
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
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
