import { useEffect, useRef, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageBubble } from "./MessageBubble";
import { DateSeparator } from "./DateSeparator";
import { isDifferentDay } from "../utils/formatTime";
import type { Message, Platform } from "../types";

interface MessageThreadProps {
  messages: Message[];
  platform: Platform;
  isLoading: boolean;
  onRetry: (message: Message) => void;
}

function MessageThreadSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4" aria-busy="true">
      <Skeleton className="h-10 w-48 self-start rounded-2xl rounded-tl-sm" />
      <Skeleton className="h-8 w-56 self-end rounded-2xl rounded-tr-sm" />
      <Skeleton className="h-14 w-60 self-start rounded-2xl rounded-tl-sm" />
      <Skeleton className="h-8 w-40 self-end rounded-2xl rounded-tr-sm" />
      <Skeleton className="h-10 w-52 self-start rounded-2xl rounded-tl-sm" />
      <Skeleton className="h-8 w-36 self-end rounded-2xl rounded-tr-sm" />
    </div>
  );
}

export function MessageThread({ messages, platform, isLoading, onRetry }: MessageThreadProps) {
  // We target the ScrollArea's viewport div for programmatic scroll-to-bottom.
  // Base UI ScrollArea renders a [data-slot="scroll-area-viewport"] child — we
  // grab it via a ref on the wrapper and scroll it directly.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    // Primary: scroll the bottom sentinel into view inside the viewport
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior, block: "end" });
      return;
    }
    // Fallback: find the Base UI viewport and scroll it manually
    const viewport = wrapperRef.current?.querySelector<HTMLElement>(
      "[data-slot='scroll-area-viewport']"
    );
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, []);

  // Jump instantly on conversation switch, smooth on new message
  const prevConvRef = useRef<string | null>(null);
  const firstMessageId = messages[0]?.conversationId ?? null;

  useEffect(() => {
    const isNewConversation = firstMessageId !== prevConvRef.current;
    prevConvRef.current = firstMessageId;
    scrollToBottom(isNewConversation ? "instant" : "smooth");
  }, [messages, firstMessageId, scrollToBottom]);

  if (isLoading) {
    return <MessageThreadSkeleton />;
  }

  return (
    <div ref={wrapperRef} className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ScrollArea className="h-full w-full flex-1">
        <div
          className="flex flex-col gap-1.5 px-4 py-4"
          role="log"
          aria-label="Message thread"
          aria-live="polite"
        >
          {messages.map((message, index) => {
            const prev = messages[index - 1];
            const showSeparator =
              !prev || isDifferentDay(prev.createdAt, message.createdAt);

            return (
              <div key={message.id}>
                {showSeparator && <DateSeparator isoString={message.createdAt} />}
                <MessageBubble
                  message={message}
                  platform={platform}
                  onRetry={onRetry}
                />
              </div>
            );
          })}
          {/* Sentinel element — always rendered at the bottom of the list */}
          <div ref={bottomRef} className="h-px w-full" aria-hidden="true" />
        </div>
      </ScrollArea>
    </div>
  );
}
