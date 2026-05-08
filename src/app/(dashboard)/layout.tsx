import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/auth";
import { buildFolderTree } from "@/services/folder-service";
import type { FolderTreeNode } from "@/components/folders/folder-tree";

function toClientNode(node: Awaited<ReturnType<typeof buildFolderTree>>[number]): FolderTreeNode {
  return {
    id: node.id,
    name: node.name,
    parentId: node.parentId,
    path: node.path,
    children: node.children.map(toClientNode),
  };
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const initials = (user.name ?? user.email ?? "U")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const tree = await buildFolderTree(user.id);
  const folders = tree.map(toClientNode);

  return (
    <AppShell userInitials={initials} folders={folders}>
      {children}
    </AppShell>
  );
}
