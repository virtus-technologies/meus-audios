"use client";

import { useState, useTransition } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/format";

import { updateAudioAction } from "./audio-actions";

type AudioMetadataPanelProps = {
  audio: {
    id: string;
    title: string;
    description: string | null;
    language: string | null;
    contentType: string | null;
    sizeBytes: number;
    mimeType: string;
    originalFileName: string;
    createdAt: Date;
  };
};

const LANGUAGES = [
  { value: "pt-BR", label: "Português (BR)" },
  { value: "en", label: "Inglês" },
  { value: "es", label: "Espanhol" },
  { value: "it", label: "Italiano" },
];

const CONTENT_TYPES = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "reuniao", label: "Reunião" },
  { value: "aula", label: "Aula" },
  { value: "pregacao", label: "Pregação" },
  { value: "discurso", label: "Discurso" },
  { value: "podcast", label: "Podcast" },
  { value: "entrevista", label: "Entrevista" },
  { value: "ideia", label: "Ideia pessoal" },
  { value: "anotacao", label: "Anotação de voz" },
  { value: "estudo", label: "Estudo" },
  { value: "oracao", label: "Oração" },
  { value: "outro", label: "Outro" },
];

export function AudioMetadataPanel({ audio }: AudioMetadataPanelProps) {
  const [title, setTitle] = useState(audio.title);
  const [description, setDescription] = useState(audio.description ?? "");
  const [language, setLanguage] = useState(audio.language ?? "pt-BR");
  const [contentType, setContentType] = useState(audio.contentType ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function save() {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await updateAudioAction({
        audioId: audio.id,
        data: {
          title,
          description: description.trim() || null,
          language,
          contentType: contentType || undefined,
        },
      });
      if (result.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h3 className="mb-4 font-display text-lg font-medium tracking-tight">Metadados</h3>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="meta-title" className="text-sm font-medium">
            Título
          </label>
          <Input
            id="meta-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={200}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="meta-description" className="text-sm font-medium">
            Descrição
          </label>
          <textarea
            id="meta-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            maxLength={2000}
            className="rounded-xl border border-border bg-surface p-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="meta-language" className="text-sm font-medium">
              Idioma
            </label>
            <select
              id="meta-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="h-10 rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="meta-content-type" className="text-sm font-medium">
              Tipo
            </label>
            <select
              id="meta-content-type"
              value={contentType}
              onChange={(event) => setContentType(event.target.value)}
              className="h-10 rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
            >
              <option value="">— escolha —</option>
              {CONTENT_TYPES.map((ct) => (
                <option key={ct.value} value={ct.value}>
                  {ct.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <dl className="mt-2 grid grid-cols-2 gap-y-2 text-xs">
          <dt className="text-muted-foreground">Arquivo original</dt>
          <dd className="truncate text-right">{audio.originalFileName}</dd>
          <dt className="text-muted-foreground">Tamanho</dt>
          <dd className="text-right font-mono">{formatFileSize(audio.sizeBytes)}</dd>
          <dt className="text-muted-foreground">MIME</dt>
          <dd className="text-right font-mono">{audio.mimeType}</dd>
          <dt className="text-muted-foreground">Enviado em</dt>
          <dd className="text-right">
            {audio.createdAt.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </dd>
        </dl>

        {error ? <p className="text-sm text-destructive-dark">{error}</p> : null}
        {success ? <p className="text-sm text-success-dark">Metadados salvos.</p> : null}

        <div className="flex justify-end">
          <Button type="button" onClick={save} disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
