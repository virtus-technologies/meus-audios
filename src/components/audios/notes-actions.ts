"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { createNote, deleteNote, updateNote } from "@/services/note-service";
import { createNoteSchema, updateNoteSchema } from "@/lib/validations";

export type NoteActionResult = { ok: true } | { ok: false; error: string };

export async function createNoteAction(input: {
  audioId: string;
  timestampSeconds: number;
  text: string;
}): Promise<NoteActionResult> {
  const user = await requireUser();
  const parsed = createNoteSchema.safeParse({
    timestampSeconds: input.timestampSeconds,
    text: input.text,
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Inválido." };

  try {
    await createNote({ userId: user.id, audioId: input.audioId, ...parsed.data });
    revalidatePath(`/audios/${input.audioId}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Erro." };
  }
}

export async function updateNoteAction(input: {
  audioId: string;
  noteId: string;
  text: string;
}): Promise<NoteActionResult> {
  const user = await requireUser();
  const parsed = updateNoteSchema.safeParse({ text: input.text });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Inválido." };

  try {
    await updateNote({ userId: user.id, noteId: input.noteId, text: parsed.data.text });
    revalidatePath(`/audios/${input.audioId}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Erro." };
  }
}

export async function deleteNoteAction(input: {
  audioId: string;
  noteId: string;
}): Promise<NoteActionResult> {
  const user = await requireUser();
  try {
    await deleteNote({ userId: user.id, noteId: input.noteId });
    revalidatePath(`/audios/${input.audioId}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Erro." };
  }
}
