export type AudioUploadInput = {
  userId: string;
  audioId: string;
  file: Blob;
  mimeType: string;
};

export type AudioUploadResult = {
  blobUrl: string;
  storageKey: string;
  sizeBytes: number;
  mimeType: string;
};
