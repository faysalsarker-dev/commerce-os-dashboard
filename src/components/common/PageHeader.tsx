import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  meta,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          {eyebrow}
          <h1 className="truncate text-xl font-semibold text-foreground sm:text-2xl">{title}</h1>
          {description ? (
            <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      {meta ? <div className="flex flex-wrap items-center gap-x-6 gap-y-2">{meta}</div> : null}
    </div>
  );
}

interface MetricProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
}

export function Metric({ label, value, hint }: MetricProps) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="numeric mt-0.5 text-sm font-medium text-foreground">
        {value}
        {hint ? <span className="ml-1.5 text-xs text-muted-foreground">{hint}</span> : null}
      </p>
    </div>
  );
}