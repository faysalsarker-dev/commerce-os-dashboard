import { formatDateSeparator } from "../utils/formatTime";

interface DateSeparatorProps {
  isoString: string;
}

export function DateSeparator({ isoString }: DateSeparatorProps) {
  const label = formatDateSeparator(isoString);
  return (
    <div
      role="separator"
      aria-label={label}
      className="my-3 flex items-center gap-3 px-4"
    >
      <div className="h-px flex-1 bg-border/60" />
      <span className="shrink-0 text-[11px] font-medium text-muted-foreground">{label}</span>
      <div className="h-px flex-1 bg-border/60" />
    </div>
  );
}

