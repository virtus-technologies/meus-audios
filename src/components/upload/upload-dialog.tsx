"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { FolderTreeNode } from "@/components/folders/folder-tree";

import { UploadDropzone } from "./upload-dropzone";
import { useUploadDialog } from "./upload-context";

type UploadDialogProps = {
  folders: ReadonlyArray<FolderTreeNode>;
};

const LANGUAGES: ReadonlyArray<{ value: string; label: string }> = [
  { value: "pt-BR", label: "Português (BR)" },
  { value: "en", label: "Inglês" },
  { value: "es", label: "Espanhol" },
  { value: "it", label: "Italiano" },
];

const CONTENT_TYPES: ReadonlyArray<{ value: string; label: string }> = [
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

function flattenFolders(nodes: ReadonlyArray<FolderTreeNode>): { id: string; path: string }[] {
  const out: { id: string; path: string }[] = [];
  function walk(list: ReadonlyArray<FolderTreeNode>) {
    for (const n of list) {
      out.push({ id: n.id, path: n.path });
      walk(n.children);
    }
  }
  walk(nodes);
  return out;
}

export function UploadDialog({ folders }: UploadDialogProps) {
  const { open, presetFolderId, closeDialog } = useUploadDialog();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [folderId, setFolderId] = useState<string>("");
  const [language, setLanguage] = useState("pt-BR");
  const [contentType, setContentType] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Atalho U para abrir
  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (
        event.target instanceof HTMLElement &&
        /input|textarea|select/i.test(event.target.tagName)
      ) {
        return;
      }
      if (event.key === "u" || event.key === "U") {
        if (!open) {
          event.preventDefault();
          window.dispatchEvent(new CustomEvent("meus-audios:open-upload"));
        }
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Preset folder vinda do contexto
  useEffect(() => {
    setFolderId(presetFolderId ?? "");
  }, [presetFolderId, open]);

  function reset() {
    setFile(null);
    setTitle("");
    setFolderId(presetFolderId ?? "");
    setLanguage("pt-BR");
    setContentType("");
    setTags("");
    setProgress(null);
    setError(null);
  }

  function handleFile(picked: File) {
    setFile(picked);
    if (!title) {
      const stem = picked.name.replace(/\.[^.]+$/, "");
      setTitle(stem);
    }
    setError(null);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!file) {
      setError("Selecione um arquivo de áudio.");
      return;
    }
    if (title.trim().length === 0) {
      setError("Título é obrigatório.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    if (folderId) formData.append("folderId", folderId);
    if (language) formData.append("language", language);
    if (contentType) formData.append("contentType", contentType);
    if (tags.trim()) formData.append("tagIds", tags);

    setProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload/audio");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      setProgress(null);
      if (xhr.status >= 200 && xhr.status < 300) {
        reset();
        closeDialog();
        router.refresh();
      } else {
        try {
          const body = JSON.parse(xhr.responseText) as { error?: string };
          setError(body.error ?? "Falha no upload.");
        } catch {
          setError(`Falha no upload (status ${xhr.status}).`);
        }
      }
    };
    xhr.onerror = () => {
      setProgress(null);
      setError("Erro de rede durante o upload.");
    };
    xhr.send(formData);
  }

  const flatFolders = flattenFolders(folders);
  const isUploading = progress !== null;

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? null : closeDialog())}>
      <DialogContent className="max-w-lg">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Enviar áudio</DialogTitle>
            <DialogDescription>
              Arquivo + metadados. Após o envio o áudio aparece na biblioteca pronto para
              transcrever.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 flex flex-col gap-4">
            <UploadDropzone onFileSelected={handleFile} selectedFile={file} />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="upload-title">
                Título
              </label>
              <Input
                id="upload-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                maxLength={200}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" htmlFor="upload-folder">
                  Pasta
                </label>
                <select
                  id="upload-folder"
                  value={folderId}
                  onChange={(event) => setFolderId(event.target.value)}
                  className="h-10 rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                >
                  <option value="">— sem pasta —</option>
                  {flatFolders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.path}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" htmlFor="upload-language">
                  Idioma
                </label>
                <select
                  id="upload-language"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="h-10 rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                >
                  {LANGUAGES.map((language) => (
                    <option key={language.value} value={language.value}>
                      {language.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="upload-content-type">
                Tipo de conteúdo
              </label>
              <select
                id="upload-content-type"
                value={contentType}
                onChange={(event) => setContentType(event.target.value)}
                className="h-10 rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
              >
                <option value="">— escolha —</option>
                {CONTENT_TYPES.map((contentType) => (
                  <option key={contentType.value} value={contentType.value}>
                    {contentType.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" htmlFor="upload-tags">
                Tags (IDs separadas por vírgula)
              </label>
              <Input
                id="upload-tags"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                placeholder="opcional"
              />
              <span className="text-xs text-muted-foreground">
                Selector visual de tags chega em VIR-48 (#41).
              </span>
            </div>

            {progress !== null ? (
              <div className="flex flex-col gap-1.5">
                <span className="text-sm">Enviando... {progress}%</span>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
                  <span
                    className="block h-full bg-gradient-primary transition-[width]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : null}

            {error ? <p className="text-sm text-destructive-dark">{error}</p> : null}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={isUploading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isUploading || !file || title.trim().length === 0}>
              {isUploading ? "Enviando..." : "Enviar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
