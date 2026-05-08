import { cn } from "@/lib/utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-surface-muted", className)}
      aria-hidden
      {...props}
    />
  );
}

export function AudioCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      <Skeleton className="h-28 rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="mt-1 h-5 w-20" />
      </div>
    </div>
  );
}

export function FolderTreeSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      {Array.from({ length: count }).map((_, idx) => (
        <Skeleton key={idx} className="h-7 w-full" />
      ))}
    </div>
  );
}

export function TranscriptSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="grid grid-cols-[60px_1fr] gap-3">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
}
