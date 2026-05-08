import { z } from "zod";

/**
 * Padrão de IDs aceitos. Compatível com `cuid()` do Prisma e UUIDs.
 */
export const idSchema = z.string().regex(/^[a-zA-Z0-9_-]+$/, "ID inválido.");

/**
 * Texto curto sanitizado: trim + comprimento mínimo.
 */
export function shortText(label: string, min = 1, max = 255) {
  return z.string().trim().min(min, `${label} muito curto.`).max(max, `${label} muito longo.`);
}

/**
 * Texto opcional (vazio vira `null`).
 */
export function optionalText(max = 1000) {
  return z
    .string()
    .trim()
    .max(max, "Texto muito longo.")
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null));
}
