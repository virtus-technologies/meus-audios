import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";

export type CurrentUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

/**
 * Retorna o usuário autenticado atual ou `null`. Use em rotas que aceitam
 * tanto público quanto autenticado.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };
}

/**
 * Garante que há um usuário autenticado. Redireciona para `/login` caso
 * contrário. Use em todas as route handlers e server actions privadas.
 */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * Garante que `resourceUserId` pertence ao usuário atual. Lança erro caso
 * contrário. Use sempre que receber um id de recurso vindo do client.
 */
export async function requireOwnership(resourceUserId: string): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.id !== resourceUserId) {
    throw new Error("Forbidden: recurso pertence a outro usuário.");
  }
  return user;
}

export { auth, signIn, signOut } from "@/auth";
