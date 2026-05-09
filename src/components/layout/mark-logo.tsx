import { cn } from "@/lib/utils";

type MarkLogoProps = {
  className?: string;
  /**
   * Unique suffix for inline gradient ids. Defaults to a stable string. Provide a
   * different value when rendering more than one mark in the same document so
   * the gradients don't collide.
   */
  idSuffix?: string;
};

export function MarkLogo({ className, idSuffix = "default" }: MarkLogoProps) {
  const gradId = `mark-grad-${idSuffix}`;
  const sheenId = `mark-sheen-${idSuffix}`;
  return (
    <svg
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="55%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <radialGradient id={sheenId} cx="30%" cy="20%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.28" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M 512 32 C 800 32, 992 224, 992 512 C 992 800, 800 992, 512 992 C 224 992, 32 800, 32 512 C 32 224, 224 32, 512 32 Z"
        fill={`url(#${gradId})`}
      />
      <path
        d="M 512 32 C 800 32, 992 224, 992 512 C 992 800, 800 992, 512 992 C 224 992, 32 800, 32 512 C 32 224, 224 32, 512 32 Z"
        fill={`url(#${sheenId})`}
      />
      <g fill="#FFFFFF">
        <rect x="200" y="450" width="80" height="160" rx="40" ry="40" opacity="0.78" />
        <rect x="312" y="370" width="80" height="320" rx="40" ry="40" opacity="0.92" />
        <rect x="424" y="262" width="80" height="540" rx="40" ry="40" />
        <rect x="536" y="330" width="80" height="400" rx="40" ry="40" opacity="0.96" />
        <rect x="648" y="406" width="80" height="248" rx="40" ry="40" opacity="0.84" />
        <rect x="760" y="468" width="64" height="128" rx="32" ry="32" opacity="0.7" />
        <path d="M 444 162 Q 444 152, 454 154 L 584 142 Q 596 140, 588 158 L 460 238 Q 448 246, 442 234 Z" />
      </g>
    </svg>
  );
}
