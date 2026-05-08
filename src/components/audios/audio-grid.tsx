import type { Audio } from "@prisma/client";

import { AudioCard } from "./audio-card";

type AudioGridProps = {
  audios: ReadonlyArray<Audio>;
};

export function AudioGrid({ audios }: AudioGridProps) {
  if (audios.length === 0) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-border bg-surface-muted p-12 text-center">
        <p className="font-display text-lg font-medium">Você ainda não enviou nenhum áudio.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Comece fazendo upload de uma gravação, áudio do WhatsApp, reunião, aula ou pregação.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {audios.map((audio) => (
        <AudioCard key={audio.id} audio={audio} />
      ))}
    </div>
  );
}
