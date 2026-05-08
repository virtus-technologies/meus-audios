import "server-only";

export type AudioMetrics = {
  wordCount: number;
  wordsPerMinute: number | null;
  questionCount: number;
  exclamationCount: number;
};

/**
 * Métricas leves derivadas da transcrição. Conforme spec sec 8.12,
 * análises mais profundas (tom, clareza, engajamento, persuasão) ficam
 * no domínio dos templates de IA, não como cálculo fixo.
 */
export function computeAudioMetrics(input: {
  transcriptText: string;
  durationSeconds: number | null;
}): AudioMetrics {
  const text = input.transcriptText;
  const words = text.split(/\s+/).filter((token) => token.length > 0);
  const wordCount = words.length;
  const wpm =
    input.durationSeconds && input.durationSeconds > 0
      ? Math.round((wordCount / input.durationSeconds) * 60)
      : null;
  const questionCount = (text.match(/\?/g) ?? []).length;
  const exclamationCount = (text.match(/!/g) ?? []).length;

  return {
    wordCount,
    wordsPerMinute: wpm,
    questionCount,
    exclamationCount,
  };
}
