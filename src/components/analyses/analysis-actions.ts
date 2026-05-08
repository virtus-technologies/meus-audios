"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { createAnalysis, deleteAnalysis } from "@/services/analysis-service";
import { createAnalysisSchema } from "@/lib/validations";

export type AnalysisActionResult = { ok: true; analysisId: string } | { ok: false; error: string };

export async function createAnalysisAction(input: {
  audioId: string;
  question?: string;
  templateId?: string;
}): Promise<AnalysisActionResult> {
  const user = await requireUser();
  const parsed = createAnalysisSchema.safeParse({
    question: input.question,
    templateId: input.templateId,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Inválido." };
  }

  try {
    const analysis = await createAnalysis({
      userId: user.id,
      audioId: input.audioId,
      question: parsed.data.question ?? null,
      templateId: parsed.data.templateId ?? null,
    });
    revalidatePath(`/audios/${input.audioId}`);
    return { ok: true, analysisId: analysis.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Erro desconhecido." };
  }
}

export async function deleteAnalysisAction(input: {
  audioId: string;
  analysisId: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await requireUser();
  try {
    await deleteAnalysis({ userId: user.id, analysisId: input.analysisId });
    revalidatePath(`/audios/${input.audioId}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Erro desconhecido." };
  }
}
