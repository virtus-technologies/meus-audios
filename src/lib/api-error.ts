import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

import { ForbiddenError, UnauthorizedError } from "@/lib/auth";

export type ApiErrorBody = {
  error: string;
  fieldErrors?: Record<string, string[]>;
  code?: string;
};

/**
 * Converte erros conhecidos em respostas HTTP estruturadas. Use no `catch`
 * de cada route handler privado:
 *
 * ```ts
 * try { ... } catch (err) { return apiError(err); }
 * ```
 */
export function apiError(error: unknown): NextResponse<ApiErrorBody> {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: "Validação falhou.", fieldErrors: error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (error instanceof UnauthorizedError) {
    return NextResponse.json({ error: error.message }, { status: error.httpStatus });
  }

  if (error instanceof ForbiddenError) {
    return NextResponse.json({ error: error.message }, { status: error.httpStatus });
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json({ error: error.message, code: "NOT_FOUND" }, { status: 404 });
  }

  if (error instanceof ValidationError) {
    return NextResponse.json(
      { error: error.message, fieldErrors: error.fieldErrors },
      { status: 400 },
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Recurso já existe.", code: "DUPLICATE" }, { status: 409 });
    }
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Recurso não encontrado.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }
  }

  console.error("[api] unhandled error", error);
  return NextResponse.json({ error: "Erro interno." }, { status: 500 });
}

export class ValidationError extends Error {
  readonly httpStatus = 400 as const;

  constructor(
    message: string,
    public readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  readonly httpStatus = 404 as const;

  constructor(message = "Recurso não encontrado.") {
    super(message);
    this.name = "NotFoundError";
  }
}
