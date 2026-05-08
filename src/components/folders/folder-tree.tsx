"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Folder as FolderIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { CreateFolderDialog } from "./create-folder-dialog";
import { FolderItemMenu } from "./folder-item-menu";

export type FolderTreeNode = {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
  children: FolderTreeNode[];
};

type FolderTreeProps = {
  folders: ReadonlyArray<FolderTreeNode>;
};

function flatten(
  nodes: ReadonlyArray<FolderTreeNode>,
): { id: string; name: string; path: string }[] {
  const out: { id: string; name: string; path: string }[] = [];
  function walk(list: ReadonlyArray<FolderTreeNode>) {
    for (const node of list) {
      out.push({ id: node.id, name: node.name, path: node.path });
      walk(node.children);
    }
  }
  walk(nodes);
  return out;
}

export function FolderTree({ folders }: FolderTreeProps) {
  const flat = flatten(folders);

  return (
    <div className="flex flex-col gap-px">
      <div className="mb-1.5 flex items-center justify-between px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        <span>Pastas</span>
        <CreateFolderDialog parentId={null} />
      </div>

      {folders.length === 0 ? (
        <p className="px-3 text-xs text-muted-foreground">
          Nenhuma pasta ainda. Crie a primeira para organizar seus áudios.
        </p>
      ) : null}

      {folders.map((folder) => (
        <FolderRow key={folder.id} folder={folder} depth={0} allFolders={flat} />
      ))}
    </div>
  );
}

function FolderRow({
  folder,
  depth,
  allFolders,
}: {
  folder: FolderTreeNode;
  depth: number;
  allFolders: ReadonlyArray<{ id: string; name: string; path: string }>;
}) {
  const pathname = usePathname();
  const href = `/folders/${folder.id}`;
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  const [expanded, setExpanded] = useState(true);
  const hasChildren = folder.children.length > 0;

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "group relative flex items-center gap-1.5 rounded-lg pl-1 pr-2 transition-colors",
          isActive
            ? "bg-primary-light text-primary-dark"
            : "text-muted-foreground hover:bg-surface-muted",
        )}
        style={{ paddingLeft: 4 + depth * 12 }}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-label={expanded ? "Colapsar pasta" : "Expandir pasta"}
            onClick={() => setExpanded((value) => !value)}
            className="grid h-5 w-5 place-items-center text-muted-foreground transition hover:text-foreground"
          >
            <ChevronRight
              className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-90")}
            />
          </button>
        ) : (
          <span className="h-5 w-5" aria-hidden />
        )}

        <Link href={href} className="flex flex-1 items-center gap-2 py-1.5 text-sm text-inherit">
          <FolderIcon className="h-3.5 w-3.5" />
          <span className="flex-1 truncate">{folder.name}</span>
        </Link>

        <FolderItemMenu
          folderId={folder.id}
          currentName={folder.name}
          currentParentId={folder.parentId}
          allFolders={allFolders}
        />
      </div>

      {expanded && hasChildren ? (
        <div className="flex flex-col gap-px">
          {folder.children.map((child) => (
            <FolderRow key={child.id} folder={child} depth={depth + 1} allFolders={allFolders} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
