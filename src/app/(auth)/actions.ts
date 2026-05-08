"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/passwords";
import { loginSchema, registerSchema } from "@/lib/validations/auth";

export type AuthFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const SAFE_REDIRECT = /^\/(?!\/)[^?#]*/; // só paths internos, evita open redirect

function safeCallback(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "/dashboard";
  if (!SAFE_REDIRECT.test(value)) return "/dashboard";
  return value;
}

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: flattenErrors(parsed.error.flatten().fieldErrors) };
  }

  const callbackUrl = safeCallback(formData.get("callbackUrl"));

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email ou senha incorretos." };
    }
    throw error;
  }

  redirect(callbackUrl);
}

export async function registerAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { fieldErrors: flattenErrors(parsed.error.flatten().fieldErrors) };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  try {
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { fieldErrors: { email: "Já existe uma conta com este email." } };
    }
    throw error;
  }

  // Auto sign-in após cadastro
  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Conta criada, mas falha ao entrar. Tente fazer login." };
    }
    throw error;
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

function flattenErrors(input: Record<string, string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value?.[0]) out[key] = value[0];
  }
  return out;
}
