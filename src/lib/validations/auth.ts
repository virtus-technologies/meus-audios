import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido."),
  password: z.string().min(1, "Senha obrigatória."),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Nome muito curto.").max(80, "Nome muito longo."),
    email: z.string().trim().toLowerCase().email("Email inválido."),
    password: z
      .string()
      .min(8, "Senha precisa ter ao menos 8 caracteres.")
      .max(128, "Senha muito longa.")
      .regex(/[a-z]/, "Inclua ao menos uma letra minúscula.")
      .regex(/[A-Z]/, "Inclua ao menos uma letra maiúscula.")
      .regex(/[0-9]/, "Inclua ao menos um número."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
