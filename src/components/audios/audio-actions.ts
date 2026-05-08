"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { deleteAudio, moveAudio, updateAudio } from "@/services/audio-service";
import { moveAudioSchema, updateAudioSchema } from "@/lib/validations";

export type AudioActionResult = { ok: true } | { ok: false; error: string };

export async function updateAudioAction(input: {
  audioId: string;
  data: { title?: string; description?: string | null; language?: string; contentType?: string };
}): Promise<AudioActionResult> {
  const user = await requireUser();
  const parsed = updateAudioSchema.safeParse(input.data);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Inválido." };

  try {
    await updateAudio({ userId: user.id, audioId: input.audioId, data: parsed.data });
    revalidatePath(`/audios/${input.audioId}`);
    revalidatePath("/audios");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Erro." };
  }
}

export async function moveAudioAction(input: {
  audioId: string;
  folderId: string | null;
}): Promise<AudioActionResult> {
  const user = await requireUser();
  const parsed = moveAudioSchema.safeParse({ folderId: input.folderId });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Inválido." };

  try {
    await moveAudio({
      userId: user.id,
      audioId: input.audioId,
      folderId: parsed.data.folderId,
    });
    revalidatePath(`/audios/${input.audioId}`);
    revalidatePath("/audios");
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Erro." };
  }
}

export async function deleteAudioAction(input: { audioId: string }): Promise<void> {
  const user = await requireUser();
  await deleteAudio({ userId: user.id, audioId: input.audioId });
  revalidatePath("/audios");
  revalidatePath("/", "layout");
  redirect("/audios");
}
