import { z } from "zod";

import { idSchema, optionalText, shortText } from "./common";

const AUDIO_LANGUAGES = ["pt-BR", "en", "es", "it"] as const;

const CONTENT_TYPES = [
  "whatsapp",
  "reuniao",
  "aula",
  "pregacao",
  "discurso",
  "podcast",
  "entrevista",
  "ideia",
  "anotacao",
  "estudo",
  "oracao",
  "outro",
] as const;

export const audioLanguageSchema = z.enum(AUDIO_LANGUAGES);
export const audioContentTypeSchema = z.enum(CONTENT_TYPES);

export const createAudioMetadataSchema = z.object({
  title: shortText("Título", 1, 200),
  description: optionalText(2000),
  folderId: idSchema.nullable().optional(),
  language: audioLanguageSchema.default("pt-BR"),
  contentType: audioContentTypeSchema.optional(),
  tagIds: z.array(idSchema).default([]),
});

export const updateAudioSchema = z.object({
  title: shortText("Título", 1, 200).optional(),
  description: optionalText(2000),
  language: audioLanguageSchema.optional(),
  contentType: audioContentTypeSchema.optional(),
});

export const moveAudioSchema = z.object({
  folderId: idSchema.nullable(),
});

export type CreateAudioMetadataInput = z.infer<typeof createAudioMetadataSchema>;
export type UpdateAudioInput = z.infer<typeof updateAudioSchema>;
export type MoveAudioInput = z.infer<typeof moveAudioSchema>;
export type AudioLanguage = z.infer<typeof audioLanguageSchema>;
export type AudioContentType = z.infer<typeof audioContentTypeSchema>;
