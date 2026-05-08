import "server-only";

import type { AudioNote } from "@prisma/client";

import { prisma } from "@/lib/db";
import { ForbiddenError } from "@/lib/auth";
import { NotFoundError } from "@/lib/api-error";

async function loadAudioForUser(audioId: string, userId: string) {
  const audio = await prisma.audio.findUnique({
    where: { id: audioId },
    select: { id: true, userId: true },
  });
  if (!audio) throw new NotFoundError("Áudio não encontrado.");
  if (audio.userId !== userId) throw new ForbiddenError();
  return audio;
}

async function loadNoteForUser(noteId: string, userId: string): Promise<AudioNote> {
  const note = await prisma.audioNote.findUnique({ where: { id: noteId } });
  if (!note) throw new NotFoundError("Nota não encontrada.");
  if (note.userId !== userId) throw new ForbiddenError();
  return note;
}

export async function listNotes(input: { userId: string; audioId: string }): Promise<AudioNote[]> {
  await loadAudioForUser(input.audioId, input.userId);
  return prisma.audioNote.findMany({
    where: { audioId: input.audioId, userId: input.userId },
    orderBy: { timestampSeconds: "asc" },
  });
}

export async function createNote(input: {
  userId: string;
  audioId: string;
  timestampSeconds: number;
  text: string;
}): Promise<AudioNote> {
  await loadAudioForUser(input.audioId, input.userId);
  return prisma.audioNote.create({
    data: {
      audioId: input.audioId,
      userId: input.userId,
      timestampSeconds: Math.max(0, Math.round(input.timestampSeconds)),
      text: input.text.trim(),
    },
  });
}

export async function updateNote(input: {
  userId: string;
  noteId: string;
  text: string;
}): Promise<AudioNote> {
  const note = await loadNoteForUser(input.noteId, input.userId);
  return prisma.audioNote.update({
    where: { id: note.id },
    data: { text: input.text.trim() },
  });
}

export async function deleteNote(input: { userId: string; noteId: string }): Promise<void> {
  const note = await loadNoteForUser(input.noteId, input.userId);
  await prisma.audioNote.delete({ where: { id: note.id } });
}
