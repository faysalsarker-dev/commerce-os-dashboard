import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ComponentType<LucideProps>;
  image?: string;
  imageClassName?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon,
  image,
  imageClassName,
  title,
  description,
  action,
  className,
  compact,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface/60 text-center",
        compact ? "gap-2 px-6 py-8" : "gap-3 px-6 py-14",
        className,
      )}
    >
      {image ? (
        <img
          src={image}
          alt={title}
          className={cn("w-[85%] max-w-md h-auto object-contain", imageClassName)}
        />
      ) : Icon ? (
        <div className="grid size-9 place-items-center rounded-md border border-border bg-card text-muted-foreground shadow-card">
          <Icon className="size-4" />
        </div>
      ) : null}
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
