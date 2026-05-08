"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { createFolder, deleteFolder, moveFolder, renameFolder } from "@/services/folder-service";
import { createFolderSchema, moveFolderSchema, renameFolderSchema } from "@/lib/validations";

export type FolderActionResult = { ok: true } | { ok: false; error: string };

export async function createFolderAction(input: {
  name: string;
  parentId: string | null;
}): Promise<FolderActionResult> {
  const user = await requireUser();
  const parsed = createFolderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Inválido." };

  try {
    await createFolder({
      userId: user.id,
      name: parsed.data.name,
      parentId: parsed.data.parentId ?? null,
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: extractMessage(error) };
  }
}

export async function renameFolderAction(input: {
  folderId: string;
  name: string;
}): Promise<FolderActionResult> {
  const user = await requireUser();
  const parsed = renameFolderSchema.safeParse({ name: input.name });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Inválido." };

  try {
    await renameFolder({ userId: user.id, folderId: input.folderId, name: parsed.data.name });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: extractMessage(error) };
  }
}

export async function deleteFolderAction(input: { folderId: string }): Promise<FolderActionResult> {
  const user = await requireUser();
  try {
    await deleteFolder({ userId: user.id, folderId: input.folderId });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: extractMessage(error) };
  }
}

export async function moveFolderAction(input: {
  folderId: string;
  parentId: string | null;
}): Promise<FolderActionResult> {
  const user = await requireUser();
  const parsed = moveFolderSchema.safeParse({ parentId: input.parentId });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Inválido." };

  try {
    await moveFolder({
      userId: user.id,
      folderId: input.folderId,
      parentId: parsed.data.parentId,
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: extractMessage(error) };
  }
}

function extractMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Erro desconhecido.";
}
