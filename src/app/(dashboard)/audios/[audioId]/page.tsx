import { notFound } from "next/navigation";
import { AudioLines } from "lucide-react";

import { requireUser, ForbiddenError } from "@/lib/auth";
import { NotFoundError } from "@/lib/api-error";
import { getAudioById } from "@/services/audio-service";
import { getTranscript } from "@/services/transcription-service";
import { listAnalyses } from "@/services/analysis-service";
import { listNotes } from "@/services/note-service";
import { prisma } from "@/lib/db";
import { AnalysisPanel } from "@/components/analyses/analysis-panel";
import { NotesPanel } from "@/components/audios/notes-panel";
import { AudioPlayer } from "@/components/audios/audio-player";
import { AudioMetadataPanel } from "@/components/audios/audio-metadata-panel";
import { AudioDeleteButton } from "@/components/audios/audio-delete-button";
import { AudioStatusBadge } from "@/components/audios/audio-status-badge";
import { TranscriptViewer } from "@/components/audios/transcript-viewer";
import { TranscribeButton } from "@/components/audios/transcribe-button";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { formatDuration } from "@/lib/format";

type AudioPageProps = {
  params: Promise<{ audioId: string }>;
};

export default async function AudioPage({ params }: AudioPageProps) {
  const user = await requireUser();
  const { audioId } = await params;

  let audio;
  try {
    audio = await getAudioById(audioId, user.id);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      notFound();
    }
    throw error;
  }

  const [transcript, analyses, templates, notes] = await Promise.all([
    getTranscript(audio.id, user.id),
    listAnalyses({ userId: user.id, audioId: audio.id }),
    prisma.analysisTemplate.findMany({
      where: { OR: [{ isSystem: true }, { userId: user.id }] },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    }),
    listNotes({ userId: user.id, audioId: audio.id }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { label: "Biblioteca", href: "/audios" },
          { label: audio.title, current: true },
        ]}
      />

      <header className="flex items-start gap-6 rounded-2xl border border-border bg-gradient-soft p-6">
        <span className="grid h-24 w-24 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
          <AudioLines className="h-8 w-8" strokeWidth={1.5} />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-medium tracking-tight">{audio.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDuration(audio.durationSeconds)} ·{" "}
            {audio.createdAt.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <AudioStatusBadge status={audio.status} />
            {audio.language ? (
              <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {audio.language}
              </span>
            ) : null}
            {audio.contentType ? (
              <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {audio.contentType}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <TranscribeButton audioId={audio.id} status={audio.status} />
          <AudioDeleteButton audioId={audio.id} title={audio.title} />
        </div>
      </header>

      <AudioPlayer src={audio.blobUrl} initialDurationSeconds={audio.durationSeconds} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <TranscriptViewer
          audioId={audio.id}
          status={audio.status}
          transcript={transcript}
          audioTitle={audio.title}
        />

        <div className="flex flex-col gap-6">
          <AudioMetadataPanel audio={audio} />
          <NotesPanel
            audioId={audio.id}
            initialNotes={notes.map((note) => ({
              id: note.id,
              timestampSeconds: note.timestampSeconds,
              text: note.text,
            }))}
          />
          <AnalysisPanel
            audioId={audio.id}
            hasTranscript={Boolean(transcript)}
            templates={templates.map((template) => ({
              id: template.id,
              name: template.name,
              description: template.description,
              category: template.category,
            }))}
            initialAnalyses={analyses.map((analysis) => ({
              id: analysis.id,
              question: analysis.question,
              templateId: analysis.templateId,
              result: analysis.result,
              createdAt: analysis.createdAt,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
