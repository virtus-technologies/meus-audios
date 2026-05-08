import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import type { FolderTreeNode } from "@/components/folders/folder-tree";
import { UploadProvider } from "@/components/upload/upload-context";
import { UploadDialog } from "@/components/upload/upload-dialog";
import { ToastProvider } from "@/components/ui/toast";

type AppShellProps = {
  children: React.ReactNode;
  folders: ReadonlyArray<FolderTreeNode>;
  breadcrumbs?: ReadonlyArray<{ label: string; href?: string; current?: boolean }>;
  userInitials?: string;
};

export function AppShell({ children, folders, breadcrumbs, userInitials }: AppShellProps) {
  return (
    <ToastProvider>
      <UploadProvider>
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[264px_1fr]">
          <div className="hidden lg:block">
            <div className="sticky top-0 h-screen">
              <Sidebar folders={folders} />
            </div>
          </div>

          <div className="flex min-h-screen flex-col">
            <Topbar breadcrumbs={breadcrumbs} userInitials={userInitials} />
            <main className="flex-1 overflow-x-hidden px-7 py-8">{children}</main>
          </div>
        </div>

        <UploadDialog folders={folders} />
      </UploadProvider>
    </ToastProvider>
  );
}
