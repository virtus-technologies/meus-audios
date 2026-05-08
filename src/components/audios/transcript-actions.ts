"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { transcribeAudio, updateTranscript } from "@/services/transcription-service";

export type TranscriptActionResult = { ok: true } | { ok: false; error: string };

export async function startTranscriptionAction(input: {
  audioId: string;
}): Promise<TranscriptActionResult> {
  const user = await requireUser();
  try {
    await transcribeAudio({ audioId: input.audioId, userId: user.id });
    revalidatePath(`/audios/${input.audioId}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Erro desconhecido." };
  }
}

export async function updateTranscriptAction(input: {
  audioId: string;
  fullText: string;
}): Promise<TranscriptActionResult> {
  const user = await requireUser();
  try {
    await updateTranscript({
      audioId: input.audioId,
      userId: user.id,
      fullText: input.fullText,
    });
    revalidatePath(`/audios/${input.audioId}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Erro desconhecido." };
  }
}
