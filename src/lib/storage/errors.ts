export class StorageError extends Error {
  constructor(
    message: string,
    public readonly code: StorageErrorCode,
    options?: { cause?: Error },
  ) {
    super(message, options);
    this.name = "StorageError";
  }
}

export type StorageErrorCode =
  | "INVALID_MIME_TYPE"
  | "INVALID_ID"
  | "FILE_TOO_LARGE"
  | "MISSING_TOKEN"
  | "UPLOAD_FAILED"
  | "DELETE_FAILED"
  | "READ_FAILED"
  | "NOT_FOUND";
