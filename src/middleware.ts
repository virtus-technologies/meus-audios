import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import authConfig from "@/auth.config";

/**
 * Middleware roda no Edge runtime — usa `auth.config.ts` (sem Prisma).
 * Apenas verifica presença de sessão (cookie); validação detalhada e
 * carga de usuário acontecem nos route handlers via `requireUser` /
 * `requireUserApi` (Node runtime).
 */
const { auth } = NextAuth(authConfig);

/**
 * Rotas públicas — não exigem autenticação.
 *
 * Tudo o que estiver fora desta lista (e que casar com o `matcher`
 * abaixo) redireciona para `/login` (ou retorna 401 JSON em rotas API).
 */
const PUBLIC_PATH_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/api/auth", // NextAuth handlers
];

const PUBLIC_EXACT_PATHS = new Set<string>([
  "/", // landing
]);

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT_PATHS.has(pathname)) return true;
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export default auth((req) => {
  const { pathname, search } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (!req.auth) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Autenticação requerida." }, { status: 401 });
    }

    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

/**
 * Aplica em todas as rotas exceto:
 *  - assets do Next (`_next/static`, `_next/image`, `_next/data`)
 *  - arquivos públicos com extensão clássica (favicon, robots, sitemap, OG images)
 *  - HTML estático de referência em `/preview`
 *
 * `_next/data` foi adicionado para evitar overhead em requests de
 * ISR/static data do App Router.
 *
 * Decisão sobre proteger ou liberar fica centralizada em `isPublicPath()`.
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|_next/data|favicon\\.ico|robots\\.txt|sitemap\\.xml|preview).*)"],
};
