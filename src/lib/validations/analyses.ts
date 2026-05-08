import { z } from "zod";

import { idSchema } from "./common";

export const createAnalysisSchema = z
  .object({
    question: z.string().trim().min(3, "Pergunta muito curta.").max(2000).optional(),
    templateId: idSchema.optional(),
  })
  .refine((data) => data.question || data.templateId, {
    message: "Forneça uma pergunta livre ou um template.",
  });

export type CreateAnalysisInput = z.infer<typeof createAnalysisSchema>;
