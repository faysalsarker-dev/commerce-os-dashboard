import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

type StatusVariant =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "secondary"
  | "default";

interface StatusBadgeProps {
  value: string;
  text?: string;
  variant?: StatusVariant;
  className?: string;
}

const STATUS_MAP: Record<string, StatusVariant> = {
  // Success
  delivered: "success",
  completed: "success",
  confirmed: "success",
  paid: "success",
  active: "success",
  approved: "success",

  // Warning
  pending: "warning",
  processing: "warning",
  waiting: "warning",

  // Danger
  cancelled: "danger",
  cancel: "danger",
  failed: "danger",
  rejected: "danger",
  returned: "danger",
  inactive: "danger",

  // Info
  shipped: "info",
  refunded: "info",

  // Secondary
  draft: "secondary",
};

const badgeVariants: Record<StatusVariant, string> = {
  success:
    "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400",

  danger:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400",

  warning:
    "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",

  info:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400",

  secondary:
    "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",

  default:
    "border-muted bg-muted text-muted-foreground",
};

export function StatusBadge({
  value,
  text,
  variant,
  className,
}: StatusBadgeProps) {
  const normalized = value.toLowerCase();

  const finalVariant =
    variant ?? STATUS_MAP[normalized] ?? "default";



const dotVariants: Record<StatusVariant, string> = {
  success: "bg-green-500",
  danger: "bg-red-500",
  warning: "bg-yellow-500",
  info: "bg-blue-500",
  secondary: "bg-slate-500",
  default: "bg-muted-foreground",
};




  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded px-3 py-1 font-medium capitalize gap-2",
        badgeVariants[finalVariant],
        className
      )}
    >

 <span
  className={cn(
    "h-2 w-2 shrink-0 m-0 rounded-xs",
    dotVariants[finalVariant]
  )}
/>



      {text ?? value}
    </Badge>
  );
}