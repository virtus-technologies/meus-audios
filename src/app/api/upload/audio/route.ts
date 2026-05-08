import { NextResponse } from "next/server";

import { requireUserApi } from "@/lib/auth";
import { apiError, ValidationError } from "@/lib/api-error";
import { createAudio } from "@/services/audio-service";
import {
  audioContentTypeSchema,
  audioLanguageSchema,
  idSchema,
  shortText,
  optionalText,
} from "@/lib/validations";
import {
  ALLOWED_AUDIO_MIME_TYPES,
  MAX_AUDIO_SIZE_BYTES,
  isAllowedAudioMimeType,
} from "@/lib/storage";
import { z } from "zod";

const metadataSchema = z.object({
  title: shortText("Título", 1, 200),
  description: optionalText(2000),
  folderId: idSchema.nullable().optional(),
  language: audioLanguageSchema.optional(),
  contentType: audioContentTypeSchema.optional(),
  tagIds: z.array(idSchema).max(50).default([]),
});

function parseTagIds(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string" || raw.length === 0) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  try {
    const user = await requireUserApi();
    const formData = await request.formData();

    const file = formData.get("file");
    if (!(file instanceof Blob)) {
      throw new ValidationError("Arquivo de áudio é obrigatório (campo `file`).");
    }
    if (file.size === 0) {
      throw new ValidationError("Arquivo vazio.");
    }
    if (file.size > MAX_AUDIO_SIZE_BYTES) {
      throw new ValidationError(
        `Arquivo excede o limite de ${Math.round(MAX_AUDIO_SIZE_BYTES / (1024 * 1024 * 1024))} GB.`,
      );
    }

    const mimeType = file.type;
    if (!isAllowedAudioMimeType(mimeType)) {
      throw new ValidationError(
        `MIME não suportado. Aceitos: ${ALLOWED_AUDIO_MIME_TYPES.join(", ")}.`,
      );
    }

    const originalFileName = file instanceof File && file.name ? file.name : `upload-${Date.now()}`;

    const meta = metadataSchema.parse({
      title: formData.get("title"),
      description: formData.get("description") ?? undefined,
      folderId: formData.get("folderId") || null,
      language: formData.get("language") ?? undefined,
      contentType: formData.get("contentType") ?? undefined,
      tagIds: parseTagIds(formData.get("tagIds")),
    });

    const audio = await createAudio({
      userId: user.id,
      title: meta.title,
      description: meta.description ?? null,
      folderId: meta.folderId ?? null,
      language: meta.language ?? null,
      contentType: meta.contentType ?? null,
      tagIds: meta.tagIds,
      file,
      mimeType,
      originalFileName,
    });

    return NextResponse.json({ audio }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
