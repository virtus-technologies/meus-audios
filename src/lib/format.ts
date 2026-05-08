export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || !Number.isFinite(seconds) || seconds < 0) return "—";
  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) {
    return `${hours}:${pad2(minutes)}:${pad2(secs)}`;
  }
  return `${minutes}:${pad2(secs)}`;
}

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

export function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const seconds = Math.round(diffMs / 1000);
  if (seconds < 60) return "agora";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `há ${minutes}min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `há ${days}d`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `há ${weeks}sem`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
