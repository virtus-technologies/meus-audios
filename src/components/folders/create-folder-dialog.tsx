"use client";

import { Plus } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { createFolderAction } from "./folder-actions";

type CreateFolderDialogProps = {
  parentId?: string | null;
  trigger?: React.ReactNode;
};

export function CreateFolderDialog({ parentId = null, trigger }: CreateFolderDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createFolderAction({ name, parentId });
      if (result.ok) {
        setName("");
        setOpen(false);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            aria-label="Criar pasta"
            className="rounded p-0.5 text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar pasta</DialogTitle>
            <DialogDescription>
              {parentId
                ? "Cria uma subpasta dentro da pasta selecionada."
                : "Cria uma pasta na raiz."}
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 flex flex-col gap-2">
            <label htmlFor="folder-name" className="text-sm font-medium">
              Nome
            </label>
            <Input
              id="folder-name"
              name="name"
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: Reuniões"
              required
              maxLength={80}
            />
            {error ? <span className="text-xs text-destructive-dark">{error}</span> : null}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending || name.trim().length === 0}>
              {isPending ? "Criando..." : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
