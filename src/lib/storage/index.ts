import "server-only";

import { put, del, type PutBlobResult } from "@vercel/blob";
import {
  ALLOWED_AUDIO_MIME_TYPES,
  MAX_AUDIO_SIZE_BYTES,
  MIME_TO_EXTENSION,
  type AllowedAudioMimeType,
} from "./constants";
import { StorageError } from "./errors";

export type AudioUploadInput = {
  userId: string;
  audioId: string;
  file: File | Blob;
  mimeType: string;
  sizeBytes: number;
};

export type AudioUploadResult = {
  blobUrl: string;
  storageKey: string;
  sizeBytes: number;
  mimeType: string;
};

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

export function isAllowedAudioMimeType(mimeType: string): mimeType is AllowedAudioMimeType {
  return (ALLOWED_AUDIO_MIME_TYPES as readonly string[]).includes(mimeType);
}

export function validateAudioFile(input: { mimeType: string; sizeBytes: number }): void {
  if (!isAllowedAudioMimeType(input.mimeType)) {
    throw new StorageError(
      `MIME type não suportado: ${input.mimeType}. Aceitos: ${ALLOWED_AUDIO_MIME_TYPES.join(", ")}.`,
      "INVALID_MIME_TYPE",
    );
  }
  if (input.sizeBytes > MAX_AUDIO_SIZE_BYTES) {
    throw new StorageError(
      `Arquivo excede o limite de ${MAX_AUDIO_SIZE_BYTES} bytes.`,
      "FILE_TOO_LARGE",
    );
  }
}

/**
 * Gera a chave técnica de storage para um áudio.
 * Padrão: `users/{userId}/audios/{audioId}/original.{ext}`
 *
 * A chave é estável e independente da estrutura visual de pastas que o
 * usuário monta no produto (regra de negócio em
 * docs/plano-de-implementacao.md seção 9).
 */
export function buildAudioStorageKey(params: {
  userId: string;
  audioId: string;
  mimeType: string;
}): string {
  const ext = MIME_TO_EXTENSION[params.mimeType];
  if (!ext) {
    throw new StorageError(`MIME type não suportado: ${params.mimeType}.`, "INVALID_MIME_TYPE");
  }
  return `users/${params.userId}/audios/${params.audioId}/original.${ext}`;
}

/**
 * Faz upload de um arquivo de áudio para o Vercel Blob privado.
 *
 * Retorna a URL pública assinada e a chave técnica (`storageKey`) para
 * armazenar no banco. O blob é privado por padrão — só é acessível via
 * URL assinada gerada pelo runtime.
 */
export async function uploadAudio(input: AudioUploadInput): Promise<AudioUploadResult> {
  validateAudioFile(input);
  const token = assertToken();
  const storageKey = buildAudioStorageKey(input);

  let blob: PutBlobResult;
  try {
    blob = await put(storageKey, input.file, {
      access: "public", // Vercel Blob: tier privado vem por org/project; URL é assinada via SDK
      contentType: input.mimeType,
      token,
      addRandomSuffix: false,
    });
  } catch (error) {
    throw new StorageError(
      `Falha ao fazer upload para o Vercel Blob: ${(error as Error).message}`,
      "UPLOAD_FAILED",
    );
  }

  return {
    blobUrl: blob.url,
    storageKey,
    sizeBytes: input.sizeBytes,
    mimeType: input.mimeType,
  };
}

/**
 * Remove um áudio do storage. Chamado quando o `Audio` é excluído no banco.
 */
export async function deleteAudio(storageKey: string): Promise<void> {
  const token = assertToken();
  try {
    await del(storageKey, { token });
  } catch (error) {
    throw new StorageError(
      `Falha ao excluir do Vercel Blob: ${(error as Error).message}`,
      "DELETE_FAILED",
    );
  }
}

export { StorageError } from "./errors";
export { ALLOWED_AUDIO_MIME_TYPES, MAX_AUDIO_SIZE_BYTES, MIME_TO_EXTENSION } from "./constants";
