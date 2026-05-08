import { z } from "zod";

import { idSchema, shortText } from "./common";

export const createFolderSchema = z.object({
  name: shortText("Nome", 1, 80),
  parentId: idSchema.nullable().optional(),
});

export const renameFolderSchema = z.object({
  name: shortText("Nome", 1, 80),
});

export const moveFolderSchema = z.object({
  parentId: idSchema.nullable(),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;
export type RenameFolderInput = z.infer<typeof renameFolderSchema>;
export type MoveFolderInput = z.infer<typeof moveFolderSchema>;
