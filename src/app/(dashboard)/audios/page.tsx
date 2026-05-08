import { requireUser } from "@/lib/auth";
import { listAudios } from "@/services/audio-service";
import { AudioGrid } from "@/components/audios/audio-grid";
import { formatDuration } from "@/lib/format";

type LibraryPageProps = {
  searchParams: Promise<{ status?: string; folderId?: string }>;
};

const FILTER_TABS = [
  { value: "", label: "Todos" },
  { value: "TRANSCRIBED", label: "Transcritos" },
  { value: "UPLOADED", label: "Pendentes" },
  { value: "ANALYZED", label: "Com IA" },
] as const;

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const user = await requireUser();
  const { status: statusParam, folderId } = await searchParams;
  const status =
    statusParam && ["UPLOADED", "TRANSCRIBED", "ANALYZED"].includes(statusParam)
      ? (statusParam as "UPLOADED" | "TRANSCRIBED" | "ANALYZED")
      : undefined;

  const audios = await listAudios({
    userId: user.id,
    folderId: folderId ?? undefined,
    status,
    limit: 100,
  });

  const totalDurationSeconds = audios.reduce((sum, audio) => sum + (audio.durationSeconds ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-4xl font-medium tracking-tight">Biblioteca</h1>
        <p className="text-sm text-muted-foreground">
          {audios.length} áudios · {formatDuration(totalDurationSeconds)} no total
        </p>
      </div>

      <div className="flex flex-wrap gap-1 rounded-xl bg-surface-muted p-1">
        {FILTER_TABS.map((tab) => {
          const href = tab.value
            ? `/audios?status=${tab.value}${folderId ? `&folderId=${folderId}` : ""}`
            : `/audios${folderId ? `?folderId=${folderId}` : ""}`;
          const isActive = (statusParam ?? "") === tab.value;
          return (
            <a
              key={tab.value}
              href={href}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                isActive
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </a>
          );
        })}
      </div>

      <AudioGrid audios={audios} />
    </div>
  );
}
