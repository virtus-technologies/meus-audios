import { Clock } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { listAudios } from "@/services/audio-service";
import { AudioGrid } from "@/components/audios/audio-grid";
import { EmptyState } from "@/components/ui/empty-state";

const RECENTS_LIMIT = 24;

export default async function RecentsPage() {
  const user = await requireUser();
  const audios = await listAudios({ userId: user.id, limit: RECENTS_LIMIT });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-4xl font-medium tracking-tight">Recentes</h1>
        <p className="text-sm text-muted-foreground">
          Os {RECENTS_LIMIT} áudios mais recentes da sua biblioteca.
        </p>
      </div>

      {audios.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="Nada por aqui ainda"
          description="Faça upload de um áudio para vê-lo aparecer em Recentes."
        />
      ) : (
        <AudioGrid audios={audios} />
      )}
    </div>
  );
}
