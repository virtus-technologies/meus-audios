import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "@/auth.config";
import { prisma } from "@/lib/db";

/**
 * Config completo do NextAuth (Node runtime apenas — usa Prisma adapter).
 *
 * Este export é usado nos route handlers (`src/app/api/auth/...`) e nos
 * helpers de servidor (`src/lib/auth.ts`).
 *
 * O middleware (`src/middleware.ts`) NÃO importa daqui — usa
 * `src/auth.config.ts` diretamente, pois roda no Edge runtime onde o
 * Prisma Client não funciona.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  ...authConfig,
});
