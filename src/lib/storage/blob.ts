import "server-only";

import { put, del, type PutBlobResult } from "@vercel/blob";

import { StorageError } from "./errors";
import type { AudioUploadInput, AudioUploadResult } from "./types";

function assertToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new StorageError(
      "BLOB_READ_WRITE_TOKEN não configurado. Veja .env.example.",
      "MISSING_TOKEN",
    );
  }
  return token;
}

export async function uploadAudioToBlob(
  input: AudioUploadInput & { storageKey: string },
): Promise<AudioUploadResult> {
  const token = assertToken();
  let blob: PutBlobResult;
  try {
    blob = await put(input.storageKey, input.file, {
      access: "public",
      contentType: input.mimeType,
      token,
      addRandomSuffix: false,
    });
  } catch (error) {
    console.error("[storage:blob] uploadAudio failed", { storageKey: input.storageKey, error });
    throw new StorageError(
      "Falha ao fazer upload para o Vercel Blob. Verifique os logs do servidor.",
      "UPLOAD_FAILED",
    );
  }
  return {
    blobUrl: blob.url,
    storageKey: input.storageKey,
    sizeBytes: input.file.size,
    mimeType: input.mimeType,
  };
}

export async function deleteAudioFromBlob(storageKey: string): Promise<void> {
  const token = assertToken();
  try {
    await del(storageKey, { token });
  } catch (error) {
    console.error("[storage:blob] deleteAudio failed", { storageKey, error });
    throw new StorageError(
      "Falha ao excluir do Vercel Blob. Verifique os logs do servidor.",
      "DELETE_FAILED",
    );
  }
}

export async function fetchAudioFromBlob(blobUrl: string): Promise<Buffer> {
  const response = await fetch(blobUrl);
  if (!response.ok) {
    throw new StorageError(
      `Falha ao baixar arquivo do Vercel Blob (status ${response.status}).`,
      "READ_FAILED",
    );
  }
  return Buffer.from(await response.arrayBuffer());
}
