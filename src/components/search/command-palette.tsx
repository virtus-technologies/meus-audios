"use client";

import { useRouter } from "next/navigation";
import { Folder, Search, Sparkles, Tag, AudioLines } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Results = {
  audios: Array<{ id: string; title: string; description: string | null }>;
  folders: Array<{ id: string; name: string; path: string }>;
  tags: Array<{ id: string; name: string }>;
  analyses: Array<{ id: string; audioId: string; preview: string }>;
};

const EMPTY: Results = { audios: [], folders: [], tags: [], analyses: [] };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Results>(EMPTY);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      const isMod = event.ctrlKey || event.metaKey;
      if (isMod && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      } else if (event.key === "Escape" && open) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults(EMPTY);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (response.ok) {
          const data = (await response.json()) as Results;
          setResults(data);
        }
      } catch {
        // ignore aborts
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, open]);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    setResults(EMPTY);
    router.push(href);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-full max-w-xl items-center gap-2 rounded-xl border border-border bg-surface-muted px-3.5 text-left text-sm text-muted-foreground transition hover:border-primary/40 hover:bg-surface"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 truncate">Buscar áudios, transcrições e análises…</span>
        <span className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[11px]">
          ⌘K
        </span>
      </button>
    );
  }

  const totalResults =
    results.audios.length + results.folders.length + results.tags.length + results.analyses.length;

  return (
    <>
      <button
        type="button"
        className="flex h-10 w-full max-w-xl items-center gap-2 rounded-xl border border-border bg-surface-muted px-3.5 text-left text-sm text-muted-foreground"
        aria-hidden
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 truncate">Buscar áudios, transcrições e análises…</span>
        <span className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[11px]">
          ⌘K
        </span>
      </button>

      <div
        className="fixed inset-0 z-50 grid place-items-start bg-foreground/40 pt-24 backdrop-blur-sm"
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <div className="w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-lg">
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar áudios, transcrições, análises, pastas, tags..."
              className="h-12 flex-1 bg-transparent text-sm outline-none"
            />
            <span className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
              ESC
            </span>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {query.trim().length < 2 ? (
              <p className="px-2 py-4 text-sm text-muted-foreground">
                Digite ao menos 2 caracteres.
              </p>
            ) : loading && totalResults === 0 ? (
              <p className="px-2 py-4 text-sm text-muted-foreground">Buscando...</p>
            ) : totalResults === 0 ? (
              <p className="px-2 py-4 text-sm text-muted-foreground">Nenhum resultado.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {results.audios.length > 0 ? (
                  <Group label="Áudios" icon={AudioLines}>
                    {results.audios.map((audio) => (
                      <Item
                        key={audio.id}
                        title={audio.title}
                        subtitle={audio.description ?? undefined}
                        onSelect={() => go(`/audios/${audio.id}`)}
                      />
                    ))}
                  </Group>
                ) : null}

                {results.folders.length > 0 ? (
                  <Group label="Pastas" icon={Folder}>
                    {results.folders.map((folder) => (
                      <Item
                        key={folder.id}
                        title={folder.name}
                        subtitle={folder.path}
                        onSelect={() => go(`/folders/${folder.id}`)}
                      />
                    ))}
                  </Group>
                ) : null}

                {results.tags.length > 0 ? (
                  <Group label="Tags" icon={Tag}>
                    {results.tags.map((tag) => (
                      <Item
                        key={tag.id}
                        title={`#${tag.name}`}
                        onSelect={() => go(`/audios?tag=${tag.id}`)}
                      />
                    ))}
                  </Group>
                ) : null}

                {results.analyses.length > 0 ? (
                  <Group label="Análises" icon={Sparkles}>
                    {results.analyses.map((analysis) => (
                      <Item
                        key={analysis.id}
                        title="Análise"
                        subtitle={analysis.preview}
                        onSelect={() => go(`/audios/${analysis.audioId}`)}
                      />
                    ))}
                  </Group>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Group({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: typeof Search;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="flex flex-col gap-px">{children}</div>
    </div>
  );
}

function Item({
  title,
  subtitle,
  onSelect,
}: {
  title: string;
  subtitle?: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left text-sm transition",
        "hover:bg-surface-muted",
      )}
    >
      <span className="font-semibold">{title}</span>
      {subtitle ? (
        <span className="line-clamp-1 text-xs text-muted-foreground">{subtitle}</span>
      ) : null}
    </button>
  );
}
