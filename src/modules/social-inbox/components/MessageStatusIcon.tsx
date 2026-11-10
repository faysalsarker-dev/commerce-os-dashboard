import { Check, CheckCheck, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Message } from "../types";

interface MessageStatusIconProps {
  status: Message["status"];
  onRetry?: () => void;
  className?: string;
}

export function MessageStatusIcon({ status, onRetry, className }: MessageStatusIconProps) {
  if (status === "sending") {
    return (
      <Clock
        className={cn("size-3 animate-pulse text-muted-foreground", className)}
        aria-label="Sending"
      />
    );
  }
  if (status === "sent") {
    return (
      <Check
        className={cn("size-3 text-muted-foreground", className)}
        aria-label="Sent"
      />
    );
  }
  if (status === "delivered") {
    return (
      <CheckCheck
        className={cn("size-3 text-muted-foreground", className)}
        aria-label="Delivered"
      />
    );
  }
  if (status === "read") {
    return (
      <CheckCheck
        className={cn("size-3 text-primary", className)}
        aria-label="Read"
      />
    );
  }
  if (status === "failed") {
    return (
      <span className="flex items-center gap-1">
        <AlertCircle
          className={cn("size-3 text-destructive", className)}
          aria-label="Failed to send"
        />
        {onRetry && (
          <Button
            size="icon-xs"
            variant="ghost"
            className="size-4 text-destructive hover:text-destructive"
            onClick={onRetry}
            aria-label="Retry sending message"
          >
            <RefreshCw className="size-2.5" />
          </Button>
        )}
      </span>
    );
  }

  return null;
}

