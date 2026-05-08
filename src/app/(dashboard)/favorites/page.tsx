import { Star } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { listAudios } from "@/services/audio-service";
import { AudioGrid } from "@/components/audios/audio-grid";
import { EmptyState } from "@/components/ui/empty-state";

export default async function FavoritesPage() {
  const user = await requireUser();
  const audios = await listAudios({ userId: user.id, isFavorite: true, limit: 100 });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-4xl font-medium tracking-tight">Favoritos</h1>
        <p className="text-sm text-muted-foreground">
          {audios.length} {audios.length === 1 ? "áudio favorito" : "áudios favoritos"}.
        </p>
      </div>

      {audios.length === 0 ? (
        <EmptyState
          icon={Star}
          title="Você ainda não favoritou nenhum áudio"
          description="Clique na estrela em qualquer card para marcar como favorito."
        />
      ) : (
        <AudioGrid audios={audios} />
      )}
    </div>
  );
}
