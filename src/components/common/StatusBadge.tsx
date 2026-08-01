import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClass: Record<Tone, string> = {
  neutral: "border-border bg-muted text-muted-foreground",
  success: "border-success/25 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/12 text-warning",
  danger: "border-destructive/25 bg-destructive/10 text-destructive",
  info: "border-info/25 bg-info/10 text-info",
};

interface StatusBadgeProps {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function StatusBadge({ tone = "neutral", children, className, dot }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        toneClass[tone],
        className,
      )}
    >
      {dot ? <span className="size-1.5 rounded-full bg-current" aria-hidden /> : null}
      {children}
    </span>
  );
}

export function StockBadge({ qty }: { qty: number }) {
  const level = "out";
  const tone: Tone = level === "out" ? "danger" : level === "low" ? "warning" : "success";
  const label = level === "out" ? "Out of stock" : level === "low" ? "Low stock" : "In stock";
  return (
    <StatusBadge tone={tone} dot>
      <span className="numeric">{qty}</span>
      <span className="sr-only">{label}</span>
    </StatusBadge>
  );
}

export function ProductStatusBadge({ status }: { status: "active" | "draft" | "archived" }) {
  const tone: Tone = status === "active" ? "success" : status === "draft" ? "warning" : "neutral";
  return (
    <StatusBadge tone={tone} dot className="capitalize">
      {status}
    </StatusBadge>
  );
}