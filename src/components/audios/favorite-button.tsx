"use client";

import { Star } from "lucide-react";
import { useState, useTransition } from "react";

import { toggleFavoriteAction } from "./audio-actions";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  audioId: string;
  initialFavorite: boolean;
  className?: string;
};

export function FavoriteButton({ audioId, initialFavorite, className }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isPending, startTransition] = useTransition();

  function onClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const next = !isFavorite;
    setIsFavorite(next);
    startTransition(async () => {
      const result = await toggleFavoriteAction({ audioId, isFavorite: next });
      if (!result.ok) setIsFavorite(!next);
    });
  }

  return (
    <button
      type="button"
      aria-label={isFavorite ? "Remover dos favoritos" : "Marcar como favorito"}
      aria-pressed={isFavorite}
      onClick={onClick}
      disabled={isPending}
      className={cn(
        "grid h-8 w-8 place-items-center rounded-full bg-surface/80 text-muted-foreground backdrop-blur transition hover:bg-surface hover:text-foreground disabled:opacity-60",
        isFavorite && "text-amber-500 hover:text-amber-500",
        className,
      )}
    >
      <Star className={cn("h-4 w-4", isFavorite && "fill-current")} strokeWidth={1.75} />
    </button>
  );
}
