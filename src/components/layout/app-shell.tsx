import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

type AppShellProps = {
  children: React.ReactNode;
  breadcrumbs?: ReadonlyArray<{ label: string; href?: string; current?: boolean }>;
  userInitials?: string;
};

/**
 * Layout autenticado padrão: sidebar fixa à esquerda no desktop, topbar
 * sticky e área principal rolável.
 *
 * No mobile (≤ 1024px) a sidebar é escondida — o drawer mobile virá em
 * iteração separada usando shadcn `Sheet` (fora do escopo do MVP foundation).
 */
export function AppShell({ children, breadcrumbs, userInitials }: AppShellProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[264px_1fr]">
      <div className="hidden lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </div>

      <div className="flex min-h-screen flex-col">
        <Topbar breadcrumbs={breadcrumbs} userInitials={userInitials} />
        <main className="flex-1 overflow-x-hidden px-7 py-8">{children}</main>
      </div>
    </div>
  );
}
