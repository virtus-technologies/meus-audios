/**
 * MIME types aceitos para upload de áudio.
 * Spec: docs/plano-de-negocios.md seção 8.3 (mp3, m4a, wav, ogg, webm, mp4 com áudio).
 */
export const ALLOWED_AUDIO_MIME_TYPES = [
  "audio/mpeg", // mp3
  "audio/mp4", // m4a
  "audio/x-m4a",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/ogg",
  "audio/webm",
  "video/mp4", // mp4 com faixa de áudio
] as const;

export type AllowedAudioMimeType = (typeof ALLOWED_AUDIO_MIME_TYPES)[number];

/**
 * Mapeamento MIME type → extensão do arquivo no storage.
 * Usado para gerar a `storageKey` final.
 */
export const MIME_TO_EXTENSION: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/wav": "wav",
  "audio/wave": "wav",
  "audio/x-wav": "wav",
  "audio/ogg": "ogg",
  "audio/webm": "webm",
  "video/mp4": "mp4",
};

/**
 * Tamanho máximo permitido por upload (2 GB).
 * Spec: docs/plano-de-negocios.md menciona suportar arquivos até 2GB.
 */
export const MAX_AUDIO_SIZE_BYTES = 2 * 1024 * 1024 * 1024;
