import { AudioLines, Clock, LayoutGrid, Sparkles, Star, Upload } from "lucide-react";

import { Brand } from "@/components/layout/brand";
import { NavItem } from "@/components/layout/nav-item";
import { FolderTree, type FolderTreeNode } from "@/components/folders/folder-tree";

type SidebarProps = {
  folders: ReadonlyArray<FolderTreeNode>;
};

export function Sidebar({ folders }: SidebarProps) {
  return (
    <aside className="flex h-screen flex-col gap-5 border-r border-border bg-surface p-3.5">
      <div className="px-1">
        <Brand showSubtitle />
      </div>

      <button
        type="button"
        className="flex items-center gap-2.5 rounded-2xl bg-gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-px"
      >
        <Upload className="h-4 w-4" strokeWidth={1.75} />
        Enviar áudio
        <span className="ml-auto rounded-md bg-white/20 px-2 py-0.5 font-mono text-[11px] font-medium">
          U
        </span>
      </button>

      <nav className="flex flex-col gap-px">
        <div className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Navegação
        </div>
        <NavItem href="/dashboard" icon={LayoutGrid} label="Dashboard" />
        <NavItem href="/audios" icon={AudioLines} label="Biblioteca" />
        <NavItem href="/recents" icon={Clock} label="Recentes" />
        <NavItem href="/favorites" icon={Star} label="Favoritos" />
        <NavItem href="/templates" icon={Sparkles} label="Templates" />
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
