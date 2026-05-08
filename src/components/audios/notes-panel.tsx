"use client";

import { Plus, StickyNote, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

import { createNoteAction, deleteNoteAction } from "./notes-actions";

export type Note = {
  id: string;
  timestampSeconds: number;
  text: string;
};

type NotesPanelProps = {
  audioId: string;
  initialNotes: ReadonlyArray<Note>;
};

function formatTimestamp(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const mm = Math.floor(total / 60);
  const ss = total % 60;
  return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
}

export function NotesPanel({ audioId, initialNotes }: NotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes.slice());
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function getCurrentPlayerTime(): number {
    const audio = document.querySelector("audio");
    return audio?.currentTime ?? 0;
  }

  function add() {
    setError(null);
    if (text.trim().length === 0) return;
    const ts = getCurrentPlayerTime();
    startTransition(async () => {
      const result = await createNoteAction({
        audioId,
        timestampSeconds: ts,
        text,
      });
      if (result.ok) {
        setNotes((prev) =>
          [...prev, { id: crypto.randomUUID(), timestampSeconds: Math.round(ts), text }].sort(
            (a, b) => a.timestampSeconds - b.timestampSeconds,
          ),
        );
        setText("");
        // Force reload to get real IDs from server
        window.location.reload();
      } else {
        setError(result.error);
      }
    });
  }

  function remove(noteId: string) {
    startTransition(async () => {
      const result = await deleteNoteAction({ audioId, noteId });
      if (result.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
      }
    });
  }

  function seekTo(seconds: number) {
    const audio = document.querySelector("audio");
    if (audio) {
      audio.currentTime = seconds;
      audio.play().catch(() => undefined);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-info-light text-info-dark">
          <StickyNote className="h-4 w-4" />
        </span>
        <h3 className="font-display text-lg font-medium tracking-tight">Notas</h3>
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Adicionar nota no tempo atual..."
          className="h-10 flex-1 rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
          maxLength={1000}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
        />
        <Button onClick={add} disabled={isPending || text.trim().length === 0} size="sm">
          <Plus className="h-3.5 w-3.5" /> Adicionar
        </Button>
      </div>

      {error ? <p className="mt-2 text-xs text-destructive-dark">{error}</p> : null}

      {notes.length === 0 ? (
        <p className="mt-4 text-xs text-muted-foreground">
          Adicione notas para marcar momentos importantes do áudio.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {notes.map((note) => (
            <li
              key={note.id}
              className="flex items-start gap-3 rounded-xl border border-border bg-surface-muted p-3 text-sm"
            >
              <button
                type="button"
                onClick={() => seekTo(note.timestampSeconds)}
                className="font-mono text-xs font-semibold text-primary-dark hover:underline"
              >
                {formatTimestamp(note.timestampSeconds)}
              </button>
              <p className="flex-1">{note.text}</p>
              <button
                type="button"
                aria-label="Excluir nota"
                onClick={() => remove(note.id)}
                className="rounded p-1 text-muted-foreground transition hover:bg-destructive-light hover:text-destructive-dark"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
