import { useCallback, useMemo, useState } from "react";
import { MessageThread } from "./MessageThread";
import { MessageComposer } from "./MessageComposer";
import { ReplyWindowExpiredBar } from "./ReplyWindowExpiredBar";
import { ChatEmptyState } from "./ChatEmptyState";
import { useMessages } from "../hooks/useMessages";
import { useSendMessage } from "../hooks/useSendMessage";
import { isExpired } from "../utils/formatTime";
import type { Conversation, Customer, Message, MessageTemplate } from "../types";

interface ChatAreaProps {
  conversation: Conversation | null;
  customer: Customer | null;
}

export function ChatArea({ conversation, customer }: ChatAreaProps) {
  const [localMessageMap, setLocalMessageMap] = useState<Map<string, Message[]>>(new Map());

  const { messages: fetchedMessages, isLoading } = useMessages(conversation?.id ?? null);

  const allMessages = useMemo<Message[]>(() => {
    if (!conversation) return [];
    const local = localMessageMap.get(conversation.id) ?? [];
    const fetchedIds = new Set(fetchedMessages.map((m) => m.id));
    const localOnly = local.filter((lm) => !fetchedIds.has(lm.id));
    return [...fetchedMessages, ...localOnly].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [fetchedMessages, localMessageMap, conversation]);

  const handleMessageSent = useCallback((msg: Message) => {
    setLocalMessageMap((prev) => {
      const existing = prev.get(msg.conversationId) ?? [];
      const idx = existing.findIndex((m) => m.id === msg.id);
      let updated: Message[];
      if (idx >= 0) {
        updated = [...existing];
        updated[idx] = msg;
      } else {
        updated = [...existing, msg];
      }
      const next = new Map(prev);
      next.set(msg.conversationId, updated);
      return next;
    });
  }, []);

  const { send, isSending } = useSendMessage(handleMessageSent);

  async function handleSendText(text: string) {
    if (!conversation) return;
    await send({ conversationId: conversation.id, text });
  }

  async function handleSendTemplate(template: MessageTemplate) {
    if (!conversation) return;
    await send({ conversationId: conversation.id, template });
  }

  function handleRetry(message: Message) {
    if (!conversation || !message.text) return;
    setLocalMessageMap((prev) => {
      const existing = prev.get(message.conversationId) ?? [];
      const next = new Map(prev);
      next.set(message.conversationId, existing.filter((m) => m.id !== message.id));
      return next;
    });
    send({ conversationId: conversation.id, text: message.text });
  }

  const replyExpired =
    conversation?.replyWindowExpiresAt != null &&
    isExpired(conversation.replyWindowExpiresAt);

  if (!conversation || !customer) {
    return (
      <section className="flex min-h-0 flex-1 flex-col bg-background" aria-label="Chat area">
        <ChatEmptyState />
      </section>
    );
  }

  return (
    <section
      className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background"
      aria-label={`Chat with ${customer.name}`}
    >
      <MessageThread
        messages={allMessages}
        platform={conversation.platform}
        isLoading={isLoading}
        onRetry={handleRetry}
      />

      {replyExpired ? (
        <ReplyWindowExpiredBar onSendTemplate={handleSendTemplate} />
      ) : (
        <MessageComposer onSend={handleSendText} isSending={isSending} disabled={false} />
      )}
    </section>
  );
}
