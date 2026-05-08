import "server-only";

import type { Audio, Transcript } from "@prisma/client";
import { toFile } from "openai";

import { prisma } from "@/lib/db";
import { ForbiddenError } from "@/lib/auth";
import { NotFoundError, ValidationError } from "@/lib/api-error";
import { getOpenAIClient } from "@/lib/ai/openai";

export type TranscriptSegment = {
  start: number;
  end: number;
  text: string;
};

const WHISPER_MODEL = "whisper-1";

async function loadAudioForUser(audioId: string, userId: string): Promise<Audio> {
  const audio = await prisma.audio.findUnique({ where: { id: audioId } });
  if (!audio) throw new NotFoundError("Áudio não encontrado.");
  if (audio.userId !== userId) throw new ForbiddenError();
  return audio;
}

export async function getTranscript(audioId: string, userId: string): Promise<Transcript | null> {
  const audio = await loadAudioForUser(audioId, userId);
  return prisma.transcript.findUnique({ where: { audioId: audio.id } });
}

export async function transcribeAudio(input: {
  audioId: string;
  userId: string;
}): Promise<Transcript> {
  const audio = await loadAudioForUser(input.audioId, input.userId);

  if (audio.status === "TRANSCRIBING") {
    throw new ValidationError("Transcrição já em andamento.");
  }

  await prisma.audio.update({
    where: { id: audio.id },
    data: { status: "TRANSCRIBING" },
  });

  try {
    const response = await fetch(audio.blobUrl);
    if (!response.ok) {
      throw new Error(`Falha ao baixar arquivo do storage (status ${response.status}).`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const file = await toFile(buffer, audio.originalFileName, { type: audio.mimeType });

    const openai = getOpenAIClient();
    const result = await openai.audio.transcriptions.create({
      file,
      model: WHISPER_MODEL,
      language: normalizeLanguage(audio.language),
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
    });

    const fullText = (result as { text: string }).text;
    const rawSegments = (
      result as { segments?: Array<{ start: number; end: number; text: string }> }
    ).segments;

    const segments: TranscriptSegment[] | null = rawSegments
      ? rawSegments.map((segment) => ({
          start: segment.start,
          end: segment.end,
          text: segment.text.trim(),
        }))
      : null;

    const transcript = await prisma.$transaction(async (tx) => {
      const persisted = await tx.transcript.upsert({
        where: { audioId: audio.id },
        create: {
          audioId: audio.id,
          userId: audio.userId,
          language: normalizeLanguage(audio.language) ?? "pt",
          fullText,
          segmentsJson: segments ?? undefined,
        },
        update: {
          language: normalizeLanguage(audio.language) ?? "pt",
          fullText,
          segmentsJson: segments ?? undefined,
        },
      });

      const totalDuration =
        segments && segments.length > 0 ? Math.round(segments[segments.length - 1].end) : null;

      await tx.audio.update({
        where: { id: audio.id },
        data: {
          status: "TRANSCRIBED",
          durationSeconds: totalDuration ?? audio.durationSeconds,
        },
      });

      return persisted;
    });

    return transcript;
  } catch (error) {
    await prisma.audio.update({
      where: { id: audio.id },
      data: { status: "TRANSCRIPTION_FAILED" },
    });
    console.error("[transcription] failed", { audioId: audio.id, error });
    throw error;
  }
}

export async function updateTranscript(input: {
  audioId: string;
  userId: string;
  fullText: string;
}): Promise<Transcript> {
  const audio = await loadAudioForUser(input.audioId, input.userId);

  if (input.fullText.length === 0 || input.fullText.length > 200_000) {
    throw new ValidationError("Texto da transcrição inválido.");
  }

  return prisma.transcript.update({
    where: { audioId: audio.id },
    data: { fullText: input.fullText },
  });
}

function normalizeLanguage(language: string | null | undefined): string | undefined {
  if (!language) return undefined;
  const map: Record<string, string> = {
    "pt-BR": "pt",
    "pt-PT": "pt",
    en: "en",
    "en-US": "en",
    es: "es",
    it: "it",
  };
  return map[language] ?? language.split("-")[0];
}
