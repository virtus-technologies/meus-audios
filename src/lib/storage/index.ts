import "server-only";

import { put, del, type PutBlobResult } from "@vercel/blob";
import {
  ALLOWED_AUDIO_MIME_TYPES,
  MAX_AUDIO_SIZE_BYTES,
  MIME_TO_EXTENSION,
  type AllowedAudioMimeType,
} from "./constants";
import { StorageError } from "./errors";

/**
 * Padrão aceito para userId e audioId nas chaves de storage.
 * Restringe a alfanuméricos + `_` + `-` para prevenir path traversal
 * (ex.: `..`, `/`, `%2F`) que permitiria acessar blobs de outros usuários.
 * Compatível com `cuid()` do Prisma e UUIDs convencionais.
 */
const STORAGE_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

export type AudioUploadInput = {
  userId: string;
  audioId: string;
  file: Blob;
  mimeType: string;
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

function assertSafeStorageId(value: string, name: "userId" | "audioId"): void {
  if (!STORAGE_ID_PATTERN.test(value)) {
    throw new StorageError(
      `${name} contém caracteres não permitidos. Apenas [a-zA-Z0-9_-] são aceitos.`,
      "INVALID_ID",
    );
  }
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
 *
 * `userId` e `audioId` são validados contra `STORAGE_ID_PATTERN` para
 * prevenir path traversal.
 */
export function buildAudioStorageKey(params: {
  userId: string;
  audioId: string;
  mimeType: string;
}): string {
  assertSafeStorageId(params.userId, "userId");
  assertSafeStorageId(params.audioId, "audioId");
  const ext = MIME_TO_EXTENSION[params.mimeType];
  if (!ext) {
    throw new StorageError(`MIME type não suportado: ${params.mimeType}.`, "INVALID_MIME_TYPE");
  }
  return `users/${params.userId}/audios/${params.audioId}/original.${ext}`;
}

/**
 * Faz upload de um arquivo de áudio para o Vercel Blob.
 *
 * O tamanho é lido diretamente de `file.size` (Blob nativo); o caller não
 * pode falsificar o tamanho via parâmetro separado. Erros do SDK são
 * registrados no servidor mas não propagam mensagens cruas (mitigação de
 * leak de detalhes internos / token).
 *
 * Acesso atual é `public` (limitação do `@vercel/blob` v1). A URL é
 * unguessable graças ao prefixo `userId/audioId`. Para hardening
 * futuro: emitir URLs assinadas com expiração curta sob demanda.
 */
export async function uploadAudio(input: AudioUploadInput): Promise<AudioUploadResult> {
  const sizeBytes = input.file.size;
  validateAudioFile({ mimeType: input.mimeType, sizeBytes });
  const token = assertToken();
  const storageKey = buildAudioStorageKey(input);

  let blob: PutBlobResult;
  try {
    blob = await put(storageKey, input.file, {
      access: "public",
      contentType: input.mimeType,
      token,
      addRandomSuffix: false,
    });
  } catch (error) {
    console.error("[storage] uploadAudio failed", { storageKey, error });
    throw new StorageError(
      "Falha ao fazer upload para o Vercel Blob. Verifique os logs do servidor.",
      "UPLOAD_FAILED",
    );
  }

  return {
    blobUrl: blob.url,
    storageKey,
    sizeBytes,
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
    console.error("[storage] deleteAudio failed", { storageKey, error });
    throw new StorageError(
      "Falha ao excluir do Vercel Blob. Verifique os logs do servidor.",
      "DELETE_FAILED",
    );
  }
}

export { StorageError } from "./errors";
export { ALLOWED_AUDIO_MIME_TYPES, MAX_AUDIO_SIZE_BYTES, MIME_TO_EXTENSION } from "./constants";
