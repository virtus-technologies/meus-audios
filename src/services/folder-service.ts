import "server-only";

import type { Folder } from "@prisma/client";

import { prisma } from "@/lib/db";
import { ForbiddenError } from "@/lib/auth";
import { NotFoundError, ValidationError } from "@/lib/api-error";

export type FolderNode = Folder & { children: FolderNode[] };

const NAME_MAX = 80;

function buildPath(name: string, parentPath: string | null): string {
  const safe = name.trim();
  if (!parentPath) return `/${safe}`;
  return `${parentPath}/${safe}`;
}

async function loadFolderForUser(folderId: string, userId: string): Promise<Folder> {
  const folder = await prisma.folder.findUnique({ where: { id: folderId } });
  if (!folder) throw new NotFoundError("Pasta não encontrada.");
  if (folder.userId !== userId) throw new ForbiddenError();
  return folder;
}

async function assertNameUniqueAmongSiblings(params: {
  userId: string;
  parentId: string | null;
  name: string;
  excludeId?: string;
}): Promise<void> {
  const sibling = await prisma.folder.findFirst({
    where: {
      userId: params.userId,
      parentId: params.parentId,
      name: params.name,
      ...(params.excludeId ? { NOT: { id: params.excludeId } } : {}),
    },
    select: { id: true },
  });

  if (sibling) {
    throw new ValidationError("Já existe uma pasta com este nome no mesmo nível.", {
      name: ["Nome em uso."],
    });
  }
}

export async function listFolders(userId: string): Promise<Folder[]> {
  return prisma.folder.findMany({
    where: { userId },
    orderBy: [{ path: "asc" }],
  });
}

export async function buildFolderTree(userId: string): Promise<FolderNode[]> {
  const folders = await listFolders(userId);
  const byParent = new Map<string | null, FolderNode[]>();

  for (const folder of folders) {
    const node: FolderNode = { ...folder, children: [] };
    const arr = byParent.get(folder.parentId) ?? [];
    arr.push(node);
    byParent.set(folder.parentId, arr);
  }

  function attachChildren(node: FolderNode) {
    const children = byParent.get(node.id) ?? [];
    children.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    node.children = children;
    children.forEach(attachChildren);
  }

  const roots = (byParent.get(null) ?? []).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  roots.forEach(attachChildren);
  return roots;
}

export async function getFolderById(folderId: string, userId: string): Promise<Folder> {
  return loadFolderForUser(folderId, userId);
}

export async function createFolder(input: {
  userId: string;
  name: string;
  parentId: string | null;
}): Promise<Folder> {
  if (input.name.trim().length === 0 || input.name.length > NAME_MAX) {
    throw new ValidationError("Nome inválido.", { name: ["Nome inválido."] });
  }

  let parentPath: string | null = null;
  if (input.parentId) {
    const parent = await loadFolderForUser(input.parentId, input.userId);
    parentPath = parent.path;
  }

  await assertNameUniqueAmongSiblings({
    userId: input.userId,
    parentId: input.parentId,
    name: input.name,
  });

  return prisma.folder.create({
    data: {
      userId: input.userId,
      name: input.name,
      parentId: input.parentId,
      path: buildPath(input.name, parentPath),
    },
  });
}

export async function renameFolder(input: {
  userId: string;
  folderId: string;
  name: string;
}): Promise<Folder> {
  const folder = await loadFolderForUser(input.folderId, input.userId);

  if (folder.name === input.name) return folder;

  await assertNameUniqueAmongSiblings({
    userId: input.userId,
    parentId: folder.parentId,
    name: input.name,
    excludeId: folder.id,
  });

  const parentPath = folder.parentId
    ? ((await prisma.folder.findUnique({ where: { id: folder.parentId } }))?.path ?? null)
    : null;
  const newPath = buildPath(input.name, parentPath);

  // Atualiza folder + recalcula paths dos descendentes em transação
  return prisma.$transaction(async (tx) => {
    const updated = await tx.folder.update({
      where: { id: folder.id },
      data: { name: input.name, path: newPath },
    });

    await recalculatePathsForDescendants(tx, folder.id, folder.path, newPath);

    return updated;
  });
}

export async function deleteFolder(input: { userId: string; folderId: string }): Promise<void> {
  const folder = await loadFolderForUser(input.folderId, input.userId);

  // Cascade do schema cuida das subpastas. Audios viram folderId=null
  // (onDelete: SetNull em Audio.folder).
  await prisma.folder.delete({ where: { id: folder.id } });
  void folder;
}

export async function moveFolder(input: {
  userId: string;
  folderId: string;
  parentId: string | null;
}): Promise<Folder> {
  const folder = await loadFolderForUser(input.folderId, input.userId);

  if (folder.parentId === input.parentId) return folder;

  if (input.parentId === folder.id) {
    throw new ValidationError("Não é possível mover uma pasta para dentro dela mesma.");
  }

  let newParentPath: string | null = null;
  if (input.parentId) {
    const newParent = await loadFolderForUser(input.parentId, input.userId);
    if (await isDescendantOf(newParent.id, folder.id)) {
      throw new ValidationError(
        "Não é possível mover uma pasta para dentro de uma de suas descendentes.",
      );
    }
    newParentPath = newParent.path;
  }

  await assertNameUniqueAmongSiblings({
    userId: input.userId,
    parentId: input.parentId,
    name: folder.name,
    excludeId: folder.id,
  });

  const newPath = buildPath(folder.name, newParentPath);

  return prisma.$transaction(async (tx) => {
    const moved = await tx.folder.update({
      where: { id: folder.id },
      data: { parentId: input.parentId, path: newPath },
    });

    await recalculatePathsForDescendants(tx, folder.id, folder.path, newPath);

    return moved;
  });
}

async function isDescendantOf(candidateId: string, ancestorId: string): Promise<boolean> {
  let cursor: string | null = candidateId;
  // Limite defensivo contra ciclos imprevistos
  for (let depth = 0; depth < 100 && cursor; depth += 1) {
    const node: { parentId: string | null } | null = await prisma.folder.findUnique({
      where: { id: cursor },
      select: { parentId: true },
    });
    if (!node) return false;
    if (node.parentId === ancestorId) return true;
    cursor = node.parentId;
  }
  return false;
}

type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

async function recalculatePathsForDescendants(
  tx: Tx,
  rootId: string,
  oldRootPath: string,
  newRootPath: string,
): Promise<void> {
  const descendants = await tx.folder.findMany({
    where: { path: { startsWith: `${oldRootPath}/` } },
    select: { id: true, path: true },
  });

  await Promise.all(
    descendants.map((desc) =>
      tx.folder.update({
        where: { id: desc.id },
        data: { path: `${newRootPath}${desc.path.slice(oldRootPath.length)}` },
      }),
    ),
  );
  void rootId;
}
