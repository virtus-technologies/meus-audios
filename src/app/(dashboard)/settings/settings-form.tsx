"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import { deleteAccountAction, updateProfileAction } from "./settings-actions";

type SettingsFormProps = {
  initialName: string;
  email: string;
};

export function SettingsForm({ initialName, email }: SettingsFormProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function save() {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await updateProfileAction({ name });
      if (result.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-xl font-medium tracking-tight">Perfil</h2>
        <p className="mt-1 text-sm text-muted-foreground">Como aparece no seu workspace.</p>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="profile-name" className="text-sm font-medium">
              Nome
            </label>
            <Input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="profile-email" className="text-sm font-medium">
              Email
            </label>
            <Input id="profile-email" value={email} readOnly className="bg-surface-muted" />
          </div>
          {error ? <p className="text-sm text-destructive-dark">{error}</p> : null}
          {success ? <p className="text-sm text-success-dark">Perfil atualizado.</p> : null}
          <div className="flex justify-end">
            <Button onClick={save} disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-destructive/30 bg-destructive-light/30 p-6">
        <h2 className="font-display text-xl font-medium tracking-tight text-destructive-dark">
          Zona de perigo
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A exclusão da conta é permanente e remove todos os áudios, transcrições e análises.
        </p>
        <div className="mt-4 flex justify-start">
          <ConfirmDialog
            trigger={<Button variant="destructive">Excluir minha conta</Button>}
            title="Excluir conta"
            description="Esta ação é permanente. Todos os áudios, transcrições, análises, pastas, tags e notas serão excluídos. Não há desfazer."
            confirmLabel="Excluir conta"
            destructive
            onConfirm={async () => {
              await deleteAccountAction();
              return { ok: true };
            }}
          />
        </div>
      </section>
    </div>
  );
}
