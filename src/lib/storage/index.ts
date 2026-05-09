import "server-only";

import {
  ALLOWED_AUDIO_MIME_TYPES,
  MAX_AUDIO_SIZE_BYTES,
  MIME_TO_EXTENSION,
  type AllowedAudioMimeType,
} from "./constants";
import { StorageError } from "./errors";
import type { AudioUploadInput, AudioUploadResult } from "./types";
import {
  uploadAudioToBlob,
  deleteAudioFromBlob,
  fetchAudioFromBlob,
} from "./blob";
import {
  uploadAudioToLocal,
  deleteAudioFromLocal,
  readAudioFromLocal,
} from "./local";

/**
 * Padrão aceito para userId e audioId nas chaves de storage.
 * Restringe a alfanuméricos + `_` + `-` para prevenir path traversal
 * (ex.: `..`, `/`, `%2F`) que permitiria acessar blobs de outros usuários.
 * Compatível com `cuid()` do Prisma e UUIDs convencionais.
 */
const STORAGE_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

export type { AudioUploadInput, AudioUploadResult } from "./types";

/**
 * Backend é selecionado por `APP_ENV`:
 * - `local` → filesystem (`./uploads/{storageKey}`), servido por `/api/uploads/[...key]`
 * - qualquer outro → Vercel Blob
 *
 * `BLOB_READ_WRITE_TOKEN` continua exigido para preview/produção, mas
 * em dev local não é necessário.
 */
export function isLocalStorageBackend(): boolean {
  return process.env.APP_ENV === "local";
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
 * Faz upload de um arquivo de áudio para o backend ativo (local ou Vercel Blob).
 *
 * O tamanho é lido diretamente de `file.size` (Blob nativo); o caller não
 * pode falsificar o tamanho via parâmetro separado. Erros do backend são
 * registrados no servidor mas não propagam mensagens cruas (mitigação de
 * leak de detalhes internos / token).
 */
export async function uploadAudio(input: AudioUploadInput): Promise<AudioUploadResult> {
  const sizeBytes = input.file.size;
  validateAudioFile({ mimeType: input.mimeType, sizeBytes });
  const storageKey = buildAudioStorageKey(input);
  const payload = { ...input, storageKey };
  return isLocalStorageBackend()
    ? uploadAudioToLocal(payload)
    : uploadAudioToBlob(payload);
}

/**
 * Remove um áudio do storage. Chamado quando o `Audio` é excluído no banco.
 */
export async function deleteAudio(storageKey: string): Promise<void> {
  return isLocalStorageBackend()
    ? deleteAudioFromLocal(storageKey)
    : deleteAudioFromBlob(storageKey);
}

/**
 * Lê o conteúdo bruto do áudio. Usado pela transcrição (Whisper) que
 * precisa do buffer in-memory. Em local lê do filesystem; em remoto baixa
 * do Vercel Blob.
 */
export async function readAudioBuffer(audio: {
  storageKey: string;
  blobUrl: string;
}): Promise<Buffer> {
  return isLocalStorageBackend()
    ? readAudioFromLocal(audio.storageKey)
    : fetchAudioFromBlob(audio.blobUrl);
}

export { StorageError } from "./errors";
export { ALLOWED_AUDIO_MIME_TYPES, MAX_AUDIO_SIZE_BYTES, MIME_TO_EXTENSION } from "./constants";
