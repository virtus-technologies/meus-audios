"use client";

import { Pause, Play, Rewind, FastForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { formatDuration } from "@/lib/format";

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2] as const;

type AudioPlayerProps = {
  src: string;
  initialDurationSeconds?: number | null;
  onDurationKnown?: (seconds: number) => void;
};

export function AudioPlayer({ src, initialDurationSeconds, onDurationKnown }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDurationSeconds ?? 0);
  const [rate, setRate] = useState<(typeof PLAYBACK_RATES)[number]>(1);

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

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [onDurationKnown]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play();
    else audio.pause();
  }

  function seekBy(seconds: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds));
  }

  function setSeek(percent: number) {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = (percent / 100) * audio.duration;
  }

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
          setSeek(pct);
        }}
        className="relative h-16 cursor-pointer rounded-lg bg-surface-muted"
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

      <div className="mt-4 flex items-center gap-4">
        <span className="font-mono text-xs text-muted-foreground">
          {formatDuration(currentTime)}
        </span>

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

        <span className="font-mono text-xs text-muted-foreground">{formatDuration(duration)}</span>

        <button
          type="button"
          onClick={nextRate}
          aria-label="Velocidade de reprodução"
          className="ml-auto rounded-full bg-surface-muted px-3 py-1.5 font-mono text-xs font-semibold transition hover:bg-border"
        >
          {rate}×
        </button>
      </div>
    </div>
  );
}
