"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { signOut } from "@/auth";

export async function updateProfileAction(input: {
  name: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireUser();
  const trimmed = input.name.trim();
  if (trimmed.length < 2 || trimmed.length > 80) {
    return { ok: false, error: "Nome inválido (entre 2 e 80 caracteres)." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name: trimmed },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteAccountAction(): Promise<void> {
  const user = await requireUser();
  // Cascade do schema vai limpar folders/audios/transcripts/analyses/tags/notes
  await prisma.user.delete({ where: { id: user.id } });
  await signOut({ redirect: false });
  redirect("/");
}
