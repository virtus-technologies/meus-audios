import "server-only";

import { prisma } from "@/lib/db";

export type SearchResults = {
  audios: Array<{ id: string; title: string; description: string | null }>;
  folders: Array<{ id: string; name: string; path: string }>;
  tags: Array<{ id: string; name: string }>;
  analyses: Array<{ id: string; audioId: string; preview: string }>;
};

const TAKE_LIMIT = 8;

export async function searchAll(input: { userId: string; query: string }): Promise<SearchResults> {
  const term = input.query.trim();
  if (term.length === 0) {
    return { audios: [], folders: [], tags: [], analyses: [] };
  }

  const contains = { contains: term, mode: "insensitive" as const };

  const [audios, folders, tags, transcripts, analyses] = await Promise.all([
    prisma.audio.findMany({
      where: {
        userId: input.userId,
        OR: [{ title: contains }, { description: contains }, { originalFileName: contains }],
      },
      select: { id: true, title: true, description: true },
      take: TAKE_LIMIT,
      orderBy: { createdAt: "desc" },
    }),
    prisma.folder.findMany({
      where: { userId: input.userId, OR: [{ name: contains }, { path: contains }] },
      select: { id: true, name: true, path: true },
      take: TAKE_LIMIT,
      orderBy: { path: "asc" },
    }),
    prisma.tag.findMany({
      where: { userId: input.userId, name: contains },
      select: { id: true, name: true },
      take: TAKE_LIMIT,
      orderBy: { name: "asc" },
    }),
    prisma.transcript.findMany({
      where: { userId: input.userId, fullText: contains },
      select: { audioId: true, fullText: true, audio: { select: { title: true } } },
      take: TAKE_LIMIT,
    }),
    prisma.audioAnalysis.findMany({
      where: {
        userId: input.userId,
        OR: [{ result: contains }, { question: contains }],
      },
      select: { id: true, audioId: true, result: true },
      take: TAKE_LIMIT,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Mescla transcripts no resultado de audios (sem duplicar) — quando o
  // termo casa só com a transcrição, ainda queremos surfacear o áudio
  const audioIds = new Set(audios.map((audio) => audio.id));
  for (const transcript of transcripts) {
    if (!audioIds.has(transcript.audioId)) {
      audios.push({
        id: transcript.audioId,
        title: transcript.audio.title,
        description: snippet(transcript.fullText, term),
      });
      audioIds.add(transcript.audioId);
    }
  }

  return {
    audios: audios.slice(0, TAKE_LIMIT),
    folders,
    tags,
    analyses: analyses.map((analysis) => ({
      id: analysis.id,
      audioId: analysis.audioId,
      preview: snippet(analysis.result, term),
    })),
  };
}

function snippet(text: string, term: string, around = 60): string {
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  if (idx < 0) return text.slice(0, around * 2);
  const start = Math.max(0, idx - around);
  const end = Math.min(text.length, idx + term.length + around);
  return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
}
