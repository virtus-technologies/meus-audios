import Link from "next/link";
import { Play } from "lucide-react";
import type { Audio } from "@prisma/client";

import { AudioStatusBadge } from "./audio-status-badge";
import { formatDuration, formatRelativeTime } from "@/lib/format";

type AudioCardProps = {
  audio: Audio;
};

export function AudioCard({ audio }: AudioCardProps) {
  return (
    <Link
      href={`/audios/${audio.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-0.5 hover:border-transparent hover:shadow-lg"
    >
      <div className="relative grid h-28 place-items-center bg-gradient-soft">
        <Waveform />
        <span className="absolute bottom-3 right-3 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-foreground text-surface opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100">
          <Play className="h-3.5 w-3.5 fill-current" />
        </span>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-0.5">
          <h4 className="line-clamp-1 font-semibold">{audio.title}</h4>
          <p className="text-xs text-muted-foreground">
            {formatDuration(audio.durationSeconds)} · {formatRelativeTime(audio.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <AudioStatusBadge status={audio.status} />
        </div>
      </div>
    </Link>
  );
}

function Waveform() {
  const heights = [16, 24, 32, 20, 28, 36, 22, 30, 18, 34, 26, 32, 24, 30, 20];
  return (
    <svg width="120" height="40" viewBox="0 0 120 40" className="text-primary" aria-hidden>
      {heights.map((h, idx) => (
        <line
          key={idx}
          x1={4 + idx * 8}
          x2={4 + idx * 8}
          y1={(40 - h) / 2}
          y2={(40 + h) / 2}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
