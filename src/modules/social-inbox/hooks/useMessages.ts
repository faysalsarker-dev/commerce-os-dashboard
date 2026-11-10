import { useState, useEffect } from "react";
import type { Message } from "../types";
import { mockMessages } from "../data";

interface UseMessagesResult {
  messages: Message[];
  isLoading: boolean;
}

/**
 * Returns messages for a given conversation, in chronological order.
 * Simulates async loading with a short delay to match real API behaviour.
 *
 * SWAP POINT: Replace with RTK Query, e.g.:
 *   const { data, isLoading } = useGetMessagesQuery(conversationId)
 * The returned shape stays identical.
 */
export function useMessages(conversationId: string | null): UseMessagesResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    setIsLoading(true);

    // Simulate network latency so skeletons are visible
    const timer = setTimeout(() => {
      const result = mockMessages
        .filter((m) => m.conversationId === conversationId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      setMessages(result);
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [conversationId]);

  return { messages, isLoading };
}
