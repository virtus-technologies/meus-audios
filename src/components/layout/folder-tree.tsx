"use client";

/**
 * Mock folder tree para o AppShell. Será substituído pelos dados reais
 * quando as APIs de pastas forem implementadas (VIR-17 / `[#11]`).
 */
import { Plus } from "lucide-react";

type Folder = { id: string; name: string; color: string; count: number };

const MOCK_FOLDERS: readonly Folder[] = [
  { id: "1", name: "Reuniões", color: "hsl(var(--primary))", count: 28 },
  { id: "2", name: "Pregações", color: "hsl(var(--accent))", count: 41 },
  { id: "3", name: "WhatsApp", color: "hsl(var(--info))", count: 62 },
  { id: "4", name: "Aulas", color: "hsl(var(--success))", count: 7 },
  { id: "5", name: "Ideias soltas", color: "hsl(var(--warning))", count: 4 },
];

export function FolderTree() {
  return (
    <div className="flex flex-col gap-px">
      <div className="mb-1.5 flex items-center justify-between px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        <span>Pastas</span>
        <button
          type="button"
          aria-label="Criar pasta"
          className="rounded p-0.5 transition hover:bg-surface-muted hover:text-foreground"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      {MOCK_FOLDERS.map((folder) => (
        <button
          key={folder.id}
          type="button"
          className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
        >
          <span className="h-2 w-2 rounded" style={{ backgroundColor: folder.color }} aria-hidden />
          <span className="flex-1">{folder.name}</span>
          <span className="font-mono text-[11px] text-muted-foreground/70">{folder.count}</span>
        </button>
      ))}
    </div>
  );
}
