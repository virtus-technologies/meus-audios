import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "@/auth.config";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/passwords";
import { loginSchema } from "@/lib/validations/auth";

/**
 * Config completo do NextAuth (Node runtime).
 *
 * Diferenças em relação ao `auth.config.ts`:
 * - Adiciona `PrismaAdapter` (Node-only)
 * - Adiciona `Credentials` provider (faz `bcrypt.compare`, Node-only)
 * - Usa `session.strategy = "jwt"` porque Credentials provider não é
 *   suportado com sessões em banco no Auth.js v5
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            passwordHash: true,
          },
        });

        if (!user?.passwordHash) return null;

        const ok = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    /**
     * Em estratégia JWT o `session` callback recebe `token` no lugar de
     * `user`. Sobrescreve o do auth.config para popular `session.user.id`
     * a partir do token.
     */
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
