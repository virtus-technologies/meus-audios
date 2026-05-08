import { signInWithGoogleAction } from "./actions";

type GoogleButtonProps = {
  callbackUrl?: string;
  label?: string;
};

/**
 * Renderiza o botão "Continuar com Google" apenas quando as envs do
 * provider estão configuradas. Caso contrário não aparece — o build
 * permanece verde em qualquer ambiente.
 *
 * Server component: leitura segura de `process.env`.
 */
export function GoogleButton({ callbackUrl, label = "Continuar com Google" }: GoogleButtonProps) {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return null;
  }

  return (
    <form action={signInWithGoogleAction}>
      {callbackUrl ? <input type="hidden" name="callbackUrl" value={callbackUrl} /> : null}
      <button
        type="submit"
        className="inline-flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface text-sm font-semibold transition hover:bg-surface-muted"
      >
        <GoogleLogo />
        {label}
      </button>
    </form>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
