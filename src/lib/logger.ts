import "server-only";

/**
 * Logger estruturado conforme docs/plano-de-implementacao.md secao 18.
 * Saida JSON em uma linha — Vercel Observability/Logs faz parse automatico.
 *
 * Eventos canonicos: audio.upload.{started,completed,failed},
 * audio.transcription.{started,completed,failed},
 * audio.analysis.{started,completed,failed}.
 */
export type LogEvent = {
  event: string;
  userId?: string;
  audioId?: string;
  durationMs?: number;
  error?: string;
  [key: string]: unknown;
};

export const logger = {
  info(event: LogEvent): void {
    if (process.env.NODE_ENV === "test") return;
    console.log(JSON.stringify({ level: "info", ts: new Date().toISOString(), ...event }));
  },
  warn(event: LogEvent): void {
    console.warn(JSON.stringify({ level: "warn", ts: new Date().toISOString(), ...event }));
  },
  error(event: LogEvent): void {
    console.error(JSON.stringify({ level: "error", ts: new Date().toISOString(), ...event }));
  },
};

/**
 * Helper: mede duração e loga evento started/completed/failed automaticamente.
 *
 * ```ts
 * await withTimedLog({ baseEvent: "audio.transcription", userId, audioId }, async () => {
 *   await openai.audio.transcriptions.create(...);
 * });
 * ```
 */
export async function withTimedLog<T>(
  context: { baseEvent: string; userId?: string; audioId?: string },
  fn: () => Promise<T>,
): Promise<T> {
  const startedAt = Date.now();
  logger.info({
    event: `${context.baseEvent}.started`,
    userId: context.userId,
    audioId: context.audioId,
  });
  try {
    const result = await fn();
    logger.info({
      event: `${context.baseEvent}.completed`,
      userId: context.userId,
      audioId: context.audioId,
      durationMs: Date.now() - startedAt,
    });
    return result;
  } catch (error) {
    logger.error({
      event: `${context.baseEvent}.failed`,
      userId: context.userId,
      audioId: context.audioId,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
