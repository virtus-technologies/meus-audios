import NextAuth, { type NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/db";

/**
 * Lista de providers ativada conforme variáveis de ambiente disponíveis.
 *
 * Mantém o build verde quando rodando em dev/CI sem credenciais reais — o
 * provider só é registrado quando as duas envs do par existem.
 *
 * - Google: `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` (VIR-13, ticket #09)
 * - Credentials: a ser adicionado em VIR-12 (ticket #08) com email + senha
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

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: buildProviders(),
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    /**
     * Inclui o `id` do usuário na sessão para que `auth()` retorne
     * `session.user.id` consistentemente em route handlers e server actions.
     */
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
