import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TokenExpiredBanner() {
  return (
    <div
      role="alert"
      className="flex items-center gap-2.5 border-b border-yellow-200 bg-yellow-50 px-4 py-2.5 text-xs text-yellow-800 dark:border-yellow-800/40 dark:bg-yellow-900/20 dark:text-yellow-200"
    >
      <AlertTriangle className="size-3.5 shrink-0 text-yellow-600 dark:text-yellow-400" />
      <span className="flex-1">Session expired. Reconnect to send and receive messages.</span>
      <Button
        size="xs"
        variant="outline"
        className="border-yellow-400 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:border-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200"
        onClick={() => {
          /* Reconnect flow — UI only */
        }}
        aria-label="Reconnect social media account"
      >
        Reconnect
      </Button>
    </div>
  );
}

