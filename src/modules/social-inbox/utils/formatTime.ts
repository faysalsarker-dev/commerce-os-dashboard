import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from "date-fns";

/** Returns a human-readable relative time, e.g. "2m ago", "Yesterday", "Nov 5" */
export function formatRelativeTime(isoString: string): string {
  const date = parseISO(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = diffMs / 60_000;

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${Math.floor(diffMins)}m`;
  if (isToday(date)) return format(date, "h:mm a");
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d");
}

/** Returns a full timestamp string, e.g. "Nov 10, 2026 at 10:10 AM" */
export function formatFullTime(isoString: string): string {
  return format(parseISO(isoString), "MMM d, yyyy 'at' h:mm a");
}

/** Returns relative time from now, e.g. "5 minutes ago" */
export function formatTimeAgo(isoString: string): string {
  return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
}

/** Returns a date separator label for the message thread */
export function formatDateSeparator(isoString: string): string {
  const date = parseISO(isoString);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d, yyyy");
}

/** Returns true if isoString is in the past */
export function isExpired(isoString: string): boolean {
  return parseISO(isoString).getTime() < Date.now();
}

/** Returns true if two ISO strings are on different calendar days */
export function isDifferentDay(a: string, b: string): boolean {
  return format(parseISO(a), "yyyy-MM-dd") !== format(parseISO(b), "yyyy-MM-dd");
}

