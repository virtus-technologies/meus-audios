import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const user = await requireUser();
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true },
  });

  const usage = await prisma.audio.aggregate({
    where: { userId: user.id },
    _sum: { durationSeconds: true, sizeBytes: true },
    _count: { _all: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl font-medium tracking-tight">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Perfil, preferências e uso do seu workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <SettingsForm initialName={dbUser?.name ?? ""} email={dbUser?.email ?? ""} />

        <aside className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-xl font-medium tracking-tight">Uso</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Áudios</dt>
              <dd className="font-display text-2xl font-medium">{usage._count._all}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                Duração total
              </dt>
              <dd className="font-display text-2xl font-medium">
                {Math.round(((usage._sum.durationSeconds ?? 0) / 60) * 10) / 10} min
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                Armazenamento
              </dt>
              <dd className="font-display text-2xl font-medium">
                {((usage._sum.sizeBytes ?? 0) / (1024 * 1024)) | 0} MB
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
