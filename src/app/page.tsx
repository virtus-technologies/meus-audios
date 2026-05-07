import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-soft">
      <div className="container flex min-h-screen flex-col items-center justify-center gap-8 py-16 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-success ring-4 ring-success/20" />
          Beta aberto · scaffold inicial
        </span>

        <h1 className="font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
          Meus
          <em className="bg-gradient-primary bg-clip-text font-medium italic not-italic text-transparent">
            Áudios
          </em>
        </h1>

        <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
          Seus áudios organizados, transcritos e inteligentes. Esta é a base do projeto; telas reais
          chegam nos próximos tickets.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5 hover:shadow-glow-lg"
          >
            Entrar
          </Link>
          <a
            href="https://github.com/virtus-technologies/meus-audios"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-surface-muted"
          >
            Ver código
          </a>
        </div>

        <p className="mt-12 max-w-md font-mono text-xs text-muted-foreground">
          [#01] Setup inicial — Next.js · TypeScript · Tailwind · shadcn/ui
        </p>
      </div>
    </main>
  );
}
