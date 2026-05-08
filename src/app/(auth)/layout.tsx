import Link from "next/link";
import { AudioLines } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-soft px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <AudioLines className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Meus<em className="font-medium italic not-italic text-primary">Áudios</em>
          </span>
        </Link>
        <div className="rounded-2xl border border-border bg-surface p-8 shadow">{children}</div>
      </div>
    </main>
  );
}
