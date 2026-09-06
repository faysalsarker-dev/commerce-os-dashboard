import { cn } from "@/lib/utils";

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-muted", className)}
      aria-hidden
    />
  );
}

export function UserDetailsSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading user">
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <SkeletonBlock className="h-20 w-20 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <SkeletonBlock className="h-6 w-48" />
            <SkeletonBlock className="h-4 w-64" />
            <div className="flex gap-2">
              <SkeletonBlock className="h-6 w-20 rounded-full" />
              <SkeletonBlock className="h-6 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <SkeletonBlock className="h-10 w-full max-w-md rounded-full" />
      <div className="grid gap-4 lg:grid-cols-2">
        <SkeletonBlock className="h-64 rounded-2xl" />
        <SkeletonBlock className="h-64 rounded-2xl" />
      </div>
    </div>
  );
}

export default SkeletonBlock;
