import "server-only";

import type { Tag } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { ForbiddenError } from "@/lib/auth";
import { NotFoundError, ValidationError } from "@/lib/api-error";

async function loadTagForUser(tagId: string, userId: string): Promise<Tag> {
  const tag = await prisma.tag.findUnique({ where: { id: tagId } });
  if (!tag) throw new NotFoundError("Tag não encontrada.");
  if (tag.userId !== userId) throw new ForbiddenError();
  return tag;
}

async function loadAudioForUser(audioId: string, userId: string) {
  const audio = await prisma.audio.findUnique({
    where: { id: audioId },
    select: { id: true, userId: true },
  });
  if (!audio) throw new NotFoundError("Áudio não encontrado.");
  if (audio.userId !== userId) throw new ForbiddenError();
  return audio;
}

export async function listTags(userId: string): Promise<Tag[]> {
  return prisma.tag.findMany({ where: { userId }, orderBy: { name: "asc" } });
}

export async function createTag(input: { userId: string; name: string }): Promise<Tag> {
  const trimmed = input.name.trim();
  if (trimmed.length === 0 || trimmed.length > 40) {
    throw new ValidationError("Nome de tag inválido.", { name: ["Nome inválido."] });
  }
  try {
    return await prisma.tag.create({
      data: { userId: input.userId, name: trimmed },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new ValidationError("Já existe uma tag com este nome.", {
        name: ["Tag em uso."],
      });
    }
    throw error;
  }
}

export async function renameTag(input: {
  userId: string;
  tagId: string;
  name: string;
}): Promise<Tag> {
  const tag = await loadTagForUser(input.tagId, input.userId);
  return prisma.tag.update({
    where: { id: tag.id },
    data: { name: input.name.trim() },
  });
}

export async function deleteTag(input: { userId: string; tagId: string }): Promise<void> {
  const tag = await loadTagForUser(input.tagId, input.userId);
  await prisma.tag.delete({ where: { id: tag.id } });
}

export async function attachTag(input: {
  userId: string;
  audioId: string;
  tagId: string;
}): Promise<void> {
  await loadAudioForUser(input.audioId, input.userId);
  await loadTagForUser(input.tagId, input.userId);
  await prisma.audioTag.upsert({
    where: { audioId_tagId: { audioId: input.audioId, tagId: input.tagId } },
    create: { audioId: input.audioId, tagId: input.tagId },
    update: {},
  });
}

export async function detachTag(input: {
  userId: string;
  audioId: string;
  tagId: string;
}): Promise<void> {
  await loadAudioForUser(input.audioId, input.userId);
  await loadTagForUser(input.tagId, input.userId);
  await prisma.audioTag.deleteMany({
    where: { audioId: input.audioId, tagId: input.tagId },
  });
}
