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
 * Lançada por `requireOwnership` quando o usuário atual não é dono do
 * recurso. Route handlers devem capturar e responder HTTP 403.
 */
export class ForbiddenError extends Error {
  readonly httpStatus = 403 as const;

  constructor(message = "Recurso pertence a outro usuário.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Lançada quando não há sessão e o caller não pode redirecionar (ex.: API
 * route handler). Route handlers devem capturar e responder HTTP 401.
 */
export class UnauthorizedError extends Error {
  readonly httpStatus = 401 as const;

  constructor(message = "Autenticação requerida.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

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
 * Garante que `resourceUserId` pertence ao usuário atual.
 *
 * Lança `ForbiddenError` (HTTP 403) caso contrário. Use sempre que
 * receber um id de recurso vindo do client; route handlers devem
 * capturar `ForbiddenError` e devolver `Response.json({...}, { status: err.httpStatus })`.
 */
export async function requireOwnership(resourceUserId: string): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.id !== resourceUserId) {
    throw new ForbiddenError();
  }
  return user;
}

/**
 * Variante de `requireUser` que lança `UnauthorizedError` (HTTP 401) em
 * vez de redirecionar. Use em route handlers (`/api/*`) onde redirecionar
 * para `/login` não faz sentido.
 */
export async function requireUserApi(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedError();
  }
  return user;
}

export { auth, signIn, signOut } from "@/auth";
