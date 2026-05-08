import type { AudioStatus } from "@prisma/client";

import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<AudioStatus, string> = {
  UPLOADED: "Upload feito",
  TRANSCRIPTION_PENDING: "Aguardando",
  TRANSCRIBING: "Transcrevendo…",
  TRANSCRIBED: "Transcrito",
  TRANSCRIPTION_FAILED: "Erro na transcrição",
  ANALYSIS_PENDING: "Aguardando IA",
  ANALYZING: "Analisando…",
  ANALYZED: "Analisado",
  ANALYSIS_FAILED: "Erro na análise",
};

const STATUS_TONE: Record<AudioStatus, string> = {
  UPLOADED: "bg-primary-light text-primary-dark",
  TRANSCRIPTION_PENDING: "bg-info-light text-info-dark",
  TRANSCRIBING: "bg-warning-light text-warning-dark animate-pulse",
  TRANSCRIBED: "bg-success-light text-success-dark",
  TRANSCRIPTION_FAILED: "bg-destructive-light text-destructive-dark",
  ANALYSIS_PENDING: "bg-info-light text-info-dark",
  ANALYZING: "bg-warning-light text-warning-dark animate-pulse",
  ANALYZED: "bg-accent-light text-accent-dark",
  ANALYSIS_FAILED: "bg-destructive-light text-destructive-dark",
};

export function AudioStatusBadge({
  status,
  className,
}: {
  status: AudioStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        STATUS_TONE[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}
