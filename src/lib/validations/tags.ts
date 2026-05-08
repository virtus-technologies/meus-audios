import { z } from "zod";

import { shortText } from "./common";

export const createTagSchema = z.object({
  name: shortText("Tag", 1, 40).regex(
    /^[a-zA-Z0-9-_\sçÇãÃõÕáÁéÉíÍóÓúÚâÂêÊôÔ]+$/,
    "Tag contém caracteres inválidos.",
  ),
});

export const renameTagSchema = z.object({
  name: shortText("Tag", 1, 40),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type RenameTagInput = z.infer<typeof renameTagSchema>;
