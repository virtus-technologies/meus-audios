import Link from "next/link";
import {
  ArrowRight,
  AudioLines,
  Clock,
  FileText,
  Folder as FolderIcon,
  Sparkles,
} from "lucide-react";

import { requireUser } from "@/lib/auth";
import { getDashboard } from "@/services/dashboard-service";
import { AudioStatusBadge } from "@/components/audios/audio-status-badge";
import { formatDuration, formatRelativeTime } from "@/lib/format";

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await getDashboard(user.id);
  const firstName = user.name?.split(" ")[0] ?? "explorador";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-4xl font-medium tracking-tight">
          Bom dia, <em className="italic not-italic text-primary">{firstName}</em>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visão geral do seu workspace de áudios.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          tone="primary"
          icon={AudioLines}
          label="Total de áudios"
          value={data.metrics.totalAudios.toString()}
        />
        <MetricCard
          tone="info"
          icon={Clock}
          label="Horas armazenadas"
          value={formatDuration(data.metrics.totalDurationSeconds)}
        />
        <MetricCard
          tone="success"
          icon={FileText}
          label="Transcritos"
          value={data.metrics.transcribedCount.toString()}
        />
        <MetricCard
          tone="accent"
          icon={Sparkles}
          label="Análises geradas"
          value={data.metrics.analysesCount.toString()}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border border-border bg-surface">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-lg font-medium tracking-tight">Áudios recentes</h2>
            <Link
              href="/audios"
              className="text-xs font-semibold text-primary hover:text-primary-dark"
            >
              Ver todos
            </Link>
          </header>
          {data.recentAudios.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              Nenhum áudio enviado ainda.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {data.recentAudios.map((audio) => (
                <li key={audio.id}>
                  <Link
                    href={`/audios/${audio.id}`}
                    className="flex items-center gap-4 px-5 py-3 transition hover:bg-surface-muted"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-soft">
                      <AudioLines className="h-4 w-4 text-primary" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="line-clamp-1 font-semibold">{audio.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatRelativeTime(audio.createdAt)} ·{" "}
                        {formatDuration(audio.durationSeconds)}
                      </div>
                    </div>
                    <AudioStatusBadge status={audio.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="flex flex-col gap-5">
          <section className="rounded-2xl border border-border bg-surface">
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-base font-medium">Pastas recentes</h2>
            </header>
            {data.recentFolders.length === 0 ? (
              <div className="px-5 py-6 text-sm text-muted-foreground">Sem pastas ainda.</div>
            ) : (
              <ul className="divide-y divide-border">
                {data.recentFolders.map((folder) => (
                  <li key={folder.id}>
                    <Link
                      href={`/folders/${folder.id}`}
                      className="flex items-center gap-3 px-5 py-3 transition hover:bg-surface-muted"
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-light text-primary">
                        <FolderIcon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="line-clamp-1 text-sm font-semibold">{folder.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {folder.audioCount} áudios
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-surface">
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-base font-medium">Templates recomendados</h2>
              <Link href="/templates" className="text-xs font-semibold text-primary">
                Ver galeria
              </Link>
            </header>
            <ul className="flex flex-col">
              {data.recommendedTemplates.map((template) => (
                <li key={template.id} className="border-b border-border last:border-b-0">
                  <Link
                    href="/templates"
                    className="flex items-start justify-between gap-3 px-5 py-3 transition hover:bg-surface-muted"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">{template.name}</div>
                      <div className="line-clamp-1 text-xs text-muted-foreground">
                        {template.description}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

type MetricTone = "primary" | "info" | "success" | "accent";

function MetricCard({
  tone,
  icon: Icon,
  label,
  value,
}: {
  tone: MetricTone;
  icon: typeof AudioLines;
  label: string;
  value: string;
}) {
  const toneClasses: Record<MetricTone, string> = {
    primary: "bg-primary-light text-primary-dark",
    info: "bg-info-light text-info-dark",
    success: "bg-success-light text-success-dark",
    accent: "bg-accent-light text-accent-dark",
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${toneClasses[tone]}`}>
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-medium tracking-tight">{value}</p>
    </div>
  );
}
