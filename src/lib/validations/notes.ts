import { z } from "zod";

import { shortText } from "./common";

export const createNoteSchema = z.object({
  timestampSeconds: z.coerce.number().int().nonnegative("Timestamp inválido."),
  text: shortText("Nota", 1, 1000),
});

export const updateNoteSchema = z.object({
  text: shortText("Nota", 1, 1000),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
