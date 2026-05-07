import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Augmenta o tipo `Session` para incluir o `id` do usuário, que é
   * preenchido no callback `session` em `src/auth.ts`.
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
