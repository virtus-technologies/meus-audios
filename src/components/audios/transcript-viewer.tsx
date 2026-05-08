"use client";

import { Copy, Download, Edit3, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { AudioStatus } from "@prisma/client";

import { TranscribeButton } from "./transcribe-button";
import { updateTranscriptAction } from "./transcript-actions";

type Segment = { start: number; end: number; text: string };

type TranscriptViewerProps = {
  audioId: string;
  status: AudioStatus;
  transcript: {
    id: string;
    fullText: string;
    segmentsJson: unknown;
  } | null;
  audioTitle: string;
};

function parseSegments(value: unknown): Segment[] | null {
  if (!Array.isArray(value)) return null;
  const out: Segment[] = [];
  for (const item of value) {
    if (
      item &&
      typeof item === "object" &&
      typeof (item as Segment).start === "number" &&
      typeof (item as Segment).end === "number" &&
      typeof (item as Segment).text === "string"
    ) {
      out.push(item as Segment);
    }
  }
  return out.length > 0 ? out : null;
}

function formatTimestamp(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const mm = Math.floor(total / 60);
  const ss = total % 60;
  return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
}

export function TranscriptViewer({
  audioId,
  status,
  transcript,
  audioTitle,
}: TranscriptViewerProps) {
  const [editing, setEditing] = useState(false);

  if (!transcript) {
    return (
      <section className="rounded-2xl border border-border bg-surface p-6">
        <header className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-medium tracking-tight">Transcrição</h2>
        </header>
        <div className="grid place-items-center gap-3 rounded-xl border border-dashed border-border bg-surface-muted p-10 text-center">
          <Sparkles className="h-6 w-6 text-primary" />
          <p className="font-display text-lg font-medium">Este áudio ainda não foi transcrito.</p>
          <p className="max-w-md text-sm text-muted-foreground">
            Transcreva para pesquisar dentro do conteúdo, gerar resumos e fazer perguntas com IA.
          </p>
          <TranscribeButton audioId={audioId} status={status} />
        </div>
      </section>
    );
  }

  if (editing) {
    return (
      <TranscriptEditor
        audioId={audioId}
        initialText={transcript.fullText}
        onCancel={() => setEditing(false)}
        onSaved={() => setEditing(false)}
      />
    );
  }

  const segments = parseSegments(transcript.segmentsJson);

  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <header className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-medium tracking-tight">Transcrição</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => copyText(transcript.fullText)}>
            <Copy className="h-3.5 w-3.5" /> Copiar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => downloadTxt(audioTitle, transcript.fullText)}
          >
            <Download className="h-3.5 w-3.5" /> .txt
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
            <Edit3 className="h-3.5 w-3.5" /> Editar
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-2 leading-relaxed">
        {segments ? (
          segments.map((segment, idx) => (
            <p key={idx} className="grid grid-cols-[60px_1fr] gap-3 text-sm">
              <span className="font-mono text-xs text-primary">
                {formatTimestamp(segment.start)}
              </span>
              <span>{segment.text}</span>
            </p>
          ))
        ) : (
          <p className="whitespace-pre-wrap text-sm">{transcript.fullText}</p>
        )}
      </div>
    </section>
  );
}

function TranscriptEditor({
  audioId,
  initialText,
  onCancel,
  onSaved,
}: {
  audioId: string;
  initialText: string;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [text, setText] = useState(initialText);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function save() {
    setError(null);
    startTransition(async () => {
      const result = await updateTranscriptAction({ audioId, fullText: text });
      if (result.ok) onSaved();
      else setError(result.error);
    });
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-3 font-display text-xl font-medium tracking-tight">Editar transcrição</h2>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={16}
        maxLength={200_000}
        className="w-full rounded-xl border border-border bg-surface p-3 font-sans text-sm leading-relaxed outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
      />
      {error ? <p className="mt-2 text-sm text-destructive-dark">{error}</p> : null}
      <div className="mt-3 flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button onClick={save} disabled={isPending || text.trim().length === 0}>
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </section>
  );
}

function copyText(text: string) {
  void navigator.clipboard.writeText(text);
}

function downloadTxt(title: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/[^\w\-_. ]+/g, "_")}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
