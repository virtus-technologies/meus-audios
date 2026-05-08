"use client";

import { Upload } from "lucide-react";

import { useUploadDialog } from "./upload-context";

export function UploadButton() {
  const { openDialog } = useUploadDialog();
  return (
    <button
      type="button"
      onClick={() => openDialog()}
      className="flex items-center gap-2.5 rounded-2xl bg-gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-px"
    >
      <Upload className="h-4 w-4" strokeWidth={1.75} />
      Enviar áudio
      <span className="ml-auto rounded-md bg-white/20 px-2 py-0.5 font-mono text-[11px] font-medium">
        U
      </span>
    </button>
  );
}
