import type { NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";

/**
 * Config "lite" do NextAuth — sem adapter Prisma. Usado em:
 *
 * 1. **`src/middleware.ts`** — middleware roda no Edge runtime onde o
 *    Prisma Client não funciona. Importar este arquivo diretamente.
 * 2. **`src/auth.ts`** — config completo extende este, adicionando o
 *    `PrismaAdapter` e `session.strategy = "database"`.
 *
 * Mantém providers + callbacks aqui (são Edge-safe). Adapter e session
 * strategy ficam no auth.ts (Node-only).
 */
function buildProviders(): Provider[] {
  const providers: Provider[] = [];

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    );
  }

  return providers;
}

export default {
  providers: buildProviders(),
  pages: {
    signIn: "/login",
  },
  callbacks: {
    /**
     * Inclui o `id` do usuário na sessão para que `auth()` retorne
     * `session.user.id` consistentemente em route handlers e server
     * actions.
     */
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
