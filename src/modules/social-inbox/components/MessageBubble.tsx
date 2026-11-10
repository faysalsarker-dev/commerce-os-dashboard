import { cn } from "@/lib/utils";
import { formatFullTime } from "../utils/formatTime";
import { MessageStatusIcon } from "./MessageStatusIcon";
import { MediaMessage } from "./MediaMessage";
import { UnsupportedMessage } from "./UnsupportedMessage";
import { TemplateMessage } from "./TemplateMessage";
import type { Message, Platform } from "../types";

interface MessageBubbleProps {
  message: Message;
  platform: Platform;
  onRetry?: (message: Message) => void;
}

export function MessageBubble({ message, platform, onRetry }: MessageBubbleProps) {
  const isOutbound = message.direction === "outbound";

  const bubbleBase = cn(
    "relative max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
    isOutbound
      ? "rounded-tr-sm bg-primary text-primary-foreground"
      : "rounded-tl-sm bg-card text-card-foreground ring-1 ring-border/60"
  );

  const renderContent = () => {
    if (message.type === "unsupported") {
      return <UnsupportedMessage platform={platform} />;
    }
    if (message.type === "template" && message.template) {
      return <TemplateMessage template={message.template} />;
    }
    if (["image", "video", "audio", "file"].includes(message.type)) {
      return <MediaMessage message={message} />;
    }
    return <span className="whitespace-pre-wrap break-words">{message.text}</span>;
  };

  return (
    <div
      className={cn(
        "flex w-full",
        isOutbound ? "justify-end" : "justify-start"
      )}
      aria-label={`${isOutbound ? "Outbound" : "Inbound"} message`}
    >
      <div className="flex flex-col gap-1">
        <div className={bubbleBase}>{renderContent()}</div>

        {/* Timestamp + status */}
        <div
          className={cn(
            "flex items-center gap-1",
            isOutbound ? "justify-end pr-1" : "justify-start pl-1"
          )}
        >
          <span className="text-[10px] text-muted-foreground">
            {formatFullTime(message.createdAt)}
          </span>
          {isOutbound && (
            <MessageStatusIcon
              status={message.status}
              onRetry={
                message.status === "failed" && onRetry
                  ? () => onRetry(message)
                  : undefined
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

