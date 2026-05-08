"use client";

import { Upload } from "lucide-react";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";
import { ALLOWED_AUDIO_MIME_TYPES } from "@/lib/storage/constants";

const ACCEPT = ALLOWED_AUDIO_MIME_TYPES.join(",");

type UploadDropzoneProps = {
  onFileSelected: (file: File) => void;
  selectedFile: File | null;
};

export function UploadDropzone({ onFileSelected, selectedFile }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected],
  );

  return (
    <label
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition",
        isDragging
          ? "border-primary bg-primary-light"
          : "border-border bg-surface-muted hover:border-primary-dark/40",
      )}
    >
      <Upload className="h-8 w-8 text-primary" strokeWidth={1.5} />
      {selectedFile ? (
        <>
          <span className="font-medium">{selectedFile.name}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {Math.round((selectedFile.size / (1024 * 1024)) * 10) / 10} MB ·{" "}
            {selectedFile.type || "tipo desconhecido"}
          </span>
          <span className="mt-1 text-xs text-primary-dark">
            Clique ou arraste outro arquivo para trocar.
          </span>
        </>
      ) : (
        <>
          <span className="font-medium">Arraste um áudio ou clique para selecionar</span>
          <span className="text-xs text-muted-foreground">
            mp3, m4a, wav, ogg, webm ou mp4 — até 2 GB
          </span>
        </>
      )}
      <input
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFileSelected(file);
        }}
      />
    </label>
  );
}
