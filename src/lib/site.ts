/**
 * Returns the absolute URL of the running site without a trailing slash.
 *
 * Reads NEXT_PUBLIC_SITE_URL when present (Vercel: set this in the project envs).
 * Falls back to VERCEL_URL (Vercel preview deployments) or localhost in dev.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return stripTrailingSlash(explicit);

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${stripTrailingSlash(vercel)}`;

  return "http://localhost:3000";
}

function stripTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}
