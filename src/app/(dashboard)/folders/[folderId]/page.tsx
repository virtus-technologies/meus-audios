import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getFolderById } from "@/services/folder-service";
import { listAudios } from "@/services/audio-service";
import { prisma } from "@/lib/db";
import { AudioGrid } from "@/components/audios/audio-grid";
import { Breadcrumb, buildFolderBreadcrumb } from "@/components/layout/breadcrumb";
import { ForbiddenError } from "@/lib/auth";
import { NotFoundError } from "@/lib/api-error";

type FolderPageProps = {
  params: Promise<{ folderId: string }>;
};

async function loadAncestors(folderId: string): Promise<{ id: string; name: string }[]> {
  const ancestors: { id: string; name: string }[] = [];
  let cursor: string | null = folderId;
  for (let depth = 0; depth < 100 && cursor; depth += 1) {
    const node: { id: string; name: string; parentId: string | null } | null =
      await prisma.folder.findUnique({
        where: { id: cursor },
        select: { id: true, name: true, parentId: true },
      });
    if (!node) break;
    if (node.id !== folderId) ancestors.push({ id: node.id, name: node.name });
    cursor = node.parentId;
  }
  return ancestors.reverse();
}

export default async function FolderPage({ params }: FolderPageProps) {
  const user = await requireUser();
  const { folderId } = await params;

  let folder;
  try {
    folder = await getFolderById(folderId, user.id);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) {
      notFound();
    }
    throw error;
  }

  const [audios, ancestors] = await Promise.all([
    listAudios({ userId: user.id, folderId: folder.id, limit: 200 }),
    loadAncestors(folder.id),
  ]);

  const breadcrumb = buildFolderBreadcrumb({
    current: { id: folder.id, name: folder.name },
    ancestors,
  });

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={breadcrumb} />

      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-medium tracking-tight">{folder.name}</h1>
          <p className="text-sm text-muted-foreground">
            {audios.length} áudios · caminho{" "}
            <span className="font-mono text-xs">{folder.path}</span>
          </p>
        </div>
      </div>

      <AudioGrid audios={audios} />
    </div>
  );
}
