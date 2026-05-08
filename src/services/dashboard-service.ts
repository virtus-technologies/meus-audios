import "server-only";

import type { Audio, Folder, AnalysisTemplate } from "@prisma/client";

import { prisma } from "@/lib/db";

export type DashboardMetrics = {
  totalAudios: number;
  totalDurationSeconds: number;
  transcribedCount: number;
  analysesCount: number;
};

export type DashboardData = {
  metrics: DashboardMetrics;
  recentAudios: Audio[];
  recentFolders: Array<Folder & { audioCount: number }>;
  recommendedTemplates: AnalysisTemplate[];
};

export async function getDashboard(userId: string): Promise<DashboardData> {
  const [
    totalAudios,
    durations,
    transcribedCount,
    analysesCount,
    recentAudios,
    recentFolders,
    templates,
  ] = await Promise.all([
    prisma.audio.count({ where: { userId } }),
    prisma.audio.aggregate({ where: { userId }, _sum: { durationSeconds: true } }),
    prisma.audio.count({
      where: {
        userId,
        status: { in: ["TRANSCRIBED", "ANALYZED", "ANALYZING", "ANALYSIS_PENDING"] },
      },
    }),
    prisma.audioAnalysis.count({ where: { userId } }),
    prisma.audio.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.folder.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 4,
      include: { _count: { select: { audios: true } } },
    }),
    prisma.analysisTemplate.findMany({
      where: { isSystem: true },
      orderBy: [{ category: "asc" }, { name: "asc" }],
      take: 3,
    }),
  ]);

  return {
    metrics: {
      totalAudios,
      totalDurationSeconds: durations._sum.durationSeconds ?? 0,
      transcribedCount,
      analysesCount,
    },
    recentAudios,
    recentFolders: recentFolders.map((folder) => ({
      ...folder,
      audioCount: folder._count.audios,
    })),
    recommendedTemplates: templates,
  };
}
