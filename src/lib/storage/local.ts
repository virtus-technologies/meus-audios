import "server-only";

import { promises as fs, createReadStream, statSync } from "node:fs";
import path from "node:path";

import { StorageError } from "./errors";
import type { AudioUploadInput, AudioUploadResult } from "./types";

/**
 * Diretório de uploads local (apenas dev). Mantido fora de `public/`
 * porque o conteúdo é privado por usuário; serve via `/api/uploads`.
 */
export const LOCAL_UPLOADS_DIR = path.join(process.cwd(), "uploads");

function resolveStoragePath(storageKey: string): string {
  const resolved = path.resolve(LOCAL_UPLOADS_DIR, storageKey);
  const root = path.resolve(LOCAL_UPLOADS_DIR);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    throw new StorageError("storageKey resolveu para fora do diretório.", "INVALID_ID");
  }
  return resolved;
}

export async function uploadAudioToLocal(
  input: AudioUploadInput & { storageKey: string },
): Promise<AudioUploadResult> {
  const target = resolveStoragePath(input.storageKey);
  try {
    await fs.mkdir(path.dirname(target), { recursive: true });
    const buffer = Buffer.from(await input.file.arrayBuffer());
    await fs.writeFile(target, buffer);
  } catch (error) {
    console.error("[storage:local] uploadAudio failed", { storageKey: input.storageKey, error });
    throw new StorageError(
      "Falha ao salvar arquivo no diretório local de uploads.",
      "UPLOAD_FAILED",
    );
  }
  return {
    blobUrl: `/api/uploads/${input.storageKey}`,
    storageKey: input.storageKey,
    sizeBytes: input.file.size,
    mimeType: input.mimeType,
  };
}

export async function deleteAudioFromLocal(storageKey: string): Promise<void> {
  const target = resolveStoragePath(storageKey);
  try {
    await fs.rm(target, { force: true });
    // Tenta remover diretórios vazios (audios/{id}/, depois users/{id}/)
    await fs.rm(path.dirname(target), { recursive: true, force: true });
  } catch (error) {
    console.error("[storage:local] deleteAudio failed", { storageKey, error });
    throw new StorageError(
      "Falha ao excluir arquivo do diretório local de uploads.",
      "DELETE_FAILED",
    );
  }
}

export async function readAudioFromLocal(storageKey: string): Promise<Buffer> {
  const target = resolveStoragePath(storageKey);
  try {
    return await fs.readFile(target);
  } catch (error) {
    throw new StorageError(
      `Falha ao ler arquivo local (${storageKey}).`,
      "READ_FAILED",
      { cause: error as Error },
    );
  }
}

export type LocalFileHandle = {
  absolutePath: string;
  size: number;
  stream: (start?: number, end?: number) => NodeJS.ReadableStream;
};

export function openLocalAudio(storageKey: string): LocalFileHandle {
  const absolutePath = resolveStoragePath(storageKey);
  let size: number;
  try {
    size = statSync(absolutePath).size;
  } catch (error) {
    throw new StorageError(
      `Arquivo local não encontrado (${storageKey}).`,
      "NOT_FOUND",
      { cause: error as Error },
    );
  }
  return {
    absolutePath,
    size,
    stream: (start, end) =>
      createReadStream(absolutePath, start !== undefined ? { start, end } : undefined),
  };
}
