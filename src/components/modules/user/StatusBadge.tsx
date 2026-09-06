import { cn } from "@/lib/utils";

type Tone = "green" | "amber" | "gray" | "red" | "blue";

const TONES: Record<Tone, string> = {
  green:
    "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400",
  amber: "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400",
  gray: "bg-muted text-muted-foreground ring-border",
  red: "bg-destructive/10 text-destructive ring-destructive/20",
  blue: "bg-primary/10 text-primary ring-primary/20",
};

const MAP: Record<string, Tone> = {
  ACTIVE: "green",
  PAID: "green",
  ON_LEAVE: "amber",
  PENDING: "amber",
  INACTIVE: "gray",
  TERMINATED: "red",
  ADMIN: "blue",
  MANAGER: "blue",
  SALES: "blue",
  EMPLOYEE: "gray",
};

export function StatusBadge({
  value,
  tone,
  className,
}: {
  value: string;
  tone?: Tone;
  className?: string;
}) {
  const resolved = tone ?? MAP[value] ?? "gray";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset",
        TONES[resolved],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {value.replace(/_/g, " ")}
    </span>
  );
}

export default StatusBadge;
