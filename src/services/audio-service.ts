import "server-only";

import { createId } from "@paralleldrive/cuid2";
import type { Audio, AudioStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { ForbiddenError } from "@/lib/auth";
import { NotFoundError, ValidationError } from "@/lib/api-error";
import { deleteAudio as deleteAudioFromStorage, uploadAudio } from "@/lib/storage";

export type AudioCreateInput = {
  userId: string;
  title: string;
  description?: string | null;
  folderId?: string | null;
  language?: string | null;
  contentType?: string | null;
  tagIds?: ReadonlyArray<string>;
  file: Blob;
  mimeType: string;
  originalFileName: string;
};

async function loadAudioForUser(audioId: string, userId: string): Promise<Audio> {
  const audio = await prisma.audio.findUnique({ where: { id: audioId } });
  if (!audio) throw new NotFoundError("Áudio não encontrado.");
  if (audio.userId !== userId) throw new ForbiddenError();
  return audio;
}

async function assertFolderOwnership(folderId: string, userId: string): Promise<void> {
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    select: { userId: true },
  });
  if (!folder) throw new NotFoundError("Pasta destino não existe.");
  if (folder.userId !== userId) throw new ForbiddenError();
}

async function assertTagsOwnership(tagIds: ReadonlyArray<string>, userId: string): Promise<void> {
  if (tagIds.length === 0) return;
  const tags = await prisma.tag.findMany({
    where: { id: { in: tagIds.slice() } },
    select: { id: true, userId: true },
  });
  if (tags.length !== tagIds.length) {
    throw new ValidationError("Uma ou mais tags não existem.");
  }
  if (tags.some((tag) => tag.userId !== userId)) {
    throw new ForbiddenError();
  }
}

export async function createAudio(input: AudioCreateInput): Promise<Audio> {
  if (input.folderId) {
    await assertFolderOwnership(input.folderId, input.userId);
  }
  if (input.tagIds && input.tagIds.length > 0) {
    await assertTagsOwnership(input.tagIds, input.userId);
  }

  const audioId = createId();

  const upload = await uploadAudio({
    userId: input.userId,
    audioId,
    file: input.file,
    mimeType: input.mimeType,
  });

  try {
    return await prisma.audio.create({
      data: {
        id: audioId,
        userId: input.userId,
        folderId: input.folderId ?? null,
        title: input.title.trim(),
        description: input.description ?? null,
        originalFileName: input.originalFileName,
        mimeType: upload.mimeType,
        sizeBytes: upload.sizeBytes,
        blobUrl: upload.blobUrl,
        storageKey: upload.storageKey,
        status: "UPLOADED",
        language: input.language ?? null,
        contentType: input.contentType ?? null,
        tags:
          input.tagIds && input.tagIds.length > 0
            ? {
                create: input.tagIds.map((tagId) => ({ tagId })),
              }
            : undefined,
      },
    });
  } catch (error) {
    // Compensa o upload caso a inserção falhe — evita orfãos no Blob
    await deleteAudioFromStorage(upload.storageKey).catch(() => undefined);
    throw error;
  }
}

export async function listAudios(input: {
  userId: string;
  folderId?: string | null;
  status?: AudioStatus;
  isFavorite?: boolean;
  limit?: number;
  offset?: number;
}): Promise<Audio[]> {
  return prisma.audio.findMany({
    where: {
      userId: input.userId,
      ...(input.folderId !== undefined ? { folderId: input.folderId } : {}),
      ...(input.status ? { status: input.status } : {}),
      ...(input.isFavorite !== undefined ? { isFavorite: input.isFavorite } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: input.limit ?? 50,
    skip: input.offset ?? 0,
  });
}

export async function setAudioFavorite(input: {
  userId: string;
  audioId: string;
  isFavorite?: boolean;
}): Promise<Audio> {
  const audio = await loadAudioForUser(input.audioId, input.userId);
  const next = input.isFavorite ?? !audio.isFavorite;
  if (next === audio.isFavorite) return audio;
  return prisma.audio.update({
    where: { id: audio.id },
    data: { isFavorite: next },
  });
}

export async function getAudioById(audioId: string, userId: string): Promise<Audio> {
  return loadAudioForUser(audioId, userId);
}

export async function updateAudio(input: {
  userId: string;
  audioId: string;
  data: Partial<{
    title: string;
    description: string | null;
    language: string | null;
    contentType: string | null;
  }>;
}): Promise<Audio> {
  const audio = await loadAudioForUser(input.audioId, input.userId);
  return prisma.audio.update({
    where: { id: audio.id },
    data: input.data,
  });
}

export async function moveAudio(input: {
  userId: string;
  audioId: string;
  folderId: string | null;
}): Promise<Audio> {
  const audio = await loadAudioForUser(input.audioId, input.userId);
  if (input.folderId) {
    await assertFolderOwnership(input.folderId, input.userId);
  }
  return prisma.audio.update({
    where: { id: audio.id },
    data: { folderId: input.folderId },
  });
}

export async function setAudioPeaks(input: {
  userId: string;
  audioId: string;
  peaks: ReadonlyArray<number>;
}): Promise<Audio> {
  const audio = await loadAudioForUser(input.audioId, input.userId);
  return prisma.audio.update({
    where: { id: audio.id },
    data: { peaksJson: [...input.peaks] satisfies Prisma.InputJsonValue },
  });
}

export async function deleteAudio(input: { userId: string; audioId: string }): Promise<void> {
  const audio = await loadAudioForUser(input.audioId, input.userId);
  await prisma.audio.delete({ where: { id: audio.id } });
  // Best-effort: remove arquivo do Blob. Falhas não revertem o delete do banco.
  await deleteAudioFromStorage(audio.storageKey).catch((error) => {
    console.error("[audio-service] failed to delete blob", { storageKey: audio.storageKey, error });
  });
}
