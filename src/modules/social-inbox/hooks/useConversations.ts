import { useMemo, useState } from "react";
import type { Conversation, ConversationFilters, Customer } from "../types";
import { mockConversations, mockCustomers } from "../data";

interface ConversationWithCustomer extends Conversation {
  customer: Customer;
}

interface UseConversationsResult {
  conversations: ConversationWithCustomer[];
  isLoading: boolean;
  updateStatus: (id: string, status: "open" | "resolved") => void;
}

/**
 * Returns conversations filtered by platform and optional search term,
 * with the customer record joined in.
 *
 * SWAP POINT: Replace the mock state below with RTK Query endpoints, e.g.:
 *   useGetConversationsQuery({ platform, search })
 *   useUpdateConversationMutation()
 */
export function useConversations(filters: ConversationFilters): UseConversationsResult {
  // Local state mirrors what a real API slice would hold.
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);

  const filtered = useMemo<ConversationWithCustomer[]>(() => {
    return conversations
      .filter((c) => c.platform === filters.platform)
      .filter((c) => {
        if (!filters.search) return true;
        const customer = mockCustomers.find((cu) => cu.id === c.customerId);
        const name = customer?.name.toLowerCase() ?? "";
        const preview = c.lastMessagePreview.toLowerCase();
        const q = filters.search.toLowerCase();
        return name.includes(q) || preview.includes(q);
      })
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
      .map((conv) => ({
        ...conv,
        customer: mockCustomers.find((cu) => cu.id === conv.customerId)!,
      }));
  }, [conversations, filters]);

  function updateStatus(id: string, status: "open" | "resolved") {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  }

  return { conversations: filtered, isLoading: false, updateStatus };
}

