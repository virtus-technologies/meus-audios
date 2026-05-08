"use client";

import { createContext, useCallback, useContext, useState } from "react";

type UploadContextValue = {
  open: boolean;
  presetFolderId: string | null;
  openDialog: (presetFolderId?: string | null) => void;
  closeDialog: () => void;
};

const UploadContext = createContext<UploadContextValue | null>(null);

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [presetFolderId, setPresetFolderId] = useState<string | null>(null);

  const openDialog = useCallback((preset?: string | null) => {
    setPresetFolderId(preset ?? null);
    setOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <UploadContext.Provider value={{ open, presetFolderId, openDialog, closeDialog }}>
      {children}
    </UploadContext.Provider>
  );
}

export function useUploadDialog(): UploadContextValue {
  const ctx = useContext(UploadContext);
  if (!ctx) throw new Error("useUploadDialog deve ser usado dentro de UploadProvider.");
  return ctx;
}
