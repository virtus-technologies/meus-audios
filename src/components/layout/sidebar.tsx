import { AudioLines, Clock, LayoutGrid, Sparkles, Star, Upload } from "lucide-react";

import { Brand } from "@/components/layout/brand";
import { FolderTree } from "@/components/layout/folder-tree";
import { NavItem } from "@/components/layout/nav-item";

export function Sidebar() {
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
        <NavItem href="/audios" icon={AudioLines} label="Biblioteca" count={142} />
        <NavItem href="/recents" icon={Clock} label="Recentes" />
        <NavItem href="/favorites" icon={Star} label="Favoritos" />
        <NavItem href="/templates" icon={Sparkles} label="Templates" />
      </nav>

      <FolderTree />

      <div className="mt-auto rounded-2xl border border-border bg-gradient-soft p-3.5">
        <h4 className="font-display text-base font-semibold">Plano Pessoal</h4>
        <p className="mt-1 text-xs text-muted-foreground">
          62% das 50h mensais usadas em transcrição.
        </p>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface">
          <span className="block h-full w-[62%] rounded-full bg-gradient-primary" aria-hidden />
        </div>
        <small className="mt-2 block font-mono text-[11px] text-muted-foreground/80">
          31h 04min · renova em 12 dias
        </small>
      </div>
    </aside>
  );
}
