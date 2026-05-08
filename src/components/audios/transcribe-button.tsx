"use client";

import { Sparkles } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { AudioStatus } from "@prisma/client";

import { startTranscriptionAction } from "./transcript-actions";

const TRANSCRIBING_STATES = new Set<AudioStatus>(["TRANSCRIPTION_PENDING", "TRANSCRIBING"]);

export function TranscribeButton({ audioId, status }: { audioId: string; status: AudioStatus }) {
  const [isPending, startTransition] = useTransition();
  const inProgress = TRANSCRIBING_STATES.has(status) || isPending;

  function start() {
    startTransition(async () => {
      const result = await startTranscriptionAction({ audioId });
      if (!result.ok) alert(result.error); // toast/error UX em VIR-58 (#49)
    });
  }

  return (
    <Button onClick={start} disabled={inProgress}>
      <Sparkles className="h-3.5 w-3.5" />
      {inProgress ? "Transcrevendo..." : "Transcrever agora"}
    </Button>
  );
}
