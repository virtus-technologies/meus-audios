import Link from "next/link";
import { ArrowRight, AudioLines, FolderOpen, Sparkles, Upload } from "lucide-react";

const STEPS = [
  {
    icon: Upload,
    title: "Envie seus áudios",
    description:
      "Solte gravações do WhatsApp, reuniões, aulas ou pregações. Aceita mp3, m4a, wav, ogg e mp4 até 2 GB.",
  },
  {
    icon: FolderOpen,
    title: "Organize em pastas",
    description:
      "Crie pastas, adicione tags, mova em massa. Sua biblioteca fica navegável como um drive — não como pilha de mensagens.",
  },
  {
    icon: Sparkles,
    title: "Transcreva e analise",
    description:
      "IA transcreve automaticamente e gera resumos, perguntas, atas, roteiros — escolha um template ou pergunte livremente.",
  },
];

const USE_CASES = [
  { emoji: "💬", title: "WhatsApp", text: "Áudios longos viram texto pesquisável em segundos." },
  {
    emoji: "📋",
    title: "Reuniões",
    text: "Atas automáticas, decisões e próximos passos extraídos.",
  },
  { emoji: "⛪", title: "Pregações", text: "Esboços, citações e versículos prontos para reuso." },
  { emoji: "🎓", title: "Aulas", text: "Resumos por tópico, flashcards e revisões instantâneas." },
  { emoji: "🎤", title: "Discursos", text: "Roteiros polidos a partir de gravações brutas." },
  {
    emoji: "💡",
    title: "Ideias pessoais",
    text: "Capture no celular, reencontre quando precisar.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-soft">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
            <AudioLines className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Meus<em className="font-medium italic not-italic text-primary">Áudios</em>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5"
          >
            Começar agora
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-success ring-4 ring-success/20" />
          Beta aberto · primeiro mês de transcrição grátis
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl font-display text-5xl font-normal leading-[1.05] tracking-tight md:text-6xl">
          Seus áudios <em className="italic not-italic text-primary">organizados</em>, transcritos e
          inteligentes.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          Faça upload de áudios, organize em pastas, transcreva automaticamente e use IA para gerar
          resumos, análises e insights — tudo num só lugar.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5 hover:shadow-glow-lg"
          >
            Começar agora <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-surface-muted"
          >
            Já tenho conta
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          Como funciona
        </p>
        <h2 className="mt-2 font-display text-4xl font-normal leading-tight">
          Do gravador ao <em className="italic not-italic text-primary">insight</em>, em três
          passos.
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-light text-primary">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span className="font-display text-3xl italic text-primary">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-medium tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          Casos de uso
        </p>
        <h2 className="mt-2 font-display text-4xl font-normal leading-tight">
          Áudio é o seu <em className="italic not-italic text-primary">segundo cérebro</em>.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {USE_CASES.map((useCase) => (
            <article
              key={useCase.title}
              className="rounded-2xl border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:bg-gradient-soft hover:shadow-lg"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-muted text-2xl">
                {useCase.emoji}
              </span>
              <h3 className="mt-3 font-semibold">{useCase.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{useCase.text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-12 text-center text-xs text-muted-foreground">
        © 2026 MeusÁudios · Transforme seus áudios em conhecimento organizado.
      </footer>
    </main>
  );
}
