"use client";

import { Pause, Play, Rewind, FastForward } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { formatDuration } from "@/lib/format";

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2] as const;
const PEAK_BUCKETS = 200;

type AudioPlayerProps = {
  audioId: string;
  src: string;
  initialDurationSeconds?: number | null;
  initialPeaks?: number[] | null;
  onDurationKnown?: (seconds: number) => void;
};

export function AudioPlayer({
  audioId,
  src,
  initialDurationSeconds,
  initialPeaks,
  onDurationKnown,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDurationSeconds ?? 0);
  const [rate, setRate] = useState<(typeof PLAYBACK_RATES)[number]>(1);
  const [peaks, setPeaks] = useState<number[] | null>(
    initialPeaks && initialPeaks.length >= 16 ? initialPeaks : null,
  );
  const [peaksError, setPeaksError] = useState(false);

  // `timeupdate` dispara só ~4Hz (~250ms) — choppy no waveform. Usamos rAF
  // enquanto está tocando pra refletir `currentTime` em sincronia com o
  // refresh do display (60Hz). Em pausa, lemos uma vez via timeupdate
  // (cobre seek manual com áudio pausado).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => {
      setDuration(audio.duration);
      onDurationKnown?.(audio.duration);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onSeeked = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("seeked", onSeeked);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("seeked", onSeeked);
    };
  }, [onDurationKnown]);

  useEffect(() => {
    if (!isPlaying) return;
    const audio = audioRef.current;
    if (!audio) return;
    let frame = 0;
    const tick = () => {
      setCurrentTime(audio.currentTime);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying]);

  // Decodifica audio + extrai peaks na 1ª abertura sem peaks persistidos.
  useEffect(() => {
    if (peaks || peaksError) return;
    let cancelled = false;

    async function loadPeaks() {
      try {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`fetch ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        if (cancelled) return;

        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) throw new Error("AudioContext indisponível");
        const ctx = new AudioCtx();
        let decoded: AudioBuffer;
        try {
          decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
        } finally {
          ctx.close();
        }
        if (cancelled) return;

        const computed = computePeaks(decoded, PEAK_BUCKETS);
        setPeaks(computed);

        // Persiste server-side (best-effort; falha não impede UI).
        fetch(`/api/audios/${audioId}/peaks`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ peaks: computed }),
        }).catch(() => undefined);
      } catch (error) {
        console.warn("[audio-player] peak generation failed", error);
        if (!cancelled) setPeaksError(true);
      }
    }

    loadPeaks();
    return () => {
      cancelled = true;
    };
  }, [audioId, peaks, peaksError, src]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play();
    else audio.pause();
  }, []);

  const seekBy = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds));
  }, []);

  const seekToPercent = useCallback((percent: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = (percent / 100) * audio.duration;
  }, []);

  function nextRate() {
    const idx = PLAYBACK_RATES.indexOf(rate);
    const next = PLAYBACK_RATES[(idx + 1) % PLAYBACK_RATES.length];
    setRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <audio ref={audioRef} src={src} preload="metadata" />

      {peaks ? (
        <Waveform peaks={peaks} progressPct={progressPct} onSeek={seekToPercent} />
      ) : (
        <ProgressBar progressPct={progressPct} onSeek={seekToPercent} loading={!peaksError} />
      )}

      <div className="mt-4 grid grid-cols-3 items-center gap-4">
        <span className="font-mono text-xs text-muted-foreground">
          {formatDuration(currentTime)}
        </span>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => seekBy(-10)}
            aria-label="Voltar 10 segundos"
            className="grid h-10 w-10 place-items-center rounded-full text-foreground transition hover:bg-surface-muted"
          >
            <Rewind className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={toggle}
            aria-label={isPlaying ? "Pausar" : "Tocar"}
            className="grid h-14 w-14 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current" />
            )}
          </button>

          <button
            type="button"
            onClick={() => seekBy(10)}
            aria-label="Avançar 10 segundos"
            className="grid h-10 w-10 place-items-center rounded-full text-foreground transition hover:bg-surface-muted"
          >
            <FastForward className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            {formatDuration(duration)}
          </span>
          <button
            type="button"
            onClick={nextRate}
            aria-label="Velocidade de reprodução"
            className="rounded-full bg-surface-muted px-3 py-1.5 font-mono text-xs font-semibold transition hover:bg-border"
          >
            {rate}×
          </button>
        </div>
      </div>
    </div>
  );
}

type WaveformProps = {
  peaks: number[];
  progressPct: number;
  onSeek: (percent: number) => void;
};

function Waveform({ peaks, progressPct, onSeek }: WaveformProps) {
  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const pct = ((event.clientX - rect.left) / rect.width) * 100;
    onSeek(Math.max(0, Math.min(100, pct)));
  }

  function handleKey(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onSeek(Math.max(0, progressPct - 2));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      onSeek(Math.min(100, progressPct + 2));
    }
  }

  // Renderizamos as mesmas barras duas vezes — camada de fundo (não-tocada)
  // e camada de frente (tocada). A camada de frente é recortada por
  // `clip-path: inset(...)` na proporção do progresso, fazendo a transição
  // com precisão de pixel (independente do número de barras) e sem
  // re-render por barra a cada frame.
  const bars = peaks.map((peak, idx) => (
    <span
      key={idx}
      aria-hidden
      className="flex-1 rounded-[1px]"
      style={{ height: `${Math.max(6, peak * 100)}%` }}
    />
  ));

  const clip = `inset(0 ${Math.max(0, 100 - progressPct)}% 0 0)`;

  return (
    <div
      role="slider"
      aria-label="Posição do áudio"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progressPct)}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKey}
      className="relative h-20 cursor-pointer rounded-lg bg-surface-muted outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div
        aria-hidden
        className="absolute inset-0 flex items-center gap-[2px] px-2 py-1 text-border [&>span]:bg-current"
      >
        {bars}
      </div>
      <div
        aria-hidden
        className="absolute inset-0 flex items-center gap-[2px] px-2 py-1 text-primary [&>span]:bg-current"
        style={{ clipPath: clip, WebkitClipPath: clip }}
      >
        {bars}
      </div>
    </div>
  );
}

function ProgressBar({
  progressPct,
  onSeek,
  loading,
}: {
  progressPct: number;
  onSeek: (percent: number) => void;
  loading: boolean;
}) {
  return (
    <div
      role="slider"
      aria-label="Posição do áudio"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progressPct)}
      tabIndex={0}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const pct = ((event.clientX - rect.left) / rect.width) * 100;
        onSeek(pct);
      }}
      className={`relative h-16 cursor-pointer rounded-lg bg-surface-muted ${
        loading ? "animate-pulse" : ""
      }`}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-lg bg-gradient-soft"
        style={{ width: `${progressPct}%` }}
      />
      <div
        className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary shadow"
        style={{ left: `calc(${progressPct}% - 6px)` }}
        aria-hidden
      />
    </div>
  );
}

/**
 * Reduz um AudioBuffer multi-canal a `bucketCount` valores RMS normalizados.
 * Misturamos canais (mono mix) e usamos RMS por bucket — produz um perfil
 * mais fiel do que pegar `Math.max(abs)` (que satura visualmente em
 * gravações ruidosas).
 */
function computePeaks(buffer: AudioBuffer, bucketCount: number): number[] {
  const channelCount = buffer.numberOfChannels;
  const length = buffer.length;
  const samplesPerBucket = Math.max(1, Math.floor(length / bucketCount));
  const channels: Float32Array[] = [];
  for (let c = 0; c < channelCount; c++) {
    channels.push(buffer.getChannelData(c));
  }

  const result = new Array<number>(bucketCount);
  let maxRms = 0;

  for (let b = 0; b < bucketCount; b++) {
    const start = b * samplesPerBucket;
    const end = b === bucketCount - 1 ? length : start + samplesPerBucket;
    let sumSquares = 0;
    let count = 0;
    for (let i = start; i < end; i++) {
      let mixed = 0;
      for (let c = 0; c < channelCount; c++) {
        mixed += channels[c][i];
      }
      mixed /= channelCount;
      sumSquares += mixed * mixed;
      count++;
    }
    const rms = count > 0 ? Math.sqrt(sumSquares / count) : 0;
    result[b] = rms;
    if (rms > maxRms) maxRms = rms;
  }

  // Normaliza para [0, 1] mantendo proporção. Floor para evitar barras
  // invisíveis em silêncio total.
  if (maxRms <= 0) return result.map(() => 0);
  for (let b = 0; b < bucketCount; b++) {
    result[b] = Math.min(1, result[b] / maxRms);
  }
  return result;
}
