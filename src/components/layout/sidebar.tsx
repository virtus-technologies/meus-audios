import { AudioLines, Clock, LayoutGrid, Sparkles, Star } from "lucide-react";

import { Brand } from "@/components/layout/brand";
import { NavItem } from "@/components/layout/nav-item";
import { FolderTree, type FolderTreeNode } from "@/components/folders/folder-tree";
import { UploadButton } from "@/components/upload/upload-button";

type SidebarProps = {
  folders: ReadonlyArray<FolderTreeNode>;
};

export function Sidebar({ folders }: SidebarProps) {
  return (
    <aside className="flex h-screen flex-col gap-5 border-r border-border bg-surface p-3.5">
      <div className="px-1">
        <Brand showSubtitle />
      </div>

      <UploadButton />

      <nav className="flex flex-col gap-px">
        <div className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Navegação
        </div>
        <NavItem
          href="/dashboard"
          icon={<LayoutGrid className="h-4 w-4" strokeWidth={1.75} />}
          label="Dashboard"
        />
        <NavItem
          href="/audios"
          icon={<AudioLines className="h-4 w-4" strokeWidth={1.75} />}
          label="Biblioteca"
        />
        <NavItem
          href="/recents"
          icon={<Clock className="h-4 w-4" strokeWidth={1.75} />}
          label="Recentes"
        />
        <NavItem
          href="/favorites"
          icon={<Star className="h-4 w-4" strokeWidth={1.75} />}
          label="Favoritos"
        />
        <NavItem
          href="/templates"
          icon={<Sparkles className="h-4 w-4" strokeWidth={1.75} />}
          label="Templates"
        />
      </nav>

      <FolderTree folders={folders} />

      <div className="mt-auto rounded-2xl border border-border bg-gradient-soft p-3.5">
        <h4 className="font-display text-base font-semibold">Plano Pessoal</h4>
        <p className="mt-1 text-xs text-muted-foreground">
          Plano e métricas chegam em VIR-54 e VIR-52.
        </p>
      </div>
    </aside>
  );
}
