import "server-only";

import type { AudioAnalysis } from "@prisma/client";

import { prisma } from "@/lib/db";
import { ForbiddenError } from "@/lib/auth";
import { NotFoundError, ValidationError } from "@/lib/api-error";
import { getOpenAIClient } from "@/lib/ai/openai";
import {
  ANALYSIS_SYSTEM_PROMPT,
  buildFreeQuestionPrompt,
  buildTemplatePrompt,
} from "@/lib/ai/prompts";

const MODEL = process.env.OPENAI_ANALYSIS_MODEL ?? "gpt-4o-mini";
const MAX_TRANSCRIPT_CHARS = 80_000;

async function loadAudioForUser(audioId: string, userId: string) {
  const audio = await prisma.audio.findUnique({
    where: { id: audioId },
    include: { transcript: true },
  });
  if (!audio) throw new NotFoundError("Áudio não encontrado.");
  if (audio.userId !== userId) throw new ForbiddenError();
  if (!audio.transcript) {
    throw new ValidationError("Áudio ainda não tem transcrição.");
  }
  return audio;
}

async function loadTemplate(templateId: string, userId: string) {
  const template = await prisma.analysisTemplate.findUnique({
    where: { id: templateId },
  });
  if (!template) throw new NotFoundError("Template não encontrado.");
  if (!template.isSystem && template.userId !== userId) throw new ForbiddenError();
  return template;
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n\n[transcrição truncada — texto muito longo]`;
}

export async function createAnalysis(input: {
  userId: string;
  audioId: string;
  question?: string | null;
  templateId?: string | null;
}): Promise<AudioAnalysis> {
  if (!input.question && !input.templateId) {
    throw new ValidationError("Forneça uma pergunta livre ou um template.");
  }

  const audio = await loadAudioForUser(input.audioId, input.userId);
  const transcriptText = truncate(audio.transcript!.fullText, MAX_TRANSCRIPT_CHARS);

  let userPrompt: string;
  if (input.templateId) {
    const template = await loadTemplate(input.templateId, input.userId);
    userPrompt = buildTemplatePrompt({
      transcript: transcriptText,
      templatePrompt: template.prompt,
    });
  } else {
    userPrompt = buildFreeQuestionPrompt({
      transcript: transcriptText,
      question: input.question!,
    });
  }

  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: ANALYSIS_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.4,
  });

  const result = completion.choices[0]?.message?.content?.trim() ?? "";
  if (result.length === 0) {
    throw new Error("Resposta vazia do modelo.");
  }

  return prisma.audioAnalysis.create({
    data: {
      audioId: audio.id,
      userId: input.userId,
      templateId: input.templateId ?? null,
      question: input.question ?? null,
      result,
    },
  });
}

export async function listAnalyses(input: {
  userId: string;
  audioId: string;
}): Promise<AudioAnalysis[]> {
  return prisma.audioAnalysis.findMany({
    where: { audioId: input.audioId, userId: input.userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteAnalysis(input: { userId: string; analysisId: string }): Promise<void> {
  const analysis = await prisma.audioAnalysis.findUnique({
    where: { id: input.analysisId },
  });
  if (!analysis) throw new NotFoundError("Análise não encontrada.");
  if (analysis.userId !== input.userId) throw new ForbiddenError();

  await prisma.audioAnalysis.delete({ where: { id: analysis.id } });
}
