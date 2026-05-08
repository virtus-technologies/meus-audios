"use client";

import { Edit3, FolderInput, MoreHorizontal, Trash2 } from "lucide-react";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { deleteFolderAction, moveFolderAction, renameFolderAction } from "./folder-actions";

type FolderForMove = { id: string; name: string; path: string };

type FolderItemMenuProps = {
  folderId: string;
  currentName: string;
  currentParentId: string | null;
  allFolders: ReadonlyArray<FolderForMove>;
};

type DialogKind = "rename" | "move" | "delete" | null;

export function FolderItemMenu({
  folderId,
  currentName,
  currentParentId,
  allFolders,
}: FolderItemMenuProps) {
  const [openDialog, setOpenDialog] = useState<DialogKind>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  function open(kind: DialogKind) {
    setOpenDialog(kind);
    setMenuOpen(false);
  }

  return (
    <>
      <button
        type="button"
        aria-label="Ações da pasta"
        onClick={(event) => {
          event.stopPropagation();
          setMenuOpen((value) => !value);
        }}
        className="opacity-0 transition focus:opacity-100 group-hover:opacity-100"
      >
        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
      </button>

      {menuOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-7 z-30 w-44 rounded-lg border border-border bg-surface p-1 shadow"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => open("rename")}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition hover:bg-surface-muted"
          >
            <Edit3 className="h-3.5 w-3.5" /> Renomear
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => open("move")}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition hover:bg-surface-muted"
          >
            <FolderInput className="h-3.5 w-3.5" /> Mover
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => open("delete")}
            className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-destructive-dark transition hover:bg-destructive-light"
          >
            <Trash2 className="h-3.5 w-3.5" /> Excluir
          </button>
        </div>
      ) : null}

      <RenameDialog
        open={openDialog === "rename"}
        onClose={() => setOpenDialog(null)}
        folderId={folderId}
        currentName={currentName}
      />

      <MoveDialog
        open={openDialog === "move"}
        onClose={() => setOpenDialog(null)}
        folderId={folderId}
        currentParentId={currentParentId}
        folders={allFolders.filter((f) => f.id !== folderId)}
      />

      <DeleteDialog
        open={openDialog === "delete"}
        onClose={() => setOpenDialog(null)}
        folderId={folderId}
        currentName={currentName}
      />
    </>
  );
}

function RenameDialog({
  open,
  onClose,
  folderId,
  currentName,
}: {
  open: boolean;
  onClose: () => void;
  folderId: string;
  currentName: string;
}) {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await renameFolderAction({ folderId, name });
      if (result.ok) onClose();
      else setError(result.error);
    });
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? null : onClose())}>
      <DialogContent>
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Renomear pasta</DialogTitle>
          </DialogHeader>
          <div className="my-4 flex flex-col gap-2">
            <Input
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              required
            />
            {error ? <span className="text-xs text-destructive-dark">{error}</span> : null}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending || name.trim() === currentName.trim()}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MoveDialog({
  open,
  onClose,
  folderId,
  currentParentId,
  folders,
}: {
  open: boolean;
  onClose: () => void;
  folderId: string;
  currentParentId: string | null;
  folders: ReadonlyArray<FolderForMove>;
}) {
  const [target, setTarget] = useState<string>(currentParentId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await moveFolderAction({
        folderId,
        parentId: target === "" ? null : target,
      });
      if (result.ok) onClose();
      else setError(result.error);
    });
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? null : onClose())}>
      <DialogContent>
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Mover pasta</DialogTitle>
            <DialogDescription>Escolha a nova pasta pai (ou a raiz).</DialogDescription>
          </DialogHeader>
          <div className="my-4 flex flex-col gap-2">
            <select
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              className="h-10 rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
            >
              <option value="">/ (raiz)</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.path}
                </option>
              ))}
            </select>
            {error ? <span className="text-xs text-destructive-dark">{error}</span> : null}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Movendo..." : "Mover"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDialog({
  open,
  onClose,
  folderId,
  currentName,
}: {
  open: boolean;
  onClose: () => void;
  folderId: string;
  currentName: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function confirm() {
    setError(null);
    startTransition(async () => {
      const result = await deleteFolderAction({ folderId });
      if (result.ok) onClose();
      else setError(result.error);
    });
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? null : onClose())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir pasta</DialogTitle>
          <DialogDescription>
            A pasta &quot;{currentName}&quot; será excluída permanentemente. Áudios contidos serão
            desvinculados (não excluídos). Subpastas também serão removidas.
          </DialogDescription>
        </DialogHeader>
        {error ? <p className="text-sm text-destructive-dark">{error}</p> : null}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={confirm} disabled={isPending}>
            {isPending ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
